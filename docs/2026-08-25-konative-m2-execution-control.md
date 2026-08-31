# Konative M2 Mini — execution control

**Owner:** Tolowa CTO on `M2-Mini.local` (`100.67.55.81`).

**Operating rule:** The M2 Mini, not a laptop, performs recurring execution. Stash `/projects/konative` is durable operational memory; this file is the repository execution mirror. The daily OpenMaus routine `fa1b1e83-21b5-4277-858a-83a74edb84c0` is the scheduler.

## Non-negotiable safety gates

1. Never write to Twenty CRM, send or queue a campaign, or call an apply mode without Jeramey's explicit approval of that exact batch.
2. Never reuse the rejected 164-contact cohort or the 21 `QUEUED` records as-is.
3. Treat the 164 contacts as proposed, not reviewed or campaign-ready. `0` campaign-ready is the current validated baseline.
4. Preserve immutable audience snapshots, suppression checks, and sender-event sync before any future send readiness decision.
5. TBCP R3 and NEGP both close 2026-11-17 at 11:59 p.m. ET under the current NTIA notices.

## Verified baseline — 2026-08-25

- Twenty audit: 7,650 people; 3,878 companies; 605 eligible; 164 proposed cohort; 21 excluded `QUEUED`; 0 campaign-ready.
- Cohort integrity hash: `1ba05c1384ebe6d898ec301f8bef5f529ae7251b117190617caee887c80f1f03`.
- Read-only audit tests: 24 passing.
- BrowserOS pilot: 6/10 roles confirmed, 4 unresolved.
- Evidence writer dry-run: 5 evidence-only candidate mutations; no actual CRM changes.
- Enrichment tooling is committed locally on the M2 at `8063aac`; GitHub push previously failed because remote GitHub authentication was unavailable.
- The tooling was safely replayed onto current `origin/main` on the M2 as `d9e28c4` and is now under review in GitHub PR #69. Do not force-push, duplicate the PR, or merge it without the normal review path.
- A host-side, credential-in-memory read-only audit on the M2 reverified the baseline and hash above. Private artifacts are in `/tmp/konative-audit-20260825-m2-host` (mode 0700); no CRM write occurred.
- BrowserOS Neo and its OpenMaus bridge were live-tested on the M2. The Mailgun console is reachable but stuck at “Loading session...”; this is an interactive re-login requirement, not a missing browser integration. Do not retry it automatically until the session is restored.
- Official-source work resolved three additional pilot roles. One claim remains genuinely unresolved and must not be upgraded without a new primary source. The stale public claim “164 — reviewed tribal contacts in the first campaign base” was approved for correction on 2026-08-30; the validated replacement is “164 proposed tribal contacts — pending review, 0 approved for campaign.”

## Factual correction scope — 2026-08-30

- Current deadline authority: [TBCP Round 3](https://broadbandusa.ntia.gov/funding-programs/tribal-broadband-connectivity/round-three-notice-of-funding-opportunity) and [NEGP](https://broadbandusa.ntia.gov/funding-programs/native-entities-grant-program). Each current NTIA page states November 17, 2026 at 11:59 p.m. ET.
- Active public pages, LLM feeds, campaign templates, tests, generators, seed descriptions, and current operating documents must use the current deadline.
- `docs/strategy/2026-06-23-gtm-business-plan.md` and `docs/strategy/2026-07-06-market-storm-briefing.md` remain unchanged as dated historical snapshots. Their former-deadline statements are archival evidence, not current operating authority.
- This correction does not approve outreach, CRM changes, deployment, spending, or campaign execution.

## Ordered M2 work queue

1. Monitor PR #69; do not duplicate its rebase, force-push, or merge it automatically.
2. Wait for the interactive BrowserOS Neo Mailgun re-login, then record a sender/suppression verification receipt. No campaign action follows automatically.
3. Keep the one unresolved pilot claim unresolved unless a new official source appears; store evidence packets and candidate diffs only.
4. Verify the approved public “164 reviewed” correction in the factual-corrections PR; do not reinterpret that approval as campaign-send authorization.
5. Obtain an explicit IAM decision before expanding the M2 runtime service account beyond `get_secret`; do not rely on Jeramey’s personal gcloud identity as a durable service credential.

## Completion gates for this control cycle

- Approval-gated tooling is reviewable in PR #69 and subsequently merged through the normal review path.
- All ten pilot records have evidence packets with explicit role/affiliation status; unresolved claims remain unresolved unless primary evidence is later found.
- BrowserOS Neo has an active Mailgun session and sender identity/suppression verification has a recorded receipt.
- Public-copy discrepancy has a tracked decision and, only if approved, a verified correction.
- Any proposed CRM metadata batch is shown to Jeramey with immutable manifest, evidence, validation result, and rollback plan; only an explicit approval may unlock application.

## Reporting protocol

Each M2 run must update Stash `/projects/konative` and the existing Linear issue `TOL-462` (search before creating another). Mark `needs:jeramey` only for an actual approval/decision. Email only when a specific batch is genuinely ready for approval. Include commands/results, evidence locations, and the next constrained action.

## Current risks

- BrowserOS Neo reaches Mailgun but needs Jeramey to re-authenticate its interactive session; this blocks sender/suppression verification.
- The M2 runtime secret bridge can retrieve a named secret but cannot list names, and currently depends on Jeramey's personal gcloud identity; a dedicated IAM design requires an explicit decision.
- OpenMaus routine schedule is enabled but its API did not expose a recorded last run during the 2026-08-25 control verification; manually trigger and verify a run receipt before relying on unattended scheduling.
- BATON fleet parity is blocked by unrelated offline hosts; Konative execution is deliberately limited to the healthy M2 Mini.

## Exact next action

Manually trigger the existing Konative OpenMaus routine on the M2 Mini, then verify a durable run receipt in Stash and `TOL-462`. Its first task is to finish the four unresolved BrowserOS Neo role verifications with official-source evidence, without changing CRM or campaigns.
