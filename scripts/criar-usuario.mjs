// Cria um usuário já confirmado e ajusta o papel.
// Uso: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/criar-usuario.mjs <email> <senha> [papel]
// Papéis: admin | editor | revisor | observador (padrão: observador).
// A chave service_role é secreta: use só no seu terminal, nunca no site nem no repositório.
import { createClient } from '@supabase/supabase-js'

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env
const [email, password, role = 'observador'] = process.argv.slice(2)
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) { console.error('Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.'); process.exit(1) }
if (!email || !password) { console.error('Uso: node scripts/criar-usuario.mjs <email> <senha> [papel]'); process.exit(1) }
if (!['admin', 'editor', 'revisor', 'observador', 'visitante'].includes(role)) { console.error('Papel inválido: ' + role); process.exit(1) }

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
const { data, error } = await sb.auth.admin.createUser({ email, password, email_confirm: true })
if (error) { console.error('ERRO ao criar: ' + error.message); process.exit(1) }

// o gatilho on_auth_user_created já criou o perfil como observador
const { error: e2 } = await sb.from('profiles').update({ role }).eq('user_id', data.user.id)
if (e2) { console.error('Usuário criado, mas falhou o papel: ' + e2.message); process.exit(1) }
console.log(`ok   ${email} (${role})`)
