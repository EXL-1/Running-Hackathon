# Testing Peanut Butter / Runaway

A test script for the whole team, including people who do not run. You do not
need to be able to run to test this — walking, cycling, driving as a passenger
or a simulated GPS route all produce the numbers we care about.

The repo holds two clients on one backend:

| Client | Path | What to test |
| --- | --- | --- |
| Next.js web app | repo root | landing page, onboarding, dashboard, API |
| Expo app (iOS/Android) | `mobile/` | native GPS pace and distance tracking |

---

## 1. Test the native GPS screen on your phone (no laptop needed)

This is the priority test right now: does pace and distance look correct on a
real phone? The Expo app has one screen for this, `/gps-test`, and it writes
**nothing** to the database — the session lives in memory and disappears when
you close the app.

### Setup (2 minutes)

1. Install **Expo Go** on your phone (App Store / Play Store).
2. Ask whoever is hosting the dev server (a teammate's laptop, or Devin's VM) to
   run:
   ```bash
   cd mobile
   npm install          # first time only
   npx expo start --tunnel
   ```
   `--tunnel` means your phone does **not** need to be on the same Wi-Fi as the
   server — it works over mobile data, outdoors, mid-run.
3. They send you the `exp://….exp.direct` link (or a QR code). Open the link on
   your phone, or scan the QR with the Camera app (iOS) / Expo Go (Android).
4. The app loads in Expo Go. Tap **Open GPS test**.

The dev server has to stay running while you test. Code changes reload on your
phone within a couple of seconds, so bugs can be fixed while you stand there.

### The test

1. Go outside, or next to a window with a clear view of the sky. GPS is bad
   indoors.
2. Tap **Start** and allow the location permission when iOS/Android asks.
3. Wait until `Signal:` says `Strong` or `Usable` and the fix count is climbing.
4. Keep the screen on and the app in the foreground, then move for at least
   3–5 minutes. Walking is fine.
5. Tap **Stop**.

### What should happen

- [ ] Permission prompt appears the first time, and only the first time.
- [ ] `Time` starts counting up the moment you press Start.
- [ ] `Distance` stays at `0.00` while you stand still (GPS jitter is filtered
      out — small wobbles must not add distance).
- [ ] `Distance` climbs steadily once you move, and roughly matches reality.
      Sanity checks: a standard running track lap is 0.40 km; compare against
      Strava/Apple Fitness/Google Maps for the same route if you have it.
      Anything within ~5% is fine.
- [ ] `Pace (session average)` settles on a believable min/km once you have
      moved 100 m or so. Walking is usually 8:00–13:00, easy running 5:00–7:00.
      It should not jump wildly every second.
- [ ] `Live pace` moves around more than the average (it comes from the phone's
      instantaneous speed) and shows `--:--` when you stop moving.
- [ ] `GPS accuracy` shows a number in metres, usually ±5 m to ±15 m outdoors.
- [ ] **Stop** freezes every number. They do not keep counting.
- [ ] **Reset session** puts everything back to zero.
- [ ] Nothing new appears in the database or on the web dashboard — this screen
      must not save anything.

### Known limitation: locking the screen

In Expo Go the app only tracks while it is **open and in the foreground**. If
you lock the phone or switch apps, iOS stops giving out location and distance
will stall. That is expected today, not a bug. Background tracking needs a
custom development build (`eas build --profile development`), which requires an
Apple Developer account for iOS. Test with the screen on for now.

### If you cannot go outside

Report `Signal: Too weak` plus the accuracy value rather than the distance —
indoor fixes are deliberately ignored above ±30 m, so distance staying at 0.00
indoors is correct behaviour.

---

## 2. Test without leaving your desk (simulated GPS)

Anyone with a Mac (Xcode) or Android Studio can fake a moving GPS route.

**iOS Simulator** (Mac only):

```bash
cd mobile
npx expo start          # then press "i" to open the simulator
```

In the simulator menu bar: **Features → Location → Freeway Drive**. The
simulator then "drives" a route, so the GPS test screen fills in distance and
pace with no movement on your part. Note the drive is at car speed, so the pace
will read very fast (~0:30/km) — you are checking that the numbers *move
sensibly and consistently*, not that the pace is realistic.
**Features → Location → Custom Location…** sets a single fixed point, useful for
checking that a stationary device adds no distance.

**Android emulator**: **Extended controls (…) → Location → Routes**, draw a
route, set a speed, press **Play route**.

For a realistic run, import a GPX file: in the Android emulator use
**Location → Load GPX/KML**; in the iOS Simulator use
**Debug → Simulate Location → Add GPX File to Project**.

---

## 3. Test the web app

The web app remains the landing page, onboarding and dashboard.

```bash
npm install
cp .env.example .env.local   # SUPABASE_URL, SUPABASE_SECRET_KEY, SESSION_SECRET
npm run dev
```

- [ ] http://localhost:3000 — landing page renders, no console errors, layout
      holds up at phone width (dev tools → iPhone).
- [ ] http://localhost:3000/start — claiming a username sends you into
      onboarding.
- [ ] Onboarding: goal + target pace → prompt frequency → voice. Refuses
      nonsense values (empty username, a 1:00/km target pace) with a readable
      message rather than a crash.
- [ ] http://localhost:3000/dashboard — shows your player, lifetime totals and
      run history. With no runs yet it should say so instead of showing blanks
      or `NaN`.
- [ ] Reload the page: you are still signed in as the same player.

Checks that must pass before any PR merges:

```bash
npm run lint
npm run build
npx tsc --noEmit          # after a build, so route types exist
cd mobile && npm run typecheck
```

---

## 4. Test the API directly (no UI)

Useful for backend-only bugs. The native app authenticates with a bearer token
instead of the browser cookie:

```bash
# 1. get a token for a username
curl -s localhost:3000/api/auth/session \
  -H 'content-type: application/json' \
  -d '{"username":"tester"}'
# -> { "token": "...", "player": {...}, "nextStep": "goal" }

TOKEN=... # copy the token

# 2. read the current player
curl -s localhost:3000/api/players/me -H "authorization: Bearer $TOKEN"

# 3. set onboarding values
curl -s -X PATCH localhost:3000/api/players/me \
  -H "authorization: Bearer $TOKEN" -H 'content-type: application/json' \
  -d '{"goalKind":"beat_pb","targetPaceSPerKm":300}'

# 4. list runs and lifetime totals
curl -s localhost:3000/api/runs -H "authorization: Bearer $TOKEN"
```

- [ ] A missing or tampered token returns `401`, never someone else's data.
- [ ] Invalid bodies return `422` with field errors, not `500`.

---

## 5. Reporting a bug

Include:

1. Which client (web / Expo Go on iPhone / Expo Go on Android) and OS version.
2. What you did, what you expected, what happened.
3. For GPS bugs: the `GPS accuracy`, the fix count, and the distance/pace/time
   shown, plus whether you were indoors, walking or running. A screenshot of the
   screen is ideal.
4. Whether the phone screen was on and the app in the foreground the whole time.
5. For the web app: the browser console output.
