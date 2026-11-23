import type { ViewId } from './types'
import { risks, internalDocs, publicDocs } from './data'
import { getActors } from './store'

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
  users: { mood: 'analisando', tips: ['Aqui o admin define quem lê, quem edita e quem administra.', 'Desativar não apaga: a pessoa só passa a ver o conteúdo público.', 'Toda mudança fica registrada no fim da página.'] },
  editor: { mood: 'feliz', tips: ['Aqui você cria e edita perfis e dossiês.', 'Tudo fica salvo no Supabase para a equipe ver.'] },
}

// ---- o que a Uly diz além das dicas ----
// "Dado": calculado na hora a partir do que o site mostra. "Curiosidade": fato verificável fora do acervo, com a base legal na frase.
type Line = { kind: 'dica' | 'dado' | 'curiosidade'; mood: Mood; text: string }
const posseDias = () => Math.round((Date.UTC(2027, 0, 5) - Date.now()) / 864e5)
const hypRe = /não confirm|hipótese|cotado/i

const DATA: Record<ViewId, () => string[]> = {
  home: () => { const d = posseDias(); return [d > 0 ? `Faltam ${d} dias para a posse, em 5 de janeiro de 2027.` : `Estamos no dia ${1 - d} do mandato; o balanço dos 100 dias é por volta de 15 de abril.`] },
  themes: () => ['Na ordem do calendário, a reforma tributária (CBS/IBS) é o primeiro marco: janeiro de 2027.'],
  scenarios: () => ['Os três cenários partem de uma pergunta só: o pacote fiscal sai nas primeiras semanas ou não?'],
  actors: () => { const l = getActors(); const h = l.filter(a => hypRe.test(a.status)).length; return [`${h} de ${l.length} perfis ainda são nome cotado ou hipótese, e não cargo confirmado.`] },
  risks: () => { const n = (t: string) => risks.filter(r => r.type === t).length; return [`A matriz tem ${n('Risco')} riscos, ${n('Oportunidade')} oportunidades e ${n('Misto')} itens mistos. Sem nota justificada, o item fica em análise.`] },
  monitor: () => ['Só a posse é fato documentado na régua; os outros marcos são calendário preliminar.'],
  method: () => ['Regra do grupo: histórico dá contexto, não previsão.'],
  sources: () => [`Há ${internalDocs.length} documentos internos e ${publicDocs.length} fontes públicas no acervo.`],
  editor: () => ['Dá para importar perfis e dossiês por JSON, CSV ou XML. Os modelos estão em Conteúdos cadastrados.'],
  users: () => ['Desativar uma conta não apaga nada: a pessoa só passa a ver o conteúdo público.'],
}

const CURIOS: Record<ViewId, string[]> = {
  home: [
    'Curiosidade: a posse em 5 de janeiro vale a partir de 2027. Até 2023 era 1º de janeiro; a Emenda 111/2021 mudou a data (Constituição, art. 82).',
    'Curiosidade: a expressão "100 primeiros dias" vem do início do governo de Franklin Roosevelt, nos EUA, em 1933.',
  ],
  themes: ['Curiosidade: o IBS substitui o ICMS e o ISS, e a CBS substitui o PIS e a Cofins (Emenda 132/2023).'],
  scenarios: ['Curiosidade: uma medida provisória vale por 60 dias, prorrogáveis por mais 60, e precisa ser votada pelo Congresso para virar lei (art. 62).'],
  actors: ['Curiosidade: o STF tem 11 ministros. O presidente indica, e o Senado aprova por maioria absoluta: 41 dos 81 senadores (art. 101).'],
  risks: ['Curiosidade: emenda constitucional exige 3/5 dos votos, em dois turnos, em cada Casa: 308 deputados e 49 senadores (art. 60).'],
  monitor: ['Curiosidade: o Copom, do Banco Central, decide a Selic em 8 reuniões por ano.'],
  method: ['Curiosidade: a Câmara tem 513 deputados e o Senado tem 81 senadores, 3 por estado e pelo DF (arts. 45 e 46).'],
  sources: ['Curiosidade: a Constituição é a fonte primária de todas as regras citadas nas curiosidades; o texto está no site do Planalto.'],
  editor: [],
  users: [],
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
    ...VIEWS[v].tips.map((t): Line => ({ kind: 'dica', mood: VIEWS[v].mood, text: t })),
    ...DATA[v]().map((t): Line => ({ kind: 'dado', mood: 'analisando', text: t })),
    ...CURIOS[v].map((t): Line => ({ kind: 'curiosidade', mood: 'apresentando', text: t.replace(/^Curiosidade: (.)/, (_, c: string) => c.toUpperCase()) })),
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
  img.src = src(VIEWS[v].mood)
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
  const { mood, tips } = VIEWS[view]
  const img = `${import.meta.env.BASE_URL}uly/${mood}.png`
  return {
    title: 'Ajuda',
    body: `<div class="help"><img src="${img}" alt="Uly, assistente de cenários e riscos políticos"><div><h2>Nesta tela</h2><ul>${tips.map(t => `<li>${t}</li>`).join('')}</ul><p class="small">Uly é a assistente do grupo. Clique nela, no canto da tela, para outra dica.</p></div></div>`,
  }
}
