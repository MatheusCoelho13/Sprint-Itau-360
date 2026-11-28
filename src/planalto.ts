import { $, esc, sourceLine, addRender } from './ui'
import { ETAPAS } from './data'
import { getActors, getContent } from './store'
import type { Rec } from './content'

/** Desenho da tela Planalto: movimentações, etapa atual e caminho até o Itaú. O HTML fixo da tela está em src/views/planalto.ts. */

/** Registra o desenho no renderAll. */
export function mountPlanalto(): void { addRender(renderPlanalto) }

const stepper = (stage: string): string => {
  const now = ETAPAS.indexOf(stage)
  const items = ETAPAS.map((e, i) => {
    const state = i < now ? 'done' : i === now ? 'now' : ''
    return `<li class="${state}"${i === now ? ' aria-current="step"' : ''}><span>${esc(e)}</span></li>`
  })
  return `<ol class="pl-steps" aria-label="Etapa atual: ${esc(stage)}">${items.join('')}</ol>`
}

const block = (title: string, text: unknown): string => `<div><h4>${title}</h4><p>${esc(text)}</p></div>`

function card(m: Rec, actorId: Map<string, string>): string {
  const names = (m.actors ?? []) as string[]
  // nome que existe no Mapa de atores vira link; o resto aparece como texto
  const actors = names
    .map(n => actorId.has(n) ? `<button type="button" class="link-btn" data-pl-actor="${actorId.get(n)}">${esc(n)}</button>` : esc(n))
    .join(' · ')
  return `
    <article class="panel pl-card">
      <h3>${esc(m.title)}</h3>
      ${stepper(m.stage)}
      <div class="pl-grid">${block('Próxima decisão', m.next)}${block('Risco', m.risk)}${block('Como chega ao Itaú', m.itau)}</div>
      ${actors && m.showActors !== 'não' ? `<p class="small">Atores: ${actors}</p>` : ''}
      ${m.showSrc === 'não' ? '' : sourceLine((m.src ?? []) as string[])}
    </article>`
}

export function renderPlanalto(): void {
  const actorId = new Map(getActors().map(a => [a.name, a.id]))
  $('planaltoList').innerHTML = getContent<Rec>('movimento').map(m => card(m, actorId)).join('')
    || '<div class="empty">Nenhuma movimentação cadastrada.</div>'
}

