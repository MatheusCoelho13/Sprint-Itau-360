/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string
  /** @deprecated chave anon legada; use VITE_SUPABASE_PUBLISHABLE_KEY */
  readonly VITE_SUPABASE_ANON_KEY?: string
  readonly VITE_VISITOR_EMAIL?: string
  readonly VITE_VISITOR_PASSWORD?: string
}
interface ImportMeta { readonly env: ImportMetaEnv }
