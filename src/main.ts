import './style.css'
import { supabase, configured } from './supabase'
import { loadAll, clearCache } from './store'
import {
  $, closeModal, go, renderAll, showActor, showCustomAnalysis, showScenario, showTheme,
  renderActors, renderRisks,
} from './ui'
import {
  editorTab, initEditor, loadActorToForm, loadAnalysisToForm, deleteRecord, resetActorOverride,
} from './editor'
import { startMascot } from './mascot'
import { themes } from './data'
import type { ViewId } from './types'

// ---------- autenticação (opcional: só a Área editorial exige login) ----------
let signedIn = false
let activeView: ViewId = 'home'

const loginError = (t: string) => { $('loginError').textContent = t }
const showLogin = (on: boolean) => { $('loginScreen').classList.toggle('hide', !on); if (on) $('loginEmail').focus() }

/** Navega; a Área editorial pede login se ainda não houver sessão. */
function nav(view: ViewId): void {
  if (view === 'editor' && !signedIn) return showLogin(true)
  activeView = view
  go(view)
}

async function refresh(): Promise<void> {
  try { await loadAll() } catch (e) { console.warn('Supabase indisponível; mostrando só o conteúdo base.', e) }
  renderAll()
}

let appliedEmail: string | undefined | null = null // null = ainda não aplicado
function applySession(email: string | undefined): void {
  if (email === appliedEmail) return // evento repetido (ex.: voltar para a aba): nada mudou
  appliedEmail = email
  signedIn = Boolean(email)
  $('userEmail').textContent = email ?? 'Visitante · somente leitura'
  $('authBtn').textContent = signedIn ? 'Sair' : 'Entrar'
  showLogin(false)
  if (!signedIn) { clearCache(); $<HTMLFormElement>('loginForm').reset() }
  if (!signedIn && activeView === 'editor') nav('home')
  void refresh()
}

$('loginForm').addEventListener('submit', async e => {
  e.preventDefault()
  loginError('')
  if (!configured) return loginError('Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env.')
  const { error } = await supabase.auth.signInWithPassword({
    email: $<HTMLInputElement>('loginEmail').value.trim(),
    password: $<HTMLInputElement>('loginPassword').value,
  })
  if (error) return loginError('Não foi possível entrar: ' + error.message)
  // sucesso: onAuthStateChange atualiza a tela; abre a área editorial que o usuário pediu
  setTimeout(() => nav('editor'), 0)
})
$('loginCancel').addEventListener('click', () => showLogin(false))
$('authBtn').addEventListener('click', () => (signedIn ? void supabase.auth.signOut() : showLogin(true)))

// Dispara no carregamento (INITIAL_SESSION), no login e no logout.
supabase.auth.onAuthStateChange((_event, session) => {
  // setTimeout: supabase-js pede para não chamar a API dentro deste callback (deadlock).
  setTimeout(() => applySession(session?.user.email), 0)
})

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
  hit('[data-actor]') && showActor(hit('[data-actor]')!.dataset.actor!)
  hit('[data-etab]') && editorTab(hit('[data-etab]')!.dataset.etab!)
  hit('[data-edit-actor]') && loadActorToForm(hit('[data-edit-actor]')!.dataset.editActor!)
  hit('[data-edit-analysis]') && loadAnalysisToForm(hit('[data-edit-analysis]')!.dataset.editAnalysis!)
  const del = hit('[data-delete]')
  if (del) void deleteRecord(del.dataset.delete!, del.dataset.id!)
  hit('[data-reset-actor]') && void resetActorOverride(hit('[data-reset-actor]')!.dataset.resetActor!)
  hit('[data-custom-analysis]') && showCustomAnalysis(hit('[data-custom-analysis]')!.dataset.customAnalysis!)
})
function openAxis(id: string): void { nav('themes'); showTheme(id) }
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') showLogin(false)
  const axis = el(e.target).closest<HTMLElement>('[data-axis]')
  if (axis && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openAxis(axis.dataset.axis!) }
})

// ---------- filtros e busca global ----------
$('actorSearch').addEventListener('input', renderActors)
$('actorFilter').addEventListener('change', renderActors)
$('riskSearch').addEventListener('input', renderRisks)
$('riskType').addEventListener('change', renderRisks)
$('globalSearch').addEventListener('keydown', e => {
  if (e.key !== 'Enter') return
  const q = $<HTMLInputElement>('globalSearch').value.trim().toLowerCase()
  if (!q) return
  nav('actors')
  $<HTMLInputElement>('actorSearch').value = q
  renderActors()
  if (!$('actorGrid').textContent?.trim()) {
    $<HTMLInputElement>('actorSearch').value = ''
    nav('themes')
    showTheme(themes.find(t => (t.title + ' ' + t.desc).toLowerCase().includes(q))?.id ?? 'fiscal')
  }
})

initEditor()
startMascot()
void refresh()
