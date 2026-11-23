export interface Source { label: string; url: string }
/** Fonte livre (editor): `section` só existe em dossiês. */
export interface CustomSource extends Source { section?: string }

export type ViewId =
  | 'home' | 'themes' | 'scenarios' | 'actors' | 'risks'
  | 'monitor' | 'method' | 'sources' | 'editor' | 'users'

export interface Theme {
  id: string; n: string; title: string; desc: string
  questions: string[]; channels: string[]; itau: string; sources: string[]
}
export interface CrossTheme { title: string; desc: string; type: string; src: string[] }
export interface Scenario {
  id: 'A' | 'B' | 'C'; title: string; kind: string; definition: string
  signals: string[]; support: string; resistance: string
  itau: string[]; clients: string[]; sources: string[]
}
export type RiskType = 'Risco' | 'Oportunidade' | 'Misto'
export interface Risk { title: string; type: RiskType; channel: string; state: string; src: string[] }

export interface Actor {
  id: string; name: string; role: string; group: string; status: string
  photo?: string
  /** chave em SRC (base) ou texto livre (editor) */
  photoCredit?: string
  bio: string; relevance?: string
  /** chaves em SRC */
  sources?: string[]
  /** fontes livres criadas no editor */
  sourceDetails?: Source[]
  date?: string
}
/** Ator + origem, já mesclado (base, override, criado no editor). */
export type ActorView = Actor & { _base: boolean }

export interface Analysis {
  id: string; title: string; theme: string; status: string; type: string
  question: string; evidence: string; actors: string; transmission: string
  impact: string; scenarios: string; signals: string; assessment: string
  sources: CustomSource[]; author: string; review: string; updated: string
}

/** Linha das tabelas `actors` / `analyses` no Supabase. */
export interface Row<T> { id: string; record: T; is_override?: boolean }

export interface ExportFile { actors: Actor[]; analyses: Analysis[]; exportedAt?: string }
