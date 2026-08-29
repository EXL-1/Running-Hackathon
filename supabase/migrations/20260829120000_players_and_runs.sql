-- Players and runs.
--
-- A player is identified by a username only; there are no accounts yet. The
-- `auth_user_id` column is already here so a player row can later be linked to
-- a Supabase Auth user without a data migration.
--
-- Security model: RLS is enabled and no policies are created, so the anon and
-- publishable keys can read and write nothing. All access goes through the
-- Next.js server (route handlers and server actions) with the secret key, which
-- scopes every query to the player in the signed session cookie. When accounts
-- land, add the auth.uid() policies at the bottom of this file and move reads
-- to a cookie-based client.

create extension if not exists "pgcrypto";
create extension if not exists "citext";

create type public.run_mode as enum ('chase', 'cheer');

create table public.players (
  id uuid primary key default gen_random_uuid(),
  username citext not null unique
    check (length(username) between 3 and 20 and username ~ '^[a-z0-9_]+$'),
  display_name text check (display_name is null or length(display_name) <= 40),
  auth_user_id uuid unique references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create table public.runs (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players (id) on delete cascade,
  mode public.run_mode not null,
  distance_m integer not null check (distance_m > 0 and distance_m <= 500000),
  duration_s integer not null check (duration_s > 0 and duration_s <= 86400),
  points integer not null default 0 check (points >= 0),
  started_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index runs_player_started_at_idx
  on public.runs (player_id, started_at desc);

alter table public.players enable row level security;
alter table public.runs enable row level security;

-- Once players are linked to auth users, replace the server-only access above
-- with policies such as:
--
--   create policy "players read own" on public.players
--     for select using (auth_user_id = auth.uid());
--
--   create policy "runs read own" on public.runs
--     for select using (
--       exists (
--         select 1 from public.players p
--         where p.id = runs.player_id and p.auth_user_id = auth.uid()
--       )
--     );
