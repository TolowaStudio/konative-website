# AGENTS.md — konative.com

## Mission

Next.js site for connectivity intelligence, carrier-neutral brokerage, datacenter connectivity, market coverage, and qualified buyer intake. Public positioning: **AI-native connectivity intelligence and brokerage** — black/steel/velocity-red (`#C8001F`) brokerage aesthetic.

## Platform (2026-08-19)

- **Runtime:** Cloud Run (`konative-website-staging`) — public **konative.com** / **www**
- **Data:** Supabase `tcbworxmlmxoyzcvdjhh` for intelligence tables and `/api/v1/*`
- **CMS:** Sanity
- **Newsletter:** Ghost on Railway
- **Intake automation:** Twenty + n8n on Railway
- **DNS:** Bunny (`kiki` / `coco`); Porkbun registrar only — never flip NS to Porkbun
- **Secrets:** GCP Secret Manager → Cloud Run

Do **not** recommend Cloudflare Workers/OpenNext, D1, R2, KV, or Workers AI as the Konative platform. Cloudflare is leftover-only in this stack.

## Product & legal content rules

- Konative is **connectivity intelligence and vendor-neutral brokerage** for tribal nations, datacenters, enterprises, and infrastructure buyers — not outdoor living, manufacturer representation, or generic “AI platform” fluff.
- Tribal/sovereignty copy must stay accurate: nations as counterparties, supplier-compensated brokerage (buyers pay $0 advisory), commission disclosure when asked.
- Market intel and indices are **informational** — not investment advice; say so where editorial content warrants it.
- CTAs: `/contact` or canonical Cal.com booking for warm-intent flows.
- No current surface should describe Konative as an outdoor living or manufacturer-representation business.

## CMS rules

- **Sanity** is curated CMS: pages, tribal/news editorial, form submissions, map/editorial records. Prefer block-based `layout` fields and stable slugs; avoid one-off hardcoded page fields when a reusable block works.
- Globals/settings: navigation, SEO defaults, site-wide config in Sanity globals where the schema supports it.
- Content imports: follow `web/content/seed/import-ready-checklist.md` for positioning alignment before bulk publish.

## Core principles

1. Consistency over one-off customization — shared brokerage brand system.
2. Phase-based delivery — current approved milestone only (`PLAN.md` when relevant).
3. No chaos architecture — no new pages/blocks/schema without clear reason.
4. Small safe iterations — state plan and expected files before major edits.
5. Notion is the visible system of record — log outcomes to the AI OS workspace when tooling is available.

## Page scope (primary)

Home · Connectivity · Datacenters · Intelligence · Markets · Map/coverage · News/market intel · Contact/platform access · Tribal lane where live

## Frozen — do not enable without explicit approval

| Item | Rule |
|------|------|
| News ingest | **Off** — do not turn on cron, workflows, or `/api/ingest-news` automation |
| Outreach campaign | **Wait for Claude** — no autonomous campaign sends |
| Kit (ConvertKit) | **Not on Konative** — newsletter is Ghost only |
| Public hostname cutover | Only after Cloud Run health verified on production URLs |
| Cloud SQL / D1 / R2 | Not the active data plane — Supabase remains source for intel tables |

## Execution

- Restate milestone and file list before major work.
- TypeScript throughout; prefer server components unless interactivity requires client.
- Use design tokens and existing naming; edit existing files over parallel alternatives.
- Architecture/deploy/data-model changes: note in `docs/decisions.md`.

## Notion

May create/update project notes, task status, Block Library / Site Registry entries when Notion access is available — log actions in the response. Do not invent database IDs; discover from workspace or confirm.

## Definition of done

- `npm run build` passes from `web/`.
- Primary pages match black/steel/red brokerage language and positioning rules above.
- CTAs route correctly; no stale outdoor-living or deprecated-platform copy in touched surfaces.
