-- Rode no SQL Editor DEPOIS de criar as contas em Authentication > Users. Troque os e-mails pelos reais.
-- Papéis: admin (Administração), editor (Edição), revisor (Revisão), observador (Leitura).
update public.profiles set role = 'admin'   where email = 'matheus@exemplo.com';
update public.profiles set role = 'editor'  where email = 'larissa@exemplo.com';
update public.profiles set role = 'revisor' where email = 'felipe@exemplo.com';
