# Konative campaign set — 2026-11 (DRAFTS ONLY)

**Status: DRAFT. Nothing in this folder has been sent, scheduled, or loaded
into Mailgun, Resend, Ghost, Twenty, LinkedIn or Cal.com.** First send needs
Jeramey's explicit approval of the exact batch (≤10 recipients, warm-path-first)
through the Konative decision gate (Linear TOL-3559, item 2).

Linear: TOL-3553 (W4) · parent TOL-3545 · compliance origin TOL-659.

## What is here

| File | What it is |
|---|---|
| [`warm-intros.md`](./warm-intros.md) | Warm-intro asks: Avant, T4DevCo / WestPorch, existing tribal relationships. **Run these first.** |
| [`tier-dc-under-construction.md`](./tier-dc-under-construction.md) | P0 — data centers under construction: 3-touch email + LinkedIn variants |
| [`tier-tribal-enterprise-gaming.md`](./tier-tribal-enterprise-gaming.md) | P1 — tribal enterprise / gaming / multi-site ops: 3-touch email + LinkedIn |
| [`tier-tbcp-awardees-operations.md`](./tier-tbcp-awardees-operations.md) | P1b — prior TBCP awardees moving into operations: 3-touch email + LinkedIn |
| [`newsletter-tribal-infrastructure-brief-001.md`](./newsletter-tribal-infrastructure-brief-001.md) | Ghost newsletter issue draft (markdown only; not created in Ghost) |
| [`COMPLIANCE.md`](./COMPLIANCE.md) | Filled pre-send checklist: CAN-SPAM, WA CEMA, suppression/DNC, sending path, sender identity |

## Order of operations (warm-path-first)

From the 2026-07-15 roast RESHAPE and the 2026-07-15 messaging lock
(`docs/strategy/2026-07-15-validated-business-model-wedge-moat.md`):

1. For each target account, search for a warm path (Avant, T4DevCo / WestPorch,
   tribal peer). If one exists, use `warm-intros.md` — not the tier sequence.
2. Only if no warm path exists, the account becomes eligible for the tier
   sequence (cold residual), and only on a compliant sending path
   (see `COMPLIANCE.md` §4 — **not** Mailgun or Resend).
3. LinkedIn variants are manual, 1:1, from Jeramey's own profile. No automation
   tools.

## The single CTA

Every prospect-facing touch has one ask: **request a One-Site Snapshot** at
`https://konative.com/contact#request`.

What a One-Site Snapshot is (from the W1 offer, TOL-3546 / TOL-3559 item 1 —
pending Jeramey's offer approval): a free, one-page read on one named site —
which carriers can actually reach it, physical-path diversity, and the renewal
or construction timing that matters. Supplier-paid brokerage sits behind it.

> **Naming gap (blocking for send, not for drafts):** konative.com does not yet
> use the words "One-Site Snapshot". Today the site says "One-Page Site Brief"
> (`/data-center-connectivity`) and "Continuity Snapshot" (`/tribal`), both
> pointing at `/contact#request`. The contact form also ignores the
> `?projectType=` query string those pages send. Before first send, either the
> site adopts "One-Site Snapshot" (W2, TOL-3549) or these drafts are changed to
> the site's wording. A prospect must land on a page that matches the email.

## Reuse map — what this builds on (not duplicated)

| Prior work | How it is reused here |
|---|---|
| `docs/outreach/tribal-connectivity-campaign-drafts.md` (Campaigns A–D) | Body language for award-to-operations, tribal resilience, gaming uptime and DC planning was tightened into the 3-touch tier sequences. Its approval checklist is carried into `COMPLIANCE.md`. That file stays as the earlier version. |
| `docs/strategy/2026-07-15-validated-business-model-wedge-moat.md` | Messaging lock, hero lines, cold-residual email shape, "messages that waste air" list. |
| `docs/outreach/README.md` | 3-touch spacing (5–7 business days) and the "Touch 3 = close the loop" pattern. Its `/readiness-audit` CTA is **not** reused (old powered-land offer). |
| `docs/tribal-campaign-readiness-plan.md` | Approved-for-outreach status, logging every send to Twenty. |
| `web/src/lib/jev/sendSafetyGate.ts`, `web/src/lib/outreach/campaign/batchLifecycle.ts` | Existing send gate takes a `suppression_checked` flag; `COMPLIANCE.md` §3 says what must be true before that flag is set. |
| Stash `/projects/konative` | July 2026 cold campaign outcome (102 delivered, 0 real replies) — reason cold is residual only. |

## Claims register

Every factual claim used in these drafts, with its source. Anything not on this
list must not be added to a send without a source.

| # | Claim used in copy | Source |
|---|---|---|
| C1 | Konative is a vendor-neutral connectivity brokerage | konative.com site copy; Stash /projects/konative (June 2026 repositioning) |
| C2 | Konative is an Avant sub-agent (Avant calls the role "Trusted Advisor") | Jeramey, 2026-10-27 (Stash /projects/konative) |
| C3 | Suppliers pay Konative when they win the business; no advisory fee to the buyer | konative.com site copy ("Suppliers pay Konative's fee when they win the business. There is no advisory charge…"); `docs/strategy/2026-07-15-validated-business-model-wedge-moat.md` §model |
| C4 | Konative is Native-owned | konative.com site copy ("Native-owned"); venture brief |
| C5 | Konative is a trade name of Tolowa Pacific LLC | Venture brief; TOL-3549 (footer correction "Total" → "Tolowa") |
| C6 | Konative does not write grants and is not a TBCP3/NEGP applicant | TOL-3545 hard rules |
| C7 | A named organization received a TBCP award (P1b only) | **Per-recipient**: NTIA public award listing URL must be pasted into the Twenty record before the touch is approved. No award amount in copy unless it is on that page. |
| C8 | A named DC project is under construction (P0 only) | **Per-recipient**: public signal URL (permit, press release, utility filing) pasted into the Twenty record before approval. |

Deliberately **not** claimed anywhere: percentages saved, supplier counts, "the
only…" superlatives, carrier on-net counts for a prospect's site (those belong
in the Snapshot itself, after research), any TBCP3/NEGP deadline or eligibility
statement, and anything about the Avant agreement's terms.

## Merge fields

`[First name]`, `[Organization]`, `[Site / Project]`, `[City, State]`,
`[Signal]` + `[Signal URL]` (P0), `[Award source URL]` (P1b),
`[Warm contact first name]`, `{{POSTAL_ADDRESS}}`, `{{UNSUBSCRIBE}}`.
A draft with an unfilled merge field fails the pre-send check.

## Undo

Drafts only. Close the PR, or delete this folder. Nothing external was changed.
