import type { ViewId } from './types'

/** Poses disponíveis em public/uly/<pose>.png (recortadas da folha de personagem da Uly). */
type Mood = 'apresentando' | 'feliz' | 'triste' | 'dormindo' | 'analisando' | 'entediada' | 'raiva' | 'medo'
// 'dormindo' e 'entediada' existem em public/uly/ mas não são usadas: a Uly só muda de pose por ação do usuário.
const PRELOAD: Mood[] = ['apresentando', 'feliz', 'triste', 'analisando', 'medo', 'raiva']

// Fala e pose por tela. A primeira frase aparece ao entrar; cada clique mostra a próxima.
const VIEWS: Record<ViewId, { mood: Mood; tips: string[] }> = {
  home: { mood: 'apresentando', tips: ['Olá! Eu sou a Uly, sua assistente de cenários e riscos políticos.', 'Comece pelos temas ou clique num eixo do radar.', 'Use a busca para achar atores e temas.'] },
  themes: { mood: 'feliz', tips: ['São 5 eixos de análise. Abra um para ver o dossiê.', 'Cada dossiê mostra como o tema chega até o Itaú.'] },
  scenarios: { mood: 'analisando', tips: ['Três cenários possíveis. Eles podem se combinar!', 'Não uso porcentagem sem evidência.'] },
  actors: { mood: 'apresentando', tips: ['Quem decide? Clique num perfil para ver.', 'Passe o mouse na foto: ela ganha cor.'] },
  risks: { mood: 'medo', tips: ['Atenção aos riscos! Use o filtro para separar das oportunidades.', 'Nota alta não é prejuízo certo. Serve para priorizar.'] },
  monitor: { mood: 'analisando', tips: ['Estou de olho nos sinais. Veja o que acompanhar.', 'Os pontos a verificar estão lá embaixo.'] },
  method: { mood: 'feliz', tips: ['Seis etapas: do histórico ao monitoramento.'] },
  sources: { mood: 'analisando', tips: ['Toda informação tem fonte. Confira!', 'Ter fonte não é prova: confira o trecho citado.'] },
  editor: { mood: 'feliz', tips: ['Aqui você cria e edita perfis e dossiês.', 'Tudo fica salvo no Supabase para a equipe ver.'] },
}

const BUBBLE_MS = 7_000

let root: HTMLElement, img: HTMLImageElement, text: HTMLElement, bubble: HTMLElement
let view: ViewId = 'home'
let tipIndex = 0
let started = false
let hideTimer = 0
let clicks: number[] = []

const src = (m: Mood) => `${import.meta.env.BASE_URL}uly/${m}.png`

function show(mood: Mood, msg: string): void {
  root.dataset.mood = mood
  img.src = src(mood)
  img.classList.remove('pop'); void img.offsetWidth // reinicia a animação
  img.classList.add('pop')
  text.textContent = msg
  bubble.classList.remove('show'); void bubble.offsetWidth
  bubble.classList.add('show')
  clearTimeout(hideTimer)
  hideTimer = window.setTimeout(() => bubble.classList.remove('show'), BUBBLE_MS)
}

/** Reação pontual (ex.: busca sem resultado). */
export function react(mood: Mood, msg: string): void {
  if (started) show(mood, msg)
}

/** Chamado a cada troca de tela. */
export function sayView(v: ViewId): void {
  if (!started) return
  view = v; tipIndex = 0
  show(VIEWS[v].mood, VIEWS[v].tips[0])
}

function poke(): void {
  const now = Date.now()
  clicks = [...clicks.filter(t => now - t < 4000), now]
  if (clicks.length >= 5) { clicks = []; return show('raiva', 'Ei! Pare de me cutucar!') }
  const { mood, tips } = VIEWS[view]
  tipIndex = (tipIndex + 1) % tips.length
  show(mood, tips[tipIndex])
}

/** Cria a Uly (uma vez) e cumprimenta. */
export function startMascot(): void {
  if (!started) {
    root = document.getElementById('mascot')!
    root.innerHTML = `<div class="mascot-bubble" role="status" aria-live="polite"><span class="mascot-name">Uly</span><span class="mascot-text"></span></div><button type="button" class="mascot-btn" aria-label="Uly, guia do Itaú 360°. Clique para uma dica."><img alt="" width="150" height="150"></button>`
    bubble = root.querySelector('.mascot-bubble')!
    text = root.querySelector('.mascot-text')!
    img = root.querySelector('img')!
    root.querySelector('.mascot-btn')!.addEventListener('click', poke)
    bubble.addEventListener('click', () => bubble.classList.remove('show')) // toque no balão o dispensa
    PRELOAD.forEach(m => { new Image().src = src(m) })
    started = true
  }
  sayView('home')
}
