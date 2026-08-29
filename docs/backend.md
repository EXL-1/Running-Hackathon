# Backend (Supabase + Next.js)

Postgres, and later auth and storage, come from Supabase. The Next.js server is
the only thing that talks to it.

## Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Copy `.env.example` to `.env.local` and fill in `SUPABASE_URL`,
   `SUPABASE_SECRET_KEY` (Project Settings → API Keys → Secret keys) and
   `SESSION_SECRET` (`openssl rand -base64 32`).
3. Apply the schema — either paste `supabase/migrations/*.sql` into the SQL
   editor, or link the project and push:

   ```bash
   npx supabase link --project-ref <ref>
   npx supabase db push
   ```

4. `npm run dev`, then open http://localhost:3000/start.

Regenerate types after a schema change:

```bash
npx supabase gen types typescript --project-id <ref> --schema public \
  > src/lib/supabase/database.types.ts
```

## Identity today

There are no accounts. A player picks a username, which is upserted into
`players`, and the row id is stored in an httpOnly cookie signed with
`SESSION_SECRET`. The cookie is the whole session; a tampered cookie fails the
HMAC check and is treated as signed out.

This means a username is a handle, not an account: anyone who types someone
else's username becomes that player. That is deliberate until auth lands, so
don't put anything private behind it.

## First-run onboarding

After claiming a username a player walks through three steps, all under
`/onboarding`:

1. `goal` — what they want (`increase_pace` or `target_pace`) plus the pace they
   care about, stored as whole seconds per km on `players`.
2. `prompts` — how chatty the coach is, `prompt_frequency` 1–5.
3. `voice` — one or more audio clips of people they love or hate.

Progress is derived from the player row by `nextOnboardingStep()`
(`src/lib/onboarding/steps.ts`) rather than tracked separately, so a signup
abandoned halfway resumes where it stopped and `/dashboard` bounces back into
onboarding until `onboarding_completed_at` is set. The voice step can be skipped.

### Voices and ElevenLabs

`POST /api/voices` takes multipart form data — a route handler rather than a
server action because clips run past the 1MB action body cap. The sample is
stored in the private `voice-samples` bucket, the `player_voices` row is written
first, and only then is ElevenLabs asked for an instant clone, so an ElevenLabs
outage never loses an upload; `status` says what happened (`uploaded` when no
`ELEVENLABS_API_KEY` is set, `ready` with a `elevenlabs_voice_id`, or `failed`
with the reason). A successful clone becomes the player's active voice, and a
partial unique index keeps at most one active voice per player.

## Security model

- RLS is enabled on every table and **no policies exist**, so the publishable
  and anon keys can read and write nothing. Data flows only through the server.
- `createServiceClient()` (secret key) is `import "server-only"`, as are the
  session and player modules, so none of it can be pulled into a Client
  Component.
- Route handlers and server actions resolve the player themselves and scope
  every query by `player_id`; ids are never taken from the request body.
- Derived values (run points) are computed server-side.
- The `voice-samples` bucket is private, so uploaded clips are only reachable
  through the server.

## Adding accounts later

The seam is `getCurrentPlayer()` in `src/lib/player/current.ts` — it is the only
code that answers "who is this request". To switch to Supabase Auth:

1. Install `@supabase/ssr`, add a cookie-based client and a `proxy.ts` that
   refreshes the session (Next.js 16 renamed middleware to proxy).
2. In `getCurrentPlayer()`, verify the access token with
   `supabase.auth.getClaims()` and look the player up by `players.auth_user_id`
   instead of the cookie id.
3. Set `auth_user_id` when a signed-in user claims a username, then add the
   `auth.uid()` RLS policies sketched at the bottom of the migration.
4. Replace `/start` with `/login` and `/signup`; `requirePlayer()` already
   redirects there for anything protected.

Callers (`/dashboard`, `/api/runs`, `/api/players/me`) need no changes.

## API

| Route | Method | Notes |
| --- | --- | --- |
| `/api/players/me` | GET | Current player, or 401 |
| `/api/runs` | GET | `{ runs, limit, runCount, totalPoints }` — newest first, `?limit=` 1–200 (default 20); the totals cover every run |
| `/api/runs` | POST | `{ mode, distanceM, durationS, startedAt? }`, validated with zod |
| `/api/voices` | GET | Current player's voices, newest first |
| `/api/voices` | POST | Multipart `label`, `sentiment`, `sample`; uploads and clones |
