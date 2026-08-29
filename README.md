# Runaway

Landing page for Runaway, a running app that narrates your run in real time. Pick a voice before you head out and it reacts to your pace, splits and distance markers.

- **Chase mode** – something (or someone) is behind you; slow down and they gain on you.
- **Cheer mode** – gentle pacing tips and encouragement all the way to the finish.

The page is a prototype: the mode showcase replays scripted lines and the waitlist form does not persist anything.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Scripts

- `npm run dev` – dev server
- `npm run build` – production build
- `npm start` – serve the production build
- `npm run lint` – ESLint
- `npx tsc --noEmit` – typecheck (run a build first so route types are generated)

## Project structure

- `src/app` – routes, root layout and global styles
- `src/components/landing` – landing sections (`ModeShowcase`, `WaitlistForm`)
- `src/components/ui` – shadcn/ui primitives
- `src/lib/utils.ts` – shared helpers (`cn`)

## Stack

Next.js (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui and Radix UI, Lucide icons.

## Adding components

```bash
npx shadcn@latest add <component>
```
