-- Dados de desenvolvimento LOCAL. Rodam em `npx supabase db reset` (pilha local no Docker), depois das migrations.
-- NUNCA aplique em produção: as senhas abaixo são de teste e estão neste arquivo. `db push --remote` não executa o seed.
--
--   admin       admin@itau360.test         senha: Itau360-Admin-local   papel: admin (gerencia usuários e conteúdo)
--   editor      editor@itau360.test        senha: Itau360-Editor-local  papel: editor (escreve conteúdo)
--   observador  observador@itau360.test    senha: Itau360-Observa-local papel: observador (só lê)
--
-- Também entram dois dossiês de exemplo (um Publicado e um rascunho) para ver a diferença entre
-- visitante (só o publicado), observador, editor e admin (veem o rascunho). Texto de exemplo, sem fato real.

do $$
declare
  u record;
begin
  for u in select * from (values
    ('00000000-0000-4000-8000-0000000000a1'::uuid, 'admin@itau360.test',      'Itau360-Admin-local',   'admin'),
    ('00000000-0000-4000-8000-0000000000c3'::uuid, 'editor@itau360.test',     'Itau360-Editor-local',  'editor'),
    ('00000000-0000-4000-8000-0000000000b2'::uuid, 'observador@itau360.test', 'Itau360-Observa-local', 'observador')
  ) as t(id, email, senha, papel)
  loop
    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      confirmation_token, recovery_token, email_change, email_change_token_new
    ) values (
      '00000000-0000-0000-0000-000000000000', u.id, 'authenticated', 'authenticated', u.email,
      extensions.crypt(u.senha, extensions.gen_salt('bf')), now(),
      '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''
    ) on conflict (id) do nothing;

    insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    values (gen_random_uuid(), u.id, u.id::text,
            jsonb_build_object('sub', u.id::text, 'email', u.email, 'email_verified', true),
            'email', now(), now(), now())
    on conflict do nothing;

    -- o gatilho on_auth_user_created já criou o perfil como observador; aqui só ajusta o papel
    update public.profiles set role = u.papel where user_id = u.id;
  end loop;
end $$;

insert into public.analyses (id, record) values
  ('seed-publicado', jsonb_build_object(
     'id', 'seed-publicado', 'title', '[seed] Dossiê de exemplo publicado', 'theme', 'Transversal',
     'status', 'Publicado', 'type', 'Monitoramento', 'question', 'Exemplo para testar a leitura pública.',
     'evidence', 'Texto de exemplo do seed; não é análise real.', 'actors', '', 'transmission', '', 'impact', '',
     'scenarios', '', 'signals', '', 'assessment', '', 'author', 'seed', 'review', '', 'updated', '23/11/2026', 'sources', '[]'::jsonb)),
  ('seed-rascunho', jsonb_build_object(
     'id', 'seed-rascunho', 'title', '[seed] Dossiê de exemplo em elaboração', 'theme', 'Transversal',
     'status', 'Em elaboração', 'type', 'Monitoramento', 'question', 'Exemplo para testar quem vê rascunho.',
     'evidence', 'Texto de exemplo do seed; não é análise real.', 'actors', '', 'transmission', '', 'impact', '',
     'scenarios', '', 'signals', '', 'assessment', '', 'author', 'seed', 'review', '', 'updated', '23/11/2026', 'sources', '[]'::jsonb))
on conflict (id) do nothing;
