import { isDocument } from './documents'
import type { Actor, Analysis, CustomSource, Source } from './types'

/** Leitura de arquivos CSV, XML e documentos (.txt, .docx, .pdf) para perfis e dossiês. Só valida e converte; quem grava no banco é o store. */
export interface Allowed { group: string[]; astatus: string[]; theme: string[]; dstatus: string[]; dtype: string[] }
export interface Parsed { actors: Actor[]; analyses: Analysis[]; errors: string[] }

type Rec = Record<string, unknown>
type Item = { kind: 'actor' | 'analysis'; rec: Rec }

const str = (v: unknown) => (v == null || typeof v === 'object' ? '' : String(v).trim())
const slug = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

// ---------- leitores de formato ----------
function csv(text: string): Rec[] {
  text = text.replace(/^﻿/, '')
  const head = text.split(/\r?\n/, 1)[0]
  const d = (head.match(/;/g)?.length ?? 0) > (head.match(/,/g)?.length ?? 0) ? ';' : ',' // Excel pt-BR salva com ;
  const rows: string[][] = []
  let row: string[] = [], cell = '', q = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (q) { if (c !== '"') cell += c; else if (text[i + 1] === '"') { cell += '"'; i++ } else q = false }
    else if (c === '"') q = true
    else if (c === d) { row.push(cell); cell = '' }
    else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(cell); rows.push(row); row = []; cell = '' }
    else cell += c
  }
  row.push(cell); rows.push(row)
  const [h, ...body] = rows.filter(r => r.some(x => x.trim()))
  const keys = (h ?? []).map(k => k.trim())
  return body.map(r => Object.fromEntries(keys.map((k, i) => [k, r[i] ?? ''])))
}

function xml(text: string): Item[] {
  const doc = new DOMParser().parseFromString(text, 'application/xml')
  if (doc.querySelector('parsererror')) throw new Error('XML inválido.')
  const leaf = (k: Element): unknown => k.children.length
    ? Object.fromEntries(Array.from(k.children).map(x => [x.localName, x.textContent ?? '']))
    : (k.textContent ?? '')
  const rec = (el: Element): Rec => Object.fromEntries(Array.from(el.children).map(c =>
    [c.localName, c.children.length ? Array.from(c.children).map(leaf) : c.textContent ?? '']))
  const out: Item[] = []
  for (const el of Array.from(doc.getElementsByTagName('*')))
    if (el.localName === 'actor' || el.localName === 'analysis') out.push({ kind: el.localName, rec: rec(el) })
  return out
}

// Rótulos reconhecidos no começo de uma linha ("Pergunta: ..."), na ordem do formulário de dossiê.
const LABELS: Record<string, string> = {
  título: 'title', titulo: 'title', tema: 'theme', tipo: 'type', status: 'status', pergunta: 'question', evidência: 'evidence', evidencia: 'evidence',
  atores: 'actors', transmissão: 'transmission', transmissao: 'transmission', impacto: 'impact', cenários: 'scenarios', cenarios: 'scenarios',
  sinais: 'signals', avaliação: 'assessment', avaliacao: 'assessment', autor: 'author', revisão: 'review', revisao: 'review',
}
/** Documento vira um dossiê. Com linhas "Campo: valor" preenche cada campo; sem elas, a 1ª linha é o título e o resto é a evidência. */
function fromDocument(filename: string, text: string): Rec {
  const rec: Rec = {}
  let cur = ''
  for (const line of text.split('\n')) {
    const m = line.match(/^\s*([A-Za-zÀ-ú]+)\s*:\s*(.*)$/)
    const key = m ? LABELS[m[1].toLowerCase()] : undefined
    if (key) { cur = key; rec[key] = m![2] }
    else if (cur) rec[cur] = str(rec[cur]) + '\n' + line
  }
  const base = filename.replace(/\.[^.]+$/, '')
  if (!rec.title && !rec.evidence) {
    const [first, ...rest] = text.split('\n').filter(l => l.trim())
    return { title: first.length <= 140 ? first : base, evidence: first.length <= 140 ? rest.join('\n') || first : text, question: `A definir (importado de ${filename}).` }
  }
  rec.title = str(rec.title) || base
  rec.question = str(rec.question) || `A definir (importado de ${filename}).`
  rec.evidence = str(rec.evidence) || text
  return rec
}

const classify = (rec: Rec): Item | null => 'name' in rec ? { kind: 'actor', rec } : 'title' in rec ? { kind: 'analysis', rec } : null

/** Lê o arquivo (pela extensão) e devolve só registros válidos, mais a lista de erros por linha. */
export function parseFile(filename: string, text: string, allow: Allowed): Parsed {
  const out: Parsed = { actors: [], analyses: [], errors: [] }
  const ext = filename.split('.').pop()?.toLowerCase()
  let items: Item[] = []
  try {
    if (ext === 'csv') {
      items = csv(text).flatMap(r => { const it = classify(r); return it ? [it] : [] })
      if (!items.length) out.errors.push('CSV sem linhas válidas: a primeira linha precisa ter a coluna "name" (perfis) ou "title" (dossiês).')
    } else if (ext === 'xml') items = xml(text)
    else if (isDocument(filename)) items = [{ kind: 'analysis', rec: fromDocument(filename, text) }]
    else throw new Error('Use um arquivo .docx, .pdf, .txt, .csv ou .xml.')
  } catch (e) {
    out.errors.push((e as Error).message)
    return out
  }
  let na = 0, nd = 0
  for (const { kind, rec } of items) {
    if (kind === 'actor') { const a = toActor(rec, ++na, allow, out.errors); if (a) out.actors.push(a) }
    else { const d = toAnalysis(rec, ++nd, allow, out.errors); if (d) out.analyses.push(d) }
  }
  return out
}

// ---------- conversão e validação ----------
const lineToSource = (l: string, withSection: boolean): CustomSource => {
  const p = l.split('|').map(s => s.trim())
  return withSection
    ? { section: (p.length > 2 ? p[0] : 'Geral').toLowerCase(), label: (p.length > 2 ? p[1] : p[0]) || 'Fonte', url: p.slice(p.length > 2 ? 2 : 1).join('|') }
    : { label: p[0] || 'Fonte', url: p.slice(1).join('|') }
}
function sources(v: unknown, withSection: boolean): CustomSource[] {
  if (Array.isArray(v)) return v.map(s => typeof s === 'string' ? lineToSource(s, withSection)
    : { label: str((s as Rec).label) || 'Fonte', url: str((s as Rec).url), ...(withSection ? { section: (str((s as Rec).section) || 'Geral').toLowerCase() } : {}) })
  return str(v).split(/\n|;;/).map(l => l.trim()).filter(Boolean).map(l => lineToSource(l, withSection))
}

/** Valor da lista (sem diferenciar maiúsculas); vazio cai no padrão; fora da lista é erro. */
function pick(v: unknown, list: string[], def: string | null, label: string, errs: string[]): string | null {
  const s = str(v)
  if (!s) { if (def === null) errs.push(`${label} é obrigatório`); return def }
  const hit = list.find(x => x.toLowerCase() === s.toLowerCase())
  if (!hit) errs.push(`${label} "${s}" não existe (use: ${list.join(' | ')})`)
  return hit ?? null
}

function toActor(r: Rec, n: number, allow: Allowed, all: string[]): Actor | null {
  const errs: string[] = []
  const name = str(r.name), role = str(r.role), bio = str(r.bio)
  for (const [k, v] of [['name', name], ['role', role], ['bio', bio]]) if (!v) errs.push(`falta ${k}`)
  const group = pick(r.group, allow.group, null, 'group', errs)
  // sem status informado, vira "Em verificação": nunca presume "Confirmado"
  const status = pick(r.status, allow.astatus, 'Em verificação', 'status', errs)
  if (errs.length) { all.push(`Perfil ${n}${name ? ` (${name})` : ''}: ${errs.join('; ')}`); return null }
  const sd = sources(r.sourceDetails ?? r.sources, false) as Source[]
  return {
    id: str(r.id) || 'imp-' + slug(name), name, role, group: group!, status: status!, bio,
    relevance: str(r.relevance), photo: str(r.photo), photoCredit: str(r.photoCredit), date: str(r.date),
    ...(sd.length ? { sourceDetails: sd } : {}),
  }
}

const A_TEXT = ['question', 'evidence', 'actors', 'transmission', 'impact', 'scenarios', 'signals', 'assessment', 'author', 'review'] as const
function toAnalysis(r: Rec, n: number, allow: Allowed, all: string[]): Analysis | null {
  const errs: string[] = []
  const title = str(r.title)
  for (const k of ['title', 'question', 'evidence']) if (!str(r[k])) errs.push(`falta ${k}`)
  const theme = pick(r.theme, allow.theme, 'Transversal', 'theme', errs)
  // sem status informado, fica "Em elaboração": publicar é decisão explícita
  const status = pick(r.status, allow.dstatus, 'Em elaboração', 'status', errs)
  const type = pick(r.type, allow.dtype, 'Monitoramento', 'type', errs)
  if (errs.length) { all.push(`Dossiê ${n}${title ? ` (${title})` : ''}: ${errs.join('; ')}`); return null }
  const d = { id: str(r.id) || 'imp-' + slug(title), title, theme, status, type, sources: sources(r.sources, true), updated: new Date().toLocaleDateString('pt-BR') } as Analysis
  for (const k of A_TEXT) d[k] = str(r[k])
  return d
}

// ---------- modelos para baixar ----------
const q = (s: string) => `"${s.replace(/"/g, '""')}"`
export const templates: Record<string, { file: string; mime: string; body: string }> = {
  'csv-actor': { file: 'modelo-perfis.csv', mime: 'text/csv', body:
    'id,name,role,group,status,bio,relevance,photo,photoCredit,date,sources\n' +
    `,Nome do ator,Cargo ou posição,Executivo,Em verificação,${q('Resumo biográfico com fatos verificáveis.')},${q('Por que importa para o Itaú.')},,,,${q('Título da fonte | https://exemplo.com;;Outra fonte | https://exemplo.com/2')}\n` },
  'csv-analysis': { file: 'modelo-dossies.csv', mime: 'text/csv', body:
    'id,title,theme,status,type,question,evidence,actors,transmission,impact,scenarios,signals,assessment,author,review,sources\n' +
    `,Título do dossiê,Transversal,Em elaboração,Monitoramento,${q('Qual pergunta esta análise responde?')},${q('Fatos e documentos.')},,,,,,,,,${q('fiscal | Título da fonte | https://exemplo.com')}\n` },
  xml: { file: 'modelo-conteudo.xml', mime: 'application/xml', body: `<?xml version="1.0" encoding="UTF-8"?>
<conteudo>
  <actor>
    <name>Nome do ator</name><role>Cargo ou posição</role><group>Executivo</group><status>Em verificação</status>
    <bio>Resumo biográfico com fatos verificáveis.</bio><relevance>Por que importa para o Itaú.</relevance>
    <sources><source><label>Título da fonte</label><url>https://exemplo.com</url></source></sources>
  </actor>
  <analysis>
    <title>Título do dossiê</title><theme>Transversal</theme><status>Em elaboração</status><type>Monitoramento</type>
    <question>Qual pergunta esta análise responde?</question><evidence>Fatos e documentos.</evidence>
    <sources><source><section>fiscal</section><label>Título da fonte</label><url>https://exemplo.com</url></source></sources>
  </analysis>
</conteudo>
` },
}
