import {
  SRC, scenarios, risks, variables, timeline, indicators, pending, methodSteps, methodTools,
  internalDocs, publicDocs, themeScenarios, movimentos, ETAPAS,
} from './data'
import { TIPS, CURIOS } from './ulyData'
import { textBase } from './texts'

// instantâneo das fontes antes de qualquer edição (o cadastro de fontes altera SRC em tempo de execução)
const SRC_BASE = Object.entries(SRC).map(([id, s]) => ({ id, ...s }))

// Registro de tudo o que a Área editorial edita, além de atores, dossiês e temas (que têm formulário próprio).
// Cada tipo tem: campos (o formulário é gerado a partir deles) e o conteúdo-base. Edição de item da base vira
// "override" no banco (content_items); item novo é criado; item da base pode ser ocultado e restaurado.

export type FType = 'text' | 'area' | 'lines' | 'num' | 'select' | 'level' | 'srcs' | 'src'
export interface Field { k: string; label: string; type: FType; opts?: string[]; hint?: string }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Rec = { id: string; _hidden?: boolean; _deleted?: boolean } & Record<string, any>
export interface KindDef { id: string; label: string; prefix: string; fields: Field[]; title: (r: Rec) => string; base: () => Rec[] }

const T = (k: string, label: string, hint?: string): Field => ({ k, label, type: 'text', hint })
const A = (k: string, label: string, hint?: string): Field => ({ k, label, type: 'area', hint })
const L = (k: string, label: string, hint = 'Um item por linha.'): Field => ({ k, label, type: 'lines', hint })
const LV = (k: string, label: string): Field => ({ k, label, type: 'level' })
const SR = (k: string, label: string): Field => ({ k, label, type: 'srcs', hint: 'Segure Ctrl (ou Cmd) para marcar mais de uma. Fontes novas entram em “Fontes”.' })
const n = <X>(prefix: string, a: X[], f: (x: X, i: number) => Record<string, unknown>): Rec[] => a.map((x, i) => ({ id: prefix + (i + 1), ...f(x, i) }))

const POSES = ['apresentando', 'feliz', 'triste', 'analisando', 'medo', 'raiva', 'entediada', 'dormindo']
const VIEWS_ULY = ['login', 'primeiro', 'historia', 'home', 'themes', 'scenarios', 'actors', 'risks', 'monitor', 'method', 'sources', 'guide', 'editor', 'users', 'planalto', 'fim']

// ---- Uly: dicas por tela, curiosidades e o roteiro da proposta (19 falas) ----
const ulyBase = (): Rec[] => {
  const out: Rec[] = []
  let o = 0
  for (const [view, { mood, tips }] of Object.entries(TIPS)) tips.forEach((text, i) => out.push({ id: `dica-${view}-${i + 1}`, view, kind: 'dica', pose: mood, trigger: '', text, order: ++o }))
  for (const [view, list] of Object.entries(CURIOS)) list.forEach((text, i) => out.push({ id: `curio-${view}-${i + 1}`, view, kind: 'curiosidade', pose: 'apresentando', trigger: '', text, order: ++o }))
  const R: [string, string, string, string, string][] = [
    ['login', 'Ao lado de Entrar · Grande, mão aberta', 'apresentando', 'Entre com seu perfil. Lá dentro eu te mostro por onde começar.', ''],
    ['primeiro', 'Ao abrir Conheça a Uly · Grande, mão aberta', 'apresentando', 'Eu sou a Uly. Minha primeira pista foi uma pergunta rabiscada num caderno. Quer conhecer a história?', ''],
    ['home', 'Sob o resumo do período · Pequena, curiosa', 'analisando', 'Comece pelo destaque do dia. Toque no título para descobrir por que ele entrou no radar.', ''],
    ['home', 'Junto ao contador · Pequena, sorridente', 'feliz', 'Faltam {dias} dias para a posse presidencial.', ''],
    ['planalto', 'Acima da linha do tempo · Pequena, atenta', 'analisando', 'Escolha uma movimentação e confira em que etapa ela está. Qual é a próxima decisão?', ''],
    ['themes', 'Ao lado dos filtros · Pequena, curiosa', 'analisando', 'Escolha um tema. A primeira leitura explica o assunto e por que ele interessa ao Itaú.', ''],
    ['themes', 'Ao abrir Como o efeito chega ao banco · Pequena, pensativa', 'analisando', 'Siga o caminho comigo. Uma decisão pode mudar o calendário de uma obra e, com isso, os planos das empresas envolvidas.', ''],
    ['themes', 'Dentro de Como aprofundar · Lupa', 'analisando', 'Abra o documento indicado e procure a resposta à pergunta do dossiê.', ''],
    ['scenarios', 'Junto à legenda das barras · Pequena, atenta', 'analisando', 'Leia cada barra pelo nome. Duas marcas em probabilidade indicam uma avaliação média.', ''],
    ['scenarios', 'Ao abrir a justificativa · Lupa', 'analisando', 'O que sustenta essa avaliação? Aqui você encontra as evidências e o que faria a equipe mudar de ideia.', ''],
    ['risks', 'Acima da tabela de detalhe · Pequena, pensativa', 'analisando', 'Compare as duas células de baixo. A mesma decisão pode ter um efeito para o banco e outro para os clientes.', ''],
    ['actors', 'Junto ao filtro de situação · Lupa', 'analisando', 'Confira a situação e a data da fonte. Depois, abra os cenários em que esse ator aparece.', ''],
    ['risks', 'Ao lado da matriz · Pequena, atenta', 'analisando', 'Escolha um item da matriz para ver quem pode ser afetado e em que condições.', ''],
    ['monitor', 'Junto à última verificação · Lupa', 'analisando', 'O que mudou desde a última checagem? Abra o histórico para comparar as evidências.', ''],
    ['method', 'Junto à escala · Pequena, pensativa', 'analisando', 'Veja o que a equipe considera ao classificar uma hipótese como baixa, média ou alta.', ''],
    ['sources', 'Ao lado de Abrir fonte · Lupa', 'analisando', 'Quer conferir a análise? Abra a referência e vá até a página indicada.', ''],
    ['editor', 'Junto a Nova publicação · Grande, mão aberta', 'apresentando', 'Escolha o tipo de publicação. Você pode salvar um rascunho e voltar a ele depois.', ''],
    ['editor', 'Na prévia das linhas · Pequena, atenta', 'analisando', 'Confira o que será criado e o que será atualizado antes de salvar o lote.', ''],
    ['fim', 'Ao lado de Concluir · Pequena, sorridente', 'feliz', 'Pronto! Se quiser percorrer o caminho de novo, me chame em Rever guia.', ''],
  ]
  out.push(
    { id: 'historia-1', view: 'historia', kind: 'roteiro', pose: 'apresentando', trigger: 'Conheça a Uly · 1º parágrafo', text: 'Na noite em que três estudantes desenhavam o Itaú 360°, uma delas fez um círculo dourado em volta de uma pergunta no caderno. Quando fechou a capa, ouviu um plim. O círculo tinha rolado para fora da página. Tinha dois tênis laranja, um par de luvas e uma pergunta própria: “Se essa decisão sair do papel, onde ela vai parar?”', order: ++o },
    { id: 'historia-2', view: 'historia', kind: 'roteiro', pose: 'analisando', trigger: 'Conheça a Uly · 2º parágrafo', text: 'A pequena Uly passou a madrugada seguindo a pista. Foi de uma notícia a um documento e do documento até uma empresa que poderia sentir a mudança. De manhã, as três encontraram um caminho inteiro desenhado na margem. Uly ainda estava lá, com uma lupa quase do tamanho do rosto. “Querem ver por onde eu comecei?”', order: ++o },
  )
  R.forEach(([view, trigger, pose, text], i) => out.push({ id: `roteiro-${String(i + 1).padStart(2, '0')}`, view, kind: 'roteiro', pose, trigger, text, order: ++o }))
  return out
}

const TOUR_BASE = [
  ['Entenda o propósito', 'Explore os primeiros 100 dias de um hipotético quarto mandato do governo Lula em 2027, com foco no setor financeiro. Os acontecimentos e indicadores são demonstrativos.', '', ''],
  ['Navegue pelo menu', 'A barra de seções reúne temas, cenários, atores, riscos e oportunidades, sinais, metodologia e fontes. Esta aba, Guia, reabre o tour quando você quiser.', '', ''],
  ['Leia os cinco eixos', 'Na visão executiva, escolha um dos cinco eixos para entender os sinais e as perguntas que orientam a análise.', 'home', 'Ir para a visão executiva'],
  ['Compare os cenários', 'Abra os cenários A, B e C e veja as combinações entre eles. Mais abaixo, filtre os cenários temáticos por tipo, tema, subtema, ator, probabilidade, gravidade e horizonte.', 'scenarios', 'Ir para os cenários'],
  ['Veja quem se conecta', 'Em Atores, o Diretório lista perfis com status de verificação e o Mapa de conexões mostra como Executivo, Congresso, ministérios e setor financeiro se relacionam.', 'actors', 'Ir para os atores'],
  ['Peça ajuda à Uly', 'Clique na Uly, no canto inferior direito, ou em Ajuda, na barra superior, para ver dicas sobre a tela em que você está.', '', ''],
] as const

const VIEW_OPTS = ['', 'home', 'themes', 'scenarios', 'actors', 'risks', 'monitor', 'method', 'sources', 'guide', 'editor']

export const KINDS: KindDef[] = [
  { id: 'caminho', label: 'Cenários A, B e C', prefix: 'K', title: r => `${r.id} · ${r.title}`,
    fields: [T('title', 'Título'), T('kind', 'Rótulo curto (ex.: Pressão fiscal)'), A('definition', 'Definição'), L('signals', 'Sinais de confirmação'), A('support', 'Atores favoráveis'), A('resistance', 'Resistências'), L('itau', 'Implicações para o Itaú'), L('clients', 'Implicações para clientes'), SR('sources', 'Fontes')],
    base: () => scenarios.map(s => ({ ...s })) },
  { id: 'combinacao', label: 'Combinações (A+B, A+C, B+C)', prefix: 'X', title: r => `${r.a} + ${r.b} · ${r.title}`,
    fields: [T('a', 'Cenário 1 (A, B ou C)'), T('b', 'Cenário 2 (A, B ou C)'), T('title', 'Título'), A('text', 'Texto'), T('source', 'Fonte (texto curto)')],
    base: () => [
      { id: 'A+B', a: 'A', b: 'B', title: 'Pacote anunciado, mas sem corte de despesas', text: 'O governo apresenta um pacote com meta e travas, mas mantém despesas e compromissos para 2027. O mercado pode reconhecer o gesto e, ao mesmo tempo, duvidar da execução, o que mantém o prêmio de risco entre os dois extremos.', source: 'Combinação derivada dos cenários A e B do documento de 11/11. Não consta como cenário próprio na fonte.' },
      { id: 'A+C', a: 'A', b: 'C', title: 'Ajuste anunciado, tramitação lenta', text: 'O Executivo apresenta um pacote fiscal crível, mas encontra dificuldades para aprová-lo ou para avançar na regulamentação tributária. O mercado pode reconhecer a intenção, mas manter prêmio de risco elevado enquanto a execução não se materializa.', source: 'Cenários 100 dias, p. 2' },
      { id: 'B+C', a: 'B', b: 'C', title: 'Sem ajuste, com Congresso travado', text: 'A ausência de medidas fiscais é agravada por baixa capacidade de coordenação política. O resultado possível é maior incerteza sobre juros, tributação, prazos regulatórios e investimento.', source: 'Cenários 100 dias, p. 2' },
    ] },
  { id: 'cenario', label: 'Cenários temáticos (CT)', prefix: 'CT', title: r => `${r.id} · ${r.t}`,
    fields: [T('t', 'Título'), { k: 'tp', label: 'Tipo', type: 'select', opts: ['Favorável', 'Desfavorável', 'Misto', 'Oportunidade', 'Risco'] }, L('tm', 'Temas', 'Um por linha, exatamente como o nome curto do tema.'), L('sub', 'Subtemas', 'Um por linha, exatamente como no tema.'), L('pb', 'Públicos afetados'), L('at', 'Atores'), LV('p', 'Probabilidade'), LV('g', 'Gravidade'), LV('c', 'Complexidade'), { k: 'h', label: 'Horizonte', type: 'select', opts: ['1|Curto prazo', '2|Médio prazo', '3|Longo prazo'] }, A('r', 'Resumo'), A('why', 'Por que essa probabilidade'), A('est', 'Estado da avaliação'), L('ch', 'Como chega ao Itaú'), L('op', 'Oportunidades'), L('ri', 'Riscos'), L('mo', 'O que monitorar'), SR('src', 'Fontes')],
    base: () => themeScenarios.map(s => ({ ...s })) },
  { id: 'risco', label: 'Riscos e oportunidades (registro)', prefix: 'R', title: r => r.title,
    fields: [T('title', 'Evento / questão'), { k: 'type', label: 'Tipo', type: 'select', opts: ['Risco', 'Oportunidade', 'Misto'] }, A('channel', 'Canal de impacto'), A('state', 'Estado da avaliação'), SR('src', 'Fontes')],
    base: () => n('R', risks, r => ({ ...r })) },
  { id: 'movimento', label: 'Planalto: movimentações e etapa', prefix: 'PL', title: r => r.title,
    fields: [T('title', 'Movimentação'), { k: 'stage', label: 'Etapa atual', type: 'select', opts: ETAPAS }, A('next', 'Próxima decisão'), A('risk', 'Risco'), A('itau', 'Como chega ao Itaú'),
      L('actors', 'Atores', 'Um por linha, com o nome como está no Mapa de atores.'), SR('src', 'Fontes'),
      { k: 'showActors', label: 'Mostrar atores no card', type: 'select', opts: ['sim|Sim', 'não|Não'] }, { k: 'showSrc', label: 'Mostrar fontes no card', type: 'select', opts: ['sim|Sim', 'não|Não'] }],
    base: () => n('PL', movimentos, m => ({ ...m })) },
  { id: 'variavel', label: 'Variáveis que definem os cenários', prefix: 'V', title: r => r.title,
    fields: [T('title', 'Variável'), A('desc', 'Descrição')], base: () => n('V', variables, v => ({ title: v[0], desc: v[1] })) },
  { id: 'marco', label: 'Calendário de referência', prefix: 'M', title: r => r.date,
    fields: [T('date', 'Data ou período'), A('text', 'O que acontece')], base: () => n('M', timeline, t => ({ date: t[0], text: t[1] })) },
  { id: 'indicador', label: 'Indicadores por dimensão', prefix: 'I', title: r => r.title,
    fields: [T('title', 'Dimensão'), A('desc', 'Indicadores')], base: () => n('I', indicators, i => ({ title: i[0], desc: i[1] })) },
  { id: 'pendente', label: 'Pontos ainda a verificar', prefix: 'P', title: r => r.text.slice(0, 70),
    fields: [A('text', 'Ponto a verificar (o texto antes de “: ” vira o título)')], base: () => n('P', pending, text => ({ text })) },
  { id: 'etapa', label: 'Metodologia: etapas', prefix: 'E', title: r => r.title,
    fields: [T('title', 'Etapa'), A('desc', 'Descrição')], base: () => n('E', methodSteps, s => ({ title: s[0], desc: s[1] })) },
  { id: 'instrumento', label: 'Metodologia: instrumentos', prefix: 'N', title: r => r.title,
    fields: [T('title', 'Instrumento'), A('desc', 'Descrição')], base: () => n('N', methodTools, s => ({ title: s[0], desc: s[1] })) },
  { id: 'docinterno', label: 'Fontes: documentos internos', prefix: 'DI', title: r => r.title,
    fields: [T('title', 'Título'), A('desc', 'Descrição'), T('url', 'Arquivo ou URL', 'Arquivos privados: docs/nome.pdf (enviados ao armazenamento privado).')], base: () => n('DI', internalDocs, d => ({ title: d[0], desc: d[1], url: d[2] })) },
  { id: 'docpublico', label: 'Fontes: fontes públicas listadas', prefix: 'DP', title: r => SRC[r.ref]?.label ?? r.ref,
    fields: [{ k: 'ref', label: 'Fonte', type: 'src' }], base: () => n('DP', publicDocs, ref => ({ ref })) },
  { id: 'fonte', label: 'Fontes: cadastro de fontes (links)', prefix: 'S', title: r => r.label,
    fields: [T('label', 'Rótulo'), T('url', 'URL ou arquivo', 'Arquivos privados: docs/nome.pdf')], base: () => SRC_BASE.map(x => ({ ...x })) },
  { id: 'prioridade', label: 'Visão executiva: prioridades', prefix: 'Q', title: r => r.title,
    fields: [T('title', 'Título'), A('text', 'Texto'), T('badge', 'Marco (ex.: Jan 2027 · começa a CBS)'), T('tag', 'Etiqueta (ex.: Regulatório)'), { k: 'tone', label: 'Cor da etiqueta', type: 'select', opts: ['blue', 'gold', 'green', 'red'] }, L('refs', 'Base (um por linha: título | URL ou docs/arquivo)')],
    base: () => [
      { id: 'Q1', title: 'Transição da reforma tributária (CBS/IBS)', text: 'Alíquotas, regulamentação, Split Payment e cronograma de implementação podem exigir adaptação de sistemas e alterar custos para o banco e seus clientes.', badge: 'Jan 2027 · começa a CBS', tag: 'Regulatório', tone: 'blue', refs: ['Cenários (último pacote) | docs/Cenarios_att_24_nov.zip', 'Senado Federal | https://www12.senado.leg.br/'] },
      { id: 'Q2', title: 'Credibilidade fiscal e trajetória da dívida', text: 'Pacote de ajuste, meta fiscal de 2027, despesas e revisão de benefícios podem alterar prêmio de risco, juros longos e custo de funding.', badge: 'Fev–mar 2027 · tramitação fiscal', tag: 'Acompanhar', tone: 'gold', refs: ['Cenários (último pacote) | docs/Cenarios_att_24_nov.zip', 'Tesouro Nacional | https://www.tesourotransparente.gov.br/'] },
      { id: 'Q3', title: 'Governabilidade e capacidade de execução', text: 'Articulação entre Executivo, Câmara e Senado condiciona aprovação de medidas fiscais, regulamentação tributária e indicações institucionais.', badge: 'Fev–mar 2027 · teste no Congresso', tag: 'Institucional', tone: 'gold', refs: ['Cenários (último pacote) | docs/Cenarios_att_24_nov.zip', 'Câmara | https://www.camara.leg.br/', 'Senado | https://www12.senado.leg.br/'] },
      { id: 'Q4', title: 'Investimento produtivo, tecnologia e transição energética', text: 'Minerais críticos, terras raras, IA, biotecnologia, fármacos avançados, infraestrutura e PPPs podem gerar oportunidades de financiamento e serviços.', badge: 'Sem marco no calendário', tag: 'Oportunidade', tone: 'green', refs: ['Relatório final | docs/Relatorio_Sprint_Itau_Tom_Academico_Natural.pdf', 'MDIC | https://www.gov.br/mdic/pt-br'] },
    ] },
  { id: 'transmissao', label: 'Visão executiva: como a análise chega ao Itaú', prefix: 'Y', title: r => r.title,
    fields: [T('step', 'Etapa (ex.: 1 · Decisão política)'), T('title', 'Título'), T('note', 'Observação')],
    base: () => [
      { id: 'Y1', step: '1 · Decisão política', title: 'Regulamentação da reforma tributária (CBS/IBS)', note: 'alíquotas e calendário ainda por definir' },
      { id: 'Y2', step: '2 · Regra ou condição econômica', title: 'Split Payment e cronograma de implementação', note: 'o recolhimento passa a ocorrer no pagamento' },
      { id: 'Y3', step: '3 · Empresas e famílias', title: 'Fluxo de caixa, preço e créditos tributários dos clientes', note: 'efeito indireto sobre quem toma crédito' },
      { id: 'Y4', step: '4 · Exposição do banco', title: 'Custos e sistemas do banco', note: 'efeito direto: adaptar sistemas e processos' },
    ] },
  { id: 'passo', label: 'Guia: passos do tour', prefix: 'G', title: r => r.title,
    fields: [T('title', 'Título'), A('text', 'Texto'), { k: 'go', label: 'Leva para a tela', type: 'select', opts: VIEW_OPTS }, T('cta', 'Texto do botão (se levar a uma tela)')],
    base: () => n('G', [...TOUR_BASE], t => ({ title: t[0], text: t[1], go: t[2], cta: t[3] })) },
  { id: 'uly', label: 'Uly: falas e roteiro', prefix: 'U', title: r => `${r.view} · ${String(r.text).slice(0, 60)}`,
    fields: [{ k: 'view', label: 'Tela', type: 'select', opts: VIEWS_ULY }, { k: 'kind', label: 'Tipo', type: 'select', opts: ['dica', 'curiosidade', 'roteiro'] }, { k: 'pose', label: 'Pose', type: 'select', opts: POSES }, T('trigger', 'Gatilho e posição (informativo)', 'Ex.: Ao lado dos filtros · Pequena, curiosa'), A('text', 'Fala', 'Use {dias} para os dias até a posse.'), { k: 'order', label: 'Ordem', type: 'num' }],
    base: ulyBase },
  // páginas: textos fixos das telas (títulos, introduções, avisos). Base lida da própria página (ver texts.ts).
  { id: 'texto', label: 'Textos das telas (títulos, introduções, avisos)', prefix: 'TX', title: r => `${r.id} · ${String(r.text).slice(0, 70)}`,
    fields: [A('text', 'Texto')], base: () => textBase() },
]
export const kindOf = (id: string): KindDef => KINDS.find(k => k.id === id)!
