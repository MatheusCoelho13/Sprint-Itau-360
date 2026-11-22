import { SRC } from './data'
import {
  getActors, getAnalyses, saveActor, saveAnalysis, deleteActor, deleteAnalysis,
  exportData, importData,
} from './store'
import { $, esc, go, renderActors, renderRisks, renderThemes } from './ui'
import type { Actor, Analysis, CustomSource, ExportFile, Source } from './types'

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
  $('editorContent').classList.toggle('hide', tab !== 'content')
  if (tab === 'content') renderEditorRecords()
}

// ---------- lista de registros ----------
export function renderEditorRecords(): void {
  const actors = getActors().map(a => `<div class="editor-record"><div><strong>${esc(a.name)}</strong><small>Perfil de ator · ${esc(a.status)} · ${a._base ? 'Base do projeto' : 'Criado pela equipe'}</small></div><div><button class="pill-btn" data-edit-actor="${a.id}">Editar</button>${a._base ? `<button class="pill-btn" data-reset-actor="${a.id}">Restaurar</button>` : `<button class="pill-btn" data-delete="actor" data-id="${a.id}">Excluir</button>`}</div></div>`)
  const analyses = getAnalyses().map(d => `<div class="editor-record"><div><strong>${esc(d.title)}</strong><small>Dossiê · ${esc(d.status)} · ${esc(d.theme)}</small></div><div><button class="pill-btn" data-edit-analysis="${d.id}">Editar</button><button class="pill-btn" data-delete="analysis" data-id="${d.id}">Excluir</button></div></div>`)
  $('editorRecords').innerHTML = [...actors, ...analyses].join('') || '<div class="empty">Ainda não há conteúdo criado pela área editorial.</div>'
}

// ---------- formulários ----------
const ACTOR_FIELDS = { aName: 'name', aRole: 'role', aBio: 'bio', aRelevance: 'relevance', aPhoto: 'photo', aPhotoCredit: 'photoCredit', aDate: 'date' } as const
const ANALYSIS_FIELDS = {
  dTitle: 'title', dTheme: 'theme', dStatus: 'status', dType: 'type', dQuestion: 'question',
  dEvidence: 'evidence', dActors: 'actors', dTransmission: 'transmission', dImpact: 'impact',
  dScenarios: 'scenarios', dSignals: 'signals', dAssessment: 'assessment', dAuthor: 'author', dReview: 'review',
} as const

const actorReset = () => { $<HTMLFormElement>('actorForm').reset(); f('editActorId').value = '' }
const analysisReset = () => { $<HTMLFormElement>('analysisForm').reset(); f('editAnalysisId').value = '' }

export function loadActorToForm(id: string): void {
  const a = getActors().find(x => x.id === id)
  if (!a) return
  editorTab('actor')
  f('editActorId').value = a.id
  for (const [el, k] of Object.entries(ACTOR_FIELDS)) f(el).value = a[k] ?? ''
  f('aGroup').value = a.group
  f('aStatus').value = a.status
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
    await (type === 'actor' ? deleteActor(id) : deleteAnalysis(id))
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
    ...(sourceDetails.length ? { sourceDetails } : {}),
  }
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

// ---------- exportar / importar ----------
function exportJson(): void {
  const blob = new Blob([JSON.stringify(exportData(), null, 2)], { type: 'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'itau360-conteudo-editorial.json'
  a.click()
  URL.revokeObjectURL(a.href)
  msg('Arquivo JSON exportado.')
}

async function importJson(e: Event): Promise<void> {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  try {
    const d = JSON.parse(await file.text()) as ExportFile
    await importData(d)
    renderActors(); renderThemes(); renderRisks(); renderEditorRecords()
    msg('Conteúdo importado.')
  } catch (err) {
    alert(err instanceof SyntaxError ? 'Arquivo JSON inválido.' : 'Erro: ' + (err as Error).message)
  }
  input.value = ''
}

export function initEditor(): void {
  $('actorForm').addEventListener('submit', e => void submitActor(e as SubmitEvent))
  $('analysisForm').addEventListener('submit', e => void submitAnalysis(e as SubmitEvent))
  $('actorReset').onclick = actorReset
  $('analysisReset').onclick = analysisReset
  $('exportJson').onclick = exportJson
  $('importJson').onchange = e => void importJson(e)
}
