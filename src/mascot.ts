import type { ViewId } from './types'

/** Poses disponíveis em public/uly/<pose>.png. A Uly fica no canto da tela (balão com dica ao entrar numa tela nova) e também na Ajuda. */
type Mood = 'apresentando' | 'feliz' | 'triste' | 'dormindo' | 'analisando' | 'entediada' | 'raiva' | 'medo'

// Pose e dicas por tela, mostradas na janela de Ajuda.
const VIEWS: Record<ViewId, { mood: Mood; tips: string[] }> = {
  home: { mood: 'apresentando', tips: ['Comece pelos cinco eixos ao lado do título.', 'Use a busca para achar atores e temas.', 'A régua mostra quantos dias faltam para a posse (5/1/2027).'] },
  themes: { mood: 'feliz', tips: ['São 5 eixos de análise. Abra um para ver o dossiê.', 'Cada dossiê mostra como o tema chega até o Itaú.'] },
  scenarios: { mood: 'analisando', tips: ['Três cenários possíveis. Eles podem se combinar.', 'Não há porcentagem: sem evidência suficiente, o grupo não atribui número.'] },
  actors: { mood: 'apresentando', tips: ['Clique num perfil para ver trajetória e fontes.', 'Caixa tracejada com hachura é nome cotado ou hipótese; caixa cheia é documentado.'] },
  risks: { mood: 'medo', tips: ['Use o filtro para separar riscos de oportunidades.', 'Nota alta não é prejuízo certo: serve só para priorizar.'] },
  monitor: { mood: 'analisando', tips: ['A régua marca a posse (fato) e os demais marcos (preliminares).', 'Os pontos a verificar estão no fim da página.'] },
  method: { mood: 'feliz', tips: ['Seis etapas: do histórico ao monitoramento.'] },
  sources: { mood: 'analisando', tips: ['Toda informação tem fonte.', 'Ter fonte não é prova: confira o trecho citado.'] },
  editor: { mood: 'feliz', tips: ['Aqui você cria e edita perfis e dossiês.', 'Tudo fica salvo no Supabase para a equipe ver.'] },
}

const BUBBLE_MS = 6_500
let view: ViewId = 'home'
let tipIndex = 0
let started = false
let hideTimer = 0
let clicks: number[] = []
const greeted = new Set<ViewId>() // balão abre sozinho só na 1ª visita de cada tela; depois só por clique
let root: HTMLElement, img: HTMLImageElement, text: HTMLElement, bubble: HTMLElement
const src = (m: Mood) => `${import.meta.env.BASE_URL}uly/${m}.png`

function show(mood: Mood, msg: string): void {
  img.src = src(mood)
  img.classList.remove('pop'); void img.offsetWidth // reinicia a animação
  img.classList.add('pop')
  text.textContent = msg
  bubble.classList.add('show')
  clearTimeout(hideTimer)
  hideTimer = window.setTimeout(() => bubble.classList.remove('show'), BUBBLE_MS)
}

/** Chamado a cada troca de tela: guarda qual é (para a Ajuda) e, na 1ª visita, a Uly comenta. */
export function sayView(v: ViewId): void {
  view = v; tipIndex = 0
  if (!started) return
  img.src = src(VIEWS[v].mood)
  bubble.classList.remove('show')
  if (!greeted.has(v)) { greeted.add(v); show(VIEWS[v].mood, VIEWS[v].tips[0]) }
}

/** Reação pontual (ex.: busca sem resultado). */
export function react(mood: Mood, msg: string): void { if (started) show(mood, msg) }

function poke(): void {
  const now = Date.now()
  clicks = [...clicks.filter(t => now - t < 4000), now]
  if (clicks.length >= 5) { clicks = []; return show('raiva', 'Ei! Pare de me cutucar.') }
  const { mood, tips } = VIEWS[view]
  tipIndex = (tipIndex + 1) % tips.length
  show(mood, tips[tipIndex])
}

export function startMascot(): void {
  if (started) return
  root = document.getElementById('mascot')!
  root.innerHTML = `<div class="mascot-bubble" role="status" aria-live="polite"><span class="mascot-name">Uly</span><span class="mascot-text"></span></div><button type="button" class="mascot-btn" aria-label="Uly, assistente do Itaú 360°. Clique para uma dica."><img alt="" width="120" height="120"></button>`
  bubble = root.querySelector('.mascot-bubble')!
  text = root.querySelector('.mascot-text')!
  img = root.querySelector('img')!
  root.querySelector('.mascot-btn')!.addEventListener('click', poke)
  bubble.addEventListener('click', () => bubble.classList.remove('show'))
  ;(['apresentando', 'feliz', 'triste', 'analisando', 'medo', 'raiva'] as Mood[]).forEach(m => { new Image().src = src(m) })
  started = true
  sayView(view)
}

/** Conteúdo da janela de Ajuda da tela atual. */
export function helpContent(): { title: string; body: string } {
  const { mood, tips } = VIEWS[view]
  const img = `${import.meta.env.BASE_URL}uly/${mood}.png`
  return {
    title: 'Ajuda',
    body: `<div class="help"><img src="${img}" alt="Uly, assistente de cenários e riscos políticos"><div><h2>Nesta tela</h2><ul>${tips.map(t => `<li>${t}</li>`).join('')}</ul><p class="small">Uly é a assistente do grupo. Clique nela, no canto da tela, para outra dica.</p></div></div>`,
  }
}
