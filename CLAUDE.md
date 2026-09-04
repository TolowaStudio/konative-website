# Konative (repo)

**What:** Recurring-revenue connectivity brokerage — not a grant-writer. App in **`web/`** (Next.js + Sanity). Site rules: `web/AGENTS.md`.

**Origin:** `tolowa-studio/konative-website` · canonical clone `~/repos/konative-website`.

## Harness lanes (locked 2026-09-04)

Desk decides → Cursor ships → Hermes@Mini long jobs → Claude designs → DeepInfra cheap inference.

| Lane | Role |
|------|------|
| **Tolowa CTO desk** | Order, no-go, dispatch, gates |
| **Cursor** | This repo — PRs, CI, Cloud Run |
| **Hermes@Mini + DeepInfra** | Long ops; no phone interrupt |
| **Claude** | Design/strategy only — no execute, deploy, DNS, send, pay, or spawn. Campaigns = plan-first; no send until Jeramey says |

**Memory:** Linear = issues · Notion = library · Stash = agent locks. **Human gates:** pay · send · sign · delete · ship.

## Stack

Cloud Run (`konative-website-staging`) → **konative.com** · Supabase (intel tables) · Sanity · Twenty + Ghost (Railway) · Mailgun + Resend · GCP Secret Manager · Bunny DNS (Porkbun registrar only). **No Kit.** News ingest off; outreach waits for Claude. Legacy OpenNext/wrangler = migration residue.

## Local & deploy

`web/`: `npm ci` → `npm run dev` (port **3005**, Node **22**). Push `main` → `deploy-cloud-run.yml`. Health: `curl -sf https://konative.com -o /dev/null -w "%{http_code}\n"`.

## Done contract

Acceptance + durable handoff (Notion/Stash). **Open PR; leave merge/deploy for ship gate.**

Notion: [Konative.com — Project Hub](https://www.notion.so/34232e0a547481b39bc1e081765d6df6).
