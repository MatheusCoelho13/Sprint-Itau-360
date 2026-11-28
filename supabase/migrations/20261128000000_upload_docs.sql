-- Editores enviam e apagam arquivos do bucket privado "docs" pelo site (Fontes e documentos → Adicionar fonte).
create policy "editor insert docs" on storage.objects for insert to authenticated with check (bucket_id = 'docs' and public.is_editor());
create policy "editor update docs" on storage.objects for update to authenticated using (bucket_id = 'docs' and public.is_editor());
create policy "editor delete docs" on storage.objects for delete to authenticated using (bucket_id = 'docs' and public.is_editor());
