/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string
  /** @deprecated chave anon legada; use VITE_SUPABASE_PUBLISHABLE_KEY */
  readonly VITE_SUPABASE_ANON_KEY?: string
}
interface ImportMeta { readonly env: ImportMetaEnv }
