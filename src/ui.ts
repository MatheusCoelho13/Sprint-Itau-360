import {
  SRC, themes, cross, scenarios, risks, variables, timeline, indicators, pending,
  methodSteps, methodTools, internalDocs, publicDocs,
} from './data'
import { getActors, getAnalyses } from './store'
import { sayView, react } from './mascot'
import type { Analysis, CustomSource, ViewId } from './types'

// ---------- helpers ----------
export const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T

export const esc = (s: unknown): string =>
  String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string))

const link = (k: string) => `<a href="${SRC[k].url}" target="_blank" rel="noopener">${SRC[k].label} ↗</a>`
const sourceLine = (keys: string[]) => `<div class="source-line">Fonte: ${keys.map(link).join(' · ')}</div>`
const extLinks = (ss: { label: string; url: string }[]) =>
  ss.map(s => `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)} ↗</a>`)

export function openModal(label: string, body: string): void {
  $('modalLabel').textContent = label
  $('modalBody').innerHTML = body
  $('modal').classList.add('open')
}
export const closeModal = (): void => $('modal').classList.remove('open')

const CRUMBS: Record<ViewId, string> = {
  home: 'Visão executiva', themes: 'Temas de análise', scenarios: 'Cenários 100 dias',
  actors: 'Mapa de atores', risks: 'Riscos e oportunidades', monitor: 'Sinais e indicadores',
  method: 'Metodologia', sources: 'Fontes e documentos', editor: 'Área editorial',
}
export function go(view: ViewId): void {
  document.querySelectorAll<HTMLElement>('.view').forEach(v => v.classList.toggle('active', v.id === 'view-' + view))
  document.querySelectorAll<HTMLElement>('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.view === view))
  $('crumbName').textContent = CRUMBS[view] ?? view
  window.scrollTo({ top: 0, behavior: 'smooth' })
  sayView(view)
}

const publishedAnalyses = () => getAnalyses().filter(d => d.status === 'Publicado')

// ---------- temas ----------
export function renderThemes(): void {
  $('themeGrid').innerHTML = themes.map(t => `<div class="panel axis-card"><div class="axis-num">EIXO ${t.n}</div><h3>${t.title}</h3><p>${t.desc}</p><button data-theme="${t.id}">Abrir dossiê temático →</button></div>`).join('')
  $('crossThemes').innerHTML = cross.map(t => `<div class="panel axis-card"><span class="badge ${t.type.includes('Oportunidade') ? 'green' : t.type === 'Risco' ? 'red' : 'gold'}">${t.type}</span><h3>${t.title}</h3><p>${t.desc}</p>${sourceLine(t.src)}</div>`).join('')
  $('customDossierGrid').innerHTML = publishedAnalyses().map(d => `<div class="panel axis-card"><span class="badge green">Publicado · ${esc(d.theme)}</span><h3>${esc(d.title)}</h3><p>${esc(d.question)}</p><button data-custom-analysis="${d.id}">Abrir dossiê →</button></div>`).join('')
    || '<div class="panel empty">Nenhum dossiê novo publicado pela equipe até o momento.</div>'
}

export function showTheme(id: string): void {
  const t = themes.find(x => x.id === id)
  if (!t) return
  $('themeDetail').innerHTML = `<div class="detail"><div class="eyebrow">Dossiê temático · eixo ${t.n}</div><h2>${t.title}</h2><p>${t.desc}</p><div class="detail-grid"><div class="detail-block"><h4>Perguntas de investigação</h4><ul>${t.questions.map(q => `<li>${q}</li>`).join('')}</ul></div><div class="detail-block"><h4>Canais de transmissão</h4><ul>${t.channels.map(q => `<li>${q}</li>`).join('')}</ul></div></div><h3>Leitura para o Itaú</h3><p>${t.itau}</p><h3>Como aprofundar</h3><p>O dossiê deve ser atualizado com a evidência documental mais recente, a competência institucional aplicável, os atores que podem influenciar a medida, as hipóteses de implementação e os indicadores que confirmem ou enfraqueçam cada caminho.</p>${sourceLine(t.sources)}<div class="btn-row"><button class="btn secondary" data-go="method">Consultar método de análise</button><button class="btn" data-go="editor">Criar / atualizar dossiê</button></div></div>`
  $('themeDetail').scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// ---------- cenários ----------
export function renderScenarios(): void {
  $('scenarioGrid').innerHTML = scenarios.map(s => `<div class="panel scenario-card"><div class="scn-letter scn-${s.id}" aria-hidden="true">${s.id}</div><span class="badge ${s.id === 'A' ? 'green' : s.id === 'B' ? 'red' : 'gold'}">Cenário ${s.id} · ${s.kind}</span><h3>${s.title}</h3><p>${s.definition}</p><div class="scenario-foot"><span class="small muted">Plausibilidade qualitativa</span><button class="card-action" data-scenario="${s.id}">Ver análise →</button></div></div>`).join('')
}

export function showScenario(id: string): void {
  const s = scenarios.find(x => x.id === id)
  if (!s) return
  $('scenarioDetail').innerHTML = `<div class="detail"><div class="eyebrow">Cenário ${s.id} · dossiê prospectivo</div><h2>${s.title}</h2><p>${s.definition}</p><div class="detail-grid"><div class="detail-block"><h4>Sinais de confirmação</h4><ul>${s.signals.map(x => `<li>${x}</li>`).join('')}</ul></div><div class="detail-block"><h4>Atores e incentivos</h4><p><b>Favoráveis:</b> ${s.support}</p><p><b>Resistências:</b> ${s.resistance}</p></div><div class="detail-block"><h4>Implicações para o Itaú</h4><ul>${s.itau.map(x => `<li>${x}</li>`).join('')}</ul></div><div class="detail-block"><h4>Implicações para clientes</h4><ul>${s.clients.map(x => `<li>${x}</li>`).join('')}</ul></div></div><h3>Como acompanhar</h3><p>Atualizar a leitura quando houver mudança no pacote fiscal, no calendário legislativo, nas nomeações, na regulamentação tributária, nas expectativas de inflação, no prêmio de risco e nos indicadores de crédito. Registrar a evidência e a justificativa de qualquer revisão.</p>${sourceLine(s.sources)}</div>`
  $('scenarioDetail').scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// ---------- atores ----------
export function renderActors(): void {
  const q = ($<HTMLInputElement>('actorSearch').value || '').toLowerCase()
  const f = $<HTMLSelectElement>('actorFilter').value || 'all'
  const list = getActors().filter(a => (f === 'all' || a.group === f) && (!q || (a.name + ' ' + a.role + ' ' + a.bio + ' ' + (a.relevance ?? '')).toLowerCase().includes(q)))
  // só reage enquanto a pessoa digita (recarregar dados também chama renderActors)
  if (!list.length && q && document.activeElement?.id === 'actorSearch') react('triste', 'Não achei ninguém com esse nome.')
  $('actorResults').textContent = `${list.length} perfis`
  $('actorCount').textContent = String(list.length).padStart(2, '0')
  $('actorGrid').innerHTML = list.map(a => {
    const tone = a.status.includes('confirm') || a.status.includes('Cargo oficial') || a.status.includes('Nomeação') ? 'green'
      : a.status.includes('não confirmado') || a.status.includes('rejeitada') ? 'gold' : 'blue'
    return `<div class="panel actor-card clickable" data-actor="${a.id}"><img src="${esc(a.photo)}" alt="Retrato de ${esc(a.name)}" onerror="this.style.display='none'"><div><span class="badge ${tone} status">${esc(a.status)}</span><h3>${esc(a.name)}</h3><p>${esc(a.role)}</p><span class="small muted">${esc(a.group)}</span></div></div>`
  }).join('') || '<div class="empty">Nenhum perfil encontrado.</div>'
}

export function showActor(id: string): void {
  const a = getActors().find(x => x.id === id)
  if (!a) return
  const srcHtml = a.sourceDetails
    ? `<div class="source-line">Fontes: ${extLinks(a.sourceDetails).join(' · ')}</div>`
    : sourceLine(a.sources ?? [])
  const credit = a.photoCredit && SRC[a.photoCredit] ? link(a.photoCredit) : esc(a.photoCredit || 'Crédito não informado')
  $('actorDetail').innerHTML = `<div class="detail"><div class="actor-hero"><img src="${esc(a.photo)}" alt="Retrato de ${esc(a.name)}" onerror="this.style.display='none'"><div><div class="eyebrow">Perfil de ator · ${esc(a.group)}</div><h2>${esc(a.name)}</h2><p><b>${esc(a.role)}</b></p><span class="badge blue">${esc(a.status)}</span><p>${esc(a.bio)}</p><p>${esc(a.relevance)}</p><div class="source-line">Foto: ${credit}</div></div></div><h3>Fontes e referências do perfil</h3>${srcHtml}<div class="btn-row"><button class="btn secondary" data-go="editor">Abrir área editorial</button></div></div>`
  $('actorDetail').scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// ---------- riscos ----------
export function renderRisks(): void {
  const q = ($<HTMLInputElement>('riskSearch').value || '').toLowerCase()
  const f = $<HTMLSelectElement>('riskType').value || 'all'
  const base = risks
    .filter(r => (f === 'all' || r.type === f) && (!q || (r.title + ' ' + r.channel + ' ' + r.state).toLowerCase().includes(q)))
    .map(r => `<tr><td><b>${r.title}</b></td><td><span class="badge ${r.type === 'Risco' ? 'red' : r.type === 'Oportunidade' ? 'green' : 'gold'}">${r.type}</span></td><td>${r.channel}</td><td>${r.state}</td><td>${r.src.map(link).join('<br>')}</td></tr>`)
  const custom = publishedAnalyses()
    .filter(d => (f === 'all' || d.type === f) && (!q || (d.title + ' ' + d.theme + ' ' + d.impact).toLowerCase().includes(q)))
    .map(d => `<tr><td><b>${esc(d.title)}</b><br><button class="card-action" data-custom-analysis="${d.id}">Abrir dossiê</button></td><td><span class="badge gold">${esc(d.type)}</span></td><td>${esc(d.transmission || 'Canal a detalhar')}</td><td>Publicado pela equipe · ${esc(d.updated)}</td><td>${extLinks(d.sources).join('<br>')}</td></tr>`)
  $('riskTable').innerHTML = [...base, ...custom].join('')
}

// ---------- monitoramento / método / fontes (conteúdo estático) ----------
export function renderMonitor(): void {
  $('variablesList').innerHTML = variables.map(v => `<div class="item-row"><div><h3>${v[0]}</h3><p>${v[1]}</p></div></div>`).join('')
  $('timeline').innerHTML = timeline.map(t => `<div class="timeline-item"><strong>${t[0]}</strong><p>${t[1]}</p></div>`).join('')
  $('indicatorGrid').innerHTML = indicators.map(i => `<div class="panel axis-card"><h3>${i[0]}</h3><p>${i[1]}</p></div>`).join('')
  $('pendingList').innerHTML = pending.map((p, i) => `<div class="item-row"><div><h3>${String(i + 1).padStart(2, '0')} · Verificação pendente</h3><p>${p}</p></div><span class="badge gold">A verificar</span></div>`).join('')
}

export function renderMethod(): void {
  $('methodSteps').innerHTML = methodSteps.map((s, i) => `<div class="method-step"><div class="step-number">${i + 1}</div><div><h3>${s[0]}</h3><p>${s[1]}</p></div></div>`).join('')
  $('methodTools').innerHTML = methodTools.map(t => `<div class="panel axis-card"><h3>${t[0]}</h3><p>${t[1]}</p></div>`).join('')
}

export function renderSources(): void {
  $('internalSources').innerHTML = internalDocs.map(d => `<div class="item-row"><div><h3>${d[0]}</h3><p>${d[1]}</p></div><a class="link" href="${d[2]}" target="_blank">Abrir documento ↗</a></div>`).join('')
  $('publicSources').innerHTML = publicDocs.map(k => `<div class="item-row"><div><h3>${SRC[k].label}</h3><p class="small muted">Fonte pública vinculada a perfis, decisões ou pontos de verificação.</p></div><a class="link" href="${SRC[k].url}" target="_blank" rel="noopener">Abrir fonte ↗</a></div>`).join('')
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

export function renderAll(): void {
  renderThemes(); renderScenarios(); renderActors(); renderRisks(); renderMonitor(); renderMethod(); renderSources()
}
