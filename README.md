# ProcureChain Intelligence Hub

AI-Powered Procurement Intelligence, Market Insights & Decision Support.

This is a **standalone** platform — it does not depend on ProcureChain, but
the schema and API boundaries are designed so it can be integrated later
(shared auth model, clean lead-capture API, GoHighLevel-ready sync).

## Status: Module 1 — Foundation + Homepage

This is the first of many modules, built feature-by-feature per the project's
development approach. What's real and working in this module:

- Monorepo (pnpm workspaces): NestJS API + Next.js web app
- Auth: email/password registration & login with JWT (Google/Microsoft/
  LinkedIn OAuth are modeled in the schema but **not implemented** — no
  credentials were available; wiring them in is a small, isolated addition
  once you have OAuth app credentials for each provider)
- Lead capture: `/leads` endpoint → Postgres, with a BullMQ-backed worker
  that syncs to GoHighLevel. Until `GOHIGHLEVEL_API_KEY` /
  `GOHIGHLEVEL_LOCATION_ID` are set, leads are stored locally and marked
  `SYNC_FAILED` with a clear reason — nothing is lost, sync just resumes
  once credentials exist.
- Market data: live FX rates from frankfurter.app (no key required) and
  commodity prices from Alpha Vantage's free tier (requires a free API key).
  Refreshed on a schedule and cached in Redis.
- Homepage: hero AI-search entry point, live market dashboard, featured
  insights, newsletter signup, and book-a-demo form — all wired to the real
  API, not mocked.

Header/footer navigation links to modules that don't exist yet (Market
Intelligence, Categories, Calculators, Benchmarking, Knowledge Centre, AI
Assistant's full experience, Admin Portal, etc.) — those routes will 404
until their modules are built. The homepage's hero search links to a real
`/assistant` waitlist page rather than faking an AI response.

## Prerequisites

- Node.js 20+
- pnpm 9+ (`corepack enable && corepack prepare pnpm@9.0.0 --activate`)
- Docker (for local Postgres + Redis)

> This environment could not run `pnpm install` / a build — there is no
> package manager available in the sandbox this was built in (no npm, pnpm,
> or corepack on PATH, only a bare `node` binary). Run the steps below on a
> machine with a normal Node.js + pnpm setup to install and verify.

## Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Start Postgres + Redis
docker compose up -d

# 3. Configure environment
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
# Get a free Alpha Vantage key at https://www.alphavantage.co/support/#api-key
# and set ALPHA_VANTAGE_API_KEY in apps/api/.env to enable live commodity prices.

# 4. Run database migrations
pnpm prisma:migrate

# 5. Start both apps
pnpm dev:api   # http://localhost:4000 (Swagger docs at /docs)
pnpm dev:web   # http://localhost:3000
```

## Architecture decisions worth knowing about

- **Monorepo, not a single Next.js app.** The spec calls for a NestJS +
  Prisma + Postgres + Redis + BullMQ backend distinct from the frontend, so
  `apps/api` and `apps/web` are separate deployables from day one.
- **FX data**: frankfurter.app (ECB reference rates) needs no API key and
  covers EUR/GBP/ZAR/CNY reliably; NGN/KES/GHS/EGP are requested but the ECB
  feed doesn't always publish them — the dashboard just shows what's
  actually returned rather than fabricating rates.
- **Commodity data**: Alpha Vantage's free tier is rate-limited (~5
  req/min, 25 req/day), so the refresh job paces requests ~13s apart and
  runs once daily for a curated set of 6 commodities (WTI, Brent, natural
  gas, copper, aluminium, wheat) — enough for the homepage dashboard. The
  full Commodity Centre (steel, packaging, paper, plastics, chemicals, etc.)
  is a later module and will likely need a paid feed to cover that breadth.
- **Lead capture never blocks on GoHighLevel.** Leads write to Postgres
  synchronously and sync to GoHighLevel asynchronously via BullMQ, so a slow
  or misconfigured CRM integration never breaks the user-facing form.
- **No fabricated testimonials or customer logos.** The spec's homepage
  calls for these; they're deliberately omitted rather than invented, since
  fake customer quotes would be misleading. Add real ones as they exist.

## Next modules (suggested order)

1. Market Intelligence Centre (commodity/FX/shipping detail pages, charts,
   forecasts)
2. Category Management Centre
3. Calculator Centre
4. Benchmarking assessment
5. AI Procurement Assistant (real LLM-backed answers)
6. Knowledge Centre, Newsletter Centre
7. Admin Portal
