# Running Hackathon

Web app built with Next.js (App Router), TypeScript, Tailwind CSS v4 and shadcn/ui.

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

- `npm run dev` – dev server (Turbopack)
- `npm run build` – production build
- `npm start` – serve the production build
- `npm run lint` – ESLint

## Project structure

- `src/app` – routes, layouts and global styles
- `src/components/ui` – shadcn/ui components
- `src/lib/utils.ts` – shared helpers (`cn`)

## Adding components

```bash
npx shadcn@latest add <component>
```
