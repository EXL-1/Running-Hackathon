-- What the native app needs to persist: the coach a player picked, and the
-- run details the summary and personal best are built from.
--
-- Security model is unchanged: RLS on, no policies, all access through the
-- Next.js server with the secret key scoped by player id.

create type public.run_baseline as enum ('faster', 'slower', 'on-target');

-- Ids come from `shared/voices.ts` (mum, ex-female, sergeant, …). Kept as text
-- rather than an enum so adding a voice is a code change, not a migration.
alter table public.players
  add column coach_voice_id text
    check (coach_voice_id is null or length(coach_voice_id) between 1 and 40);

alter table public.runs
  add column coach_voice_id text
    check (coach_voice_id is null or length(coach_voice_id) between 1 and 40),
  add column baseline public.run_baseline,
  -- Derived so a client cannot report a pace its own distance and duration
  -- disagree with, and so personal bests are one indexed query.
  add column avg_pace_s_per_km integer
    generated always as (round(duration_s::numeric * 1000 / distance_m)::integer)
    stored;

-- Personal best lookup: the fastest qualifying run for a player.
create index runs_player_avg_pace_idx
  on public.runs (player_id, avg_pace_s_per_km);
