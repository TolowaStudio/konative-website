# Konative

| What | URL |
|------|-----|
| **Production** | [https://konative.com](https://konative.com) |
| **Git repository** | [github.com/tolowa-studio/konative-website](https://github.com/tolowa-studio/konative-website) (`main`) |

Founder OS structure and PRD live in **`docs/`**. Notion hub (live): [konative.com](https://www.notion.so/konative-com-34132e0a547481489537d232018bbbb0).

## Public site (Next.js)

The live site lives in **`web/`** (Next.js 16 + Sanity CMS + Supabase). Editor workflow, blocks, and collections are defined there.

```bash
cd web
npm ci
npm run dev
```

Dev server: **http://localhost:3005** (see root `CLAUDE.md`).

- Production build: `npm run build` then `npm run start`
- **Deploy:** push to `main` → [`.github/workflows/deploy-cloud-run.yml`](.github/workflows/deploy-cloud-run.yml) builds `web/Dockerfile` and deploys Cloud Run service `konative-website-staging` (GCP project `tolowa-studio`, region `us-west1`). Runtime secrets come from **GCP Secret Manager** (`konative-*` secrets). See root **`CLAUDE.md`** for status and health checks.
- **Local env:** copy `web/.env.local.example` to `web/.env.local` and set Sanity, Supabase, and site URL vars (see `web/docs/database-setup.md`).

- [`docs/founder-os-konative.md`](docs/founder-os-konative.md) — operating model (vision → workstreams → rhythm)
- [`docs/requirements-prd.md`](docs/requirements-prd.md) — konative.com requirements and backlog epics
- [`docs/DESIGN-DOC.md`](docs/DESIGN-DOC.md) — credibility-first strategy and launch direction
- [`docs/phase-one-offer.md`](docs/phase-one-offer.md) — draft paid offer, CTA, pricing, timeline, and deliverables
- [`docs/homepage-outline.md`](docs/homepage-outline.md) — homepage IA, section order, and supporting page map
- [`docs/launch-copy-outline.md`](docs/launch-copy-outline.md) — first-pass launch messaging and homepage copy structure
- [`docs/trust-legal-proof-assets.md`](docs/trust-legal-proof-assets.md) — v1 trust layer, anonymized proof options, and legal/privacy asset list
- [`docs/v1-ship-checklist.md`](docs/v1-ship-checklist.md) — ASAP launch definition of done and launch gate checklist
- [`docs/implementation-plan.md`](docs/implementation-plan.md) — greenfield build plan, task order, and PRD traceability for the public site
- [`docs/project-plan.md`](docs/project-plan.md) — ordered execution plan from offer lock through launch
- [`docs/notion-setup.md`](docs/notion-setup.md) — Notion links + task board setup
