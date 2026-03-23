-- Add avatar storage columns to profiles
-- Replaces the old avatar_url text field with explicit storage path + blurhash
alter table profiles
  drop column if exists avatar_url,
  add column if not exists avatar_path     text,
  add column if not exists avatar_blurhash text;

-- ── Storage bucket ───────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  5242880, -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

-- ── Storage RLS policies ─────────────────────────────────────────────────────
-- Anyone can read (bucket is public, but RLS still applies to object listing)
create policy "avatars_select_public"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- Authenticated user can only upload into their own folder: {userId}/...
create policy "avatars_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- User can replace their own files
create policy "avatars_update_own"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- User can delete their own files
create policy "avatars_delete_own"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
