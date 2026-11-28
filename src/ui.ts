import {
  SRC, NIVEL, HORIZONTE, TERMO_GRUPO, GRUPO_TERMO, diasAtePosse,
} from './data'
import { getActors, getAnalyses, getElection, getTopics, getContent } from './store'
import { sayView, react } from './mascot'
import type { Actor, Analysis, CustomSource, Scenario, ThemeScenario, Risk, ViewId } from './types'
import type { Rec } from './content'
import { srcPanel } from './topicSources'

// ---------- helpers ----------
export const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T

export const esc = (s: unknown): string =>
  String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string))

// documentos internos (docs/...) ficam em armazenamento privado: o clique busca um link temporário (ver main.ts)
export const href = (url: string) => /^docs\//.test(url) ? `href="#" data-doc="${esc(url.slice(5))}"` : `href="${esc(url)}" target="_blank" rel="noopener"`
const link = (k: string) => SRC[k] ? `<a ${href(SRC[k].url)}>${esc(SRC[k].label)} ↗</a>` : ''
export const sourceLine = (keys: string[]) => keys.some(k => SRC[k]) ? `<div class="source-line">Fonte: ${keys.map(link).filter(Boolean).join(' · ')}</div>` : ''
export const extLinks = (ss: { label: string; url: string }[]) =>
  ss.map(s => `<a ${href(s.url)}>${esc(s.label)} ↗</a>`)

export function openModal(label: string, body: string): void {
  $('modalLabel').textContent = label
  $('modalBody').innerHTML = body
  $('modal').classList.add('open')
}
export const closeModal = (): void => $('modal').classList.remove('open')

const CRUMBS: Record<ViewId, string> = {
  home: 'Visão executiva', themes: 'Temas de análise', scenarios: 'Cenários',
  actors: 'Mapa de atores', risks: 'Riscos e oportunidades', monitor: 'Sinais e indicadores',
  planalto: 'Planalto', method: 'Metodologia', sources: 'Fontes e documentos', guide: 'Guia e tour', editor: 'Área editorial', users: 'Usuários e acesso',
}
export function go(view: ViewId): void {
  document.querySelectorAll<HTMLElement>('.view').forEach(v => v.classList.toggle('active', v.id === 'view-' + view))
  document.querySelectorAll<HTMLElement>('.pnav').forEach(b => b.classList.toggle('active', b.dataset.view === view))
  $('crumbName').textContent = CRUMBS[view] ?? view
  window.scrollTo({ top: 0, behavior: motion() })
  document.body.dataset.tela = view // a coluna lateral só aparece na home
  sayView(view)
}

// hipótese primeiro: "não confirmada" também contém "confirm" e aparecia como fato
const isHyp = (st: string) => /não confirm|hipótese|cotado|em verificação/i.test(st)
const statusTone = (st: string) => isHyp(st) ? 'gold' : /confirm|Cargo oficial|Nomeação/.test(st) ? 'green' : 'blue'
// respeita prefers-reduced-motion também na rolagem programática
const motion = (): ScrollBehavior => matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
const publishedAnalyses = () => getAnalyses().filter(d => d.status === 'Publicado')

// ---------- temas ----------
export const atencao = (s: ThemeScenario): boolean => s.p + s.g >= 5 // zona quente da matriz: probabilidade e gravidade altas
const tipoCor = (t = '') => /oportunidade/i.test(t) && !/risco|misto/i.test(t) ? 'green' : t === 'Risco' ? 'red' : /misto|\//.test(t) ? 'gold' : 'blue'

export function renderThemes(): void {
  const q = (document.getElementById('themeSearch') as HTMLInputElement | null)?.value.trim().toLowerCase() ?? ''
  const tp = getTopics().filter(t => !q || [t.title, t.short, t.desc, t.type, ...t.subs.map(x => x.t)].join(' ').toLowerCase().includes(q))
  const none = '<div class="panel empty">Nenhum tema encontrado para esta busca.</div>'
  $('themeGrid').innerHTML = tp.filter(t => t.kind === 'eixo').map(t => `<div class="panel axis-card"><div class="axis-num">${esc(t.n)}</div><h3>${esc(t.title)}</h3><p>${esc(t.desc)}</p><span class="subs-line"><b>Subtemas:</b> ${t.subs.map(x => esc(x.t)).join(' · ')}</span><button data-theme="${t.id}">Abrir dossiê temático →</button></div>`).join('') || (q ? none : '')
  $('crossThemes').innerHTML = tp.filter(t => t.kind === 'transversal').map(t => `<div class="panel axis-card"><span class="tag ${tipoCor(t.type)}">${esc(t.type || 'Transversal')}</span><h3>${esc(t.title)}</h3><p>${esc(t.desc)}</p><button class="card-action" data-theme="${t.id}">Abrir mini dossiê →</button></div>`).join('') || (q ? none : '')
  $('customDossierGrid').innerHTML = publishedAnalyses().map(d => `<div class="panel axis-card"><span class="tag green">Publicado · ${esc(d.theme)}</span><h3>${esc(d.title)}</h3><p>${esc(d.question)}</p><button data-custom-analysis="${d.id}">Abrir dossiê →</button></div>`).join('')
    || '<div class="panel empty">Nenhum dossiê novo publicado pela equipe até o momento.</div>'
}

// Filtros de cenários dentro do dossiê do tema: por subtema e por natureza do cenário.
const KINDS: [string, string, (s: ThemeScenario) => boolean][] = [
  ['', 'Todos', () => true],
  ['pos', 'Positivos', s => s.tp === 'Favorável'],
  ['neg', 'Negativos', s => s.tp === 'Desfavorável'],
  ['neu', 'Neutros', s => s.tp === 'Misto'],
  ['opp', 'Oportunidades', s => s.tp === 'Oportunidade'],
  ['risk', 'Riscos', s => s.tp === 'Risco'],
  ['att', 'Pontos de atenção', atencao],
]
let tf = { id: '', sub: '', kind: '' }

export function showTheme(id: string): void {
  const t = getTopics().find(x => x.id === id)
  if (!t) return
  tf = { id, sub: '', kind: '' }
  const srcs = t.sourceDetails ? (t.sourceDetails.length ? `<div class="source-line">Fontes: ${extLinks(t.sourceDetails).join(' · ')}</div>` : '') : sourceLine(t.sources.filter(k => SRC[k]))
  $('themeDetail').innerHTML = `<div class="detail topic"><div class="eyebrow">${t.kind === 'eixo' ? `Dossiê temático · eixo ${esc(t.n)}` : 'Mini dossiê · tema transversal'}</div><h2>${esc(t.title)}</h2>${t.type ? `<span class="tag ${tipoCor(t.type)}">${esc(t.type)}</span>` : ''}<p>${esc(t.desc)}</p>
<div class="t-overview"><div><h3>O que é este tema</h3><p>${esc(t.about)}</p></div><div><h3>Leitura para o Itaú</h3><p>${esc(t.itau)}</p></div></div>
<h3>Subtemas: como aproveitar e com o que ter cuidado</h3><div class="sub-list">${t.subs.map(x => `<div class="sub-card"><h4>${esc(x.t)}</h4><div class="sub-cols"><div class="how"><b>Como o Itaú pode aproveitar</b><p>${esc(x.how)}</p></div><div class="care"><b>Com o que ter cuidado</b><p>${esc(x.care)}</p></div></div><button type="button" class="card-action" data-tsub-go="${esc(x.t)}">Ver cenários deste subtema ↓</button></div>`).join('') || '<p class="muted">Nenhum subtema cadastrado ainda.</p>'}</div>
<h3 id="topicScnTitle">Cenários deste tema</h3><div id="topicFilters"></div><div id="topicScn"></div>
<h3>Perguntas de investigação</h3><ul>${t.questions.map(q => `<li>${esc(q)}</li>`).join('')}</ul>
<h3>Canais de transmissão</h3><p class="explain">Canais de transmissão são os caminhos pelos quais uma decisão política chega até o banco. Exemplo: o governo muda a meta fiscal, o prêmio de risco sobe, o custo de captação aumenta e o crédito fica mais caro.</p><ul>${t.channels.map(q => `<li>${esc(q)}</li>`).join('')}</ul>
<h3>Como aprofundar</h3><p class="muted">Siga os passos na ordem; cada um produz a evidência do seguinte.</p><ol class="steps">${t.deepen.map(x => `<li>${esc(x)}</li>`).join('')}</ol>${srcs}${srcPanel(t)}
<div class="btn-row"><button class="btn secondary" data-go="method">Consultar método de análise</button><button class="btn secondary" data-go="editor">Criar dossiê sobre este tema</button><button class="btn orange" data-edit-topic="${t.id}">Editar este tema</button></div></div>`
  renderTopicScenarios()
  $('themeDetail').scrollIntoView({ behavior: motion(), block: 'start' })
}

function renderTopicScenarios(): void {
  const t = getTopics().find(x => x.id === tf.id)
  if (!t) return
  const doTema = cts().filter(s => s.tm.includes(t.short))
  const kind = KINDS.find(k => k[0] === tf.kind)!
  const bySub = doTema.filter(s => !tf.sub || s.sub.includes(tf.sub))
  const list = bySub.filter(kind[2])
  const chip = (attr: string, v: string, label: string, n: number, on: boolean) => `<button type="button" class="chip${on ? ' on' : ''}" data-${attr}="${esc(v)}" aria-pressed="${on}">${esc(label)} <b>${n}</b></button>`
  $('topicFilters').innerHTML = `<div class="fgrid t-filters"><fieldset class="fgrp"><legend>Subtema</legend><div class="chips">${chip('tsub', '', 'Todos os subtemas', doTema.length, !tf.sub)}${t.subs.map(x => chip('tsub', x.t, x.t, doTema.filter(s => s.sub.includes(x.t)).length, tf.sub === x.t)).join('')}</div></fieldset><fieldset class="fgrp"><legend>Natureza do cenário</legend><div class="chips">${KINDS.map(([k, l, f]) => chip('tkind', k, l, bySub.filter(f).length, tf.kind === k)).join('')}</div></fieldset></div>`
  $('topicScn').innerHTML = list.map(s => `<div class="topic-scn${atencao(s) ? ' attn' : ''}"><div class="ts-top"><span class="tag ${tagDe(s.tp)}">${s.tp}</span>${atencao(s) ? '<span class="attn-tag">Ponto de atenção</span>' : ''}<span class="small muted">${HORIZONTE[s.h]}</span></div><button type="button" class="link-btn" data-open-ts="${s.id}"><b>${s.id}</b> · ${esc(s.t)}</button><p>${esc(s.r)}</p><div class="meters">${meter('Probabilidade', s.p)}${meter('Gravidade', s.g)}</div></div>`).join('')
    || `<p class="muted">${doTema.length ? 'Nenhum cenário com esses filtros.' : 'Ainda não há cenário temático ligado a este tema.'}</p>`
}
export function setTopicFilter(k: 'sub' | 'kind', v: string, scroll = false): void {
  tf = { ...tf, [k]: v }
  renderTopicScenarios()
  if (scroll) $('topicScnTitle').scrollIntoView({ behavior: motion(), block: 'start' })
}

// ---------- cenários ----------
const ICON: Record<string, string> = {
  A: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/></svg>',
  B: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
  C: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.2"/><path d="m13 12-3 5h4l-3 5"/></svg>',
}
const CHEV = '<svg class="scn-chev" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>'
const TONE: Record<string, string> = { A: 'teal', B: 'orange', C: 'red' }
const tone = (id: string) => TONE[id] ?? 'blue'
const li = (a: string[] = []) => `<ul>${a.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`

// estilo copiado do Itaú 360° publicado (itau360.netlify.app/cenarios): cartões com tom, ícone e detalhe que abre no próprio cartão
export function renderScenarios(): void {
  const scn = getContent<Scenario>('caminho')
  $('scenarioGrid').innerHTML = scn.map(s => `<article class="scn-card tone-${tone(s.id)}" id="scn-${esc(s.id)}"><button class="scn-button" type="button" data-scenario="${esc(s.id)}" aria-expanded="false" aria-controls="scn-d-${esc(s.id)}"><span class="scn-top"><span class="tone-icon">${ICON[s.id] ?? ICON.A}</span>${CHEV}</span><span class="scn-title">Cenário ${esc(s.id)} · ${esc(s.title)}</span><span class="scn-summary">${esc(s.definition)}</span></button><div class="scn-detail" id="scn-d-${esc(s.id)}" hidden><h3>Sinais de confirmação</h3>${li(s.signals)}<h3>Atores e incentivos</h3><p><b>Favoráveis:</b> ${esc(s.support)}</p><p><b>Resistências:</b> ${esc(s.resistance)}</p><h3>Implicações para o Itaú</h3>${li(s.itau)}<h3>Implicações para clientes</h3>${li(s.clients)}${sourceLine(s.sources ?? [])}</div></article>`).join('')
  const row = (l: string, f: (s: Scenario) => string) => `<tr><th scope="row">${l}</th>${scn.map(s => `<td>${f(s)}</td>`).join('')}</tr>`
  $('scenarioCompare').innerHTML = `<table class="scn-table"><thead><tr><th>Dimensão</th>${scn.map(s => `<th><span class="scn-pill tone-${tone(s.id)}">${esc(s.id)} · ${esc(s.kind)}</span></th>`).join('')}</tr></thead><tbody>${row('Contexto', s => esc(s.definition))}${row('Sinais', s => li((s.signals ?? []).slice(0, 2)))}${row('Efeito para o Itaú', s => li((s.itau ?? []).slice(0, 2)))}${row('Resistência', s => esc(s.resistance))}</tbody></table>`
  $('scenarioCombos').innerHTML = getContent<Rec>('combinacao').map(c => `<div class="combo"><div class="combo-key"><span class="scn-${esc(c.a)}">${esc(c.a)}</span><i>+</i><span class="scn-${esc(c.b)}">${esc(c.b)}</span></div><div><h3>${esc(c.title)}</h3><p>${esc(c.text)}</p><div class="source-line">${esc(c.source)}</div></div></div>`).join('')
}

/** Abre/fecha o detalhe do cartão (acordeão, um por vez). */
export function showScenario(id: string): void {
  document.querySelectorAll<HTMLElement>('.scn-button').forEach(b => {
    const on = b.dataset.scenario === id && b.getAttribute('aria-expanded') !== 'true'
    b.setAttribute('aria-expanded', String(on))
    $('scn-d-' + b.dataset.scenario).hidden = !on
  })
}

// ---------- mapa de conexões (copiado do Itaú 360° publicado) ----------
// x/y em % do quadro; fonte e posições iguais às do site publicado. Conexões ilustrativas.
const MAP_NODES = [
  { id: 'exec', n: 'Executivo', x: 50, y: 49, g: 'Executivo', t: 'Executivo federal', d: 'Formula prioridades do governo e articula sua apresentação ao Congresso.' },
  { id: 'cam', n: 'Câmara', x: 24, y: 23, g: 'Legislativo', t: 'Câmara dos Deputados', d: 'Discute, emenda e vota proposições de competência legislativa federal.' },
  { id: 'sen', n: 'Senado', x: 76, y: 23, g: 'Legislativo', t: 'Senado Federal', d: 'Participa da tramitação de proposições e integra a articulação bicameral.' },
  { id: 'min', n: 'Ministérios', x: 24, y: 77, g: 'Executivo', t: 'Ministérios', d: 'Desenvolvem políticas setoriais e prestam apoio técnico à formulação de propostas.' },
  { id: 'fin', n: 'Setor financeiro', x: 76, y: 77, g: 'Sociedade', t: 'Setor financeiro', d: 'Pode acompanhar mudanças, avaliar impactos e participar de consultas públicas.' },
]
export function renderActorMap(sel = 'exec'): void {
  const c = MAP_NODES[0]
  $('actorMap').innerHTML = `<svg class="actor-edges" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${MAP_NODES.slice(1).map(n => `<line x1="${c.x}" y1="${c.y}" x2="${n.x}" y2="${n.y}" vector-effect="non-scaling-stroke"/>`).join('')}</svg>${MAP_NODES.map(n => `<button type="button" class="actor-node" style="left:${n.x}%;top:${n.y}%" data-mapnode="${n.id}" aria-pressed="${n.id === sel}">${n.n}</button>`).join('')}`
  const n = MAP_NODES.find(x => x.id === sel)!
  $('actorMapSummary').innerHTML = `<span class="tag blue">${n.g}</span><h3>${n.t}</h3><p>${n.d}</p>`
}
export function actorTab(tab: string): void {
  document.querySelectorAll<HTMLElement>('.atab').forEach(b => { const on = b.dataset.atab === tab; b.classList.toggle('active', on); b.setAttribute('aria-selected', String(on)) })
  $('actorDir').classList.toggle('hide', tab !== 'dir')
  $('actorMapPane').classList.toggle('hide', tab !== 'map')
  if (tab === 'map') renderActorMap()
}

// ---------- guia / tour (passos editáveis na Área editorial) ----------
const tourSteps = () => getContent<Rec>('passo')
let tourStep = 0
export function renderTour(step = tourStep): void {
  const TOUR = tourSteps()
  tourStep = Math.max(0, Math.min(TOUR.length - 1, step))
  const s = TOUR[tourStep], last = tourStep === TOUR.length - 1
  if (!s) { $('tour').innerHTML = '<div class="panel empty">Nenhum passo cadastrado.</div>'; return }
  $('tour').innerHTML = `<div class="tour-card"><div class="tour-head"><h2>Tour guiado com a Uly</h2><span class="small muted">Etapa ${tourStep + 1} de ${TOUR.length}</span></div><progress class="tour-progress" max="${TOUR.length}" value="${tourStep + 1}" aria-label="Progresso do tour"></progress><div class="tour-step"><div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p>${s.go ? `<button class="card-action" data-go="${esc(s.go)}">${esc(s.cta)} →</button>` : ''}</div><img src="${import.meta.env.BASE_URL}uly/${tourStep % 2 ? 'feliz' : 'apresentando'}.png" alt="" width="68" height="68"></div><div class="tour-actions"><button class="btn secondary" data-tour="restart">Recomeçar</button><div><button class="btn secondary" data-tour="prev"${tourStep === 0 ? ' disabled' : ''}>Voltar</button><button class="btn orange" data-tour="${last ? 'restart' : 'next'}">${last ? 'Concluir' : 'Avançar'}</button></div></div></div>`
}

// ---------- atores ----------
const cts = (): ThemeScenario[] => getContent<ThemeScenario>('cenario')
const dots = (n = 0) => `<span class="dots" role="img" aria-label="${NIVEL[n] || 'sem avaliação'}">${[1, 2, 3].map(i => `<i class="${i <= n ? 'f' : ''}"></i>`).join('')}</span>`
const meter = (label: string, n?: number) => n ? `<span class="m"><span>${label}: ${NIVEL[n]}</span>${dots(n)}</span>` : ''
const avalCard = (a: Actor) => {
  const m = meter('Entra', a.entra) + meter('Sai', a.sai) + meter('Gravidade', a.grav)
  return m ? `<div class="am">${m}${a.hz ? `<span class="am-hz">${HORIZONTE[a.hz]}</span>` : ''}</div>` : ''
}
const photo = (a: Actor, cls: string) => a.photo ? `<img src="${esc(a.photo)}" alt="Retrato de ${esc(a.name)}" onerror="this.closest('.${cls}').classList.add('nophoto')">` : ''

export function renderActors(): void {
  const q = ($<HTMLInputElement>('actorSearch').value || '').toLowerCase()
  const f = $<HTMLSelectElement>('actorFilter').value || 'all'
  const hz = $<HTMLSelectElement>('actorHz').value || 'all'
  const list = getActors().filter(a => (f === 'all' || a.group === f) && (hz === 'all' || String(a.hz) === hz) && (!q || (a.name + ' ' + a.role + ' ' + a.bio + ' ' + (a.relevance ?? '')).toLowerCase().includes(q)))
  // só reage enquanto a pessoa digita (recarregar dados também chama renderActors)
  if (!list.length && q && document.activeElement?.id === 'actorSearch') react('triste', 'Não achei ninguém com esse nome.')
  $('actorResults').textContent = `${list.length} ${list.length === 1 ? "perfil" : "perfis"}`
  const hip = list.filter(a => isHyp(a.status)).length
  $('certStrip').innerHTML = list.length ? `<div class="cert"><span class="cert-sq" role="img" aria-label="${list.length - hip} perfis documentados e ${hip} ainda sem confirmação">${list.map(a => `<i class="${isHyp(a.status) ? 'hyp' : 'fact'}"></i>`).join('')}</span><span><b>${list.length - hip}</b> com cargo ou resultado documentado · <b>${hip}</b> nome cotado ou hipótese, com borda tracejada</span></div>` : ''
  $('actorGrid').innerHTML = list.map(a => {
    const hyp = isHyp(a.status)
    const tone = statusTone(a.status)
    return `<div class="panel actor-card clickable${hyp ? ' hyp' : ''}${a.photo ? '' : ' nophoto'}" data-actor="${a.id}">${photo(a, 'actor-card')}<div><span class="badge ${tone} status">${esc(a.status)}</span><h3>${esc(a.name)}</h3><p>${esc(a.role)}</p><span class="small muted">${esc(a.group)}</span>${avalCard(a)}</div></div>`
  }).join('') || '<div class="empty">Nenhum perfil encontrado.</div>'
}

/** Cenários temáticos em que o ator aparece (pelo termo do grupo: Executivo → Governo etc.). */
const cenariosDoAtor = (a: Actor) => { const t = GRUPO_TERMO[a.group]; return t ? { term: t, list: cts().filter(s => s.at.includes(t)) } : null }

export function showActor(id: string): void {
  const a = getActors().find(x => x.id === id)
  if (!a) return
  const srcHtml = a.sourceDetails
    ? `<div class="source-line">Fontes: ${extLinks(a.sourceDetails).join(' · ')}</div>`
    : sourceLine(a.sources ?? [])
  const credit = a.photoCredit && SRC[a.photoCredit] ? link(a.photoCredit) : esc(a.photoCredit || 'Crédito não informado')
  const hasAval = a.entra || a.sai || a.grav || a.hz || a.why
  const aval = `<h3>Entrada, saída e gravidade</h3>${hasAval ? `<div class="aval"><div class="facts">${[['Chance de entrar', a.entra], ['Chance de sair', a.sai], ['Gravidade se continuar', a.grav]].map(([l, n]) => `<div><span>${l}</span><b>${n ? NIVEL[n as number] : 'Não se aplica'}</b>${n ? dots(n as number) : ''}</div>`).join('')}<div><span>Horizonte</span><b>${a.hz ? HORIZONTE[a.hz] : 'Não definido'}</b></div></div>${a.why ? `<p><b>Por quê:</b> ${esc(a.why)}</p>` : ''}</div>` : '<p class="muted">Ainda sem avaliação para este ator.</p>'}<p class="small muted">Avaliação qualitativa preliminar, não é previsão. Entrar e sair se referem ao cargo ou à pasta em discussão; gravidade é o efeito para o Itaú se o ator continuar no papel atual. Editável na Área editorial.</p>`
  const cs = cenariosDoAtor(a)
  const scn = cs?.list.length ? `<h3>Cenários que incluem este ator</h3><ul>${cs.list.map(s => `<li><button type="button" class="link-btn" data-open-ts="${s.id}">${s.id} · ${s.t}</button></li>`).join('')}</ul><button class="card-action" data-actor-scn="${cs.term}">Filtrar os ${cs.list.length} cenários com “${cs.term}” →</button>` : ''
  $('actorDetail').innerHTML = `<div class="detail"><div class="actor-hero${a.photo ? '' : ' nophoto'}">${photo(a, 'actor-hero')}<div><div class="eyebrow">Perfil de ator · ${esc(a.group)}</div><h2>${esc(a.name)}</h2><p><b>${esc(a.role)}</b></p><span class="badge ${statusTone(a.status)} status">${esc(a.status)}</span><p>${esc(a.bio)}</p><p>${esc(a.relevance)}</p>${a.photo ? `<div class="source-line">Foto: ${credit}</div>` : ''}</div></div>${aval}${scn}<h3>Fontes e referências do perfil</h3>${srcHtml}<div class="btn-row"><button class="btn orange" data-edit-actor="${a.id}">Editar perfil e avaliação</button></div></div>`
  $('actorDetail').scrollIntoView({ behavior: motion(), block: 'start' })
}

/** Vem de um cenário: filtra o diretório pelo grupo do termo (ou busca o texto, se o termo não tem grupo). */
export function goActorTerm(term: string): void {
  const g = TERMO_GRUPO[term]
  $<HTMLSelectElement>('actorFilter').value = g ?? 'all'
  $<HTMLInputElement>('actorSearch').value = g ? '' : term
  $<HTMLSelectElement>('actorHz').value = 'all'
  actorTab('dir'); renderActors()
}

// ---------- riscos ----------
export function renderRisks(): void {
  const q = ($<HTMLInputElement>('riskSearch').value || '').toLowerCase()
  const f = $<HTMLSelectElement>('riskType').value || 'all'
  const base = getContent<Risk & Rec>('risco')
    .filter(r => (f === 'all' || r.type === f) && (!q || (r.title + ' ' + r.channel + ' ' + r.state).toLowerCase().includes(q)))
    .map(r => `<tr><td data-l="Evento"><b>${esc(r.title)}</b></td><td data-l="Tipo"><span class="tag ${r.type === 'Risco' ? 'red' : r.type === 'Oportunidade' ? 'green' : 'blue'}">${esc(r.type)}</span></td><td data-l="Canal de impacto">${esc(r.channel)}</td><td data-l="Estado da avaliação">${esc(r.state)}</td><td data-l="Fonte">${(r.src ?? []).map(link).filter(Boolean).join('<br>')}</td></tr>`)
  const custom = publishedAnalyses()
    .filter(d => (f === 'all' || d.type === f) && (!q || (d.title + ' ' + d.theme + ' ' + d.impact).toLowerCase().includes(q)))
    .map(d => `<tr><td><b>${esc(d.title)}</b><br><button class="card-action" data-custom-analysis="${d.id}">Abrir dossiê</button></td><td><span class="tag gold">${esc(d.type)}</span></td><td>${esc(d.transmission || 'Canal a detalhar')}</td><td>Publicado pela equipe · ${esc(d.updated)}</td><td>${extLinks(d.sources).join('<br>')}</td></tr>`)
  $('riskTable').innerHTML = [...base, ...custom].join('')
}

// ---------- monitoramento / método / fontes (conteúdo estático) ----------
// ---------- régua dos 100 dias, ancorada na posse (5/1/2027) ----------
// Datas dos itens de `timeline` (data.ts). Só a posse é fato; o resto é calendário preliminar.
const POSSE = Date.UTC(2027, 0, 5)
const dia = (y: number, m: number, d: number) => Math.round((Date.UTC(y, m, d) - POSSE) / 864e5)
const R0 = dia(2026, 10, 1) - 1, R1 = 106 // intervalo mostrado: 1/11/2026 .. ~D+106
const pos = (d: number) => `${(Math.max(R0, Math.min(R1, d)) - R0) / (R1 - R0) * 100}%`
const SPANS: [string, number, number][] = [
  ['nov–dez', dia(2026, 10, 1), dia(2026, 11, 31)],
  ['jan', dia(2027, 0, 1), dia(2027, 0, 31)],
  ['fev–mar', dia(2027, 1, 1), dia(2027, 2, 31)],
]
const MESES: [string, number][] = [['nov', dia(2026, 10, 1)], ['dez', dia(2026, 11, 1)], ['jan', dia(2027, 0, 1)], ['fev', dia(2027, 1, 1)], ['mar', dia(2027, 2, 1)], ['abr', dia(2027, 3, 1)]]

function dayRule(compact: boolean): string {
  const hoje = -diasAtePosse()
  const aviso = hoje < R0 ? '' : hoje > R1 ? '' : `<i class="dr-now" style="left:${pos(hoje)}"><b>hoje D${hoje < 0 ? '−' + -hoje : '+' + hoje}</b></i>`
  const desc = 'Régua do calendário: posse em 5 de janeiro de 2027 (dia 0), balanço dos 100 dias por volta de 15 de abril de 2027. Novembro e dezembro de 2026 antes da posse; fevereiro e março de 2027 com tramitação das medidas.'
  return `<figure class="dayrule${compact ? ' compact' : ''}" role="img" aria-label="${desc}">
    <div class="dr-track">
      <span class="dr-100" style="left:${pos(0)};width:calc(${pos(100)} - ${pos(0)})"></span>
      ${compact ? '' : SPANS.map(([l, a, b]) => `<span class="dr-span" style="left:${pos(a)};width:calc(${pos(b)} - ${pos(a)})"><em>${l}</em></span>`).join('')}
      ${MESES.map(([, d]) => `<u style="left:${pos(d)}"></u>`).join('')}
      <i class="dr-mark dr-posse" style="left:${pos(0)}"><b>D0 · posse<br>5 jan 2027</b></i>
      <i class="dr-mark dr-d100" style="left:${pos(100)}"><b>D100 · balanço<br>~15 abr</b></i>
      ${aviso}
    </div>
    <div class="dr-months" aria-hidden="true">${MESES.map(([l, d]) => `<span style="left:${pos(d)}">${l}</span>`).join('')}</div>
    ${compact ? '' : '<figcaption><span class="badge">Posse: fato documentado</span> <span class="badge gold">Demais marcos: calendário preliminar, a confirmar</span></figcaption>'}
  </figure>`
}

export function renderMonitor(): void {
  $('dayRule').innerHTML = dayRule(false)
  $('heroRule').innerHTML = dayRule(true)
  $('axisIndex').innerHTML = getTopics().filter(t => t.kind === 'eixo').map(t => `<li><button type="button" class="axrow" data-axis="${t.id}">${t.title}</button></li>`).join('')
  $('variablesList').innerHTML = getContent<Rec>('variavel').map(v => `<div class="item-row"><div><h3>${esc(v.title)}</h3><p>${esc(v.desc)}</p></div></div>`).join('')
  $('timeline').innerHTML = getContent<Rec>('marco').map(t => `<div class="timeline-item"><strong>${esc(t.date)}</strong><p>${esc(t.text)}</p></div>`).join('')
  $('indicatorGrid').innerHTML = getContent<Rec>('indicador').map(i => `<div class="panel axis-card"><h3>${esc(i.title)}</h3><p>${esc(i.desc)}</p></div>`).join('')
  $('pendingList').innerHTML = getContent<Rec>('pendente').map((it, i) => {
    const [t, ...rest] = String(it.text).split(': ') // o item diz o que falta; o resto é o que fazer
    return `<div class="item-row"><div><h3><span class="mono-n">${String(i + 1).padStart(2, '0')}</span>${esc(t)}</h3>${rest.length ? `<p>${esc(rest.join(': '))}</p>` : ''}</div><span class="badge gold">A verificar</span></div>`
  }).join('')
}

export function renderMethod(): void {
  $('methodSteps').innerHTML = getContent<Rec>('etapa').map((s, i) => `<div class="method-step"><div class="step-number">${i + 1}</div><div><h3>${esc(s.title)}</h3><p>${esc(s.desc)}</p></div></div>`).join('')
  $('methodTools').innerHTML = getContent<Rec>('instrumento').map(t => `<div class="panel axis-card"><h3>${esc(t.title)}</h3><p>${esc(t.desc)}</p></div>`).join('')
}

export function renderSources(): void {
  const acts = (kind: string, id: string) => `<span class="ed-only src-acts"><button class="pill-btn" data-src-edit="${kind}:${esc(id)}">Editar</button><button class="pill-btn" data-src-del="${kind}:${esc(id)}">Remover</button></span>`
  $('internalSources').innerHTML = getContent<Rec>('docinterno').map(d => `<div class="item-row"><div><h3>${esc(d.title)}</h3><p>${esc(d.desc)}</p></div><div class="rowside"><a class="link" ${href(d.url)}>Abrir documento ↗</a>${acts('i', d.id)}</div></div>`).join('')
  $('publicSources').innerHTML = getContent<Rec>('docpublico').filter(d => SRC[d.ref]).map(d => `<div class="item-row"><div><h3>${esc(SRC[d.ref].label)}</h3></div><div class="rowside"><a class="link" ${href(SRC[d.ref].url)}>Abrir fonte ↗</a>${acts('p', d.id)}</div></div>`).join('')
}

// ---------- dossiê criado no editor ----------
const customSourcesHtml = (d: Analysis, section: string) => {
  const ss: CustomSource[] = d.sources.filter(s => !s.section || s.section === 'geral' || s.section === section)
  return ss.length ? `<div class="source-line">Fonte: ${extLinks(ss).join(' · ')}</div>` : ''
}

export function showCustomAnalysis(id: string): void {
  const d = getAnalyses().find(x => x.id === id)
  if (!d) return
  openModal('Dossiê analítico', `<div class="eyebrow">${esc(d.theme)} · ${esc(d.status)}</div><h2>${esc(d.title)}</h2><p><b>Pergunta analítica</b><br>${esc(d.question)}</p>${customSourcesHtml(d, 'contexto')}<h3>Contexto e evidências</h3><p>${esc(d.evidence)}</p>${customSourcesHtml(d, 'evidências')}<h3>Viabilidade institucional e atores</h3><p>${esc(d.actors)}</p>${customSourcesHtml(d, 'atores')}<h3>Transmissão dos impactos</h3><p>${esc(d.transmission)}</p>${customSourcesHtml(d, 'impactos')}<h3>Impactos diretos e indiretos para o Itaú</h3><p>${esc(d.impact)}</p>${customSourcesHtml(d, 'impacto')}<h3>Cenários, riscos e oportunidades</h3><p>${esc(d.scenarios)}</p>${customSourcesHtml(d, 'cenários')}<h3>Sinais e indicadores</h3><p>${esc(d.signals)}</p>${customSourcesHtml(d, 'sinais')}<h3>Avaliação e justificativa</h3><p>${esc(d.assessment)}</p>${customSourcesHtml(d, 'avaliação')}<p class="small muted">Responsável: ${esc(d.author || 'Não informado')} · Revisão: ${esc(d.review || 'Não definida')} · Atualizado: ${esc(d.updated)}</p>`)
}

// coluna lateral das telas largas: o que olhar agora (dados já existentes em data.ts)
export function renderRail(): void {
  const d = diasAtePosse()
  const prox = getContent<Rec>('marco').slice(0, 3).map(t => `<li><span class="r-d">${esc(t.date)}</span>${esc(String(t.text).split(/[;—]/)[0].replace(/\.$/, ''))}</li>`).join('')
  $('rail').innerHTML = `<h2>Sinais a monitorar</h2><div class="rail-body">
    ${d > 0 ? `<div class="r-big"><b>${d}</b><span>${d === 1 ? 'dia' : 'dias'} para a posse<br>5 de janeiro de 2027</span></div>` : ''}
    <h3>Próximos marcos</h3><ul>${prox}</ul>
    <p class="r-note">Calendário preliminar, exceto a posse.</p>
    <h3>A verificar</h3><p><b>${getContent('pendente').length}</b> pontos sem confirmação.</p>
    <button class="card-action" data-go="monitor">Ver sinais e indicadores →</button></div>`
}

// ---------- cenários temáticos: filtros por tipo, tema, subtema, ator, nível e horizonte ----------
const uniq = (a: string[]): [string, string][] => [...new Set(a)].map(x => [x, x])
const NIVEIS: [string, string][] = [['1', 'Baixa'], ['2', 'Média'], ['3', 'Alta']]
const TIPOS: ThemeScenario['tp'][] = ['Favorável', 'Desfavorável', 'Misto', 'Oportunidade', 'Risco']
let sel: Record<string, string[]> = {}
const FILTROS: { k: string; label: string; hint: string; opts: () => [string, string][] }[] = [
  { k: 'tp', label: 'Tipo', hint: 'positivo, negativo, misto, oportunidade ou risco', opts: () => TIPOS.map(x => [x, x]) },
  { k: 'tm', label: 'Tema', hint: 'os 5 eixos e os temas transversais', opts: () => getTopics().map(t => [t.short, t.short]) },
  { k: 'sub', label: 'Subtema', hint: 'mostra os subtemas dos temas escolhidos', opts: () => uniq(getTopics().filter(t => !sel.tm?.length || sel.tm.includes(t.short)).flatMap(t => t.subs.map(x => x.t))) },
  { k: 'pb', label: 'Público afetado', hint: 'quem sente o efeito', opts: () => uniq(cts().flatMap(s => s.pb)) },
  { k: 'at', label: 'Ator', hint: 'quem decide ou influencia', opts: () => uniq(cts().flatMap(s => s.at)) },
  { k: 'p', label: 'Probabilidade', hint: 'chance de acontecer', opts: () => NIVEIS },
  { k: 'g', label: 'Gravidade', hint: 'efeito para o Itaú', opts: () => NIVEIS },
  { k: 'c', label: 'Complexidade', hint: 'dificuldade de prever e responder', opts: () => NIVEIS },
  { k: 'h', label: 'Horizonte', hint: 'quando tende a aparecer', opts: () => [['1', 'Curto prazo'], ['2', 'Médio prazo'], ['3', 'Longo prazo']] },
  { k: 'att', label: 'Ponto de atenção', hint: 'probabilidade e gravidade somam 5 ou mais (zona quente da matriz)', opts: () => [['sim', 'Só pontos de atenção']] },
]
const valores = (s: ThemeScenario, k: string): string[] => {
  if (k === 'att') return atencao(s) ? ['sim'] : []
  const x = s[k as keyof ThemeScenario]
  return (Array.isArray(x) ? x : [x]).map(String)
}
const combina = (s: ThemeScenario, q: string): boolean =>
  Object.entries(sel).every(([k, a]) => !a.length || a.some(v => valores(s, k).includes(v))) &&
  (!q || JSON.stringify(s).toLowerCase().includes(q))
const toneDe = (t: string) => (t === 'Favorável' || t === 'Oportunidade' ? 'teal' : t === 'Desfavorável' || t === 'Risco' ? 'red' : 'orange')
const tagDe = (t: string) => (t === 'Favorável' || t === 'Oportunidade' ? 'green' : t === 'Desfavorável' || t === 'Risco' ? 'red' : 'gold')

const chipFiltro = (k: string, v: string, label: string, n: number) => {
  const on = sel[k]?.includes(v)
  return `<button type="button" class="chip${on ? ' on' : ''}" data-fk="${k}" data-fv="${esc(v)}" aria-pressed="${!!on}">${esc(label)} <b>${n}</b></button>`
}
function renderFiltros(): void {
  $('scnFilters').innerHTML = FILTROS.map(g => {
    const feitos = sel[g.k as string]?.length ?? 0
    return `<fieldset class="fgrp"><legend>${g.label}${feitos ? ` <b class="fcount">${feitos}</b>` : ''}</legend><p class="fhint">${g.hint}</p><div class="chips">${g.opts().map(([v, l]) => chipFiltro(g.k as string, v, l, cts().filter(s => valores(s, g.k).includes(v)).length)).join('')}</div></fieldset>`
  }).join('')
}

export function renderThemeScenarios(): void {
  const q = $<HTMLInputElement>('scnSearch').value.trim().toLowerCase()
  const ord = $<HTMLSelectElement>('scnOrder').value
  const list = cts().filter(s => combina(s, q))
  if (ord !== 'id') list.sort((a, b) => ord === 'h' ? a.h - b.h : (b[ord as 'p' | 'g' | 'c'] - a[ord as 'p' | 'g' | 'c']))
  renderFiltros()
  const ativos = Object.values(sel).reduce((n, a) => n + a.length, 0)
  $('scnCount').textContent = `${list.length} de ${cts().length} cenários` + (ativos ? ` · ${ativos} filtro${ativos > 1 ? 's' : ''} ativo${ativos > 1 ? 's' : ''}` : '')
  $('scnGrid').innerHTML = list.map(s => {
    const meters = `<span class="meters">${[['Probabilidade', s.p], ['Gravidade', s.g], ['Complexidade', s.c]].map(([l, n]) => `<span class="m"><span>${l}: ${NIVEL[n as number]}</span>${dots(n as number)}</span>`).join('')}</span>`
    const tags = `<div class="scn-tags">${s.tm.map(x => `<button type="button" class="chip" data-only-k="tm" data-only-v="${esc(x)}">${esc(x)}</button>`).join('')}${s.sub.map(x => `<button type="button" class="chip sub" data-only-k="sub" data-only-v="${esc(x)}">${esc(x)}</button>`).join('')}</div>`
    const bloco = (t: string, a: string[], cls = '') => a.length ? `<h3>${t}</h3><ul class="${cls}">${a.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''
    const eixos = s.tm.map(x => getTopics().find(t => t.short === x)).filter((t): t is NonNullable<typeof t> => !!t)
    const detail = `<h3>Por que essa probabilidade</h3><p>${esc(s.why)}</p><p class="small muted">Estado da avaliação: ${esc(s.est)}</p><p><b>${HORIZONTE[s.h]}</b> · públicos: ${esc(s.pb.join(', '))}</p>${bloco('Como chega ao Itaú', s.ch)}${bloco('Oportunidades', s.op, 'op')}${bloco('Riscos', s.ri, 'ri')}${bloco('O que monitorar', s.mo)}<h3>Ver também</h3><div class="chips"><span class="small muted">Atores:</span>${s.at.map(x => `<button type="button" class="chip" data-actor-term="${esc(x)}">${esc(x)} →</button>`).join('')}</div>${eixos.length ? `<div class="chips"><span class="small muted">Dossiê do tema:</span>${eixos.map(e => `<button type="button" class="chip" data-axis="${e.id}">${esc(e.title)} →</button>`).join('')}</div>` : ''}${sourceLine(s.src)}`
    return `<article class="scn-card tone-${toneDe(s.tp)}${atencao(s) ? ' attn' : ''}" id="tsc-${s.id}"><button class="scn-button" type="button" data-tscn="${s.id}" aria-expanded="false" aria-controls="tsc-d-${s.id}"><span class="scn-top"><span class="scn-tags-top"><span class="tag ${tagDe(s.tp)}">${s.tp}</span>${atencao(s) ? '<span class="attn-tag">Ponto de atenção</span>' : ''}</span>${CHEV}</span><span class="scn-title">${s.id} · ${esc(s.t)}</span><span class="scn-summary">${esc(s.r)}</span>${meters}</button>${tags}<div class="scn-detail" id="tsc-d-${s.id}" hidden>${detail}</div></article>`
  }).join('') || '<div class="panel empty">Nenhum cenário com esses filtros. Tire algum filtro ou use “Limpar filtros”.</div>'
}

export function toggleFilter(k: string, v: string): void {
  const a = sel[k] ?? (sel[k] = [])
  const i = a.indexOf(v)
  if (i >= 0) a.splice(i, 1); else a.push(v)
  if (k === 'tm') sel.sub = (sel.sub ?? []).filter(x => !sel.tm.length || getTopics().some(t => sel.tm.includes(t.short) && t.subs.some(y => y.t === x))) // subtema some com o tema
  renderThemeScenarios()
}
export function clearFilters(): void { sel = {}; $<HTMLInputElement>('scnSearch').value = ''; renderThemeScenarios() }
/** Redireciona para outro termo: zera tudo e filtra só por ele; sobe até a lista. */
export function onlyFilter(k: string, v: string): void {
  sel = { [k]: [v] }; $<HTMLInputElement>('scnSearch').value = ''; renderThemeScenarios()
  $('scnList').scrollIntoView({ behavior: motion(), block: 'start' })
}
export function toggleTS(id: string, force?: boolean): void {
  const b = document.querySelector<HTMLElement>(`[data-tscn="${id}"]`)
  if (!b) return
  const on = force ?? b.getAttribute('aria-expanded') !== 'true'
  b.setAttribute('aria-expanded', String(on))
  $('tsc-d-' + id).hidden = !on
}
/** Abre um cenário temático pelo código (vem da matriz ou do perfil de ator). */
export function openTS(id: string): void {
  clearFilters(); toggleTS(id, true)
  $('tsc-' + id)?.scrollIntoView({ behavior: motion(), block: 'center' })
}
export function searchScenarios(q: string): number {
  clearFilters(); $<HTMLInputElement>('scnSearch').value = q; renderThemeScenarios()
  return $('scnGrid').querySelectorAll('.scn-card').length
}

// ---------- matriz probabilidade × gravidade (aba Riscos e oportunidades) ----------
export function renderMatrix(): void {
  const f = $<HTMLSelectElement>('riskType').value || 'all'
  const doTipo = (t: ThemeScenario['tp']) => f === 'all' || (f === 'Risco' ? t === 'Risco' || t === 'Desfavorável' : f === 'Oportunidade' ? t === 'Oportunidade' || t === 'Favorável' : t === 'Misto')
  const itens = cts().filter(s => doTipo(s.tp))
  const cel = (p: number, g: number) => {
    const heat = p + g >= 5 ? 'hot' : p + g >= 4 ? 'warm' : 'cool'
    return `<td class="mx-${heat}">${itens.filter(s => s.p === p && s.g === g).map(s => `<button type="button" class="mx-chip ${tagDe(s.tp)}" data-open-ts="${s.id}" title="${esc(s.t)}">${s.id}</button>`).join('')}</td>`
  }
  $('riskMatrix').innerHTML = `<table class="matrix mx"><caption>Probabilidade (linhas) × gravidade (colunas). Toque no código para abrir o cenário.</caption><thead><tr><th scope="col">Probabilidade ↓ · Gravidade →</th>${[1, 2, 3].map(g => `<th scope="col">${NIVEL[g]}</th>`).join('')}</tr></thead><tbody>${[3, 2, 1].map(p => `<tr><th scope="row">${NIVEL[p]}</th>${[1, 2, 3].map(g => cel(p, g)).join('')}</tr>`).join('')}</tbody></table>
  <ul class="mx-legend">${itens.map(s => `<li><b class="${tagDe(s.tp)}">${s.id}</b> ${esc(s.t)} <span class="small muted">· ${s.tp}</span></li>`).join('')}</ul>`
}

// ---------- visão geral: resultado vindo do banco + atalhos ----------
export function renderHome(): void {
  const tone = (t: string) => (['blue', 'gold', 'green', 'red'].includes(t) ? t : 'blue')
  $('priorityList').innerHTML = getContent<Rec>('prioridade').map((p, i) => `<div class="item-row${i ? '' : ' first'}"><div><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p><div class="source-line">Base: ${(p.refs ?? []).map((r: string) => { const [l, ...u] = r.split('|'); return `<a ${href(u.join('|').trim())}>${esc(l.trim())}</a>` }).join(' · ')}</div></div><div class="rowside"><span class="badge gold">${esc(p.badge)}</span><span class="tag ${tone(p.tone)}">${esc(p.tag)}</span></div></div>`).join('')
  $('transmitList').innerHTML = getContent<Rec>('transmissao').map(t => `<li><span class="t-n">${esc(t.step)}</span><b>${esc(t.title)}</b><em>${esc(t.note)}</em></li>`).join('')
}

export function renderOverview(): void {
  const { votes, fromDb } = getElection()
  const [lead, ...rest] = votes
  const n = (x: number) => x.toLocaleString('pt-BR')
  const pct = (x: number) => x.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const total = votes.reduce((t, v) => t + v.votes, 0)
  const kpi = (num: number, l: string, go: string) => `<button type="button" class="kpi" data-go="${go}"><b>${num}</b>${l}</button>`
  $('overview').innerHTML = `<div class="ov-ring" style="--p:${lead.pct}" role="img" aria-label="${esc(lead.candidate)}: ${pct(lead.pct)}% dos votos válidos"><span>${pct(lead.pct)}%</span></div>
  <div class="ov-text"><h2>Reeleição não elimina a negociação</h2><p>${esc(lead.candidate)} venceu o 2º turno com ${pct(lead.pct)}% dos votos válidos (${n(lead.votes)} de ${n(total)})${rest.map(r => `, contra ${esc(r.candidate)} (${pct(r.pct)}%)`).join('')}. Formação do governo e articulação com o Congresso são os próximos testes para a agenda econômica e regulatória.</p><p class="small muted">${fromDb ? 'Percentual calculado no banco (Supabase) a partir dos votos do TSE.' : 'Valor de referência: o banco não respondeu, então o cálculo foi refeito aqui.'}</p></div>
  <div class="ov-kpis">${kpi(getContent('caminho').length + cts().length, 'cenários', 'scenarios')}${kpi(getActors().length, 'atores', 'actors')}${kpi(getContent('risco').length, 'riscos e oportunidades', 'risks')}${kpi(getContent('docinterno').length + getContent('docpublico').length, 'fontes', 'sources')}</div>`
}

export const tourMove = (k: string): void => renderTour(k === 'next' ? tourStep + 1 : k === 'prev' ? tourStep - 1 : 0)

const extras: (() => void)[] = []
/** Telas montadas por outros módulos (ex.: Planalto) entram no renderAll por aqui. */
export const addRender = (fn: () => void): void => { extras.push(fn) }

export function renderAll(): void {
  renderRail(); renderHome(); renderOverview(); renderThemes(); renderScenarios(); renderThemeScenarios(); renderActors(); renderRisks(); renderMatrix(); renderMonitor(); renderMethod(); renderSources(); renderTour()
  extras.forEach(fn => fn())
}
