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

## Security model

- RLS is enabled on every table and **no policies exist**, so the publishable
  and anon keys can read and write nothing. Data flows only through the server.
- `createServiceClient()` (secret key) is `import "server-only"`, as are the
  session and player modules, so none of it can be pulled into a Client
  Component.
- Route handlers and server actions resolve the player themselves and scope
  every query by `player_id`; ids are never taken from the request body.
- Derived values (run points) are computed server-side.

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
| `/api/runs` | GET | Current player's runs, newest first |
| `/api/runs` | POST | `{ mode, distanceM, durationS, startedAt? }`, validated with zod |
