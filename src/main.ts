import './views' // monta o HTML da página: precisa ser o primeiro import depois do CSS
import './style.css'
import { mountPlanalto } from './planalto'
import { supabase, configured } from './supabase'
import { loadAll, loadElection, loadTopics, loadContent, clearCache, getTopics, getContent } from './store'
import { initTexts } from './texts'
import {
  $, esc, closeModal, openModal, go, renderAll, showActor, showCustomAnalysis, showScenario, showTheme,
  renderActors, renderRisks, renderThemes, actorTab, renderActorMap, tourMove,
  renderThemeScenarios, renderMatrix, setTopicFilter, toggleFilter, onlyFilter, clearFilters, toggleTS, openTS, goActorTerm, searchScenarios,
} from './ui'
import {
  editorTab, initEditor, loadActorToForm, loadAnalysisToForm, loadTopicToForm, newTopic, resetTopicOverride, deleteRecord, hideRecord, resetActorOverride,
} from './editor'
import { startMascot, helpContent, falaLogin } from './mascot'
import { initSourcesEdit } from './sourcesEdit'
import { initTopicSources } from './topicSources'
import { initUsers, renderUsers, ROLE_LABEL, type Role } from './users'
import { diasAtePosse, faltam } from './data'
import type { ViewId } from './types'

initTexts() // lê os textos fixos da página antes de qualquer edição (base para a Área editorial)

// ---------- autenticação (opcional: só a Área editorial exige login) ----------
let signedIn = false
let role: Role | null = null; let myId = '' // papel vem da tabela profiles; a segurança real é a RLS do banco, aqui só esconde o que não cabe
let activeView: ViewId = 'home'
let openEditorAfterLogin = false

const loginError = (t: string) => { $('loginError').textContent = t }
const showLogin = (on: boolean) => { $('loginScreen').classList.toggle('hide', !on); document.body.classList.toggle('locked', on); if (on) $('loginEmail').focus() }

/** Navega; a Área editorial pede login se ainda não houver sessão. */
function nav(view: ViewId): void {
  if (view === 'editor' && !signedIn) return showLogin(true)
  if (view === 'editor' && !canEdit() && role !== 'revisor') {
    return openModal('Área editorial', '<p>Seu acesso é de <strong>leitura</strong>: você lê tudo, inclusive rascunhos, mas só a edição cria e altera conteúdo.</p><p class="small">Para editar, peça a quem administra o projeto.</p>')
  }
  if (view === 'users' && role !== 'admin') {
    return openModal('Usuários e acesso', '<p>Só <strong>admin</strong> gerencia usuários e papéis.</p>')
  }
  activeView = view
  go(view)
  if (view === 'users') void renderUsers(myId)
}

// dias até a posse (5/1/2027, marco do documento de cenários) ou dia do mandato
function heroClock(): void {
  const d = diasAtePosse()
  $('heroClock').textContent = d > 0 ? `Posse em 5 de janeiro de 2027 · ${faltam(d)}`
    : d === 0 ? 'Hoje é o dia da posse'
    : d > -100 ? `Dia ${1 - d} dos 100 primeiros dias · balanço por volta de 15 de abril`
    : 'Os 100 primeiros dias terminaram · revisar cenários'
}
heroClock()
$('loginUly').textContent = falaLogin()
if (!configured) loginError('Defina VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY no .env para poder entrar.')

const canEdit = () => role === 'admin' || role === 'editor'
// só quem pode editar vê a Área editorial; só admin vê Usuários
const showEditorNav = () => { document.body.classList.toggle('can-edit', canEdit()); $('navEditor').classList.toggle('hide', !canEdit() && role !== 'revisor'); $('navUsers').classList.toggle('hide', role !== 'admin') }

async function loadRole(): Promise<void> {
  const { data } = await supabase.from('profiles').select('user_id,role,active').eq('user_id', myId).maybeSingle()
  // sem linha ou inativo = trata como observador (o banco bloqueia a escrita de qualquer jeito)
  const r: Role = data?.active !== false && (data?.role === 'admin' || data?.role === 'editor' || data?.role === 'revisor') ? data.role : 'observador'
  role = r
  $('userRole').textContent = data?.active === false ? 'Inativo' : ROLE_LABEL[r]
  $('userRole').className = 'role-chip ' + r
  showEditorNav()
}

async function refresh(): Promise<void> {
  renderAll() // conteúdo-base já na tela; Supabase só acrescenta (sem .env a chamada leva ~10 s para falhar)
  if (!signedIn) return // sem login nada é carregado do banco; a tela de entrada cobre o site
  await Promise.all([loadElection(), loadTopics(), loadContent()]).catch(() => {})
  try { await loadAll() } catch (e) { console.warn('Supabase indisponível; mostrando só o conteúdo base.', e) }
  renderAll()
}

let appliedEmail: string | undefined | null = null // null = ainda não aplicado
function applySession(email: string | undefined, id = ''): void {
  if (email === appliedEmail) return // evento repetido (ex.: voltar para a aba): nada mudou
  appliedEmail = email
  myId = id
  signedIn = Boolean(email)
  $('userEmail').textContent = email ?? ''
  role = null; $('userRole').textContent = ''; showEditorNav()
  $('authBtn').textContent = signedIn ? 'Sair' : 'Entrar'
  showLogin(!signedIn) // login obrigatório: sem sessão, só a tela de entrada
  if (!signedIn) { clearCache(); $<HTMLFormElement>('loginForm').reset(); $<HTMLInputElement>('loginPassword').type = 'password' }
  if (!signedIn && (activeView === 'editor' || activeView === 'users')) nav('home')
  void (signedIn ? loadRole() : Promise.resolve()).catch(() => {}).then(() => {
    if (openEditorAfterLogin && canEdit()) nav('editor')
    openEditorAfterLogin = false
    return refresh().then(() => { if (signedIn) welcome() })
  })
}

$('loginForm').addEventListener('submit', async e => {
  e.preventDefault()
  loginError('')
  if (!configured) return loginError('Defina VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY no .env.')
  const { error } = await supabase.auth.signInWithPassword({
    email: $<HTMLInputElement>('loginEmail').value.trim(),
    password: $<HTMLInputElement>('loginPassword').value,
  })
  if (error) return loginError(error.message === 'Invalid login credentials'
    ? 'E-mail ou senha incorretos.'
    : 'Não foi possível entrar: ' + error.message)
  openEditorAfterLogin = true // onAuthStateChange carrega o papel e, se for editor, abre a área editorial
})
$('helpBtn').addEventListener('click', () => { const h = helpContent(); openModal(h.title, h.body) })
$<HTMLInputElement>('showPass').addEventListener('change', e => {
  $<HTMLInputElement>('loginPassword').type = (e.target as HTMLInputElement).checked ? 'text' : 'password'
})
$('authBtn').addEventListener('click', () => (signedIn ? void supabase.auth.signOut() : showLogin(true)))

// Dispara no carregamento (INITIAL_SESSION), no login e no logout.
supabase.auth.onAuthStateChange((_event, session) => {
  // setTimeout: supabase-js pede para não chamar a API dentro deste callback (deadlock).
  setTimeout(() => applySession(session?.user.email, session?.user.id), 0)
})

// ---------- documentos privados (bucket "docs" do Supabase; só conta ativa lê) ----------
const safeName = (n: string) => n.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
async function openDoc(name: string): Promise<void> {
  const w = window.open('', '_blank') // abre já, no clique, para o navegador não bloquear
  const { data, error } = await supabase.storage.from('docs').createSignedUrl(safeName(name), 120)
  if (error || !data) {
    w?.close()
    return openModal('Documento indisponível', `<p>Não consegui abrir <b>${esc(name)}</b>. O arquivo precisa estar no armazenamento privado (bucket <code>docs</code>) e a sessão precisa estar ativa.</p><p class="small">${esc(error?.message ?? '')}</p>`)
  }
  if (w) w.location.href = data.signedUrl
}

// ---------- primeiro acesso: "Conheça a Uly" (uma vez por navegador e conta) ----------
const welcomeKey = () => 'uly-boas-vindas:' + $('userEmail').textContent
function welcome(): void {
  try { if (localStorage.getItem(welcomeKey())) return } catch { /* sem localStorage: mostra sempre */ }
  const f = (v: string) => getContent<Record<string, unknown>>('uly').filter(l => l.view === v).map(l => `<p>${esc(l.text)}</p>`).join('')
  openModal('Conheça a Uly', `<div class="help"><img src="${import.meta.env.BASE_URL}uly/apresentando.png" alt="Uly, a assistente do Itaú 360°"><div>${f('primeiro')}<div id="ulyStory" class="hide">${f('historia')}</div><div class="btn-row"><button class="btn secondary" data-uly="story">Conhecer a história</button><button class="btn orange" data-uly="tour">Fazer o tour</button><button class="btn secondary" data-uly="skip">Agora não</button></div></div></div>`)
}
function ulyChoice(c: string): void {
  if (c === 'story') return void $('ulyStory').classList.remove('hide')
  try { localStorage.setItem(welcomeKey(), '1') } catch { /* ignore */ }
  closeModal()
  if (c === 'tour') nav('guide')
}

// ---------- navegação ----------
const el = (t: EventTarget | null) => t as HTMLElement
document.addEventListener('click', e => {
  const t = el(e.target)
  const hit = (sel: string) => t.closest<HTMLElement>(sel)
  hit('[data-view]') && nav(hit('[data-view]')!.dataset.view as ViewId)
  hit('[data-go]') && nav(hit('[data-go]')!.dataset.go as ViewId)
  if (t.id === 'modalClose' || t.id === 'modal') closeModal()
  const axis = hit('[data-axis]')
  if (axis) openAxis(axis.dataset.axis!)
  hit('[data-theme]') && showTheme(hit('[data-theme]')!.dataset.theme!)
  hit('[data-scenario]') && showScenario(hit('[data-scenario]')!.dataset.scenario!)
  hit('[data-atab]') && actorTab(hit('[data-atab]')!.dataset.atab!)
  hit('[data-mapnode]') && renderActorMap(hit('[data-mapnode]')!.dataset.mapnode!)
  const tour = hit('[data-tour]')
  if (tour) tourMove(tour.dataset.tour!)
  const pl = hit('[data-pl-actor]')
  if (pl) { nav('actors'); showActor(pl.dataset.plActor!) }
  hit('[data-actor]') && showActor(hit('[data-actor]')!.dataset.actor!)
  hit('[data-etab]') && editorTab(hit('[data-etab]')!.dataset.etab!)
  const edit = hit('[data-edit-actor]')
  if (edit) { if (canEdit()) loadActorToForm(edit.dataset.editActor!); else nav('editor') } // sem permissão, nav mostra login ou aviso
  const doc = hit('[data-doc]')
  if (doc) { e.preventDefault(); void openDoc(doc.dataset.doc!) }
  const uly = hit('[data-uly]')
  if (uly) ulyChoice(uly.dataset.uly!)
  const etopic = hit('[data-edit-topic]')
  if (etopic) { if (canEdit()) loadTopicToForm(etopic.dataset.editTopic!); else nav('editor') }
  if (hit('[data-new-topic]')) { if (canEdit()) newTopic(); else nav('editor') }
  const tsub = hit('[data-tsub]')
  if (tsub) setTopicFilter('sub', tsub.dataset.tsub!)
  const tsubGo = hit('[data-tsub-go]')
  if (tsubGo) setTopicFilter('sub', tsubGo.dataset.tsubGo!, true)
  const tkind = hit('[data-tkind]')
  if (tkind) setTopicFilter('kind', tkind.dataset.tkind!)
  const fk = hit('[data-fk]')
  if (fk) toggleFilter(fk.dataset.fk!, fk.dataset.fv!)
  const only = hit('[data-only-k]')
  if (only) onlyFilter(only.dataset.onlyK!, only.dataset.onlyV!)
  hit('[data-tscn]') && toggleTS(hit('[data-tscn]')!.dataset.tscn!)
  hit('#scnClear') && clearFilters()
  const at = hit('[data-actor-term]')
  if (at) { nav('actors'); goActorTerm(at.dataset.actorTerm!) }
  const as = hit('[data-actor-scn]')
  if (as) { nav('scenarios'); onlyFilter('at', as.dataset.actorScn!) }
  const ots = hit('[data-open-ts]')
  if (ots) { nav('scenarios'); openTS(ots.dataset.openTs!) }
  hit('[data-edit-analysis]') && loadAnalysisToForm(hit('[data-edit-analysis]')!.dataset.editAnalysis!)
  const del = hit('[data-delete]')
  if (del) void deleteRecord(del.dataset.delete!, del.dataset.id!)
  const hd = hit('[data-hide]')
  if (hd) void hideRecord(hd.dataset.hide!, hd.dataset.id!)
  hit('[data-reset-topic]') && void resetTopicOverride(hit('[data-reset-topic]')!.dataset.resetTopic!)
  hit('[data-reset-actor]') && void resetActorOverride(hit('[data-reset-actor]')!.dataset.resetActor!)
  hit('[data-custom-analysis]') && showCustomAnalysis(hit('[data-custom-analysis]')!.dataset.customAnalysis!)
})
function openAxis(id: string): void { nav('themes'); showTheme(id) }
document.addEventListener('keydown', e => {
  const axis = el(e.target).closest<HTMLElement>('[data-axis]')
  if (axis && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openAxis(axis.dataset.axis!) }
})

// ---------- filtros e busca global ----------
$('actorSearch').addEventListener('input', renderActors)
$('actorFilter').addEventListener('change', renderActors)
$('riskSearch').addEventListener('input', renderRisks)
$('riskType').addEventListener('change', () => { renderRisks(); renderMatrix() })
$('actorHz').addEventListener('change', renderActors)
$('themeSearch').addEventListener('input', renderThemes)
$('scnSearch').addEventListener('input', renderThemeScenarios)
$('scnOrder').addEventListener('change', renderThemeScenarios)
$('globalSearch').addEventListener('keydown', e => {
  if (e.key !== 'Enter') return
  const q = $<HTMLInputElement>('globalSearch').value.trim().toLowerCase()
  if (!q) return
  nav('actors')
  $<HTMLInputElement>('actorSearch').value = q
  renderActors()
  if (!$('actorGrid').textContent?.trim()) {
    $<HTMLInputElement>('actorSearch').value = ''
    if (searchScenarios(q)) return nav('scenarios')
    clearFilters()
    nav('themes')
    showTheme(getTopics().find(t => (t.title + ' ' + t.desc + ' ' + t.subs.map(x => x.t).join(' ')).toLowerCase().includes(q))?.id ?? 'fiscal')
  }
})

mountPlanalto()
initEditor()
initSourcesEdit()
initTopicSources()
initUsers()
startMascot()
void refresh()
