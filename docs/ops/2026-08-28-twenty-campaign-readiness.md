# Twenty campaign readiness — 12-account DIA packet

**Date:** 2026-08-28  
**Author:** Cloud Agent (read-only audit + doc synthesis)  
**Scope:** What exists in-repo for the 12-account validation queue, what is missing, Twenty schema fit, and blockers.  
**Explicitly out of scope:** Mailgun, Resend, Ghost sends; Twenty CRM writes; cold/grant blast; inventing contacts.

---

## Executive summary

Konative’s **first motion** is the **12-account DIA / Market Connectivity Brief validation packet** (DC mid-build + tribal gaming + two TBCP II enterprise-layer accounts), **not** a TBCP Round 3 / NEGP grant campaign. TBCP 3 and NEGP applications close **2026-09-17**; that window is a **trust / navigator lane** (Tolowa-aligned), not a brokerage send motion.

Twenty is **one Railway install** (`crm.tolowastudio.com` → Twenty workspace). Campaign tooling, audit scripts, and n8n intake are documented; **live CRM state could not be verified from this VM** (no API token; `gcloud` unavailable). **No Twenty writes were attempted.**

**BrowserOS Neo is not available on this Cloud Agent account.** Public enrichment used **Firecrawl CLI** (keyless tier) instead. Neo was **not** run and must not be claimed in downstream receipts.

**Verdict:** Repo has strong **schema and safety-gate documentation** and **outreach draft copy**, but the **12-account packet artifacts are missing from git**, buyer contacts are **not approved**, and **0 records are campaign-ready** per the last verified audit baseline. **Not sendable.**

---

## The 12-account queue (named in-repo)

Primary source: `docs/strategy/2026-07-15-validated-business-model-wedge-moat.md` (lines 148, 226, 274). Stash `/projects/konative` corroborates the full list from July 2026 research; **only names appearing in repo docs are listed here.**

| # | Account key | Lane | Priority (per strategy doc) | In-repo artifact? |
|---|-------------|------|----------------------------|-------------------|
| 1 | **Cologix COL5** — Lewis Center / Columbus OH | DC | P0 (named first) | **Missing** — packet not in repo |
| 2 | **Stream SATB** — San Antonio TX (San Antonio III) | DC | P0 | **Missing** |
| 3 | **Sabey Decatur** — Indianapolis / Decatur Township IN | DC | P0 | **Missing** |
| 4 | **Novva** — West Jordan UT campus | DC | Warm validation queue | **Missing**; strategy notes **HOLD** (fully leased per July research — not in repo body) |
| 5 | **Vantage NV1** — Reno / Sparks NV | DC | Residual / gated | **Missing** |
| 6 | **eStruxture CAL-3** — Calgary AB | DC | Gated (CoreWeave phase) | Partial — `web/data/canada-dc/research/projects.csv` |
| 7 | **Choctaw Casino & Resort — Pocola** OK | Tribal gaming | Delivery-ready (July ops memory) | **Missing** packet; public property pages only |
| 8 | **Alabama-Coushatta — Naskila** (Livingston + Leggett TX) | Tribal gaming | Delivery-ready | **Missing** |
| 9 | **Ho-Chunk Gaming — Beloit** WI | Tribal gaming | Delivery-ready | **Missing** |
| 10 | **Wilton Rancheria / Boyd — Sky River** Elk Grove CA (+ hotel expansion) | Tribal gaming | Gated (circuit ownership) | **Missing** |
| 11 | **Choctaw Nation of Oklahoma — TBCP II** (enterprise layer only) | Tribal enterprise | Round 2 — link to Pocola, not separate send | Award data on site (`/tribal/awards`); **no CRM packet** |
| 12 | **Muscogee (Creek) Nation — TBCP II** (enterprise layer only) | Tribal enterprise | Property-led (Lake Eufaula / River Spirit per July ops) | Award data on site; **TE-05 contacts unverified** per July ops memory |

**Referenced but absent from git:**

- `docs/outreach/2026-07-15-twelve-account-validation-packet.md`
- `docs/outreach/2026-07-15-twelve-account-deep-briefs.md`
- `docs/outreach/artifacts/2026-07-15-warm-asks-sent.md`
- `docs/outreach/artifacts/README.md` (and 11 per-account artifact files)

Only `docs/outreach/artifacts/2026-07-16-governors-maintain-report.md` exists under `artifacts/`.

---

## What exists in-repo (by workstream)

### Strategy and gating

| Asset | Path | Relevance |
|-------|------|-----------|
| Locked wedge + 90/10 sequencing | `docs/strategy/2026-07-15-validated-business-model-wedge-moat.md` | **12-account DC warm validation**; no grant blast; no cold tribal spray |
| Two-lane GTM (execution superseded) | `docs/strategy/2026-07-06-two-lane-gtm.md` | Clock A vs B; TribalNet; navigator as trust |
| Tribal campaign readiness (secondary) | `docs/tribal-campaign-readiness-plan.md` | Segments A–D, site/scope builder — **not** the first-send motion |
| M2 execution control | `docs/2026-08-25-konative-m2-execution-control.md` | **0 campaign-ready**; never send without Jeramey approval |

### Twenty schema and intake

| Asset | Path | Relevance |
|-------|------|-----------|
| Opportunity field model | `docs/operations/twenty-connectivity-model.md` | Lanes, campaigns, approval status, products, stages |
| n8n intake workflow | `docs/operations/n8n/konative-twenty-intake.workflow.json` | Website → person/company/opportunity upsert |
| CRM campaign audit | `docs/ops/konative-crm-campaign-audit.md` | Read-only manifest; 605 eligible; 164 **proposed**; 21 `QUEUED` excluded |
| Audit script | `scripts/konative-crm-campaign-audit.mjs` | GraphQL read + deterministic cohort scoring |
| Evidence writer (BrowserOS → Twenty) | `scripts/konative-twenty-evidence-writer.mjs` | **Dry-run default**; maps BrowserOS to `MANUAL` enum |

### Outreach copy (draft only)

| Asset | Path | Status |
|-------|------|--------|
| Tribal connectivity drafts | `docs/outreach/tribal-connectivity-campaign-drafts.md` | Draft — **do not send** without approval |
| Contractor call playbook | `docs/outreach/contractor-call-playbook.md` | Dispositions; log to Twenty before next dial |
| Cold email kits | `docs/outreach/cold-emails-*.md` | **Not** the 12-account motion (R4 audit / landowner templates) |

### Scripts (not the 12-account list)

| Asset | Path | Note |
|-------|------|------|
| Tribal outreach match | `web/scripts/tribal-outreach-match.ts` | TBCP award ↔ Twenty contacts; local JSON output |
| Tribal outreach send | `web/scripts/tribal-outreach-send.ts` | Guardrails: `ALLOW_TRIBAL_OUTREACH_LIVE`, segment, limit |
| Twenty deal seed | `web/scripts/seed-twenty-deals.ts` | **Example** tribal + DC opportunities — **not** the 12-account queue |

### Site / data supporting DIA narrative

| Asset | Path | Note |
|-------|------|------|
| Canada DC dataset | `web/data/canada-dc/research/projects.csv` | CAL-3 row (construction, 90 MW, RFS 2026-10-01) |
| Public llms positioning | `web/public/llms.txt` | Market Connectivity Brief / One-Site Snapshot offer |

---

## What is missing for a sendable 12-account campaign

### Contacts and roles

- **No approved buyer contacts** in-repo for any of the 12 accounts (no named IT/facilities lead with `Approved for outreach`).
- July warm asks went to **AVANT / T4** partners for Pathfinder name-checks — **not** to account mailboxes (`docs/strategy/2026-07-15-validated-business-model-wedge-moat.md` references `warm-asks-sent` artifact, which is **not in git**).
- CRM audit baseline (**2026-08-25**): **0 campaign-ready**; 164-person cohort is **proposed**, not reviewed; 21 legacy `QUEUED` records excluded.
- **Do not** scrape personal emails from staff pages; use org switchboards and published RFPs only.

### Sites and DIA need

Per-account public enrichment is in `docs/ops/2026-08-28-account-enrichment.md`. Gaps that block a **sendable** packet:

| Gap | Impact |
|-----|--------|
| One-page **Market Connectivity Brief** artifacts not in repo | Cannot attach or personalize warm intros |
| Pathfinder opportunity IDs | None documented |
| Site addresses / construction triggers | Partially public; not normalized into Twenty opportunity records from this VM |
| **DIA / multi-path deliverability** scope per site | Konative thesis requires carrier-truth artifacts — not just public marketing pages |
| Gated accounts (Novva, Vantage residual, CAL-3 CoreWeave phase, Sky River circuit) | Strategy says **hold** or residual-only — should not enter same sequence as COL5/SATB/Sabey |

### Twenty CRM objects

Expected for sendable campaign (from `twenty-connectivity-model.md` + tribal readiness plan):

- **Campaign** select: e.g. `Award-to-operations`, `DC build signal`, or a dedicated `2026-12-account-validation` value — **not confirmed live**
- **Approval status** = `Approved for outreach` on every person touched
- **Opportunity** per account with: lane, connectivity products, sites, award/program + source URL (tribal), next action + date
- **Send logging**: timestamp, sequence step, subject variant, failure reason — tribal plan notes Twenty logging **not** complete pre-launch

---

## Does the documented Twenty schema support a sendable campaign?

**On paper: yes.** `docs/operations/twenty-connectivity-model.md` defines the right primitives:

- Approval gate (`Approved for outreach` required for automation)
- Lane + campaign selects aligned to DC vs tribal
- Connectivity products multi-select (DIA, waves, DCI, etc.)
- Opportunity stages from Target → Residual active
- Suppression via `Do not contact`
- Webhook mapping for inbound (`docs/operations/n8n/konative-twenty-intake.workflow.json`)

**In practice: unknown from this VM, and audit says not ready.**

| Check | Doc expectation | Known state |
|-------|-----------------|-------------|
| Custom fields / enums deployed | Required | **Not verified** (no authenticated GraphQL introspection) |
| 12 accounts as companies + opportunities | One opp per site | **Not in repo** as Twenty export |
| People linked with roles | Named decision owner | **Missing** for all 12 |
| Campaign membership | Segment + status | 164 **proposed** tribal cohort ≠ 12-account DC packet |
| Send / sequence logging | Resend ID, step, timestamp | Outreach send script logs locally; **not** Twenty-backed per tribal plan |
| n8n intake tested E2E | Staging submission → Twenty | Pending manual action (`web/docs/pending-manual-actions.md`) |

The **tribal** campaign model (Segments A–D, TBCP 3/NEGP applicants) in `docs/tribal-campaign-readiness-plan.md` is a **different** motion from the **12-account DIA packet**. Mixing them in Twenty would violate the locked strategy (grant help ≠ commission ask).

---

## Twenty connectivity from this VM

| Endpoint | HTTP | Authenticated API |
|----------|------|-------------------|
| `https://api.twenty.com/graphql` | 200 | **No** — `TWENTY_API_TOKEN` / `TWENTY_API_KEY` not set; unauthenticated query returns schema errors |
| `https://crm.tolowastudio.com` | 200 | Browser session not available to agent |
| `gcloud secrets ... motion-twenty-crm-api-token` | N/A | **`gcloud` not installed** on this VM |

**Conclusion:** Twenty API and web UI are **reachable on the network**, but this VM **cannot read or write CRM data** without injected credentials. Per instructions: **no Twenty writes were performed.**

On the operator M2 Mini, read-only audit last verified (**2026-08-25**): 7,650 people; 3,878 companies; 605 eligible; 0 campaign-ready.

---

## BrowserOS Neo

**Not available** on this Cloud Agent environment (not a Cursor plugin on this account). The M2 execution control doc (`docs/2026-08-25-konative-m2-execution-control.md`) describes Neo on `M2-Mini.local` for Mailgun session verification and role-evidence pilots — that path **does not apply here**.

Enrichment for this task used **Firecrawl CLI v1.23.3** (keyless tier). Do not record BrowserOS as the enrichment source for this run.

---

## Blockers (ordered)

1. **Jeramey approval gate** — no external send until explicit batch approval (`docs/2026-08-25-konative-m2-execution-control.md`, `docs/strategy/2026-07-15-validated-business-model-wedge-moat.md`).
2. **12-account packet artifacts missing from git** — cannot review or send from repo alone.
3. **0 campaign-ready CRM records** — proposed 164-person tribal cohort must not be reused as-is.
4. **No authenticated Twenty access on this VM** — cannot verify live schema, counts, or dedupe.
5. **No named, approved buyer contacts** for the 12 accounts.
6. **DIA briefs / Pathfinder opps** — artifacts drafted per strategy but not in repo; no closes documented.
7. **Gated accounts** in the 12 (Novva, Vantage, CAL-3, Sky River) — need explicit hold/residual routing before any sequence.
8. **TBCP 3 / NEGP (deadline 2026-09-17)** — navigator/trust only; must stay firewalled from brokerage campaign in Twenty.
9. **Send logging + opt-out** — tribal readiness plan lists as incomplete; audit enforces suppression but live sender integration unproven here.
10. **BrowserOS Neo / Mailgun verification** — blocked on M2 interactive re-login; irrelevant on this VM.

---

## Recommended next steps (documentation only — no sends)

1. **Restore or commit** the twelve-account validation packet and artifact index to `docs/outreach/` (or private ops store with checksums referenced from repo).
2. **Run read-only audit** on M2 or any host with `TWENTY_API_TOKEN` — confirm 12 accounts exist as companies/opportunities with correct lane/campaign fields.
3. **Map each account** to one opportunity stage + connectivity products + public evidence URL (see enrichment doc).
4. **Warm path only** — chase AVANT/T4 responses from 2026-07-15 asks before any account-facing email.
5. **Separate Twenty views** — DC 12-account validation vs tribal TBCP navigator leads vs proposed 164 cohort.
6. **Human review** — Jeramey signs off on first Pathfinder name-check results before `Approved for outreach` on any person.

---

## Related files

- `docs/ops/2026-08-28-account-enrichment.md` — public enrichment for the 12 accounts
- `docs/strategy/2026-07-15-validated-business-model-wedge-moat.md`
- `docs/operations/twenty-connectivity-model.md`
- `docs/ops/konative-crm-campaign-audit.md`
- `docs/2026-08-25-konative-m2-execution-control.md`
- `docs/tribal-campaign-readiness-plan.md`
