// Cria vários perfis de uma vez a partir de um CSV (email,papel), com senha gerada.
// Uso: node --env-file=.env.admin scripts/criar-perfis.mjs perfis.csv   (.env.admin: SUPABASE_URL=... e SUPABASE_SERVICE_ROLE_KEY=..., fora do git)
// Grava perfis-senhas.txt (fora do git). Conta que já existe só é reportada, nada é sobrescrito.
import { createClient } from '@supabase/supabase-js'
import { readFileSync, writeFileSync } from 'node:fs'
import { randomBytes } from 'node:crypto'

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env
const file = process.argv[2]
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !file) { console.error('Uso: node --env-file=.env.admin scripts/criar-perfis.mjs perfis.csv'); process.exit(1) }
const PAPEIS = ['admin', 'editor', 'revisor', 'observador', 'visitante']
const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

const linhas = readFileSync(file, 'utf8').split(/\r?\n/).slice(1).map(l => l.trim()).filter(Boolean)
const saida = []
for (const l of linhas) {
  const [email, papel = 'observador'] = l.split(',').map(x => x.trim())
  if (!PAPEIS.includes(papel)) { console.error(`pula ${email}: papel inválido "${papel}"`); continue }
  const senha = randomBytes(9).toString('base64url') // 12 caracteres
  const { data, error } = await sb.auth.admin.createUser({ email, password: senha, email_confirm: true })
  if (error) { console.error(`erro ${email}: ${error.message}`); continue }
  const { error: e2 } = await sb.from('profiles').update({ role: papel }).eq('user_id', data.user.id)
  if (e2) { console.error(`${email} criado, mas falhou o papel: ${e2.message}`); continue }
  console.log(`ok   ${email} (${papel})`)
  saida.push(`${email}\t${papel}\t${senha}`)
}
if (saida.length) { writeFileSync('perfis-senhas.txt', saida.join('\n') + '\n', { mode: 0o600 }); console.log('Senhas em perfis-senhas.txt (não commitar).') }
