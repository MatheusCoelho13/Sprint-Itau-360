-- Rode no SQL Editor do Supabase. Usuários são criados em Authentication > Users
-- (desative "Allow new users to sign up" em Authentication > Providers > Email).

create table public.actors (
  id          text primary key,
  record      jsonb not null,
  is_override boolean not null default false,  -- true = edição de um ator da base do projeto
  created_by  uuid default auth.uid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
); 

create table public.analyses (
  id          text primary key,
  record      jsonb not null,
  created_by  uuid default auth.uid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

create trigger actors_touch   before update on public.actors   for each row execute function public.touch_updated_at();
create trigger analyses_touch before update on public.analyses for each row execute function public.touch_updated_at();

alter table public.actors   enable row level security;
alter table public.analyses enable row level security;

-- Leitura pública (anon): perfis e só os dossiês "Publicado". O site abre sem login.
create policy "anon read" on public.actors   for select to anon using (true);
create policy "anon read published" on public.analyses for select to anon using (record->>'status' = 'Publicado');

-- Escrita (e leitura de rascunhos): só usuário autenticado.
create policy "auth all" on public.actors   for all to authenticated using (true) with check (true);
create policy "auth all" on public.analyses for all to authenticated using (true) with check (true);
