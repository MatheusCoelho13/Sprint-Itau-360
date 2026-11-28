export interface Source { label: string; url: string }
/** Fonte livre (editor): `section` só existe em dossiês. */
export interface CustomSource extends Source { section?: string }

export type ViewId =
  | 'home' | 'themes' | 'scenarios' | 'actors' | 'risks'
  | 'monitor' | 'method' | 'sources' | 'guide' | 'editor' | 'users' | 'planalto'

/** Subtema: como o Itaú pode aproveitar e com o que deve ter cuidado. */
export interface Sub { t: string; how: string; care: string }
/** Tema de análise: os 5 eixos principais e os temas transversais. Editável (tabela `topics`). */
export interface Topic {
  _hidden?: boolean
  /** excluído de vez (itens da base não somem do código: ficam marcados aqui) */
  _deleted?: boolean
  id: string; kind: 'eixo' | 'transversal'
  n?: string
  /** rótulo curto: é o que os cenários citam em `tm` e o que aparece nos filtros */
  short: string
  title: string; desc: string; about: string; type?: string
  subs: Sub[]; questions: string[]; channels: string[]; itau: string; deepen: string[]
  /** chaves em SRC (base) */
  sources: string[]
  /** fontes livres criadas no editor */
  sourceDetails?: Source[]
}
export interface Scenario {
  id: string; title: string; kind: string; definition: string
  signals: string[]; support: string; resistance: string
  itau: string[]; clients: string[]; sources: string[]
}
export type RiskType = 'Risco' | 'Oportunidade' | 'Misto'

/** Nível qualitativo: 1 baixa, 2 média, 3 alta. Sem percentual inventado. */
export type Level = 1 | 2 | 3
export type ThemeKind = 'Favorável' | 'Desfavorável' | 'Misto' | 'Oportunidade' | 'Risco'
/** Cenário temático (protótipo Itaú 360°): filtrável por tema, subtema, ator, nível e horizonte. */
export interface ThemeScenario {
  id: string; t: string; tp: ThemeKind
  tm: string[]; sub: string[]; pb: string[]; at: string[]
  p: Level; c: Level; g: Level; h: Level
  r: string; why: string; est: string
  ch: string[]; op: string[]; ri: string[]; mo: string[]; src: string[]
}
export interface Risk { title: string; type: RiskType; channel: string; state: string; src: string[] }

export interface Actor {
  /** oculto do site (itens da base não somem do código: ficam marcados aqui) */
  _hidden?: boolean
  /** excluído de vez */
  _deleted?: boolean
  id: string; name: string; role: string; group: string; status: string
  photo?: string
  /** chave em SRC (base) ou texto livre (editor) */
  photoCredit?: string
  bio: string; relevance?: string
  /** Avaliação qualitativa (editável): chance de entrar, chance de sair, gravidade se continuar, horizonte e por quê. */
  entra?: Level; sai?: Level; grav?: Level; hz?: Level; why?: string
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
  /** motivo da devolução, preenchido por quem revisa (status Devolvido) */
  returnReason?: string
}

/** Linha das tabelas `actors` / `analyses` no Supabase. */
export interface Row<T> { id: string; record: T; is_override?: boolean }

export interface ExportFile { actors: Actor[]; analyses: Analysis[]; exportedAt?: string }
