import type { ViewId } from './types'
import type { Mood } from './ulyData'
import type { Rec } from './content'
import { diasAtePosse, faltam } from './data'
import { getActors, getContent } from './store'

/** Poses disponíveis em public/uly/<pose>.png. A Uly fica no canto da tela (balão com dica ao entrar numa tela nova) e também na Ajuda. */


// ---- falas editáveis (Área editorial > Uly): dicas, roteiro e curiosidades por tela ----
const POSES: Mood[] = ['apresentando', 'feliz', 'triste', 'dormindo', 'analisando', 'entediada', 'raiva', 'medo']
const pose = (p: unknown): Mood => (POSES.includes(p as Mood) ? (p as Mood) : 'apresentando')
const fala = (l: Rec): string | null => {
  const d = diasAtePosse()
  if (String(l.text).includes('{dias}')) return d > 0 ? String(l.text).replace(/Faltam \{dias\} dias/, faltam(d).replace(/^f/, 'F')).replace(/\{dias\}/g, String(d)) : null
  return String(l.text)
}
const doView = (v: string) => getContent<Rec>('uly').filter(l => l.view === v).sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0))
const VIEWS = {
  get(v: string): { mood: Mood; tips: string[] } {
    const dicas = doView(v).filter(l => l.kind !== 'curiosidade')
    return { mood: pose(dicas[0]?.pose), tips: dicas.map(fala).filter((t): t is string => !!t) }
  },
}
/** Fala da tela de entrada (antes do login só existe o conteúdo-base). */
export const falaLogin = (): string => String(doView('login')[0]?.text ?? '')

// ---- o que a Uly diz além das dicas ----
// "Dado": calculado na hora a partir do que o site mostra. "Curiosidade": fato verificável fora do acervo, com a base legal na frase.
type Line = { kind: 'dica' | 'dado' | 'curiosidade'; mood: Mood; text: string }
const hypRe = /não confirm|hipótese|cotado/i

const DATA: Partial<Record<ViewId, () => string[]>> = {
  home: () => { const d = diasAtePosse(); return [d > 0 ? `Hoje ${faltam(d)} para a posse, em 5 de janeiro de 2027.` : d === 0 ? 'Hoje é o dia da posse.' : `Estamos no dia ${1 - d} do mandato; o balanço dos 100 dias é por volta de 15 de abril.`] },
  themes: () => ['Na ordem do calendário, a reforma tributária (CBS/IBS) é o primeiro marco: janeiro de 2027.'],
  scenarios: () => ['Os três caminhos partem de uma pergunta só: o pacote fiscal sai nas primeiras semanas ou não?', `Há ${getContent('cenario').length} cenários temáticos para filtrar por tema e subtema.`],
  actors: () => { const l = getActors(); const h = l.filter(a => hypRe.test(a.status)).length; return [`${h} de ${l.length} perfis ainda são nome cotado ou hipótese, e não cargo confirmado.`] },
  risks: () => { const n = (t: string) => getContent<Rec>('risco').filter(r => r.type === t).length; return [`A matriz tem ${n('Risco')} riscos, ${n('Oportunidade')} oportunidades e ${n('Misto')} itens mistos. Sem nota justificada, o item fica em análise.`] },
  monitor: () => ['Só a posse é fato documentado na régua; os outros marcos são calendário preliminar.'],
  method: () => ['Regra do grupo: histórico dá contexto, não previsão.'],
  sources: () => [`Há ${getContent('docinterno').length} documentos internos e ${getContent('docpublico').length} fontes públicas no acervo.`],
  guide: () => ['O tour tem 6 etapas e pode ser refeito quando quiser.'],
  editor: () => ['Dá para importar um documento Word, PDF ou texto como dossiê, ou perfis por CSV e XML. Os modelos estão em Conteúdos cadastrados.'],
  users: () => ['Desativar uma conta não apaga nada: a pessoa só passa a ver o conteúdo público.'],
}


const BUBBLE_MS = 7_500
const IDLE_MS = 35_000
let view: ViewId = 'home'
let pool: Line[] = []
let idx = -1
let started = false
let hideTimer = 0
let idleTimer = 0
let clicks: number[] = []
const greeted = new Set<ViewId>() // balão abre sozinho só na 1ª visita de cada tela; depois só por clique
let root: HTMLElement, img: HTMLImageElement, text: HTMLElement, name: HTMLElement, bubble: HTMLElement
const src = (m: Mood) => `${import.meta.env.BASE_URL}uly/${m}.png`

function buildPool(v: ViewId): Line[] {
  return [
    ...VIEWS.get(v).tips.map((t): Line => ({ kind: 'dica', mood: VIEWS.get(v).mood, text: t })),
    ...(DATA[v]?.() ?? []).map((t): Line => ({ kind: 'dado', mood: 'analisando', text: t })),
    ...doView(v).filter(l => l.kind === 'curiosidade').map((l): Line => ({ kind: 'curiosidade', mood: pose(l.pose), text: String(l.text).replace(/^Curiosidade: (.)/, (_, c: string) => c.toUpperCase()) })),
  ]
}

function show(mood: Mood, msg: string, label = 'Uly'): void {
  img.src = src(mood)
  img.classList.remove('pop'); void img.offsetWidth // reinicia a animação
  img.classList.add('pop')
  name.textContent = label
  text.textContent = msg
  bubble.classList.add('show')
  clearTimeout(hideTimer)
  hideTimer = window.setTimeout(() => bubble.classList.remove('show'), BUBBLE_MS)
}

function say(i: number): void {
  idx = i % pool.length
  const l = pool[idx]
  show(l.mood, l.text, l.kind === 'dica' ? 'Uly' : l.kind === 'dado' ? 'Uly · dado' : 'Uly · curiosidade')
}

/** Chamado a cada troca de tela: guarda qual é (para a Ajuda) e, na 1ª visita, a Uly comenta. */
export function sayView(v: ViewId): void {
  view = v
  if (!started) return
  pool = buildPool(v); idx = -1
  img.src = src(VIEWS.get(v).mood)
  bubble.classList.remove('show')
  clearTimeout(idleTimer)
  if (!greeted.has(v)) { greeted.add(v); say(0) }
  // parada na mesma tela por um tempo: uma curiosidade ou dado, uma vez só por visita
  idleTimer = window.setTimeout(() => {
    const next = pool.findIndex((l, i) => i > idx && l.kind !== 'dica')
    if (next >= 0) say(next)
  }, IDLE_MS)
}

/** Reação pontual (ex.: busca sem resultado). */
export function react(mood: Mood, msg: string): void { if (started) show(mood, msg) }

function poke(): void {
  const now = Date.now()
  clicks = [...clicks.filter(t => now - t < 4000), now]
  if (clicks.length >= 5) { clicks = []; return show('raiva', 'Ei! Pare de me cutucar.') }
  clearTimeout(idleTimer)
  say(idx + 1) // dicas, depois dado, depois curiosidade; no fim volta ao começo
}

export function startMascot(): void {
  if (started) return
  root = document.getElementById('mascot')!
  root.innerHTML = `<div class="mascot-bubble" role="status" aria-live="polite"><span class="mascot-name">Uly</span><span class="mascot-text"></span></div><button type="button" class="mascot-btn" aria-label="Uly, assistente do Itaú 360°. Clique para uma dica."><img alt="" width="120" height="120"></button>`
  bubble = root.querySelector('.mascot-bubble')!
  text = root.querySelector('.mascot-text')!
  name = root.querySelector('.mascot-name')!
  img = root.querySelector('img')!
  root.querySelector('.mascot-btn')!.addEventListener('click', poke)
  bubble.addEventListener('click', () => bubble.classList.remove('show'))
  ;(['apresentando', 'feliz', 'triste', 'analisando', 'medo', 'raiva'] as Mood[]).forEach(m => { new Image().src = src(m) })
  started = true
  sayView(view)
}

/** Conteúdo da janela de Ajuda da tela atual. */
export function helpContent(): { title: string; body: string } {
  const { mood, tips } = VIEWS.get(view)
  const img = `${import.meta.env.BASE_URL}uly/${mood}.png`
  return {
    title: 'Ajuda',
    body: `<div class="help"><img src="${img}" alt="Uly, assistente de cenários e riscos políticos"><div><h2>Nesta tela</h2><ul>${tips.map(t => `<li>${t}</li>`).join('')}</ul><p class="small">Uly é a assistente do grupo. Clique nela, no canto da tela, para outra dica.</p></div></div>`,
  }
}
