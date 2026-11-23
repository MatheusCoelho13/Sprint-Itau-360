import { createClient } from '@supabase/supabase-js'

// aceita a URL colada com sufixo (ex.: .../rest/v1/): o cliente quer só a raiz do projeto
const url = import.meta.env.VITE_SUPABASE_URL?.replace(/^(https?:\/\/[^/]+).*$/, '$1')
// Chave nova do Supabase: publishable (sb_publishable_...). A anon (JWT) é legada e só entra como reserva.
const publishable = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
const key = publishable || import.meta.env.VITE_SUPABASE_ANON_KEY
if (!publishable && key) console.warn('Supabase: VITE_SUPABASE_ANON_KEY está obsoleta. Use VITE_SUPABASE_PUBLISHABLE_KEY (Project Settings > API Keys).')

export const configured = Boolean(url && key)
// placeholder evita crash no import; a tela de login avisa quando faltam as variáveis.
export const supabase = createClient(url || 'http://localhost', key || 'missing-key', {
  // login persistente: sessão fica no localStorage e o token renova sozinho; só "Sair" encerra
  auth: { persistSession: true, autoRefreshToken: true, storageKey: 'itau360-auth' },
})
