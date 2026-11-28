-- Papel "visitante": conta de acesso aberto (QR code). Lê só o que é público: dossiês Publicado, atores, temas e conteúdo.
-- Não lê rascunhos, histórico nem documentos internos, e não grava nada.
alter table public.profiles drop constraint profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (role in ('admin','editor','revisor','observador','visitante'));

-- is_member (rascunhos, histórico, documentos) passa a excluir o visitante; as policies de analyses já caem no "Publicado".
create or replace function public.is_member() returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles where user_id = auth.uid() and active and role <> 'visitante')
$$;
create function public.is_visitor() returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles where user_id = auth.uid() and active and role = 'visitante')
$$;

create policy "visitor read" on public.actors        for select to authenticated using (public.is_visitor());
create policy "visitor read" on public.topics        for select to authenticated using (public.is_visitor());
create policy "visitor read" on public.content_items for select to authenticated using (public.is_visitor());
