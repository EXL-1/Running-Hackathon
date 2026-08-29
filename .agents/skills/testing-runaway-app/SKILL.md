---
name: testing-runaway-app
description: How to run and end-to-end test the Peanut Butter / Runaway Next.js + Supabase app locally (username session, run logging, API routes, test-data cleanup).
---

# Testing the Peanut Butter (Runaway) app locally

## Run it
- `npm install`, then `npm run dev` (http://localhost:3000). If port 3000 says
  "Another next dev server is already running", reuse the existing server on
  3000 instead of starting a second one — `next dev` will otherwise fall back to
  3001 and refuse to serve.
- Requires `.env.local` with `SUPABASE_URL`, `SUPABASE_SECRET_KEY`,
  `SESSION_SECRET` (see `.env.example` / `docs/backend.md`). Schema lives in
  `supabase/migrations/`.

## Auth model (no accounts)
- `/start` → type a username → server action `claimUsername` upserts a row in
  `players` and sets the httpOnly cookie `runaway_player = <playerId>.<HMAC-SHA256
  base64url of playerId with SESSION_SECRET>` (`src/lib/player/session.ts`).
- Any protected page/route calls `getCurrentPlayer()`; unsigned/tampered cookie
  ⇒ treated as signed out (`/dashboard` redirects to `/start`, APIs return 401).
- "Switch player" on `/dashboard` clears the cookie. Re-typing the same username
  restores the same player row and its runs.

## Testing API routes without the browser
Build the cookie yourself instead of scraping the browser (it is httpOnly):

```bash
set -a && . ./.env.local && set +a
PID=<player uuid>
SIG=$(node -e 'const{createHmac}=require("crypto");console.log(createHmac("sha256",process.env.SESSION_SECRET).update(process.argv[1]).digest("base64url"))' $PID)
curl -s -X POST localhost:3000/api/runs -H "Cookie: runaway_player=$PID.$SIG" \
  -H 'content-type: application/json' -d '{"mode":"chase","distanceM":1234,"durationS":600}'
```
Expected: 201 with server-derived `points = round(distanceM/100)`; 422 on
invalid body; 401 without/with a bad cookie.

## Browser tips
- The number inputs on `/dashboard` append text rather than replacing: click the
  field, `Control+a`, `Delete`, then type the new value, and re-check the DOM.
- Zero/negative distance is blocked by native HTML `min=1` ("Value must be
  greater than or equal to 1.") before the server action runs; assert the totals
  in the header did not change, and cover the server-side rejection via
  `POST /api/runs` with `distanceM: -1` (expect 422).

## Cleaning up test data
Use the Supabase REST API with the secret key (RLS blocks anon keys):

```bash
curl -s "$SUPABASE_URL/rest/v1/players?username=like.qa_run%25&select=id,username" \
  -H "apikey: $SUPABASE_SECRET_KEY" -H "Authorization: Bearer $SUPABASE_SECRET_KEY"
curl -s -X DELETE "$SUPABASE_URL/rest/v1/runs?player_id=eq.$PID" -H "apikey: $SUPABASE_SECRET_KEY" -H "Authorization: Bearer $SUPABASE_SECRET_KEY"
curl -s -X DELETE "$SUPABASE_URL/rest/v1/players?id=eq.$PID" -H "apikey: $SUPABASE_SECRET_KEY" -H "Authorization: Bearer $SUPABASE_SECRET_KEY"
```
Delete runs before players (FK). Use unique usernames like `qa_run_<epoch>` so
cleanup queries are safe.

## Devin Secrets Needed
- `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `SESSION_SECRET` (in `.env.local`).
