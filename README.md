# Peanut Butter

Landing page for Peanut Butter, a voice-led pace coach built around one goal: be your personal best. Set an aim pace before you head out and two voices react to your pace, splits and location.

- **Arch-enemy** – drop under your aim pace and they close in on you.
- **Loved one** – hold your pace and they carry you to the PB.

The page is a prototype: the voice showcase replays scripted lines, the pace timeline is a static mock and the waitlist form does not persist anything.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in Supabase URL, secret key and session secret
npm run dev
```

Open http://localhost:3000 for the landing page, or http://localhost:3000/start
for the app itself. See [docs/backend.md](docs/backend.md) for the Supabase
setup, the schema and how accounts get added later.

## Scripts

- `npm run dev` – dev server
- `npm run build` – production build
- `npm start` – serve the production build
- `npm run lint` – ESLint
- `npx tsc --noEmit` – typecheck (run a build first so route types are generated)

## Project structure

- `src/app` – routes, root layout and global styles
- `src/components/landing` – landing sections (`ModeShowcase`, `PaceTimeline`, `WaitlistForm`)
- `src/components/ui` – shadcn/ui primitives
- `src/lib/player`, `src/lib/runs`, `src/lib/supabase` – server-side player identity, runs and Supabase access
- `src/lib/utils.ts` – shared helpers (`cn`)

## Stack

Next.js (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui and Radix UI, Lucide icons, Supabase.

## Adding components

```bash
npx shadcn@latest add <component>
```
