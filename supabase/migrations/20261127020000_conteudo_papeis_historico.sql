-- 1) Papel de revisão: administração, edição, revisão e leitura (observador = leitura).
alter table public.profiles drop constraint profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (role in ('admin','editor','revisor','observador'));
create function public.is_reviewer() returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles where user_id = auth.uid() and role in ('admin','revisor') and active)
$$;

-- 2) Todo o conteúdo editável (cenários, riscos, calendário, metodologia, fontes, tour, Uly, textos das telas...)
create table public.content_items (
  kind        text not null,
  id          text not null,
  record      jsonb not null,
  is_override boolean not null default false,  -- true = edição de um item da base do projeto
  created_by  uuid default auth.uid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  primary key (kind, id)
);
create trigger content_items_touch before update on public.content_items for each row execute function public.touch_updated_at();
alter table public.content_items enable row level security;
create policy "member read"  on public.content_items for select to authenticated using (public.is_member());
create policy "editor write" on public.content_items for all to authenticated using (public.is_editor()) with check (public.is_editor());

-- 3) Fluxo rascunho → revisão → publicação (dossiês): quem revisa aprova e devolve; quem edita não publica.
create policy "reviewer update" on public.analyses for update to authenticated using (public.is_reviewer()) with check (public.is_reviewer());
create function public.analyses_guard() returns trigger language plpgsql as $$
begin
  -- edição que não é de revisão nunca deixa a ficha como "Publicado": volta para revisão
  if not public.is_reviewer() and new.record->>'status' = 'Publicado' then
    new.record := jsonb_set(new.record, '{status}', '"Em revisão"');
  end if;
  return new;
end $$;
create trigger analyses_guard before insert or update on public.analyses for each row execute function public.analyses_guard();

-- 4) Histórico: quem criou, alterou ou excluiu, quando, com cópia do registro.
create table public.content_history (
  id       bigint generated always as identity primary key,
  at       timestamptz not null default now(),
  tbl      text not null,
  row_id   text not null,
  action   text not null,
  title    text,
  by_user  uuid default auth.uid(),
  by_email text,
  record   jsonb
);
alter table public.content_history enable row level security;
create policy "member read" on public.content_history for select to authenticated using (public.is_member());

create function public.log_change() returns trigger language plpgsql security definer set search_path = '' as $$
declare
  rec jsonb := to_jsonb(case when tg_op = 'DELETE' then old else new end);
  rid text := case when rec ? 'kind' then (rec->>'kind') || ':' || (rec->>'id') else rec->>'id' end;
begin
  insert into public.content_history (tbl, row_id, action, title, by_email, record)
  values (tg_table_name, rid,
          case tg_op when 'INSERT' then 'criou' when 'UPDATE' then 'alterou' else 'excluiu' end,
          coalesce(rec->'record'->>'title', rec->'record'->>'name', rec->'record'->>'t', rec->'record'->>'label', rec->'record'->>'text', rid),
          (select email from public.profiles where user_id = auth.uid()),
          rec->'record');
  return null;
end $$;
create trigger actors_log        after insert or update or delete on public.actors        for each row execute function public.log_change();
create trigger analyses_log      after insert or update or delete on public.analyses      for each row execute function public.log_change();
create trigger topics_log        after insert or update or delete on public.topics        for each row execute function public.log_change();
create trigger content_items_log after insert or update or delete on public.content_items for each row execute function public.log_change();

-- 5) Documentos internos em armazenamento privado: só conta ativa lê (link temporário gerado pelo site).
insert into storage.buckets (id, name, public) values ('docs', 'docs', false) on conflict (id) do nothing;
create policy "member read docs" on storage.objects for select to authenticated using (bucket_id = 'docs' and public.is_member());
