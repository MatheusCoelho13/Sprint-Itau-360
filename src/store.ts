import { supabase } from './supabase'
import { actors as baseActors, ELEICAO } from './data'
import { baseTopics } from './topics'
import { KINDS, kindOf, type Rec } from './content'
import { SRC } from './data'
import { applyTexts } from './texts'
import type { Actor, ActorView, Analysis, ExportFile, Row, Topic } from './types'

// Cache em memória; as telas leem daqui de forma síncrona, as escritas vão ao Supabase primeiro.
let extraActors: Actor[] = []
let overrides: Record<string, Actor> = {}
let analyses: Analysis[] = []
export interface Vote { candidate: string; party: string; votes: number; pct: number }
const fallbackVotes = (): Vote[] => {
  const total = ELEICAO.reduce((n, v) => n + v.votes, 0)
  return ELEICAO.map(v => ({ ...v, pct: Math.round(v.votes * 1e4 / total) / 100 }))
}
let extraTopics: Topic[] = []
let topicOverrides: Record<string, Topic> = {}
let election: Vote[] | null = null // null = banco não respondeu (ou migration não aplicada): usa a reserva local

const isBase = (id: string) => baseActors.some(a => a.id === id)
const isBaseTopic = (id: string) => baseTopics.some(t => t.id === id)

function check<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message)
  return res.data as T
}

export async function loadAll(): Promise<void> {
  const [a, d] = await Promise.all([
    supabase.from('actors').select('id,record,is_override').order('created_at'),
    supabase.from('analyses').select('id,record').order('created_at'),
  ])
  const aRows = check(a) as Row<Actor>[]
  extraActors = aRows.filter(r => !r.is_override).map(r => r.record)
  overrides = Object.fromEntries(aRows.filter(r => r.is_override).map(r => [r.id, r.record]))
  analyses = (check(d) as Row<Analysis>[]).map(r => r.record)
}

/** Percentual calculado pela view `election_result` no banco. Falha em silêncio: o resto do site não depende disto. */
export async function loadElection(): Promise<void> {
  const { data, error } = await supabase.from('election_result').select('candidate,party,votes,pct').order('votes', { ascending: false })
  election = !error && data?.length ? data.map(r => ({ ...r, votes: Number(r.votes), pct: Number(r.pct) })) as Vote[] : null
}
export const getElection = (): { votes: Vote[]; fromDb: boolean } => ({ votes: election ?? fallbackVotes(), fromDb: election !== null })

/** Temas editados na Área editorial. Separado de loadAll: sem a migration, o resto do site continua carregando. */
export async function loadTopics(): Promise<void> {
  const res = await supabase.from('topics').select('id,record,is_override').order('created_at')
  if (res.error) { extraTopics = []; topicOverrides = {}; return }
  const rows = res.data as Row<Topic>[]
  extraTopics = rows.filter(r => !r.is_override).map(r => r.record)
  topicOverrides = Object.fromEntries(rows.filter(r => r.is_override).map(r => [r.id, r.record]))
}
export const allTopics = (): (Topic & { _base: boolean })[] => [
  ...baseTopics.map(t => ({ ...t, ...(topicOverrides[t.id] ?? {}), _base: true })),
  ...extraTopics.map(t => ({ ...t, _base: false })),
]
/** O que o site mostra: sem os ocultos. */
export const getTopics = () => allTopics().filter(t => !t._hidden)
export async function saveTopic(rec: Topic): Promise<void> {
  const override = isBaseTopic(rec.id)
  check(await supabase.from('topics').upsert({ id: rec.id, record: rec, is_override: override }))
  if (override) topicOverrides[rec.id] = rec; else upsertIn(extraTopics, rec)
}
export async function deleteTopic(id: string): Promise<void> {
  check(await supabase.from('topics').delete().eq('id', id))
  extraTopics = extraTopics.filter(t => t.id !== id)
  delete topicOverrides[id]
}

// ---------- conteúdo geral editável (tabela content_items): base + overrides + itens novos ----------
type Bucket = { ov: Record<string, Rec>; extra: Rec[] }
let buckets: Record<string, Bucket> = {}
const SRC_KEYS0 = new Set(Object.keys(SRC))
const bucket = (k: string): Bucket => (buckets[k] ??= { ov: {}, extra: [] })

export type Item = Rec & { _base: boolean; _over: boolean }
/** Tudo de um tipo, inclusive itens ocultos (para a Área editorial). */
export const allContent = (kind: string): Item[] => {
  const b = bucket(kind)
  const base = kindOf(kind).base().map(x => ({ ...x, ...(b.ov[x.id] ?? {}), _base: true, _over: x.id in b.ov }))
  return [...base, ...b.extra.map(x => ({ ...x, _base: false, _over: false }))]
}
/** O que o site mostra: sem os ocultos. */
export const getContent = <T = Rec>(kind: string): T[] => allContent(kind).filter(x => !x._hidden) as unknown as T[]

function applyContent(): void {
  for (const k of Object.keys(SRC)) if (!SRC_KEYS0.has(k)) delete SRC[k] // cadastro de fontes: reaplica do zero
  for (const f of allContent('fonte')) SRC[f.id] = { label: String(f.label), url: String(f.url) }
  applyTexts(Object.fromEntries(allContent('texto').filter(t => t._over).map(t => [t.id, String(t.text)])))
}
export async function loadContent(): Promise<void> {
  const res = await supabase.from('content_items').select('kind,id,record,is_override').order('created_at')
  buckets = {}
  if (!res.error) {
    for (const r of res.data as { kind: string; id: string; record: Rec; is_override: boolean }[]) {
      if (!KINDS.some(k => k.id === r.kind)) continue
      if (r.is_override) bucket(r.kind).ov[r.id] = r.record; else bucket(r.kind).extra.push(r.record)
    }
  }
  applyContent()
}
export async function saveContent(kind: string, rec: Rec): Promise<void> {
  const base = kindOf(kind).base().some(x => x.id === rec.id)
  check(await supabase.from('content_items').upsert({ kind, id: rec.id, record: rec, is_override: base }, { onConflict: 'kind,id' }))
  if (base) bucket(kind).ov[rec.id] = rec; else upsertIn(bucket(kind).extra, rec)
  applyContent()
}
/** Exclui item novo ou volta um item da base ao original. */
export async function deleteContent(kind: string, id: string): Promise<void> {
  check(await supabase.from('content_items').delete().eq('kind', kind).eq('id', id))
  const b = bucket(kind)
  delete b.ov[id]; b.extra = b.extra.filter(x => x.id !== id)
  applyContent()
}

export interface HistoryRow { id: number; at: string; tbl: string; row_id: string; action: string; title: string; by_email: string }
/** Últimas mudanças (tabela content_history, preenchida por gatilhos no banco). */
export async function loadHistory(): Promise<HistoryRow[]> {
  return check(await supabase.from('content_history').select('id,at,tbl,row_id,action,title,by_email').order('at', { ascending: false }).limit(100)) as HistoryRow[]
}

export function clearCache(): void { buckets = {}; applyContent(); extraActors = []; overrides = {}; analyses = []; extraTopics = []; topicOverrides = {} }

export const allActors = (): ActorView[] => [
  ...baseActors.map(a => ({ ...a, ...(overrides[a.id] ?? {}), _base: true })),
  ...extraActors.map(a => ({ ...a, _base: false })),
]
export const getActors = () => allActors().filter(a => !a._hidden)
export const getAnalyses = (): Analysis[] => analyses

const upsertIn = <T extends { id: string }>(arr: T[], rec: T) => {
  const i = arr.findIndex(x => x.id === rec.id)
  if (i >= 0) arr[i] = rec; else arr.push(rec)
}

export async function saveActor(rec: Actor): Promise<void> {
  const override = isBase(rec.id)
  check(await supabase.from('actors').upsert({ id: rec.id, record: rec, is_override: override }))
  if (override) overrides[rec.id] = rec; else upsertIn(extraActors, rec)
}

export async function saveAnalysis(rec: Analysis): Promise<void> {
  check(await supabase.from('analyses').upsert({ id: rec.id, record: rec }))
  upsertIn(analyses, rec)
}

export async function deleteActor(id: string): Promise<void> {
  check(await supabase.from('actors').delete().eq('id', id))
  extraActors = extraActors.filter(a => a.id !== id)
  delete overrides[id]
}

export async function deleteAnalysis(id: string): Promise<void> {
  check(await supabase.from('analyses').delete().eq('id', id))
  analyses = analyses.filter(a => a.id !== id)
}


/** Importa por upsert; não apaga o que já existe na base compartilhada. */
export async function importData(d: ExportFile): Promise<void> {
  for (const a of d.actors ?? []) await saveActor(a)
  for (const x of d.analyses ?? []) await saveAnalysis(x)
}
