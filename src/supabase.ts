import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const configured = Boolean(url && key)
// placeholder evita crash no import; a tela de login avisa quando faltam as variáveis.
export const supabase = createClient(url || 'http://localhost', key || 'missing-key')
