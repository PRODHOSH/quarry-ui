-- Bookmarks for Quarry UI. Run this once in the Supabase SQL editor.
-- A bookmark is one row per person, per kind of thing, per slug.

create table if not exists public.bookmarks (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  kind text not null check (kind in ('components', 'templates', 'backgrounds', 'loaders', 'design')),
  slug text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, kind, slug)
);

alter table public.bookmarks enable row level security;

create policy "read own bookmarks" on public.bookmarks
  for select using (auth.uid() = user_id);

create policy "add own bookmarks" on public.bookmarks
  for insert with check (auth.uid() = user_id);

create policy "remove own bookmarks" on public.bookmarks
  for delete using (auth.uid() = user_id);
