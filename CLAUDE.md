# Konative (repo)

**Canonical clone:** `~/repos/konative-website` — must match the GitHub repo name. Origin: `tolowa-studio/konative-website` (not the old `jerameyjames` redirect). OneDrive `_AI_projects/konative/konative-site` must be a **symlink** here, not a second checkout.

App code lives in **`web/`** (Next.js 16 + Sanity). Site agent rules: `web/AGENTS.md`.

## Platform truth (2026-08-19)

| Layer | Choice |
|-------|--------|
| **Public runtime** | **Google Cloud Run** — service `konative-website-staging` (GCP project `tolowa-studio`, region `us-west1`) serves **konative.com** and **www** |
| **Intelligence / tabular data** | **Supabase** project `tcbworxmlmxoyzcvdjhh` (free tier) — not D1, not Cloud SQL |
| **CMS** | Sanity |
| **Newsletter** | Ghost on **Railway** |
| **Stateful ops** | Railway only where already deployed: **Twenty**, **Ghost**, **n8n** |
| **DNS** | **Bunny** nameservers (`kiki.bunny.net`, `coco.bunny.net`). **Porkbun** registrar only — **never** move NS to Porkbun |
| **Cloudflare** | Leftover account assets only. **No R2. No Workers AI.** Worker **public hostnames are retired** |
| **Agent secrets** | **GCP Secret Manager** (bound into Cloud Run at deploy) |

**Cutover rule:** Plan first. Do not remove a live public hostname until Cloud Run is verified serving (health `200`, Supabase-backed counts sane).

**Frozen (operator):** News ingest **off**. Outreach **campaign** waits for Claude. **No Kit** (ConvertKit) on Konative.

Legacy OpenNext / `wrangler.jsonc` / `.github/workflows/deploy.yml` may still exist in the repo — treat as **migration residue**, not current platform guidance.

## Local development

From `web/`: `npm ci` then **`npm run dev`** → **http://localhost:3005** (default port avoids collisions with 3000/3010/3011). Override: `npx next dev -p <port>`.

**Node 22** everywhere (`web/.nvmrc` + `web/package.json` `engines.node`).

Copy env from `web/.env.local.example`.

## Deploy

- **Live path:** push to `main` → `.github/workflows/deploy-cloud-run.yml` builds `web/Dockerfile`, pushes to Artifact Registry, deploys Cloud Run.
- **Production URL:** https://konative.com
- **Status:** `gh run list --workflow=deploy-cloud-run.yml --branch main`
- **Health:** `curl -sf https://konative.com -o /dev/null -w "%{http_code}\n"` (expect `200`)

Runtime secrets and server env vars come from **GCP Secret Manager** (`konative-*` secrets), not Cloudflare Worker bindings or Vercel env.

## Notion

Project hub: [Konative.com — Project Hub](https://www.notion.so/34232e0a547481b39bc1e081765d6df6). See `docs/notion-setup.md`.
