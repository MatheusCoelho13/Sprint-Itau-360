import { SRC } from './data'
import {
  allActors, allTopics, getAnalyses, saveActor, saveAnalysis, saveTopic, deleteActor, deleteAnalysis, deleteTopic,
  importData, allContent, saveContent, deleteContent, loadHistory,
} from './store'
import { KINDS, kindOf, type Field as FieldDef, type Rec } from './content'
import { $, esc, go, renderActors, renderRisks, renderThemes, renderAll } from './ui'
import { parseFile, templates, type Parsed } from './importer'
import { isDocument, readDocument } from './documents'
import type { Actor, Analysis, CustomSource, Level, Source, Sub, Topic } from './types'

type Field = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
const f = (id: string) => $<Field>(id)
const msg = (t: string) => { $('exportMessage').textContent = t }
const fail = (e: unknown) => alert('Erro: ' + (e instanceof Error ? e.message : String(e)))

// ---------- parsing das fontes ("título | URL") ----------
function parseSources(txt: string): Source[] {
  return txt.split('\n').map(s => s.trim()).filter(Boolean).map(s => {
    const p = s.split('|')
    return { label: (p[0] || 'Fonte').trim(), url: p.slice(1).join('|').trim() }
  })
}
function parseSectionSources(txt: string): CustomSource[] {
  return txt.split('\n').map(s => s.trim()).filter(Boolean).map(s => {
    const p = s.split('|')
    return { section: (p[0] || 'Geral').trim().toLowerCase(), label: (p[1] || 'Fonte').trim(), url: p.slice(2).join('|').trim() }
  })
}

// ---------- abas ----------
export function editorTab(tab: string): void {
  document.querySelectorAll<HTMLElement>('.editor-tab').forEach(b => b.classList.toggle('active', b.dataset.etab === tab))
  $('editorActor').classList.toggle('hide', tab !== 'actor')
  $('editorAnalysis').classList.toggle('hide', tab !== 'analysis')
  $('editorTopic').classList.toggle('hide', tab !== 'topic')
  $('editorAll').classList.toggle('hide', tab !== 'all')
  $('editorHistory').classList.toggle('hide', tab !== 'history')
  if (tab === 'all') renderKindList()
  if (tab === 'history') void renderHistory()
  $('editorContent').classList.toggle('hide', tab !== 'content')
  if (tab === 'content') renderEditorRecords()
}

// ---------- lista de registros ----------
export function renderEditorRecords(): void {
  const actors = allActors().map(a => `<div class="editor-record${a._hidden ? ' off' : ''}"><div><strong>${esc(a.name)}</strong><small>Perfil de ator · ${esc(a.status)} · ${a._base ? 'Base do projeto' : 'Criado pela equipe'}${a._hidden ? ' · oculto' : ''}</small></div><div><button class="pill-btn" data-edit-actor="${a.id}">Editar</button>${a._base ? `<button class="pill-btn" data-hide="actor" data-id="${a.id}">${a._hidden ? 'Mostrar' : 'Ocultar'}</button><button class="pill-btn" data-reset-actor="${a.id}">Restaurar</button>` : `<button class="pill-btn" data-delete="actor" data-id="${a.id}">Excluir</button>`}</div></div>`)
  const analyses = getAnalyses().map(d => `<div class="editor-record"><div><strong>${esc(d.title)}</strong><small>Dossiê · ${esc(d.status)} · ${esc(d.theme)}</small></div><div><button class="pill-btn" data-edit-analysis="${d.id}">Editar</button><button class="pill-btn" data-delete="analysis" data-id="${d.id}">Excluir</button></div></div>`)
  const topics = allTopics().map(t => `<div class="editor-record${t._hidden ? ' off' : ''}"><div><strong>${esc(t.title)}</strong><small>${t.kind === 'eixo' ? 'Tema · eixo ' + esc(t.n) : 'Tema transversal'} · ${t._base ? 'Base do projeto' : 'Criado pela equipe'}${t._hidden ? ' · oculto' : ''}</small></div><div><button class="pill-btn" data-edit-topic="${t.id}">Editar</button>${t._base ? `<button class="pill-btn" data-hide="topic" data-id="${t.id}">${t._hidden ? 'Mostrar' : 'Ocultar'}</button><button class="pill-btn" data-reset-topic="${t.id}">Restaurar</button>` : `<button class="pill-btn" data-delete="topic" data-id="${t.id}">Excluir</button>`}</div></div>`)
  $('editorRecords').innerHTML = [...topics, ...actors, ...analyses].join('') || '<div class="empty">Ainda não há conteúdo criado pela área editorial.</div>'
}

// ---------- formulários ----------
const ACTOR_FIELDS = { aName: 'name', aRole: 'role', aBio: 'bio', aRelevance: 'relevance', aPhoto: 'photo', aPhotoCredit: 'photoCredit', aDate: 'date', aWhy: 'why' } as const
/** Avaliação qualitativa do ator: select 1–3, vazio = não se aplica. */
const ACTOR_LEVELS = { aEntra: 'entra', aSai: 'sai', aGrav: 'grav', aHz: 'hz' } as const
const ANALYSIS_FIELDS = {
  dTitle: 'title', dTheme: 'theme', dStatus: 'status', dType: 'type', dQuestion: 'question',
  dEvidence: 'evidence', dActors: 'actors', dTransmission: 'transmission', dImpact: 'impact',
  dScenarios: 'scenarios', dSignals: 'signals', dAssessment: 'assessment', dAuthor: 'author', dReview: 'review', dReturn: 'returnReason',
} as const

const dropExtraOptions = () => document.querySelectorAll('#actorForm option[data-extra]').forEach(o => o.remove())
const actorReset = () => { dropExtraOptions(); $<HTMLFormElement>('actorForm').reset(); f('editActorId').value = '' }
const analysisReset = () => { $<HTMLFormElement>('analysisForm').reset(); f('editAnalysisId').value = '' }

export function loadActorToForm(id: string): void {
  const a = allActors().find(x => x.id === id)
  if (!a) return
  editorTab('actor')
  f('editActorId').value = a.id
  for (const [el, k] of Object.entries(ACTOR_FIELDS)) f(el).value = a[k] ?? ''
  for (const [el, k] of Object.entries(ACTOR_LEVELS)) f(el).value = String(a[k] ?? '')
  // valor que não está na lista (ex.: status de ator da base) entra como opção, para não ser apagado ao salvar
  dropExtraOptions()
  for (const [el, v] of [['aGroup', a.group], ['aStatus', a.status]] as const) {
    const sel = f(el) as HTMLSelectElement
    if (v && ![...sel.options].some(o => o.value === v || o.text === v)) { const o = new Option(v); o.dataset.extra = '1'; sel.add(o) }
    sel.value = v
  }
  f('aSources').value = a.sourceDetails
    ? a.sourceDetails.map(s => s.label + ' | ' + s.url).join('\n')
    : (a.sources ?? []).filter(k => SRC[k]).map(k => SRC[k].label + ' | ' + SRC[k].url).join('\n')
  go('editor')
}

export function loadAnalysisToForm(id: string): void {
  const d = getAnalyses().find(x => x.id === id)
  if (!d) return
  editorTab('analysis')
  f('editAnalysisId').value = d.id
  for (const [el, k] of Object.entries(ANALYSIS_FIELDS)) f(el).value = d[k] ?? ''
  f('dSources').value = d.sources.map(s => (s.section || 'Geral') + ' | ' + s.label + ' | ' + s.url).join('\n')
  go('editor')
}

export async function deleteRecord(type: string, id: string): Promise<void> {
  if (!confirm('Excluir este registro da base compartilhada?')) return
  try {
    await (type === 'actor' ? deleteActor(id) : type === 'topic' ? deleteTopic(id) : deleteAnalysis(id))
  } catch (e) { return fail(e) }
  renderEditorRecords(); renderActors(); renderThemes(); renderRisks()
}

/** Itens da base não saem do código: "apagar" vira ocultar (volta com Mostrar ou Restaurar). */
export async function hideRecord(type: string, id: string): Promise<void> {
  try {
    if (type === 'actor') {
      const { _base, ...a } = allActors().find(x => x.id === id)!; void _base
      await saveActor({ ...a, _hidden: !a._hidden })
    } else {
      const { _base, ...t } = allTopics().find(x => x.id === id)!; void _base
      await saveTopic({ ...t, _hidden: !t._hidden })
    }
  } catch (e) { return fail(e) }
  renderEditorRecords(); renderActors(); renderThemes(); renderRisks()
}

export async function resetActorOverride(id: string): Promise<void> {
  if (!confirm('Restaurar o perfil original do projeto?')) return
  try { await deleteActor(id) } catch (e) { return fail(e) }
  renderEditorRecords(); renderActors()
}

async function submitActor(e: SubmitEvent): Promise<void> {
  e.preventDefault()
  const id = f('editActorId').value || crypto.randomUUID()
  const sourceDetails = parseSources(f('aSources').value)
  const rec: Actor = {
    id, name: f('aName').value.trim(), role: f('aRole').value.trim(), group: f('aGroup').value,
    status: f('aStatus').value, photo: f('aPhoto').value.trim(), photoCredit: f('aPhotoCredit').value.trim(),
    bio: f('aBio').value.trim(), relevance: f('aRelevance').value.trim(), date: f('aDate').value.trim(),
    why: f('aWhy').value.trim(),
    ...(sourceDetails.length ? { sourceDetails } : {}),
    ...(allActors().find(x => x.id === id)?._hidden ? { _hidden: true } : {}),
  }
  for (const [el, k] of Object.entries(ACTOR_LEVELS)) { const n = Number(f(el).value); if (n) rec[k] = n as Level }
  try { await saveActor(rec) } catch (err) { return fail(err) }
  actorReset(); renderActors(); msg('Perfil salvo.')
  alert('Perfil salvo. Ele já aparece no Mapa de atores.')
}

async function submitAnalysis(e: SubmitEvent): Promise<void> {
  e.preventDefault()
  const rec = {
    id: f('editAnalysisId').value || crypto.randomUUID(),
    sources: parseSectionSources(f('dSources').value),
    updated: new Date().toLocaleDateString('pt-BR'),
  } as Analysis
  for (const [el, k] of Object.entries(ANALYSIS_FIELDS)) rec[k] = f(el).value.trim()
  try { await saveAnalysis(rec) } catch (err) { return fail(err) }
  analysisReset(); renderThemes(); renderRisks(); editorTab('content')
  alert('Dossiê salvo.')
}


// ---------- temas e subtemas ----------
const lines = (txt: string) => txt.split('\n').map(x => x.trim()).filter(Boolean)
const parseSubs = (txt: string): Sub[] => lines(txt).map(l => { const [t, how, ...care] = l.split('|'); return { t: t.trim(), how: (how ?? '').trim(), care: care.join('|').trim() } }).filter(x => x.t)
const topicReset = () => { $<HTMLFormElement>('topicForm').reset(); f('editTopicId').value = '' }
const T_LINES = { tQuestions: 'questions', tChannels: 'channels', tDeepen: 'deepen' } as const
const T_TEXT = { tTitle: 'title', tShort: 'short', tType: 'type', tDesc: 'desc', tAbout: 'about', tItau: 'itau' } as const

export function newTopic(): void { editorTab('topic'); topicReset(); go('editor') }
export function loadTopicToForm(id: string): void {
  const t = allTopics().find(x => x.id === id)
  if (!t) return
  editorTab('topic')
  f('editTopicId').value = t.id
  for (const [el, k] of Object.entries(T_TEXT)) f(el).value = t[k] ?? ''
  for (const [el, k] of Object.entries(T_LINES)) f(el).value = t[k].join('\n')
  f('tSubs').value = t.subs.map(x => `${x.t} | ${x.how} | ${x.care}`).join('\n')
  f('tSources').value = t.sourceDetails
    ? t.sourceDetails.map(s => s.label + ' | ' + s.url).join('\n')
    : t.sources.filter(k => SRC[k]).map(k => SRC[k].label + ' | ' + SRC[k].url).join('\n')
  go('editor')
}
export async function resetTopicOverride(id: string): Promise<void> {
  if (!confirm('Restaurar o tema original do projeto?')) return
  try { await deleteTopic(id) } catch (e) { return fail(e) }
  renderEditorRecords(); renderThemes()
}
async function submitTopic(e: SubmitEvent): Promise<void> {
  e.preventDefault()
  const old = allTopics().find(x => x.id === f('editTopicId').value)
  const sourceDetails = parseSources(f('tSources').value)
  const title = f('tTitle').value.trim()
  const rec = {
    id: old?.id ?? crypto.randomUUID(), kind: old?.kind ?? 'transversal', n: old?.n,
    short: f('tShort').value.trim() || title, title, type: f('tType').value.trim(),
    desc: f('tDesc').value.trim(), about: f('tAbout').value.trim(), itau: f('tItau').value.trim(),
    subs: parseSubs(f('tSubs').value), sources: old?.sources ?? [],
    ...(sourceDetails.length ? { sourceDetails } : {}),
    ...(old?._hidden ? { _hidden: true } : {}),
  } as Topic
  for (const [el, k] of Object.entries(T_LINES)) rec[k] = lines(f(el).value)
  try { await saveTopic(rec) } catch (err) { return fail(err) }
  topicReset(); renderThemes(); editorTab('content')
  alert('Tema salvo.')
}

// ---------- todo o conteúdo: formulário gerado a partir dos campos de cada tipo ----------
let curKind = KINDS[0].id
let curId: string | null = null // null = item novo; undefined-like '' = formulário fechado
let formOpen = false

const optPair = (o: string): [string, string] => { const [v, l] = o.split('|'); return [v, l ?? v] }
function fieldHtml(fd: FieldDef, v: unknown): string {
  const id = 'kf_' + fd.k
  const hint = fd.hint ? `<small class="muted">${esc(fd.hint)}</small>` : ''
  const lab = `<label for="${id}">${esc(fd.label)}</label>`
  const val = v == null ? '' : v
  if (fd.type === 'area') return `<div class="field full">${lab}<textarea id="${id}" rows="4">${esc(val)}</textarea>${hint}</div>`
  if (fd.type === 'lines') return `<div class="field full">${lab}<textarea id="${id}" rows="5">${esc(Array.isArray(val) ? val.join('\n') : val)}</textarea>${hint}</div>`
  if (fd.type === 'num') return `<div class="field">${lab}<input id="${id}" type="number" value="${esc(val)}"></div>`
  if (fd.type === 'level') return `<div class="field">${lab}<select id="${id}"><option value="">Não avaliada</option>${[['1', 'Baixa'], ['2', 'Média'], ['3', 'Alta']].map(([a, b]) => `<option value="${a}"${String(val) === a ? ' selected' : ''}>${b}</option>`).join('')}</select></div>`
  if (fd.type === 'select') return `<div class="field">${lab}<select id="${id}">${(fd.opts ?? []).map(optPair).map(([a, b]) => `<option value="${esc(a)}"${String(val) === a ? ' selected' : ''}>${esc(b || '(nenhuma)')}</option>`).join('')}</select></div>`
  if (fd.type === 'src') return `<div class="field">${lab}<select id="${id}">${Object.entries(SRC).map(([k, s]) => `<option value="${esc(k)}"${val === k ? ' selected' : ''}>${esc(s.label)}</option>`).join('')}</select></div>`
  if (fd.type === 'srcs') { const cur = Array.isArray(val) ? val : []; return `<div class="field full">${lab}<select id="${id}" multiple size="6">${Object.entries(SRC).map(([k, s]) => `<option value="${esc(k)}"${cur.includes(k) ? ' selected' : ''}>${esc(s.label)}</option>`).join('')}</select>${hint}</div>` }
  return `<div class="field">${lab}<input id="${id}" value="${esc(val)}">${hint}</div>`
}
function readField(fd: FieldDef): unknown {
  const el = f('kf_' + fd.k)
  if (fd.type === 'lines') return el.value.split('\n').map(x => x.trim()).filter(Boolean)
  if (fd.type === 'srcs') return [...(el as unknown as HTMLSelectElement).selectedOptions].map(o => o.value)
  if (fd.type === 'num' || fd.type === 'level') return el.value === '' ? undefined : Number(el.value)
  if (fd.type === 'select' && (fd.opts ?? []).length && (fd.opts ?? []).every(o => /^\d+\|/.test(o))) return Number(el.value)
  return el.value.trim()
}

export function renderKindList(): void {
  const sel = $<HTMLSelectElement>('kindSel')
  if (!sel.options.length) sel.innerHTML = KINDS.map(k => `<option value="${k.id}">${esc(k.label)}</option>`).join('')
  sel.value = curKind
  const k = kindOf(curKind)
  const rows = allContent(curKind).map(r => `<div class="editor-record${r._hidden ? ' off' : ''}"><div><strong>${esc(k.title(r))}</strong><small>${r._base ? 'Base do projeto' + (r._over ? ' · editado' : '') : 'Criado pela equipe'}${r._hidden ? ' · oculto' : ''}</small></div><div><button class="pill-btn" data-kedit="${esc(r.id)}">Editar</button>${r._base ? `<button class="pill-btn" data-khide="${esc(r.id)}">${r._hidden ? 'Mostrar' : 'Ocultar'}</button>${r._over ? `<button class="pill-btn" data-kreset="${esc(r.id)}">Restaurar</button>` : ''}` : `<button class="pill-btn" data-kdel="${esc(r.id)}">Excluir</button>`}</div></div>`)
  $('kindList').innerHTML = (curKind === 'texto' ? '' : '<div class="btn-row" style="margin:0 0 12px"><button class="btn orange" data-knew>+ Novo item</button></div>') + (rows.join('') || '<div class="empty">Nada cadastrado neste tipo.</div>')
  $('kindForm').classList.toggle('hide', !formOpen)
}
function openKindForm(id: string | null): void {
  const k = kindOf(curKind)
  const cur = id ? allContent(curKind).find(x => x.id === id) : undefined
  curId = id
  formOpen = true
  const fresh = id ? '' : `<div class="field"><label for="kf_id">Código</label><input id="kf_id" required value="${esc(k.prefix + (allContent(curKind).length + 1))}"></div>`
  $('kindForm').innerHTML = `<h3 style="margin:18px 0 10px">${id ? 'Editar' : 'Novo item'}: ${esc(k.label)}</h3><div class="form-grid">${fresh}${k.fields.map(fd => fieldHtml(fd, cur?.[fd.k])).join('')}</div><div class="btn-row"><button class="btn orange" type="submit">Salvar</button><button class="btn secondary" type="button" data-kcancel>Cancelar</button></div>`
  renderKindList()
  $('kindForm').scrollIntoView({ behavior: 'smooth', block: 'nearest' })
}
async function submitKind(e: SubmitEvent): Promise<void> {
  e.preventDefault()
  const k = kindOf(curKind)
  const old = curId ? allContent(curKind).find(x => x.id === curId) : undefined
  const id = curId ?? f('kf_id').value.trim()
  if (!id) return
  if (!curId && allContent(curKind).some(x => x.id === id)) return fail(new Error('Já existe um item com este código.'))
  const rec: Rec = { ...(old ? stripMeta(old) : {}), id }
  for (const fd of k.fields) rec[fd.k] = readField(fd)
  try { await saveContent(curKind, rec) } catch (err) { return fail(err) }
  formOpen = false; curId = null
  $('kindForm').innerHTML = ''
  renderKindList(); renderAll(); msg('Salvo.')
}
const stripMeta = (r: Rec): Rec => { const { _base, _over, ...rest } = r as Rec & { _base?: boolean; _over?: boolean }; void _base; void _over; return rest as Rec }

async function kindAction(a: 'hide' | 'reset' | 'del', id: string): Promise<void> {
  const cur = allContent(curKind).find(x => x.id === id)
  try {
    if (a === 'hide' && cur) await saveContent(curKind, { ...stripMeta(cur), _hidden: !cur._hidden })
    else if (a === 'reset') { if (!confirm('Voltar este item ao original do projeto?')) return; await deleteContent(curKind, id) }
    else if (a === 'del') { if (!confirm('Excluir este item da base compartilhada?')) return; await deleteContent(curKind, id) }
  } catch (err) { return fail(err) }
  renderKindList(); renderAll()
}

// ---------- histórico (quem mudou o quê) ----------
async function renderHistory(): Promise<void> {
  $('historyList').innerHTML = '<p class="muted">Carregando…</p>'
  try {
    const rows = await loadHistory()
    $('historyList').innerHTML = rows.map(h => `<div class="editor-record"><div><strong>${esc(h.title || h.row_id)}</strong><small>${esc(h.action)} · ${esc(h.tbl)} · ${esc(h.by_email || 'sistema')} · ${new Date(h.at).toLocaleString('pt-BR')}</small></div></div>`).join('') || '<div class="empty">Ainda sem alterações registradas.</div>'
  } catch (err) { $('historyList').innerHTML = `<p class="import-errors">Não foi possível carregar o histórico: ${esc((err as Error).message)}. Aplique a migration de histórico.</p>` }
}

// ---------- exportar / importar ----------
const opts = (id: string) => Array.from(document.querySelectorAll<HTMLOptionElement>(`#${id} option`)).map(o => o.value || o.text)
let pending: Parsed | null = null

/** Lê o arquivo, mostra o que será gravado (e o que foi recusado) e espera confirmação. */
async function importFile(e: Event): Promise<void> {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  $('importReport').innerHTML = '<p class="muted">Lendo o arquivo…</p>'
  const allow = { group: opts('aGroup'), astatus: opts('aStatus'), theme: opts('dTheme'), dstatus: opts('dStatus'), dtype: opts('dType') }
  try { pending = parseFile(file.name, isDocument(file.name) ? await readDocument(file) : await file.text(), allow) }
  catch (err) { input.value = ''; pending = null; $('importReport').innerHTML = `<p class="import-errors">${esc((err as Error).message)}</p>`; return }
  input.value = ''
  const { actors, analyses, errors } = pending
  const n = actors.length + analyses.length
  $('importReport').innerHTML =
    `<p><strong>${actors.length}</strong> perfil(is) e <strong>${analyses.length}</strong> dossiê(s) prontos para gravar.</p>` +
    (errors.length ? `<ul class="import-errors">${errors.map(x => `<li>${esc(x)}</li>`).join('')}</ul><p class="small">Linhas com erro não serão importadas.</p>` : '') +
    (n ? `<div class="btn-row"><button class="btn orange" id="importGo" type="button">Gravar ${n} no banco</button><button class="btn secondary" id="importCancel" type="button">Cancelar</button></div>` : '')
  $('importGo')?.addEventListener('click', () => void commitImport())
  $('importCancel')?.addEventListener('click', () => { pending = null; $('importReport').innerHTML = '' })
}

async function commitImport(): Promise<void> {
  if (!pending) return
  const { actors, analyses } = pending
  const btn = $<HTMLButtonElement>('importGo'); btn.disabled = true; btn.textContent = 'Gravando…'
  try {
    await importData({ actors, analyses })
    renderActors(); renderThemes(); renderRisks(); renderEditorRecords()
    $('importReport').innerHTML = `<p><strong>Gravado no banco:</strong> ${actors.length} perfil(is) e ${analyses.length} dossiê(s).</p>`
  } catch (err) {
    $('importReport').innerHTML = `<p class="import-errors">Erro ao gravar: ${esc((err as Error).message)}. Se a mensagem citar "row-level security", sua conta é de observador.</p>`
  }
  pending = null
}

function downloadTemplate(key: string): void {
  const t = templates[key]
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([t.body], { type: t.mime }))
  a.download = t.file
  a.click()
  URL.revokeObjectURL(a.href)
}

export function initEditor(): void {
  $('actorForm').addEventListener('submit', e => void submitActor(e as SubmitEvent))
  $('analysisForm').addEventListener('submit', e => void submitAnalysis(e as SubmitEvent))
  $('topicForm').addEventListener('submit', e => void submitTopic(e as SubmitEvent))
  $('topicReset').onclick = topicReset
  $('kindSel').addEventListener('change', e => { curKind = (e.target as HTMLSelectElement).value; formOpen = false; $('kindForm').innerHTML = ''; renderKindList() })
  $('kindForm').addEventListener('submit', e => void submitKind(e as SubmitEvent))
  $('editorAll').addEventListener('click', e => {
    const t = (e.target as HTMLElement).closest<HTMLElement>('button')
    if (!t) return
    if (t.dataset.knew !== undefined) openKindForm(null)
    else if (t.dataset.kedit) openKindForm(t.dataset.kedit)
    else if (t.dataset.khide) void kindAction('hide', t.dataset.khide)
    else if (t.dataset.kreset) void kindAction('reset', t.dataset.kreset)
    else if (t.dataset.kdel) void kindAction('del', t.dataset.kdel)
    else if (t.dataset.kcancel !== undefined) { formOpen = false; $('kindForm').innerHTML = ''; renderKindList() }
  })
  $('actorReset').onclick = actorReset
  $('analysisReset').onclick = analysisReset
  $('importFile').onchange = e => void importFile(e)
  document.addEventListener('click', e => {
    const t = (e.target as HTMLElement).closest<HTMLElement>('[data-tpl]')
    if (t) { e.preventDefault(); downloadTemplate(t.dataset.tpl!) }
  })
}
