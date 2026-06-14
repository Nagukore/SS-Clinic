-- ============================================================
-- SS Clinic — Blogs migration to Supabase
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor).
-- ============================================================

-- 1. Table -----------------------------------------------------
create table if not exists public.blogs (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  slug        text not null unique,
  excerpt     text,
  content     text,
  author      text,
  image_url   text,
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists blogs_created_at_idx on public.blogs (created_at desc);
create index if not exists blogs_slug_idx on public.blogs (slug);

-- 2. Row Level Security ---------------------------------------
alter table public.blogs enable row level security;

-- Since auth lives in Firebase (not Supabase), both the public site and
-- the admin pages use the anon key. The admin list must see drafts, so we
-- allow reading all rows; the public pages filter `published` client-side.
drop policy if exists "Read all blogs" on public.blogs;
create policy "Read all blogs"
  on public.blogs for select
  using (true);

-- Admin pages are gated by Firebase auth in the app (ProtectedRoute),
-- so writes come through the anon key. These policies mirror the
-- previous "client writes directly" Firestore model.
-- NOTE: the anon key is public. For true server-side protection,
-- route writes through your backend with the service_role key and
-- remove the write policies below.
drop policy if exists "Anon can insert blogs" on public.blogs;
create policy "Anon can insert blogs"
  on public.blogs for insert
  with check (true);

drop policy if exists "Anon can update blogs" on public.blogs;
create policy "Anon can update blogs"
  on public.blogs for update
  using (true) with check (true);

drop policy if exists "Anon can delete blogs" on public.blogs;
create policy "Anon can delete blogs"
  on public.blogs for delete
  using (true);

-- 3. Storage bucket for cover images --------------------------
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

-- Public read of images
drop policy if exists "Public read blog images" on storage.objects;
create policy "Public read blog images"
  on storage.objects for select
  using (bucket_id = 'blog-images');

-- Anon upload of images (mirrors current direct-upload model)
drop policy if exists "Anon upload blog images" on storage.objects;
create policy "Anon upload blog images"
  on storage.objects for insert
  with check (bucket_id = 'blog-images');
