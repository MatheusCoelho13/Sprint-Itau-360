import { supabase } from './supabase'
import { $, esc } from './ui'

/** Tela "Usuários e acesso" (só admin). Lê e altera a tabela profiles; as regras de negócio valem no banco (RLS + gatilhos). */
export type Role = 'admin' | 'editor' | 'revisor' | 'observador'
interface Profile { user_id: string; email: string; role: Role; active: boolean; created_at: string }
interface Audit { at: string; actor_email: string | null; target_email: string; field: 'role' | 'active'; old_value: string; new_value: string }

export const ROLE_LABEL: Record<Role, string> = { admin: 'Administração', editor: 'Edição', revisor: 'Revisão', observador: 'Leitura' }
const PLURAL: Record<Role, [string, string]> = { admin: ['Administração', 'Administração'], editor: ['Edição', 'Edição'], revisor: ['Revisão', 'Revisão'], observador: ['Leitura', 'Leitura'] }
const fmt = (d: string) => new Date(d).toLocaleDateString('pt-BR')
const fmtTime = (d: string) => new Date(d).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })

let rows: Profile[] = []
let me = ''

const notice = (t: string, bad = false) => { const n = $('userMsg'); n.textContent = t; n.classList.toggle('hide', !t); n.classList.toggle('bad', bad) }

export async function renderUsers(myId: string): Promise<void> {
  me = myId
  const [p, a] = await Promise.all([
    supabase.from('profiles').select('user_id,email,role,active,created_at').order('created_at'),
    supabase.from('role_audit').select('at,actor_email,target_email,field,old_value,new_value').order('at', { ascending: false }).limit(10),
  ])
  if (p.error) return notice('Não foi possível carregar os usuários: ' + p.error.message, true)
  rows = p.data as Profile[]
  draw()
  const log = (a.data ?? []) as Audit[]
  $('auditList').innerHTML = log.length ? log.map(l => {
    const o = l.field === 'role' ? ROLE_LABEL[l.old_value as Role] : l.old_value === 'true' ? 'ativo' : 'inativo'
    const n = l.field === 'role' ? ROLE_LABEL[l.new_value as Role] : l.new_value === 'true' ? 'ativo' : 'inativo'
    return `<li><time>${fmtTime(l.at)}</time><span><b>${esc(l.actor_email ?? 'SQL Editor')}</b> mudou ${l.field === 'role' ? 'o papel' : 'a situação'} de <b>${esc(l.target_email)}</b>: ${o} → ${n}</span></li>`
  }).join('') : '<li class="muted">Nenhuma alteração registrada ainda.</li>'
}

function draw(): void {
  const q = $<HTMLInputElement>('userSearch').value.trim().toLowerCase()
  const fr = $<HTMLSelectElement>('userRoleFilter').value
  const fs = $<HTMLSelectElement>('userStateFilter').value
  const list = rows.filter(u => (!q || u.email.toLowerCase().includes(q)) && (fr === 'all' || u.role === fr) &&
    (fs === 'all' || (fs === 'on') === u.active))
  const n = (r: Role) => rows.filter(u => u.role === r && u.active).length
  $('usersSummary').innerHTML =
    (['admin', 'editor', 'revisor', 'observador'] as Role[]).map(r => `<div><b>${n(r)}</b><span>${PLURAL[r][n(r) === 1 ? 0 : 1]}</span></div>`).join('') +
    `<div class="off"><b>${rows.filter(u => !u.active).length}</b><span>Inativo(s)</span></div>`
  $('userCount').textContent = `${list.length} de ${rows.length}`
  $('userRows').innerHTML = list.map(u => {
    const self = u.user_id === me
    return `<tr class="${u.active ? '' : 'off'}"><td data-l="Usuário"><strong>${esc(u.email)}</strong>${self ? ' <span class="you">você</span>' : ''}</td>
      <td data-l="Papel"><select data-uid="${u.user_id}" aria-label="Papel de ${esc(u.email)}" ${self ? 'disabled title="Você não pode alterar o próprio papel."' : ''}>${(['admin', 'editor', 'revisor', 'observador'] as Role[]).map(r => `<option value="${r}"${r === u.role ? ' selected' : ''}>${ROLE_LABEL[r]}</option>`).join('')}</select></td>
      <td data-l="Situação"><button type="button" class="pill-btn state ${u.active ? 'on' : ''}" data-ustate="${u.user_id}" ${self ? 'disabled title="Você não pode se desativar."' : ''}>${u.active ? 'Ativo' : 'Inativo'}</button></td>
      <td data-l="Desde">${fmt(u.created_at)}</td></tr>`
  }).join('') || '<tr><td colspan="4" class="muted">Nenhum usuário com esse filtro.</td></tr>'
}

async function update(id: string, patch: Partial<Pick<Profile, 'role' | 'active'>>): Promise<void> {
  notice('')
  const { error } = await supabase.from('profiles').update(patch).eq('user_id', id)
  if (error) notice(error.message, true)
  await renderUsers(me)
}

export function initUsers(): void {
  ;['userSearch', 'userRoleFilter', 'userStateFilter'].forEach(id => $(id).addEventListener('input', draw))
  $('userRows').addEventListener('change', e => {
    const s = e.target as HTMLSelectElement
    if (s.dataset.uid) void update(s.dataset.uid, { role: s.value as Role })
  })
  $('userRows').addEventListener('click', e => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('[data-ustate]')
    if (!b) return
    const u = rows.find(x => x.user_id === b.dataset.ustate)
    if (u && confirm(u.active ? `Desativar ${u.email}? A pessoa continua com a conta, mas só lê o conteúdo público.` : `Reativar ${u.email}?`)) void update(u.user_id, { active: !u.active })
  })
}
