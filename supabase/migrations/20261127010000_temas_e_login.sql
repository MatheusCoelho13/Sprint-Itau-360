-- Temas e subtemas editáveis (mesmo padrão de `actors`: is_override = edição de um tema da base do projeto)
create table public.topics (
  id          text primary key,
  record      jsonb not null,
  is_override boolean not null default false,
  created_by  uuid default auth.uid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger topics_touch before update on public.topics for each row execute function public.touch_updated_at();
alter table public.topics enable row level security;
create policy "member read"  on public.topics for select to authenticated using (public.is_member());
create policy "editor write" on public.topics for all to authenticated using (public.is_editor()) with check (public.is_editor());

-- Login obrigatório: tira a leitura pública (anon). Quem não entra não lê nada do banco.
drop policy "anon read"           on public.actors;
drop policy "anon read published" on public.analyses;
drop policy "anon read"           on public.election_votes;
revoke select on public.election_result from anon;

-- Conta desativada também deixa de ler (antes ainda via o conteúdo público).
drop policy "auth read" on public.actors;
create policy "member read" on public.actors for select to authenticated using (public.is_member());
