# <🏯 Jodo> — Build visually. Own the code.

Jodo is a website builder where the visual canvas and the code are the same artifact:
drag-and-drop like Shopify, edit code like VS Code, ship to GitHub + a live URL, with an
AI agent that can read and edit the project.

See [JODO-Architecture-Plan.md](./JODO-Architecture-Plan.md) for the full technical blueprint.

## Status

- [x] Architecture plan
- [x] Brand (logo in `logo/`)
- [x] Next.js + TypeScript + Tailwind scaffold with neon purple design system
- [x] Landing page + dashboard shell
- [x] Supabase auth + schema (needs a real Supabase project — see below)
- [x] Visual builder canvas v1 — drag/reorder section templates, inspector, breakpoint preview, save (Phase 1a; see "Canvas status" below)
- [ ] Generic nested-primitive canvas + two-way code sync (Phase 1b/2)
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
3. SQL Editor → run both files in `supabase/migrations/`, in filename order (`..._init_schema.sql` then `..._project_files.sql`).
4. Restart `npm run dev`. Sign up at `/signup` — by default Supabase requires email confirmation before the first login (toggle that off in Authentication → Providers → Email if you want instant local testing).

### Canvas status (Phase 1a)

The editor at `/editor/[projectId]` lets you drag or click-to-add pre-built
section templates (Navbar, Hero, Features, Text, CTA, Footer), reorder them,
edit each section's real fields in the inspector, and preview at three
breakpoints. Saving writes both `canvas.json` (the editor's own state) and a
generated `index.html` to the `project_files` table — that HTML is real,
Tailwind-CDN-based, standalone markup, matching the "code is the source of
truth" rule in the architecture plan.

This is intentionally a coarser-grained first step than the architecture
plan's long-term model (§4.3: arbitrary nested primitives — Section,
Container, Grid, Text… — with full two-way code sync). Section content is
edited through typed fields, not by nesting/resizing individual elements yet,
and sync is one-way (canvas → code) rather than two-way. Both are called out
as acceptable Phase 1 simplifications in §11 and §4.1 of the plan; the
generic primitive/nesting model is the next major increment.

## Stack

Next.js 14 · React 18 · TypeScript · Tailwind CSS · dnd-kit · Supabase · Claude API (planned)
