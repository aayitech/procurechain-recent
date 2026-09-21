# ProcureChain Intelligence Hub

AI-Powered Procurement Intelligence, Market Insights & Decision Support.

This is a **standalone** platform — it does not depend on ProcureChain, but
the schema and API boundaries are designed so it can be integrated later
(shared auth model, clean lead-capture API, GoHighLevel-ready sync).

## Status: Integrated intelligence-platform foundation

The repository now contains the integrated Homepage, Market Intelligence terminal,
Market Brief, Ask the Market workspace, personalisation flow, and supporting API.
See `IMPLEMENTATION_STATUS.md` for the requirement-by-requirement gap assessment.

- Monorepo (pnpm workspaces): NestJS API + Next.js web app
- Auth: passwordless email-code login with a persistent JWT session (Google/Microsoft/
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

Market data is source-controlled. The terminal exposes the full configured market
universe but explicitly marks instruments without an approved live observation as
unavailable; it never generates substitute prices or history.

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
# Set RESEND_API_KEY and AUTH_EMAIL_FROM to deliver passwordless login codes.

# 4. Run database migrations
pnpm prisma:migrate

# 5. Start both apps
pnpm dev:api   # http://localhost:4000 (Swagger docs at /docs)
pnpm dev:web   # http://localhost:3000
```

## Signup profile and personalization

New users verify their email and complete the embedded signup form. After its
redirect to `/onboarding/complete`, the ProcureChain API reads the submitted
profile and saves identity, phone, location, preferred currency, industry,
procurement interests, commodity interests, and newsletter consent to Postgres.
The dashboard and Market Brief rank verified signals and news using that stored
profile. The form configuration itself is managed separately from this codebase.

The form should redirect to `https://procurechain.online/onboarding/complete`.
The API service needs `GOHIGHLEVEL_API_KEY` and `GOHIGHLEVEL_LOCATION_ID`, with
permission to read contacts and custom-field definitions. The integration accepts
the field labels shown in the signup form as well as their standard `contact.*`
keys, including Preferred Currency, Procurement Interests, and Commodity Interests.

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

## Next implementation priority

1. Apply and seed the unified intelligence database migration.
2. Connect official South African fuel, SARB, Stats SA, and EIA feeds.
3. Connect a licensed container freight-rate provider.
4. Add authenticated server-side watchlists and profile editing.
5. Complete trade, port, packaging, plastics, chemicals, and agriculture connectors.
