# <🏯 Jodo> — Build visually. Own the code.

Jodo is a website builder where the visual canvas and the code are the same artifact:
drag-and-drop like Shopify, edit code like VS Code, ship to GitHub + a live URL, with an
AI agent that can read and edit the project.

See [JODO-Architecture-Plan.md](./JODO-Architecture-Plan.md) for the full technical blueprint.

## Status — Phase 0

- [x] Architecture plan
- [x] Brand (logo in `logo/`)
- [x] Next.js + TypeScript + Tailwind scaffold with neon purple design system
- [x] Landing page + dashboard shell
- [x] Supabase auth + schema (needs a real Supabase project — see below)
- [ ] Visual builder canvas (Phase 1)
- [ ] Visual backend designer (Phase 3, see architecture plan §5.1)

## Development

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase project's URL + anon key
npm run dev   # http://localhost:3000
```

Without `.env.local` filled in, `/login`, `/signup`, and `/dashboard` show a
"Supabase isn't connected yet" screen instead of crashing — the rest of the
app (landing page) works either way.

### Connecting Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Project Settings → API → copy the **Project URL** and **anon public key** into `.env.local`.
3. SQL Editor → paste the contents of [`supabase/migrations/20260703120000_init_schema.sql`](./supabase/migrations/20260703120000_init_schema.sql) → Run.
4. Restart `npm run dev`. Sign up at `/signup` — by default Supabase requires email confirmation before the first login (toggle that off in Authentication → Providers → Email if you want instant local testing).

## Stack

Next.js 14 · React 18 · TypeScript · Tailwind CSS · Supabase (planned) · Claude API (planned)
