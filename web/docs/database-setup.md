# Data layer for Konative

**Updated 2026-08-27.**

## Current data layer

| Layer | Store | What |
|-------|-------|------|
| **CMS / curated content** | [Sanity](https://sanity.io) | Pages, tribal/news editorial, form submissions, site settings |
| **Tabular intelligence** | **Supabase** (`tcbworxmlmxoyzcvdjhh`) | Intelligence tables and `/api/v1/*` read paths |
| **Newsletter / blog** | Ghost (Railway) | Konative Dispatch and `/blog` |

## Local setup

```bash
cd web
cp .env.local.example .env.local
# Fill in Sanity + Supabase + site URL vars (see below)
npm ci
npm run dev
```

Dev server: **http://localhost:3005**

## Environment variables

**Sanity (CMS):**

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET` (usually `production`)
- `SANITY_API_TOKEN` (Editor token with write access)

**Supabase (intelligence / `/api/v1/*`):**

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only; required for privileged API routes)

**Site:**

- `NEXT_PUBLIC_SITE_URL` (e.g. `https://konative.com`)

See `web/.env.local.example` for Ghost, Resend, CRM webhook, and other optional vars.

## Production secrets

Runtime secrets are stored in **GCP Secret Manager** (`konative-*` prefix) and bound into Cloud Run at deploy via `.github/workflows/deploy-cloud-run.yml`. Do not configure production credentials in Vercel, Builder.io, or Cloudflare Worker bindings.

Build-time `NEXT_PUBLIC_*` values are passed from **GitHub Actions secrets** during the Docker build step in the same workflow.

## Historical note

An intermediate migration doc described **Cloudflare D1 / R2 / KV** as the intelligence data plane with Supabase as deprecated. That direction was not kept. **Supabase remains the active tabular datastore** per the current Cloud Run deploy workflow and platform guidance in root `CLAUDE.md`.
