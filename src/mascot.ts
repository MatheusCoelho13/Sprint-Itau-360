import type { ViewId } from './types'

/** Poses disponíveis em public/uly/<pose>.png. A Uly não flutua mais pela tela: aparece só na Ajuda (botão do topo). */
type Mood = 'apresentando' | 'feliz' | 'triste' | 'dormindo' | 'analisando' | 'entediada' | 'raiva' | 'medo'

// Pose e dicas por tela, mostradas na janela de Ajuda.
const VIEWS: Record<ViewId, { mood: Mood; tips: string[] }> = {
  home: { mood: 'apresentando', tips: ['Comece pelos temas ou clique num eixo do radar.', 'Use a busca para achar atores e temas.', 'A régua mostra quantos dias faltam para a posse (5/1/2027).'] },
  themes: { mood: 'feliz', tips: ['São 5 eixos de análise. Abra um para ver o dossiê.', 'Cada dossiê mostra como o tema chega até o Itaú.'] },
  scenarios: { mood: 'analisando', tips: ['Três cenários possíveis. Eles podem se combinar.', 'Não há porcentagem: sem evidência suficiente, o grupo não atribui número.'] },
  actors: { mood: 'apresentando', tips: ['Clique num perfil para ver trajetória e fontes.', 'Caixa tracejada com hachura é nome cotado ou hipótese; caixa cheia é documentado.'] },
  risks: { mood: 'medo', tips: ['Use o filtro para separar riscos de oportunidades.', 'Nota alta não é prejuízo certo: serve só para priorizar.'] },
  monitor: { mood: 'analisando', tips: ['A régua marca a posse (fato) e os demais marcos (preliminares).', 'Os pontos a verificar estão no fim da página.'] },
  method: { mood: 'feliz', tips: ['Seis etapas: do histórico ao monitoramento.'] },
  sources: { mood: 'analisando', tips: ['Toda informação tem fonte.', 'Ter fonte não é prova: confira o trecho citado.'] },
  editor: { mood: 'feliz', tips: ['Aqui você cria e edita perfis e dossiês.', 'Tudo fica salvo no Supabase para a equipe ver.'] },
}

let view: ViewId = 'home'

/** Chamado a cada troca de tela: só guarda qual é, para a Ajuda mostrar as dicas certas. */
export function sayView(v: ViewId): void { view = v }

/** Reação pontual: sem balão flutuante, não faz nada. Mantido para quem chama. */
export function react(_mood: Mood, _msg: string): void {}

export function startMascot(): void { new Image().src = `${import.meta.env.BASE_URL}uly/apresentando.png` }

/** Conteúdo da janela de Ajuda da tela atual. */
export function helpContent(): { title: string; body: string } {
  const { mood, tips } = VIEWS[view]
  const img = `${import.meta.env.BASE_URL}uly/${mood}.png`
  return {
    title: 'Ajuda',
    body: `<div class="help"><img src="${img}" alt="Uly, assistente de cenários e riscos políticos"><div><h2>Nesta tela</h2><ul>${tips.map(t => `<li>${t}</li>`).join('')}</ul><p class="small">Uly é a assistente do grupo. Ela só aparece aqui.</p></div></div>`,
  }
}
