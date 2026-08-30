# Peanut Butter (Expo app)

_Spread the pace._ The native client. Owns the run experience — GPS tracking,
pace, distance and (later) voice coaching — against the same Supabase-backed API
as the Next.js app in the repo root.

```bash
npm install
npx expo start            # same Wi-Fi as the phone
npx expo start --tunnel   # phone on mobile data / different network
```

Open the printed link in **Expo Go**. See [../TESTING.md](../TESTING.md) for the
full test script.

## Coach voices

Clips come from the Next.js app's `/api/coach-voice`, which holds the ElevenLabs
key, so point the app at it — a phone cannot reach the host's `localhost`:

```bash
# Dev — replace with your machine's LAN IP
EXPO_PUBLIC_API_URL=http://192.168.1.20:3000 npx expo start

# Production — point at the deployed Next.js API on Vercel
EXPO_PUBLIC_API_URL=https://peanutbutter.fitness npx expo start
```

Choosing a coach preloads that coach's clips (`src/voice.ts`) so a run can
narrate without the network.

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

- `app/index.tsx` – 00 Launch. One-shot mark/wordmark/tagline animation, then Home.
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
- `src/session.ts` – in-memory run setup (coach, primer seen, baseline answer).
- `src/voice.ts` – coach clip URLs and preloading, via `expo-audio`.
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
