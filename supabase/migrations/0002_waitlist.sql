-- Waiting list for Quarry UI. Run this once in the Supabase SQL editor.
-- Anyone can add their email. Nobody can read the list through the API, so open the table in the
-- Supabase dashboard (Table editor > waitlist) to see who signed up.

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null check (char_length(email) between 5 and 254 and email ~* '^[^\s@]+@[^\s@]+\.[^\s@]{2,}$'),
  source text not null default 'quarry-ui',
  created_at timestamptz not null default now()
);

-- one row per address, whatever the capitalisation
create unique index if not exists waitlist_email_unique on public.waitlist (lower(email));

alter table public.waitlist enable row level security;

create policy "anyone can join the waitlist" on public.waitlist
  for insert to anon, authenticated
  with check (true);
