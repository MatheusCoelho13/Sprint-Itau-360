// Sobe a pasta docs-privados/ para o bucket privado "docs" do Supabase.
// Uso: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/subir-docs.mjs
// A chave service_role é secreta: use só no seu terminal, nunca no site nem no repositório.
import { createClient } from '@supabase/supabase-js'
import { readdirSync, readFileSync } from 'node:fs'

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) { console.error('Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.'); process.exit(1) }
const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
const safe = n => n.normalize('NFD').replace(/[̀-ͯ]/g, '') // o site pede o nome sem acento (ver openDoc em main.ts)

for (const f of readdirSync('docs-privados')) {
  const { error } = await sb.storage.from('docs').upload(safe(f), readFileSync('docs-privados/' + f), { upsert: true })
  console.log(error ? `ERRO ${f}: ${error.message}` : `ok   ${f}`)
}
