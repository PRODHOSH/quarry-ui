-- Fair use counter for "Copy prompt". Run this once in the Supabase SQL editor.
-- The site asks this function whether a visitor may copy another prompt. The table has row level
-- security on and no policies, so nobody can read or edit the counts directly. Only the function
-- can touch it, and it only ever answers yes or no.

create table if not exists public.prompt_usage (
  id text primary key,                       -- a keyed hash of the visitor, never the raw address
  count integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.prompt_usage enable row level security;

create or replace function public.claim_prompt(p_id text, p_limit integer)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  c integer;
begin
  insert into public.prompt_usage (id, count) values (p_id, 1)
  on conflict (id) do update
    set count = public.prompt_usage.count + 1, updated_at = now()
    where public.prompt_usage.count < p_limit
  returning count into c;
  return c is not null;
end;
$$;

revoke all on function public.claim_prompt(text, integer) from public;
grant execute on function public.claim_prompt(text, integer) to anon, authenticated;
