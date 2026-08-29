# Running App — "Chased by your Ex" / "Cheered by your Mum"

Product + technical plan. Written 2026-08-29.

---

## 1. The product in one paragraph

A running app with a **voice coach that isn't generic**. You pick a mode before the run:

- **Ex Mode** — a panicked, adrenal, "GO GO GO, they're gaining on you" narrative. The conceit is that your ex is behind you. Voice lines are taunting, funny, slightly unhinged, and escalate with your pace. Chase mechanics: a virtual pursuer whose distance is a function of your actual pace vs. a target pace.
- **Mum Mode** — warm, proud, unconditional encouragement in a mum's voice. Lower intensity, slower cadence, never shouts, tells you it's fine to walk, remembers your last run ("you did 5k on Tuesday, love").

Both are the *same engine* with a different persona pack: voice + line bank + trigger rules + intensity curve. That framing is the single most important architectural decision — everything below assumes personas are data, not code.

---

## 2. What's actually hard (read this first)

Ranked by risk, not by build order.

| # | Risk | Why it's hard | Mitigation (detail in later sections) |
|---|---|---|---|
| 1 | **Sourcing the voices, legally** | "Your ex's voice" and "your mum's voice" are, by default, *cloning a real third party*. ElevenLabs requires consent + voice-captcha verification for cloning, and several jurisdictions are actively legislating (Tennessee ELVIS Act; the NO FAKES Act in the US Senate; EU/France personality rights; UK is a patchwork and weaker). A consumer feature where users upload "my ex's voice" is a lawsuit and an App Store rejection waiting to happen. | Ship **archetype voices** (cast actors / Voice Design) at launch. Real-person cloning only via a **double-opt-in consent flow** where the voice owner records the consent themselves. See §6. |
| 2 | **Audio while the phone is in a pocket, screen off** | Mobile web can't do this. On iOS a standalone PWA historically stops audio when backgrounded, `AudioContext` suspends when the page is hidden, and `watchPosition` stops firing when backgrounded. There is no background geolocation on the web. | Native shell (Capacitor or React Native/Expo) with background-audio + background-location entitlements. See §4. |
| 3 | **Latency & cost of live TTS mid-run** | Real-time synth over flaky cellular while running is the worst possible network environment. Flash v2.5 is ~75 ms *model inference*, but that excludes network round trip. | **Pre-generate and cache** ~95% of lines on-device; live-synth only the rare personalised line. See §5. |
| 4 | **Not being annoying by run #3** | A hype voice that repeats is instantly grating. This kills the app more reliably than any bug. | Line bank of 300–600 variants per persona, weighted no-repeat sampling, intensity curve, mandatory silence windows. See §7. |
| 5 | **Ex Mode punching down** | "Running from your ex" can land as funny or as trauma. Some users are running from an actual abuser. | Persona is a cartoon, never cruel; no body/appearance/worth insults; onboarding tone-check; instant switch to Mum Mode; hard content rules in §8. |

---

## 3. Recommended stack (opinionated)

**Client**
- **React + TypeScript + Vite** for the app UI.
- **Capacitor 6** to ship it as a real iOS/Android app while keeping one web codebase. (React Native/Expo is the alternative — pick RN if you expect heavy native work; pick Capacitor if the team is web-first and you want a web demo too.)
- `@transistorsoft/capacitor-background-geolocation` (paid, best-in-class, motion-detection based battery management) or the free `@capacitor-community/background-geolocation` for the MVP.
- Native audio playback via `@capacitor-community/native-audio` / AVAudioSession + Android media foreground service so audio ducks over Spotify rather than stopping it.
- Zustand for run state; the run engine itself is plain TS so it's unit-testable without a device.

**Backend**
- **Next.js (API routes) or FastAPI** on Fly.io/Railway — thin. It exists to (a) hold the ElevenLabs key, (b) serve line-bank manifests, (c) sync runs.
- **Postgres (Supabase)** — users, runs, personas, line banks, consent records.
- **S3/R2 + CDN** for the audio line bank (pre-rendered mp3/opus).

**Voice**
- **ElevenLabs** for everything voice:
  - `eleven_v3` for **pre-generated** lines — it supports inline audio tags (`[shouts]`, `[whispers]`, `[laughs]`, `[out of breath]`) which is exactly what these personas need. ~$0.10 / 1k chars.
  - `eleven_flash_v2_5` for **live** synth — ~75 ms inference, ~$0.05 / 1k chars, 32 languages.
  - **Voice Design** (`POST /v1/text-to-voice/design` → `/v1/text-to-voice`) to *invent* archetype voices from a text prompt. This is the legal escape hatch: a voice that sounds like "a sardonic 30-something ex" but belongs to no real human.
  - **Instant Voice Cloning** (~1 min of audio) for the consented real-mum path; **Professional Voice Cloning** (30 min–3 h) only for flagship/celebrity partner voices.
  - TTS **WebSocket** (`/v1/text-to-speech/{voice_id}/stream-input`) if/when we do live streaming.
- Do **not** reach for the Agents Platform initially — it's for conversational agents. We're doing one-way triggered playback, which is a much simpler and cheaper problem.

**Analytics / ops**: PostHog (events + session replay on the web build), Sentry.

---

## 4. Why this can't be a pure web app (and what to do about it)

Hard mobile-web limits, all verified:

- `AudioContext` suspends and JS timers freeze when the page is hidden.
- Standalone PWAs on iOS have a long history of audio stopping the moment the app leaves the foreground (a WebKit/iOS bug tracked for years; partially fixed circa iOS 15.4 but not something to bet a product on).
- `navigator.geolocation.watchPosition` stops firing in the background. There is **no** background geolocation for web.
- Screen Wake Lock only helps while the page is foregrounded; it does nothing if the user locks the phone.

Practical path:
1. **Week 1–2 demo**: pure web PWA, phone in hand, screen on, wake lock held. Good enough for a hackathon/pitch and for tuning the persona writing.
2. **Real product**: Capacitor shell with `UIBackgroundModes: audio` + Core Location background mode on iOS, and a location + media foreground service on Android.

---

## 5. Audio architecture — the "pre-render, don't stream" pattern

The default instinct is "call ElevenLabs when we need a line." Don't. Runners are on cellular, moving, often in dead zones, and a 2-second stall ruins the illusion.

**Tier 1 — Baked line bank (95% of playback).**
For each persona × each trigger type × ~20 variants, pre-render audio offline in a build step, store as mp3/opus on the CDN, and **download the whole pack on Wi-Fi before the run**. A 500-line pack at ~3 s each ≈ 25 MB as 64 kbps opus. Playback is a local file read: 0 ms, works in a tunnel.

**Tier 2 — Personalised slots (~5%).**
Lines with your name, your distance, your split. Two options:
- *Stitching*: bake number/name fragments and concatenate ("nice one … Sarah … that's … three … kilometres"). Cheap, robust, sounds slightly robotic at the seams.
- *Pre-run generation*: at run start we know the user's name, goal, and last run, so synth the ~15 personalised lines **before** the first step and cache them. This is the sweet spot — natural prosody, zero mid-run network dependency.

**Tier 3 — Live streaming (stretch).**
Flash v2.5 over the TTS WebSocket for genuinely reactive lines (weather, a live leaderboard rival, a friend's cheer sent from the app). Always guard with a local fallback line and a 1.5 s timeout.

**Mixing rules**
- Duck the user's music to ~20% over 300 ms, speak, restore over 600 ms. On native this is a proper `AVAudioSession` `.duckOthers` / Android `AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK`.
- Queue, never overlap. Priority levels: safety/system > milestone > coaching > flavour. Drop stale flavour lines rather than backlogging.
- Hard rule: **max one line per 25 s**, and never during the first 20 s of a run.

**Cost sanity check.** Pre-rendering a 600-line persona pack at ~120 chars/line = 72k chars ≈ **$7 at v3 pricing** — one-off, per persona, amortised across every user. Live per-run personalisation of 15 lines ≈ 1.8k chars ≈ **$0.09 at v3 / $0.045 at Flash per run**. Voice economics are a rounding error compared to CAC; the risk is engineering complexity, not spend.

---

## 6. Sourcing the voices — the tricky bit, solved in three tiers

### Tier A — Archetype cast (launch here)
Ship 6–8 *characters*, not real people:
- Ex Mode: "The Smug One", "The Dramatic One", "The One Who Still Has Your Hoodie", "The Gym Bro Ex".
- Mum Mode: "Proud Mum", "Worried Mum", "Sarcastic Northern Mum", "Nan".

Two ways to build each:
1. **ElevenLabs Voice Design** — prompt-to-voice, no human involved, no likeness risk at all. Fastest route: `design()` with a description, audition the previews, promote the winner with `text_to_voice.create()`. Do this on **day one**; you can have a full cast in an afternoon.
2. **Cast real voice actors** and clone with their signed consent (Fiverr/Voice123/backstage; £150–£500 per voice for a full buyout). Higher quality and much better comic timing than a designed voice, and the actor can also record the *ad-libs* that make the persona feel alive. Use PVC (30 min+ of audio) for your two flagship voices.

**Recommendation:** Voice Design for the prototype this week; cast 2 real actors (one ex, one mum) for launch, because the writing/performance is where the magic is, and a designed voice reading great lines still sounds like a robot reading great lines.

### Tier B — "Bring your own mum" (the killer feature, gated)
This is the emotional payload of the product and worth building properly:
- User invites Mum from inside the app → she gets a link → **she** records ~1–3 minutes of a supplied script on her own phone → **she** ticks the consent box and completes the ElevenLabs voice-captcha verification → we create an IVC voice **owned by her**, licensed to her child's account.
- Store an immutable consent record: who, when, IP, the script, the recording, the scope of use, and a one-tap **revoke** that deletes the voice from ElevenLabs and purges cached audio.
- Never allow "upload an audio file of someone" — that's the abuse vector, and it's the exact pattern ElevenLabs' verification exists to prevent.

### Tier C — "Bring your own ex" (probably: never)
Cloning an ex-partner's voice without their participation is non-consensual voice cloning. It is the single fastest way to get the app pulled, and it's the use case a journalist will write about. Two safe substitutes:
- **Name-only personalisation**: the archetype voice says *their* name. 90% of the joke, 0% of the risk.
- **Consented "rival" mode**: friends opt in to record taunt packs for each other. Same social mechanic, fully consensual, and it's a viral loop.

### Getting the *writing* right
Voices are 40% of it; scripts are 60%. Budget for a comedy writer for a day. Structure the bank as:
`{persona, trigger, intensity 1-5, text_with_audio_tags, variants[]}` — e.g.
`[shouts] They just posted a story from your route. GO. [laughs] GO!`

---

## 7. The run engine (the bit that makes it feel alive)

Inputs each tick (1 Hz): GPS position, instantaneous + rolling pace, cadence (accelerometer), elapsed time, distance, HR if a Bluetooth strap is paired.

**Ex Mode — the Pursuer.** Maintain a virtual chaser at distance `d`. `d` grows when your pace beats target, shrinks when it drops. Map `d` to intensity 1–5 and to a spatial audio cue (footsteps panned behind you, closer = louder — this alone is worth more than 100 voice lines). Getting caught = a comedy line + a 60 s "escape" interval challenge, never a fail state.

**Mum Mode — the Companion.** No jeopardy. Triggers on effort, not performance: sustained climbs, first km, halfway, "you've slowed down, that's alright". Explicitly praises walking. Intensity never exceeds 3.

**Trigger types (shared):** run start, first 500 m, each km, pace up/down inflection, hill detected (elevation delta), halfway, negative split achieved, personal best, final 500 m, finish, plus randomised flavour lines on a Poisson timer.

**Anti-annoyance:** weighted sampling with a 20-line recency window, per-line global cooldown, a "quiet mode" slider (Chatty / Normal / Only when it matters), and log a `line_skipped` event whenever the user hits mute right after a line — that's your dataset for pruning bad lines.

---

## 8. Safety, tone, and legal checklist

- Consent records for every cloned voice, with revocation that propagates to ElevenLabs and to cached audio.
- Content rules for Ex Mode: no comments on body/weight/appearance, no sexual content, no "you'll die alone" cruelty, no naming real third parties in generated text unless the user typed the name themselves. Ex Mode is *slapstick jeopardy*, not abuse.
- Onboarding line: "This is a joke persona. Switch to Mum Mode any time." One-tap persona switch mid-run.
- Safety over comedy: never encourage running through traffic, never tell someone to keep going through pain, and cap intensity escalation.
- GDPR: voice recordings and location traces are personal data; location is arguably sensitive. Data minimisation, explicit purpose, export + delete, EU data residency if you have EU users.
- Watermarking/traceability: ElevenLabs can trace generated audio back to the generating account — useful in a dispute, and worth stating publicly in a trust page.
- App Store: expect review questions on the voice-cloning flow. Have the consent UX screenshotted and ready.

---

## 9. Build plan

**Phase 0 — Proof of the feeling (2–3 days).**
Web-only. Fake the GPS with a simulated pace slider. Voice Design one ex voice + one mum voice. Write 40 lines. Run it on a treadmill with headphones. *Decision gate: is it funny/moving on run #2?* If no, no amount of engineering saves it.

**Phase 1 — Real run, phone in hand (1–2 weeks).**
Real geolocation + Kalman-smoothed pace, the trigger engine, pre-rendered line bank of ~150 lines per persona, music ducking, run summary screen. PWA, wake lock, screen on.

**Phase 2 — Native shell (1–2 weeks).**
Capacitor, background location + background audio, offline pack download, run history and sync, Apple Health / Google Fit / Strava export (Strava export is the growth channel — the post-run share card is the ad).

**Phase 3 — The Pursuer + the mum clone (2–3 weeks).**
Spatial footsteps, chase dynamics, the consented "invite your mum" cloning flow, per-run personalised line generation.

**Phase 4 — Depth.**
More personas (a licensed celebrity ex is an obvious partnership), friend taunt packs, weekly narrative arcs, leaderboards, subscription.

Realistically: a compelling demo in a few days; a shippable v1 in about six focused weeks.

---

## 10. Open questions for you

1. **Web app or app-store app?** The plan above says "web codebase, native shell". If it must stay pure web, we lose screen-off running and the product changes shape (treadmill/foreground-only).
2. **Cast real actors, or ship Voice Design voices?** Cost vs. comic timing.
3. **How far do we go on "your actual mum"?** It's the most emotionally powerful feature and the biggest compliance surface.
4. **Monetisation** — free app with paid persona packs is the obvious fit and it maps cleanly onto the per-persona TTS cost model.
5. **Do we need our own run tracking at all**, or do we ride on top of Strava/Apple Health as an "audio layer"? Building a *worse Strava* is the classic trap here.
