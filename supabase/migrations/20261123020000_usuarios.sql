-- Gestão de usuários: terceiro papel (admin), situação ativo/inativo, regras de negócio e auditoria.
--   admin       gerencia usuários e conteúdo
--   editor      cria, edita, apaga e importa conteúdo
--   observador  lê tudo, inclusive rascunhos; não grava
-- Regras: conta nova = observador; só admin muda papel/situação; ninguém altera o próprio papel nem se desativa
-- (sempre sobra um admin); desativar não apaga (a pessoa só lê o que é público); toda mudança é registrada.

alter table public.profiles drop constraint profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (role in ('admin','editor','observador'));
alter table public.profiles add column active boolean not null default true;

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin' and active)
$$;
create or replace function public.is_editor() returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles where user_id = auth.uid() and role in ('admin','editor') and active)
$$;
create function public.is_member() returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles where user_id = auth.uid() and active)
$$;

-- Rascunhos só para conta ativa; conta desativada continua lendo o que é público.
drop policy "auth read" on public.analyses;
create policy "auth read" on public.analyses for select to authenticated
  using (public.is_member() or record->>'status' = 'Publicado');

-- profiles: cada um vê o próprio; admin vê todos e altera papel/situação.
drop policy "le o proprio papel" on public.profiles;
create policy "ve o proprio ou admin" on public.profiles for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "admin altera" on public.profiles for update to authenticated using (public.is_admin()) with check (public.is_admin());

create function public.profiles_guard() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null then return new; end if; -- SQL Editor / chave de serviço: sem restrição
  if new.user_id <> old.user_id or new.email is distinct from old.email or new.created_at <> old.created_at then
    raise exception 'Só papel e situação podem mudar.';
  end if;
  if old.user_id = auth.uid() and (new.role <> old.role or new.active <> old.active) then
    raise exception 'Você não pode alterar o próprio papel nem se desativar.';
  end if;
  return new;
end $$;
create trigger profiles_guard before update on public.profiles for each row execute function public.profiles_guard();

-- Auditoria
create table public.role_audit (
  id          bigint generated always as identity primary key,
  at          timestamptz not null default now(),
  actor       uuid default auth.uid(),
  actor_email text,
  target      uuid not null,
  target_email text,
  field       text not null check (field in ('role','active')),
  old_value   text,
  new_value   text
);
alter table public.role_audit enable row level security;
create policy "admin le auditoria" on public.role_audit for select to authenticated using (public.is_admin());

create function public.profiles_audit() returns trigger language plpgsql security definer set search_path = '' as $$
declare quem text := (select email from public.profiles where user_id = auth.uid());
begin
  if new.role <> old.role then
    insert into public.role_audit (actor_email, target, target_email, field, old_value, new_value)
    values (quem, new.user_id, new.email, 'role', old.role, new.role);
  end if;
  if new.active <> old.active then
    insert into public.role_audit (actor_email, target, target_email, field, old_value, new_value)
    values (quem, new.user_id, new.email, 'active', old.active::text, new.active::text);
  end if;
  return new;
end $$;
create trigger profiles_audit after update on public.profiles for each row execute function public.profiles_audit();

-- Primeiro admin (SQL Editor, pois a tela exige um admin para começar):
--   update public.profiles set role = 'admin' where email = 'pessoa@exemplo.com';
