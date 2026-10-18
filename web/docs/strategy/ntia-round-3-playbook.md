# B13 — NTIA TBCP Round 3 Connectivity Partner Campaign

**Status:** Active · time-sensitive
**Owner:** Konative (subagent under Avant Communications)
**Landing asset:** `/ntia` (`web/src/app/(frontend)/ntia/page.tsx`)
**Hard deadline:** Application window closes **November 17, 2026 at 11:59 p.m. ET**
**Award horizon:** Rolling awards begin **Spring 2027**

---

## 1. Objective

Position Konative as the **connectivity design partner** for Tribal entities
applying to the NTIA Tribal Broadband Connectivity Program (TBCP) Round 3 and the
Native Entities Grant Program (NEGP), so that carrier-grade operational
connectivity is specified into their proposals **before the Nov 17, 2026
deadline** — and Konative is the pre-negotiated, vendor-neutral broker that
executes and manages that connectivity when awards land in Spring 2027.

The grant funds infrastructure. Konative sells the recurring operational layer
that runs on top of it. This campaign gets Konative into the room during the
pre-award window, when the connectivity architecture is still being decided.

**One-line thesis:** *Grants fund the fiber. We broker the connectivity that
runs on it — at $0 cost to the Tribe.*

---

## 2. ICP — who we're targeting

Primary: **Tribal entities that are applying (or evaluating applying) to R3/NEGP.**

| Segment | Buying role / first contact | Why they need Konative |
| --- | --- | --- |
| Tribal governments | Broadband director, IT director, tribal administrator, grants/planning lead | Own the application and the enterprise (gaming, gov, health, education) that will run on the network. |
| Tribal broadband authorities / utilities | Executive director, network/ops lead | Build the infrastructure; still need the operational connectivity + carrier contracts on top. |
| Tribal colleges & universities (TCUs) | CIO / IT director | Campus connectivity, redundancy, cloud on-ramps. |
| Tribal organizations | Program director, consortium lead | Multi-site connectivity across member entities. |
| Alaska Native Corporations (ANCs) | Infrastructure / telecom lead | Remote, low-density routes where vendor-neutral sourcing matters most. |
| Native Hawaiian organizations (DHHL) | Program / homestead infrastructure lead | Same infrastructure-vs-operational gap. |

**Disqualifiers / lower priority:** entities with no intent to apply this round,
or that already have a locked-in incumbent connectivity contract with no renewal
in the R3 execution window (revisit at renewal, don't force it now).

**Trust signal to lead with in every touch:** *vendor-neutral.* Konative is not a
carrier. That neutrality — plus sovereignty awareness and $0 cost — is the whole
pitch.

---

## 3. The offer / value prop to a grantee

What a Tribal applicant gets, at **$0 cost** (suppliers pay Konative's
commission):

1. **Connectivity architecture review** — map the operational connectivity the
   proposed build will require, so it's specified into the proposal instead of
   discovered after award.
2. **Vendor-neutral sourcing** across Avant's 100+ suppliers — the whole market,
   including fixed wireless and satellite where fiber doesn't reach.
3. **Pre-negotiated carrier terms** staged during pre-award, ready to execute the
   moment funding lands.
4. **Sovereignty-aware advisory** — works with the enterprise and grant team, not
   around them; understands the line between an infrastructure grant and the
   operational layer.
5. **Lifecycle management** — one point of contact for every carrier, for the life
   of the account.

The offer is **not** "we'll write your grant." It's "we'll make sure the
connectivity that grant depends on is designed right, sourced neutrally, and
ready to run."

---

## 4. The three-phase motion (against the calendar)

### Phase 1 — Pre-award · NOW → Nov 17, 2026
**Goal:** get specified into as many R3 proposals as possible; build the pipeline.

Concrete actions:
- Build/refresh the target list from the `tbcp_awards` table (see §6) — prioritize
  entities flagged `nofo_round = 'R3'` (or prospective R3) with `outreach_status`
  of `not_started`.
- First-touch outreach (see §5) framed entirely around the **Nov 17 deadline**
  and the infrastructure-vs-operational gap.
- Offer a free **connectivity architecture review** as the meeting hook.
- For engaged applicants: produce a connectivity design brief they can reference
  or attach in their proposal; begin pre-negotiating carrier terms.
- Cadence urgency ramps as the deadline approaches; final-call sequence belongs
  in the **two weeks before Nov 17** and remains subject to the campaign approval gate.

**Exit criterion for a prospect:** connectivity specified into their proposal, or
a signed intent to work together post-award.

### Phase 2 — Award · Spring 2027 (rolling)
**Goal:** convert specified applicants into executed connectivity contracts.

Concrete actions:
- Monitor rolling award announcements; update `outreach_status` and
  `award_amount` on the `tbcp_awards` row as winners are named.
- For winners we engaged pre-award: move pre-negotiated terms from plan to order.
- For winners we did **not** reach pre-award: fast-follow — they now have funding
  and an infrastructure build with no operational connectivity plan.
- Sequence congratulatory + execution outreach the week each award posts.

### Phase 3 — Operations · 2027 and beyond
**Goal:** evergreen residual commission for the life of each account.

Concrete actions:
- Manage the connectivity contracts: billing disputes, moves/adds/changes,
  escalations, renewals.
- Expand within the account (add sites, add services — SD-WAN, voice, security,
  cloud on-ramps).
- Feed operational learnings back into the target model (which entity types,
  which enterprises — casino / clinic / gov / school — convert and expand best).

---

## 5. Outreach sequence outline

Channel mix: **email primary**, LinkedIn for warm-up on named contacts, phone for
engaged prospects. Warm intros through existing Tribal/Avant relationships beat
cold every time — prioritize them.

First-touch email (skeleton — personalize per entity):

> **Subject:** The connectivity TBCP Round 3 won't fund — before Nov 17
>
> [Name] — TBCP Round 3 and the Native Entities Grant Program put ~$790M toward
> Tribal infrastructure, and the window closes November 17, 2026 at 11:59 p.m. ET. The grant funds
> the fiber and the build. It does **not** fund the operational connectivity that
> runs on it — the enterprise internet, SD-WAN, voice, security, redundancy, and
> cloud on-ramps that keep a gaming floor, clinic, or government office running.
>
> Konative is a vendor-neutral connectivity brokerage (subagent under Avant, 100+
> suppliers). We help Tribal applicants design and source that layer so it's
> specified into the proposal now and ready to execute when funding lands in 2027
> — at **no cost to the Tribe**; suppliers pay us.
>
> Worth a 20-minute connectivity architecture review before the deadline?
>
> [link → /ntia] · [book → cal.com/jeramey-james]

Follow-up cadence (pre-award):
1. **Day 0** — first touch (above).
2. **Day 4** — the gap, made concrete: one specific enterprise example (casino
   floor / tribal clinic) + the $0-cost reframe.
3. **Day 9** — vendor-neutral proof: "we're not a carrier; we quote the whole
   market including fixed wireless/satellite where fiber doesn't reach."
4. **Day 16** — deadline urgency: days remaining until Nov 17; offer to review
   before submission.
5. **Final-call (T-14 to T-2 before Nov 17)** — last chance to specify
   connectivity into the proposal.

All links point to `/ntia`; the on-page CTA routes to `/contact#request` and
`cal.com/jeramey-james`.

---

## 6. How `tbcp_awards` feeds the campaign

Supabase table `tbcp_awards` is the operational spine of the campaign — it is
both the target list (pre-award) and the conversion tracker (award/ops).

| Field | Campaign use |
| --- | --- |
| `grantee_name` | Primary entity record / dedupe key. |
| `tribe_name` | Segment + personalization; warm-intro routing. |
| `state` | Territory prioritization; regional outreach batching. |
| `award_amount` | Populated at award; sizes the operational-connectivity opportunity (bigger build → bigger recurring layer). |
| `nofo_round` | **Primary filter.** Target `R3` / prospective-R3 rows in Phase 1; historical rounds inform which entities are repeat applicants. |
| `datacenter_potential` | Cross-sell flag — bridges into the data-center connectivity wedge. |
| `casino_present` | High-value enterprise signal — gaming floors need carrier-grade redundancy/security; strongest first-touch example. |
| `edc_present` | Economic development corp present → multi-entity, multi-site expansion potential. |
| `outreach_status` | Campaign state machine: `not_started → contacted → engaged → specified → won → managing` (or `disqualified`). Drives the daily work queue and the follow-up cadence in §5. |

**Working queries (conceptual):**
- Phase 1 queue: `nofo_round = 'R3' AND outreach_status = 'not_started'`, ordered
  by `casino_present DESC, state`.
- Priority tier: rows where `casino_present` **or** `edc_present` is true — larger
  operational footprint, faster payback.
- Cross-sell watchlist: `datacenter_potential = true` → hand to the data-center
  wedge in parallel.
- Award tracking: as winners post, set `award_amount` + advance `outreach_status`;
  Phase 2 fast-follow list = `nofo_round = 'R3' AND outreach_status IN ('contacted','specified') AND award_amount IS NOT NULL`.

Keep `outreach_status` current — it is the single source of truth for what to do
next and for reporting.

---

## 7. Success metrics & hypotheses

Leading indicators (pre-award):
- # R3 targets loaded and contacted (coverage of the eligible universe).
- Meeting/consult rate (connectivity architecture reviews booked).
- # proposals we're **specified into** (the real pre-award KPI).
- # applicants with pre-negotiated carrier terms staged.

Lagging indicators (award → ops):
- Win-attach rate: of applicants we specified into, % that win **and** execute
  connectivity with Konative.
- # connectivity contracts executed post-award.
- Monthly recurring commission (residual) under management.
- Expansion rate: additional sites/services added per account over 12 months.

Hypotheses to test:
- **H1** — Applicants engaged **pre-award** convert to executed connectivity at a
  materially higher rate than winners reached only post-award. (If true, front-load
  spend before Nov 17.)
- **H2** — `casino_present` entities convert fastest and expand most (gaming floors
  have the sharpest need for redundancy/security). (If true, weight the queue on it.)
- **H3** — Vendor-neutral + $0-cost framing out-performs any capability-led message
  in first-touch reply rate. (A/B the first email.)
- **H4** — Warm intros (existing Tribal/Avant relationships) beat cold outreach by
  a wide enough margin to justify prioritizing relationship-sourced targets first.

---

## 8. Risks & watch-items

- **Deadline is fixed.** The pre-award window is the whole game; miss it on a given
  entity and the next real entry point is post-award fast-follow (weaker position).
- **Program details evolve.** The ~$790M figure and the Nov 17, 2026 / Spring 2027
  dates are the current program facts used across the site — verify against the
  latest NTIA guidance before external claims; keep the landing page and this doc in
  sync.
- **Sovereignty sensitivity.** Every touch must respect Tribal jurisdiction and
  governance. Konative advises the enterprise; it does not insert itself into the
  grant application or Tribal decision-making.
- **Neutrality must stay real.** The pitch collapses if Konative is perceived as
  fronting for one carrier. Sourcing must genuinely run the whole Avant portfolio.
