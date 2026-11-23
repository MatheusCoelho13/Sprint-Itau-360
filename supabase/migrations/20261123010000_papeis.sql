-- Dois papéis para quem entra com login:
--   editor     cria, edita e apaga perfis e dossiês (e vê rascunhos)
--   observador só lê, inclusive rascunhos; não grava nada
-- Quem não entra (visitante) continua lendo só o que é público (policies "anon read*").

create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email   text,
  role    text not null default 'observador' check (role in ('editor','observador')),
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- Cada pessoa lê só o próprio papel. Ninguém altera papel pelo site: promover é feito no SQL Editor (ver fim do arquivo).
create policy "le o proprio papel" on public.profiles for select to authenticated using (user_id = auth.uid());

-- Conta nova nasce observador.
create function public.novo_usuario() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (user_id, email) values (new.id, new.email) on conflict do nothing;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.novo_usuario();

-- Contas que já existem tinham acesso total: viram editor, para ninguém perder acesso.
insert into public.profiles (user_id, email, role)
  select id, email, 'editor' from auth.users on conflict do nothing;

create function public.is_editor() returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles where user_id = auth.uid() and role = 'editor')
$$;

-- Troca a regra "qualquer autenticado escreve" por: observador lê, editor escreve.
drop policy "auth all" on public.actors;
drop policy "auth all" on public.analyses;

create policy "auth read"    on public.actors   for select to authenticated using (true);
create policy "auth read"    on public.analyses for select to authenticated using (true);
create policy "editor write" on public.actors   for all to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "editor write" on public.analyses for all to authenticated using (public.is_editor()) with check (public.is_editor());

-- Mudar o papel de alguém (SQL Editor):
--   update public.profiles set role = 'editor'     where email = 'pessoa@exemplo.com';
--   update public.profiles set role = 'observador' where email = 'pessoa@exemplo.com';
