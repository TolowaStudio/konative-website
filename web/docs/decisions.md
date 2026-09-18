# Decisions Log

## Purpose
Capture architecture decisions that affect the future WebOS starter.

## Entry format
### YYYY-MM-DD — Title
- Context:
- Decision:
- Why:
- Tradeoffs:
- Affected files:

## Initial assumptions
- Payload CMS + Next.js is the starter stack
- Konative is Site 0
- Vercel is acceptable for initial deployment speed
- Future multi-tenant evolution happens after starter validation

### 2026-04-15 — Canonical app in `web/`, Vercel project `konative-site`
- Context: A parallel `konative-site/` folder and an older static marketing app in `web/` caused duplicate sources and mismatched Vercel project names (`konative-website` vs `konative-site`).
- Decision: **One app**: the Payload + Next implementation lives only in **`web/`**. The Vercel project name **`konative-site`** is the default in `scripts/vercel-bootstrap.sh` and infra docs. Deprecated duplicate folders and large inbox exports were removed from the working tree; AI OS markdown playbooks live under **`docs/ai-os/`**.
- Why: Single source of truth for Git, CI, and deploy; fewer path mistakes (`web/.env.local` vs nested folder).
- Tradeoffs: Anyone with links to the old `konative-website` Vercel project must migrate env vars, domains, and Postgres/Blob links to **`konative-site`** (or rename the project in Vercel to match).
- Affected files: `web/**`, root `README.md`, `CLAUDE.md`, `scripts/vercel-bootstrap.sh`, `web/docs/database-setup.md`, `web/docs/deploy-readiness-checklist.md`, `web/docs/dns-setup.md`, `web/docs/analytics-setup.md`, `web/next.config.ts`, `docs/ai-os/*`

### 2026-09-18 — K-0 shadow `gate.send_safety` before Mailgun
- Context: Desk GO to wire TypeSafe Jev send safety at Konative canary batch creation and canary→sending without merging campaign send automation.
- Decision: Add `@/lib/jev/*` gate client + `@/lib/outreach/campaign/batchLifecycle` call sites; env `KONATIVE_JEV_SEND_GATE=shadow|steer|off`; auth via `TYPESAFE_API_KEY` (GSM `typesafe-jev-api-key`); optional Baton invoke URL; JSONL receipts `konative.jev-send-safety-receipt.v1`.
- Why: Fail-closed judgment layer in front of deterministic suppression/policy; matches signed TypeSafe decision map first fork.
- Tradeoffs: Live NTIA script requires TypeSafe key when gate is shadow; dry-run defaults gate off unless env explicitly set.
- Affected files: `web/src/lib/jev/**`, `web/src/lib/outreach/campaign/**`, `web/scripts/ntia-outreach-send.ts`, `web/docs/outreach/send-safety-gate-k0.md`
