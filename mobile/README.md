# Runaway (Expo app)

The native client. Owns the run experience — GPS tracking, pace, distance and
(later) voice coaching — against the same Supabase-backed API as the Next.js app
in the repo root.

```bash
npm install
npx expo start            # same Wi-Fi as the phone
npx expo start --tunnel   # phone on mobile data / different network
```

Open the printed link in **Expo Go**. See [../TESTING.md](../TESTING.md) for the
full test script.

## Screens

- `app/index.tsx` – entry point, links to the GPS check.
- `app/gps-test.tsx` – standalone foreground GPS session: Start/Stop, live pace,
  distance, elapsed time and accuracy. Writes nothing to the database.

## Layout

- `app/` – expo-router file routes.
- `src/useRunTracker.ts` – `expo-location` subscription, session state.
- `src/theme.ts` – colours shared with the web app's dark theme.
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
