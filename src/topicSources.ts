import { SRC } from './data'
import { getTopics, saveTopic } from './store'
import { validUrl } from './sourcesEdit'
import { $, esc, extLinks, renderThemes, showTheme } from './ui'
import type { Source, Topic } from './types'

// Fontes do tema editáveis no próprio dossiê: rascunho + prévia, só grava em "Salvar fontes".
let draft: { id: string; list: Source[]; dirty: boolean } | null = null

const current = (t: Topic): Source[] =>
  t.sourceDetails ? [...t.sourceDetails] : t.sources.filter(k => SRC[k]).map(k => ({ ...SRC[k] }))

const preview = (list: Source[]) => list.length ? `<div class="source-line">Fontes: ${extLinks(list).join(' · ')}</div>` : '<p class="muted">Nenhuma fonte neste tema.</p>'

function body(): string {
  const d = draft!
  return `<h3>Fontes deste tema <span class="tag blue">edição</span></h3>
<ul class="tsrc-list">${d.list.map((s, i) => `<li><span>${esc(s.label)}</span><button type="button" class="pill-btn" data-tsrc-rm="${i}" aria-label="Remover ${esc(s.label)}">Remover</button></li>`).join('') || '<li class="muted">Nenhuma fonte.</li>'}</ul>
<div class="field"><label for="tsrcQ">Buscar nas fontes cadastradas</label><input id="tsrcQ" type="search" autocomplete="off" placeholder="Digite parte do título"></div>
<div id="tsrcRes"></div>
<div class="form-grid"><div class="field"><label for="tsrcLabel">Ou criar uma nova: título</label><input id="tsrcLabel"></div><div class="field"><label for="tsrcUrl">URL ou docs/arquivo</label><input id="tsrcUrl"></div></div>
<p class="import-errors" id="tsrcErr"></p>
<div class="btn-row"><button type="button" class="btn secondary" data-tsrc-new>+ Adicionar à lista</button></div>
<h4>Prévia: como aparece no dossiê</h4><div id="tsrcPrev">${preview(d.list)}</div>
<div class="btn-row"><button type="button" class="btn orange" data-tsrc-save${d.dirty ? '' : ' disabled'}>Salvar fontes</button><button type="button" class="btn secondary" data-tsrc-reset${d.dirty ? '' : ' disabled'}>Descartar</button></div>`
}

/** Painel (só admin/editor veem, via .ed-only). Chamado por showTheme: reinicia o rascunho. */
export function srcPanel(t: Topic): string {
  draft = { id: t.id, list: current(t), dirty: false }
  return `<div class="ed-only tsrc-ed" id="topicSrcEd">${body()}</div>`
}

const redraw = () => { $('topicSrcEd').innerHTML = body() }
const touch = () => { draft!.dirty = true; redraw() }

function results(q: string): void {
  const have = new Set(draft!.list.map(s => s.url))
  const hits = q ? Object.entries(SRC).filter(([, s]) => !have.has(s.url) && s.label.toLowerCase().includes(q.toLowerCase())).slice(0, 8) : []
  $('tsrcRes').innerHTML = hits.map(([k, s]) => `<button type="button" class="tsrc-hit" data-tsrc-add="${esc(k)}">+ ${esc(s.label)}</button>`).join('') || (q ? '<p class="muted">Nada encontrado.</p>' : '')
}

async function save(): Promise<void> {
  const t = getTopics().find(x => x.id === draft!.id)
  if (!t) return
  const { _base, ...rec } = t as Topic & { _base?: boolean }; void _base
  try { await saveTopic({ ...rec, sourceDetails: draft!.list }) } catch (e) { return void alert('Erro: ' + (e instanceof Error ? e.message : String(e))) }
  renderThemes(); showTheme(rec.id)
}

export function initTopicSources(): void {
  document.addEventListener('input', e => {
    if ((e.target as HTMLElement).id === 'tsrcQ') results(($('tsrcQ') as HTMLInputElement).value.trim())
  })
  document.addEventListener('click', e => {
    const t = (e.target as HTMLElement).closest<HTMLElement>('[data-tsrc-rm],[data-tsrc-add],[data-tsrc-new],[data-tsrc-save],[data-tsrc-reset]')
    if (!t || !draft) return
    if (t.dataset.tsrcRm) { draft.list.splice(Number(t.dataset.tsrcRm), 1); touch() }
    else if (t.dataset.tsrcAdd) { const s = SRC[t.dataset.tsrcAdd]; if (s) { draft.list.push({ ...s }); touch() } }
    else if ('tsrcNew' in t.dataset) {
      const label = ($('tsrcLabel') as HTMLInputElement).value.trim(), url = ($('tsrcUrl') as HTMLInputElement).value.trim()
      if (!label || !validUrl(url)) { $('tsrcErr').textContent = 'Informe o título e um link https://… ou docs/arquivo.'; return }
      draft.list.push({ label, url }); touch()
    }
    else if ('tsrcSave' in t.dataset) void save()
    else if ('tsrcReset' in t.dataset) { showTheme(draft.id) }
  })
}
