import { SRC } from './data'
import { allContent, saveContent, removeContent, type Item } from './store'
import { supabase } from './supabase'
import { $, esc, openModal, closeModal, renderAll } from './ui'

// Adicionar/editar/remover fontes direto na tela "Fontes e documentos".
// Documento interno = kind 'docinterno'. Fonte pública = 'fonte' (rótulo+URL) + 'docpublico' (entrada na lista).
// Remover = excluir de vez (item da base fica marcado _deleted; item da equipe sai do banco).

const strip = (r: Item) => { const { _base, _over, ...rest } = r; void _base; void _over; return rest }
export const validUrl = (u: string) => /^https?:\/\//i.test(u) || /^docs\/[^\s]+$/.test(u) // bloqueia javascript:, data: etc.
const uid = () => Date.now().toString(36)
const val = (id: string) => ($(id) as HTMLInputElement).value.trim()

function openForm(kind: 'i' | 'p', id?: string): void {
  const doc = id && kind === 'i' ? allContent('docinterno').find(x => x.id === id) : undefined
  const pub = id && kind === 'p' ? allContent('docpublico').find(x => x.id === id) : undefined
  const s = pub ? SRC[pub.ref] : undefined
  const isNew = !id
  const type = isNew
    ? `<div class="field"><label for="sfType">Tipo</label><select id="sfType"><option value="p">Fonte pública (link)</option><option value="i">Documento interno</option></select></div>`
    : `<input type="hidden" id="sfType" value="${kind}">`
  openModal(isNew ? 'Adicionar fonte' : 'Editar fonte', `<form id="srcForm" data-id="${esc(id ?? '')}"><div class="form-grid">${type}
    <div class="field full"><label for="sfTitle">Título</label><input id="sfTitle" required value="${esc(doc?.title ?? s?.label ?? '')}"></div>
    <div class="field full" id="sfDescBox"><label for="sfDesc">Descrição</label><textarea id="sfDesc" rows="3">${esc(doc?.desc ?? '')}</textarea></div>
    <div class="field full"><label for="sfUrl">URL ou arquivo</label><input id="sfUrl" required value="${esc(doc?.url ?? s?.url ?? '')}"><small class="muted">https://… ou docs/nome.pdf (arquivo privado).</small></div>
    <div class="field full"><label for="sfFile">Ou envie um arquivo (pdf, zip, docx, xlsx…)</label><input id="sfFile" type="file"><small class="muted" id="sfFileMsg"></small></div></div>
    <p class="import-errors" id="sfErr"></p>
    <div class="btn-row"><button class="btn orange" type="submit">Salvar</button><button class="btn secondary" type="button" data-src-cancel>Cancelar</button></div></form>`)
  const sync = () => $('sfDescBox').classList.toggle('hide', val('sfType') !== 'i')
  $('sfType').addEventListener('change', sync); sync()
  $('sfFile').addEventListener('change', async ev => {
    const file = (ev.target as HTMLInputElement).files?.[0]; if (!file) return
    const name = file.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w.-]+/g, '_') // sem acento nem espaço (ver openDoc em main.ts)
    $('sfFileMsg').textContent = 'Enviando…'
    const { error } = await supabase.storage.from('docs').upload(name, file, { upsert: true })
    if (error) { $('sfFileMsg').textContent = 'Erro no envio: ' + error.message; return }
    ;($('sfUrl') as HTMLInputElement).value = 'docs/' + name
    if (!val('sfTitle')) ($('sfTitle') as HTMLInputElement).value = name.replace(/\.[^.]+$/, '').replace(/_/g, ' ')
    $('sfFileMsg').textContent = 'Enviado: ' + name
  })
}

async function submit(form: HTMLElement): Promise<void> {
  const id = form.dataset.id || ''
  const type = val('sfType'), title = val('sfTitle'), url = val('sfUrl')
  if (!validUrl(url)) { $('sfErr').textContent = 'Use um link https://… ou um arquivo docs/nome.pdf.'; return }
  try {
    if (type === 'i') {
      const old = id ? allContent('docinterno').find(x => x.id === id) : undefined
      await saveContent('docinterno', { ...(old ? strip(old) : {}), id: id || 'DI' + uid(), title, desc: val('sfDesc'), url })
    } else {
      const old = id ? allContent('docpublico').find(x => x.id === id) : undefined
      const ref = old ? String(old.ref) : 'S' + uid()
      await saveContent('fonte', { id: ref, label: title, url }) // atualiza SRC (applyContent)
      if (!old) await saveContent('docpublico', { id: 'DP' + uid(), ref })
    }
  } catch (e) { $('sfErr').textContent = 'Erro: ' + (e instanceof Error ? e.message : String(e)); return }
  closeModal(); renderAll()
}

async function remove(kind: string, id: string): Promise<void> {
  const k = kind === 'i' ? 'docinterno' : 'docpublico'
  const cur = allContent(k).find(x => x.id === id)
  if (!cur || !confirm('Excluir esta fonte de vez? Não dá para desfazer.')) return
  try {
    await removeContent(k, id)
    if (k === 'docpublico') await removeContent('fonte', String(cur.ref))
  } catch (e) { return void alert('Erro: ' + (e instanceof Error ? e.message : String(e))) }
  renderAll()
}

export function initSourcesEdit(): void {
  document.addEventListener('click', e => {
    const t = (e.target as HTMLElement).closest<HTMLElement>('[data-src-new],[data-src-edit],[data-src-del],[data-src-cancel]')
    if (!t) return
    if ('srcNew' in t.dataset) openForm('p')
    else if ('srcCancel' in t.dataset) closeModal()
    else if (t.dataset.srcEdit) { const [k, id] = t.dataset.srcEdit.split(':'); openForm(k as 'i' | 'p', id) }
    else if (t.dataset.srcDel) { const [k, id] = t.dataset.srcDel.split(':'); void remove(k, id) }
  })
  document.addEventListener('submit', e => {
    const form = e.target as HTMLElement
    if (form.id === 'srcForm') { e.preventDefault(); void submit(form) }
  })
}
