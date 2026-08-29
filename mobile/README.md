# Peanut Butter (Expo app)

_Spread the pace._ The native client. Owns the run experience — GPS tracking,
pace, distance and (later) voice coaching — against the same Supabase-backed API
as the Next.js app in the repo root.

```bash
npm install
npx expo start            # same Wi-Fi as the phone
npx expo start --tunnel   # phone on mobile data / different network
```

Expo SDK 54. Open the printed link in **Expo Go**. See
[../TESTING.md](../TESTING.md) for the full test script.

## Username, not login

First launch asks for a username and nothing else: `POST /api/auth/session`
creates the player row (or reuses it) and returns a signed token, which the app
keeps in `expo-secure-store` and sends as `Authorization: Bearer` on every
request (`src/api.ts`). There is no password, so a username is a handle rather
than an account — anyone who types it becomes that player.

`src/player.tsx` holds the player and their run totals, and is the only place
screens talk to the API from: coach choice and target pace go to
`PATCH /api/players/me`, a finished run to `POST /api/runs`, and Home's personal
best comes from `GET /api/runs`. Live GPS stays in memory during the run and is
saved once, on **Finish**.

Point the app at an API the phone can reach — `localhost` is the phone itself:

```bash
EXPO_PUBLIC_API_URL=http://192.168.1.20:3000 npx expo start
```

The API sends no CORS headers, so `--web` only works if the bundle and the API
share an origin — put a reverse proxy in front of both when testing in a
browser. Native builds are unaffected.

## Coach voices

Clips come from the same `EXPO_PUBLIC_API_URL` app's `/api/coach-voice`, which
holds the ElevenLabs key. Choosing a coach downloads that coach's clips into the
cache directory (`src/voice.ts`) so a run can narrate without the network, and
falls back to streaming the URL when a clip is missing.

Only the selected voice is heard during a run; GPS pace against the aim pace
decides which of its lines fires (`shared/voices.ts`, `src/useCoachVoice.ts`):

| Pace state    | When                                        | Reads as                                                                |
| ------------- | ------------------------------------------- | ----------------------------------------------------------------------- |
| `start`       | before the first clean fix                  | the voice arriving — "Move. Now." / "Oh, you run now?"                   |
| `behind`      | rolling pace >10s/km slower than aim        | rivals taunt and are mixed closer, allies coax                          |
| `ahead`       | at or faster than aim                       | rivals concede grudgingly, allies are delighted                          |
| `pb-in-sight` | at or faster than the personal best pace    | the one push line per voice                                             |
| `finish`      | on the summary screen                       | the verdict                                                             |

A prompt fires the moment you cross the aim pace, then at most every ~45s while
the state holds, cycling through that state's lines so nothing repeats
back-to-back.

## Screens

The screens from the design brief, in flow order:

- `app/index.tsx` – 00 Launch. One-shot mark/wordmark/tagline animation, then
  Home, or Username on a phone with no stored player.
- `app/username.tsx` – pick the username everything is tracked against.
- `app/home.tsx` – 01 Home. Personal Best pace and a single `Run` action.
- `app/permission.tsx` – 02 Location primer, shown once before the OS prompt.
- `app/coach.tsx` – 03 Choose your coach (Mum, The Ex, Drill Sergeant, Classic Coach).
- `app/baseline.tsx` – 04 Baseline setup: faster/slower/on target, coach, Strava toggle.
- `app/run.tsx` – 05 Active run: pace trace, rolling pace, target zone, coach caption.
- `app/summary.tsx` – 06 Summary: distance, time, average pace, coach verdict.

## Brand

- `src/theme.ts` – Peanut Butter, Roast, Jam, Jam Bright, Toast, Fresh tokens
  (dark palette active; the light Toast palette is exported alongside).
- `src/components/JarLogo.tsx` – the jam-jar mark, composed from views.
- Type: Baloo 2 (display), IBM Plex Sans (body), IBM Plex Mono (data), bundled
  via `@expo-google-fonts/*` and loaded in `app/_layout.tsx`.

The MapKit route polyline specced for the active-run screen is not drawn yet —
it needs a map module in a development build; the pace trace panel stands in.

## Layout

- `app/` – expo-router file routes.
- `src/components/ui.tsx` – Screen, Title, Body, Eyebrow, Chip, Button.
- `src/api.ts` – API client and the stored session token.
- `src/player.tsx` – `usePlayer()`: the player, their runs totals and personal
  best, and every write back to the API.
- `src/session.ts` – in-memory run setup (primer seen, baseline answer).
- `src/voice.ts` – coach clip URLs and caching, via `expo-file-system`.
- `src/useRunTracker.ts` – `expo-location` subscription, session state.
- `src/theme.ts` – brand colour and type tokens.
- `../shared/tracking.ts` – haversine distance, fix filtering and pace maths,
  shared with the web app (aliased as `@shared/*`, watched by `metro.config.js`).

## Background location

`app.json` already declares the iOS `location` background mode and the Android
foreground service, but **Expo Go cannot run background location on iOS**. A
development build is required:

```bash
eas build --profile development --platform ios      # needs an Apple Developer account
eas build --profile development --platform android  # free, install the APK
```

Until then treat tracking as foreground-only: screen on, app open.

## Scripts

- `npm start` / `npm run tunnel` – dev server
- `npm run typecheck` – `tsc --noEmit`
