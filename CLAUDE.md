# Konative (repo)

**What:** Recurring-revenue connectivity brokerage — not a grant-writer. App in
**`web/`** (Next.js + Sanity). Site rules: `web/AGENTS.md`. Current focus: `now.md`.
Factory loop map: `docs/FACTORY.md`. Authority and forbidden: `AGENTS.md`.

**Origin:** `tolowa-studio/konative-website` · canonical clone `~/repos/konative-website`.

## Operating loop (SIGNED TOL-638)

One loop only: decide → build → verify → activate commercial → measure → weekly
continue / change / stop. Craft labels (judgment, delivery, demand) are capabilities
inside that loop — not peer operating systems.

## Harness lanes (locked 2026-09-04)

Desk decides → Cursor ships (PRs) → Hermes@Mini long jobs → Claude designs →
DeepInfra cheap inference.

| Lane | Role |
|------|------|
| **Tolowa CTO desk** | Order, no-go, dispatch, gates |
| **Cursor** | This repo — feature branches, PRs, CI, Cloud Run evidence |
| **Hermes@Mini + DeepInfra** | Long ops; no phone interrupt |
| **Claude (Fable)** | Design/strategy only — no execute, deploy, DNS, send, pay, or spawn |

**Memory:** Linear = issues · Notion = library · Stash = agent locks.
**Human gates:** pay · send · sign · delete · ship.

## Stack

Cloud Run (`konative-website-staging`) → **konative.com** · Supabase (intel tables) ·
Sanity · Twenty + Ghost (Railway) · Mailgun + Resend · GCP Secret Manager · Bunny DNS
(Porkbun registrar only). **No Kit.** News ingest off. Outreach waits for Claude, and
**no send until Jeramey says.** Legacy OpenNext/wrangler = migration residue.

## Local & deploy

`web/`: `npm ci` → `npm run dev` (port **3005**, Node **22**).

- Typecheck: `npm run typecheck`
- Unit tests: `npm test`
- Production image: push `main` → `deploy-cloud-run.yml` (ship gate, not an agent action)
- Health: `curl -sf https://konative.com -o /dev/null -w "%{http_code}\n"`

Prefer these scripts. Do not add a second package manager or lint stack.

## Conventions

- TypeScript in `web/`. Prefer server components unless interactivity needs a client.
- Public positioning: AI-native connectivity intelligence and brokerage
  (black / steel / velocity-red `#C8001F`). Never Conative / Cognitive / Connative.
- CTAs: `/contact` or canonical Cal.com. Tribal copy: nations as counterparties;
  supplier-compensated brokerage.
- Frozen without explicit approval: news ingest cron, campaign send, Kit, Cloudflare
  Workers as the platform.

## Done contract

Acceptance + durable handoff (Linear comment and/or Stash). **Open PR; leave merge and
deploy for the ship gate.**

Notion: [Konative.com — Project Hub](https://www.notion.so/34232e0a547481b39bc1e081765d6df6).
