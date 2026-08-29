-- First-run onboarding: what the player is training for, how chatty the coach
-- should be, and whose voice it speaks in.
--
-- Security model is unchanged: RLS on, no policies, all access through the
-- Next.js server with the secret key scoped by player id.

create type public.goal_kind as enum ('increase_pace', 'target_pace');

-- 1 = only when a run goes badly wrong, 5 = talk to me constantly.
create type public.voice_status as enum ('uploaded', 'cloning', 'ready', 'failed');
create type public.voice_sentiment as enum ('love', 'hate');

alter table public.players
  add column goal_kind public.goal_kind,
  -- Seconds per kilometre. 150 s/km ≈ 2:30/km, 900 s/km ≈ 15:00/km.
  add column target_pace_s_per_km integer
    check (target_pace_s_per_km is null
      or target_pace_s_per_km between 150 and 900),
  add column prompt_frequency smallint
    check (prompt_frequency is null or prompt_frequency between 1 and 5),
  add column onboarding_completed_at timestamptz,
  add constraint players_goal_needs_pace
    check (goal_kind is null or target_pace_s_per_km is not null);

create table public.player_voices (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players (id) on delete cascade,
  label text not null check (length(label) between 1 and 40),
  sentiment public.voice_sentiment not null,
  -- Path in the private `voice-samples` storage bucket.
  sample_path text not null,
  elevenlabs_voice_id text,
  status public.voice_status not null default 'uploaded',
  error_message text,
  is_active boolean not null default false,
  created_at timestamptz not null default now()
);

create index player_voices_player_created_at_idx
  on public.player_voices (player_id, created_at desc);

-- At most one active voice per player.
create unique index player_voices_one_active_idx
  on public.player_voices (player_id)
  where is_active;

alter table public.player_voices enable row level security;

-- Private bucket for the uploaded samples. Nothing can read it with the anon or
-- publishable key; the server signs URLs with the secret key when it needs one.
insert into storage.buckets (id, name, public)
values ('voice-samples', 'voice-samples', false)
on conflict (id) do nothing;

-- When players are linked to auth users, add alongside the policies sketched in
-- the first migration:
--
--   create policy "voices read own" on public.player_voices
--     for select using (
--       exists (
--         select 1 from public.players p
--         where p.id = player_voices.player_id and p.auth_user_id = auth.uid()
--       )
--     );
