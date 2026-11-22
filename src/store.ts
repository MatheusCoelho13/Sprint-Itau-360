import { supabase } from './supabase'
import { actors as baseActors } from './data'
import type { Actor, ActorView, Analysis, ExportFile, Row } from './types'

// Cache em memória; as telas leem daqui de forma síncrona, as escritas vão ao Supabase primeiro.
let extraActors: Actor[] = []
let overrides: Record<string, Actor> = {}
let analyses: Analysis[] = []

const isBase = (id: string) => baseActors.some(a => a.id === id)

function check<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message)
  return res.data as T
}

export async function loadAll(): Promise<void> {
  const [a, d] = await Promise.all([
    supabase.from('actors').select('id,record,is_override').order('created_at'),
    supabase.from('analyses').select('id,record').order('created_at'),
  ])
  const aRows = check(a) as Row<Actor>[]
  extraActors = aRows.filter(r => !r.is_override).map(r => r.record)
  overrides = Object.fromEntries(aRows.filter(r => r.is_override).map(r => [r.id, r.record]))
  analyses = (check(d) as Row<Analysis>[]).map(r => r.record)
}

export function clearCache(): void { extraActors = []; overrides = {}; analyses = [] }

export const getActors = (): ActorView[] => [
  ...baseActors.map(a => ({ ...a, ...(overrides[a.id] ?? {}), _base: true })),
  ...extraActors.map(a => ({ ...a, _base: false })),
]
export const getAnalyses = (): Analysis[] => analyses

const upsertIn = <T extends { id: string }>(arr: T[], rec: T) => {
  const i = arr.findIndex(x => x.id === rec.id)
  if (i >= 0) arr[i] = rec; else arr.push(rec)
}

export async function saveActor(rec: Actor): Promise<void> {
  const override = isBase(rec.id)
  check(await supabase.from('actors').upsert({ id: rec.id, record: rec, is_override: override }))
  if (override) overrides[rec.id] = rec; else upsertIn(extraActors, rec)
}

export async function saveAnalysis(rec: Analysis): Promise<void> {
  check(await supabase.from('analyses').upsert({ id: rec.id, record: rec }))
  upsertIn(analyses, rec)
}

export async function deleteActor(id: string): Promise<void> {
  check(await supabase.from('actors').delete().eq('id', id))
  extraActors = extraActors.filter(a => a.id !== id)
  delete overrides[id]
}

export async function deleteAnalysis(id: string): Promise<void> {
  check(await supabase.from('analyses').delete().eq('id', id))
  analyses = analyses.filter(a => a.id !== id)
}

export const exportData = (): ExportFile => ({
  actors: extraActors, analyses, exportedAt: new Date().toISOString(),
})

/** Importa por upsert; não apaga o que já existe na base compartilhada. */
export async function importData(d: ExportFile): Promise<void> {
  for (const a of d.actors ?? []) await saveActor(a)
  for (const x of d.analyses ?? []) await saveAnalysis(x)
}
