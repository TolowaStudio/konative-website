# Konative site readiness — 2026-08-28

Read-only audit for campaign / landing-surface go/no-go. **No email sent, no live campaign import, no DNS changes, no production secret reads.**

| Field | Value |
|-------|-------|
| **Live origin** | https://konative.com (Cloud Run `konative-website-staging`, GCP `tolowa-studio`, `us-west1`) |
| **DNS estate** | Bunny nameservers; Porkbun registrar only ([`CLAUDE.md`](../../CLAUDE.md)) |
| **Checked at** | 2026-08-28 ~19:31 UTC |
| **Repo HEAD** | `6ae8967` — `fix(deploy): skip admin lock until konative-ADMIN_ACCESS_TOKEN exists` |

---

## 1. Live HTTP surface (public probes)

Probed with `curl -sI -L` (and body sample for `/cms`, `/studio`). All responses below include:

```http
strict-transport-security: max-age=31536000; includeSubDomains
```

Also present on every route checked: `x-content-type-options: nosniff`, `referrer-policy: strict-origin-when-cross-origin`, `x-frame-options: SAMEORIGIN` (configured in [`web/next.config.ts`](../../web/next.config.ts)).

| Path | Status | Notes |
|------|--------|-------|
| `/` | **200** | Title: *Konative \| Internet & Network Connectivity Brokerage*. `x-nextjs-prerender: 1`, `server: Google Frontend`. |
| `/tribal` | **200** | Title: *Tribal Enterprise Connectivity \| Sovereignty-Aware Brokerage \| Konative*. |
| `/datacenters` | **200** | Prerendered marketing page. |
| `/connectivity` | **200** | Prerendered marketing page. |
| `/contact` | **200** | Same root layout title as home (contact route under catch-all). |
| `/cms` | **200** | **Public** — renders *Systems \| Konative* hub (Sanity/Ghost integration status, links to `/studio`). `robots: noindex`. |
| `/studio` | **200** | **Public** — Sanity `NextStudio` shell loads (`data-sanity-core`, `core.sanity-cdn.com/bridge.js`). `robots: noindex`. |
| `/health` | **404** | No route. |
| `/api/health` | **404** | No route (Next.js 404 page). |
| `/api/v1/health` | **200** | Canonical health JSON: `articleCount`, `feedCount`, `dealCount`, `facilitiesScored`, etc. See [§5](#5-health-and-data-plane). |
| `https://www.konative.com/` | **200** | Apex and `www` both serve 200; no apex redirect observed in this probe. |

**HSTS:** **Present** on all paths above. TOL-490 header half of the coffee SHIP gate is **live**.

---

## 2. `/cms` and `/studio` lock status

| Check | Result |
|-------|--------|
| Unauthenticated `GET /cms` | **200** — public CMS hub |
| Unauthenticated `GET /studio` | **200** — public Sanity Studio |
| Expected when locked | **401** + `WWW-Authenticate: Basic realm="Konative Admin"` |

**Verdict: NOT LOCKED** (still public).

### Repo evidence

Middleware gates `/cms`, `/studio`, `/dashboard` only when `ADMIN_ACCESS_TOKEN` is set. If the token is **unset in production**, access is explicitly allowed:

```19:21:web/src/middleware.ts
  // Token unset in production: leave /cms and /studio public until konative-ADMIN_ACCESS_TOKEN exists.
  if (access === "disabled") {
    return NextResponse.next();
```

[`web/src/lib/adminAccess.ts`](../../web/src/lib/adminAccess.ts) returns `"disabled"` when `expectedToken` is empty and `NODE_ENV !== "development"`.

Cloud Run deploy binds the secret **only if it already exists** in GCP Secret Manager:

```93:98:.github/workflows/deploy-cloud-run.yml
          if gcloud secrets describe konative-ADMIN_ACCESS_TOKEN \
            --project "${{ env.GCP_PROJECT }}" >/dev/null 2>&1; then
            SECRETS="${SECRETS},ADMIN_ACCESS_TOKEN=konative-ADMIN_ACCESS_TOKEN:latest"
            echo "konative-ADMIN_ACCESS_TOKEN found — binding admin lock secret"
          else
            echo "konative-ADMIN_ACCESS_TOKEN missing — deploy without admin lock until operator adds secret"
```

Latest successful deploy on `main` (2026-08-28T05:16:41Z) is titled **"fix(deploy): skip admin lock until konative-ADMIN_ACCESS_TOKEN exists"** — consistent with live public `/cms` and `/studio`.

**TOL-489 / TOL-490 / PR 71:** Merged 2026-08-28 ([PR #71](https://github.com/tolowa-studio/konative-website/pull/71)). Code for HSTS + admin middleware is on `main`; **operator secret `konative-ADMIN_ACCESS_TOKEN` is the remaining human gate** for the lock half of TOL-490.

**Unknown (not probed):** Whether `konative-ADMIN_ACCESS_TOKEN` exists in GCP Secret Manager. Existence is inferred only from deploy behavior and live 200 responses — **not invented**.

---

## 3. Open PRs / issues that block campaign

### GitHub PRs (open)

| PR | Title | Campaign impact |
|----|-------|-----------------|
| [**#48**](https://github.com/tolowa-studio/konative-website/pull/48) | Always-on GTM repair: TBCP claims, Snapshot CTAs, validation packet | **Blocks GTM-ready copy.** Open since 2026-07-15. Fixes TBCP language, Snapshot/Brief CTAs, validation packet; test plan says outreach remains **unsent** until explicit approval (`docs/outreach/2026-07-14-launch-ready-locked-set.md` referenced in PR body — file not present in repo at audit time). |
| [#34](https://github.com/tolowa-studio/konative-website/pull/34) | fix(supabase): remediate security advisor findings | Draft; infra hygiene, not a landing-page blocker for Twenty traffic. |

### GitHub issues

No open issues returned by `gh issue list` at audit time. Tracking appears to live in Linear (TOL-*).

### Recently merged (context)

| PR | Relevance |
|----|-----------|
| [#71](https://github.com/tolowa-studio/konative-website/pull/71) | CRM fail-closed stages, HSTS, admin lock **code** (lock inactive — see §2). |
| [#70](https://github.com/tolowa-studio/konative-website/pull/70) | Removed GHA schedules for `ingest-news.yml`, `ingest-weekly.yml`, `refresh-tiles.yml` (TOL-316, TOL-322). |

### Leftover Cloudflare cron (TOL-322) — human gate

**Not verified from this environment** (no Cloudflare API call). Repo documents a live Worker still scheduled:

| Source | Monday UTC cron | Target |
|--------|-----------------|--------|
| [`workers/konative-cron/index.js`](../../workers/konative-cron/index.js) | `0 7 * * 1` | `GET https://konative.com/api/ingest-canada-queue` |
| same | `0 8 * * 1` | `GET https://konative.com/api/ingest-ieso` |

Runbook: [`docs/konative-leftover-compute.md`](../../docs/konative-leftover-compute.md) — clear via `scripts/cloudflare-clear-konative-cron.mjs` (needs `CLOUDFLARE_API_TOKEN`).

**GHA side:** [`ingest-weekly.yml`](../../.github/workflows/ingest-weekly.yml) schedule removed; manual dispatch fails fast. **Does not** prove the CF Worker is cleared.

---

## 4. Ghost / news ingest

### Product rule (frozen)

[`web/AGENTS.md`](../../web/AGENTS.md):

> News ingest | **Off** — do not turn on cron, workflows, or `/api/ingest-news` automation

### GitHub Actions

| Workflow | Status |
|----------|--------|
| [`ingest-news.yml`](../../.github/workflows/ingest-news.yml) | Schedule removed; `workflow_dispatch` **fails fast** with frozen message. |
| [`ingest-weekly.yml`](../../.github/workflows/ingest-weekly.yml) | Schedule removed; manual run **fails fast** (TOL-322). |

### Live ingest endpoints (unauthenticated probe)

| Endpoint | Status (no auth) | Token burn risk |
|----------|------------------|-----------------|
| `GET /api/ingest-news` | **401** | Route requires `NEWS_INGEST_TOKEN` or `CRON_SECRET` ([`web/src/app/api/ingest-news/route.ts`](../../web/src/app/api/ingest-news/route.ts)). |
| `GET /api/ingest-canada-queue` | **401** | Requires `Authorization: Bearer ${CRON_SECRET}`. |
| `GET /api/ingest-ieso` | **401** | Requires `Authorization: Bearer ${CRON_SECRET}`. |

**News-specific:** No scheduled GHA news ingest. `/api/ingest-news` rejects anonymous callers. **If** the CF Worker `konative-cron` is still deployed, it fires **Canada queue + IESO only** — not `/api/ingest-news` — but could still invoke server work and any downstream AI on those paths when `CRON_SECRET` is valid.

**Ghost:** Newsletter stack is Ghost on Railway per platform truth ([`CLAUDE.md`](../../CLAUDE.md)). Ghost admin URL helpers exist in [`web/src/lib/system-tools.ts`](../../web/src/lib/system-tools.ts); Ghost reachability **not probed** in this audit.

**Verdict:** News ingest automation is **off** in repo/CI. Residual risk is **unknown CF Worker Monday crons** (not news, but scheduled server ingest) until TOL-322 operator clear.

---

## 5. Health and data plane

Canonical probe (per [`web/docs/deploy-readiness-checklist.md`](../../web/docs/deploy-readiness-checklist.md), [`web/docs/dns-setup.md`](../../web/docs/dns-setup.md)):

```bash
curl -sf https://konative.com/api/v1/health
```

**2026-08-28 sample:**

```json
{
  "articleCount": 20,
  "feedCount": 22,
  "dealCount": 0,
  "facilitiesScored": "105",
  "generatorsTracked": "2317",
  "waterSitesIndexed": 1414,
  "networkNodesIndexed": "1572"
}
```

Supabase-backed counts look populated; `dealCount: 0` may be expected pre-campaign.

Deploy sets `CRM_WEBHOOK_REQUIRED=true` on Cloud Run ([`.github/workflows/deploy-cloud-run.yml`](../../.github/workflows/deploy-cloud-run.yml) L123) — lead forms should fail closed if Twenty/n8n webhook is down (TOL-489 behavior from PR #71). **Webhook liveness not probed** (would require POST with test data).

---

## 6. Go / no-go — Twenty campaign landing surface

### Summary

| Use case | Verdict |
|----------|---------|
| **Passive landing** (send traffic to `/`, `/tribal`, `/connectivity`, `/datacenters`, `/contact`) | **Conditional GO** — pages return 200, HSTS on, health API 200. |
| **Campaign-ready** (GTM copy, secured admin surfaces, no stray schedulers, approved send) | **NO-GO** — human gates below remain open. |

### Human gates (coffee SHIP + campaign)

| Gate | Status | Owner action |
|------|--------|--------------|
| **HSTS** (TOL-490) | **DONE** — live on all routes probed | None |
| **`konative-ADMIN_ACCESS_TOKEN`** (TOL-490 lock) | **OPEN** — `/cms` and `/studio` public | Create GCP secret; redeploy (workflow auto-binds). Editors use Basic auth `admin:<token>`. |
| **Leftover CF `konative-cron`** (TOL-322) | **UNKNOWN / likely OPEN** | Run `scripts/cloudflare-clear-konative-cron.mjs` with CF token; confirm 0 schedules. |
| **GTM repair PR #48** | **OPEN** | Merge or consciously defer; fixes TBCP claims and Snapshot/Brief CTAs before tribal outreach copy goes live. |
| **Outreach / Twenty send** | **FROZEN** per [`web/AGENTS.md`](../../web/AGENTS.md) | Explicit human approval before any campaign import or send. CRM audit tooling is read-only ([`docs/ops/konative-crm-campaign-audit.md`](./konative-crm-campaign-audit.md)). |

### Recommended sequence before campaign traffic

1. Create `konative-ADMIN_ACCESS_TOKEN` → redeploy → verify `curl -sI https://konative.com/cms` → **401**.
2. Clear CF `konative-cron` schedules (TOL-322) → verify no Monday hits in Cloud Run logs next cycle.
3. Resolve or merge **PR #48** for on-site GTM/copy alignment.
4. Smoke-test contact/intake POST to Twenty/n8n with `CRM_WEBHOOK_REQUIRED=true` (staging or single test lead).
5. Human sign-off on outreach send (frozen rule).

---

## 7. Unknowns (explicit)

- Whether `konative-ADMIN_ACCESS_TOKEN` exists in GCP Secret Manager (inferred absent from deploy title + live 200 on `/cms`).
- Whether Cloudflare Worker `konative-cron` still has active cron triggers (documented as deployed; not API-checked here).
- Twenty/n8n intake webhook end-to-end health (no test POST performed).
- Ghost newsletter instance reachability from Cloud Run.
- Whether `docs/outreach/2026-07-14-launch-ready-locked-set.md` exists outside repo (referenced in PR #48 only).
- WIF / full secret inventory — **not asserted**; only deploy workflow lists expected `konative-*` secret names.

---

## Commands to re-run this audit

```bash
# Status + HSTS
for p in "" /tribal /datacenters /connectivity /cms /studio /health /api/health /api/v1/health; do
  echo "=== https://konative.com$p ==="
  curl -sI -L "https://konative.com$p" | rg -i '^(HTTP/|strict-transport)'
done

# Health body
curl -sf https://konative.com/api/v1/health | jq .

# Ingest auth (expect 401)
for p in /api/ingest-news /api/ingest-canada-queue /api/ingest-ieso; do
  curl -s -o /dev/null -w "$p %{http_code}\n" "https://konative.com$p"
done
```
