// Textos fixos das telas (títulos, introduções, avisos): lidos da própria página e editáveis na Área editorial.
// Só entram elementos de texto puro (sem links ou negrito dentro), para a edição não apagar marcação.
const SEL = '.page-head h1, .page-head p:not(.kicker), .notice, .section-title h2, .section-title p, .hero.front h1, .hero.front .lede'
const base = new Map<string, string>()

export function initTexts(): void {
  document.querySelectorAll<HTMLElement>('.view').forEach(view => {
    let i = 0
    view.querySelectorAll<HTMLElement>(SEL).forEach(el => {
      if (el.children.length) return
      const key = `${view.id.replace('view-', '')}.${++i}`
      el.dataset.ed = key
      base.set(key, el.textContent?.trim() ?? '')
    })
  })
}
export const textBase = () => [...base].map(([id, text]) => ({ id, text }))
/** Volta tudo ao texto da página e aplica as edições salvas. */
export function applyTexts(over: Record<string, string>): void {
  document.querySelectorAll<HTMLElement>('[data-ed]').forEach(el => {
    const k = el.dataset.ed!
    el.textContent = over[k] ?? base.get(k) ?? el.textContent
  })
}
