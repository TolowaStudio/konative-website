# Konative venture analysis — 2026-11

**Date:** 2026-11-15
**Ticket:** TOL-3546 (W1 of TOL-3545, Konative autonomous GTM engine)
**Status:** Draft for Jeramey's decisions. Research only: no external contact, no spend, no sends.
**Public repo note:** this repository is public. Internal Avant rates, client deal details and partner contact names are left out here. The full version is the private Notion page "Konative venture analysis — 2026-11" (Konative Project Hub).
**Builds on, does not replace:** `2026-07-15-validated-business-model-wedge-moat.md` (model, wedge and moat lock), `2026-07-06-market-storm-briefing.md` (market facts), `2026-07-06-legal-regulatory-brief.md` (tribal contracting and grant conflict-of-interest rules), the 2026-08-20 Jeramey lock and the 2026-08-30 tribal campaign direction (Stash `/projects/konative`).

**Ground rules this page assumes.** Konative is a brokerage, not a lead machine. Suppliers pay; buyers pay nothing. Konative does not write grants. TBCP Round 3 and NEGP close **2026-11-17 at 11:59 p.m. ET**, and Konative is not an eligible applicant and does not pursue applicants as brokerage targets. Stack: Twenty + Ghost + Mailgun + Resend (no Kit). Long-game, warm-first outreach. No send without Jeramey.

How to read the confidence tags:

- **[Confirmed]**: a cited public source or an internal record.
- **[Internal]**: from Konative's own records (Pathfinder, Stash, Linear). Not public. Do not quote externally.
- **[Assumption]**: my estimate, with the reasoning stated. Replace it with real numbers when they exist.

---

## 1. Where Konative stands today (2026-11-15)

| Item | State | Source |
|---|---|---|
| Positioning | Native-owned, vendor-neutral connectivity brokerage; Avant sub-agent / Trusted Advisor; "nearby fiber is not deliverable fiber" | live `konative.com/llms.txt` |
| Closed revenue | None recorded. No installed circuit, no residual. | Stash, Linear |
| Live opportunity | One inbound carrier/CLEC partner opportunity: multi-site, redundant 100G (TOL-1695). Deliverables were sent 2026-10-26. A reply to the partner's diligence questions is drafted but not sent. Waiting on Jeramey. Deal details are in the private Notion version of this page. | TOL-1695 |
| Warm asks | Sent 2026-07-15 to Avant (Pathfinder name-check, 10 sites) and T4DevCo (Sabey Decatur). No replies are recorded in the repo, Stash or Linear. | Stash |
| Cold email history | 225 delivered → 0 human replies (July). The 102-send tribal test got 0 replies, meetings or opportunities. This is history only; cold is now out of scope. | 2026-07-15 brief; Stash 2026-07-14 |
| CRM | Twenty has 7,650 people and 3,878 companies. 605 eligible tribal contacts, 164 proposed, **0 campaign-ready**. | TOL-462 |
| Outreach path | **Warm intros only, at $0** (Jeramey, 2026-11-15, TOL-3559). No cold-email domain or tool, no paid lead data. Cold outbound is out of scope. Nothing is sent without approval of the exact batch. | TOL-3559 |
| Site vs strategy | `llms.txt` matches the lock: DC primary, tribal secondary. The homepage pipeline-metrics block is being removed (TOL-3549). The remaining gap: homepage lane 01 still leads with "TBCP 3 & Tribal grants → Plan funded connectivity" rather than the DC hero and snapshot CTA (W2). | live homepage fetched 2026-11-15; TOL-3549 |

**One-line read:** the model is sound and the wedge is defensible. But four months after the July lock, Konative has one inbound opportunity and no warm-path conversions on record. With cold outbound out of scope by decision, everything rests on **warm-path origination and inbound**. Jeramey's time is the budget.

---

## 2. Model: Avant sub-agent commissions

### How money flows

The buyer signs the carrier order. The carrier pays Avant a residual on monthly recurring charge (MRC) for the life of the account. Avant passes Konative's share through under the sub-agent / Trusted Advisor agreement. Payment starts after install, not after signature. Some suppliers add a one-time SPIFF (a multiple of MRC). Non-recurring charges (NRC) such as construction and laterals generally carry no residual. Dark-fiber IRUs pay one-time, not residual. [Confirmed, category: market STORM F6, see `2026-07-06-market-storm-briefing.md`]

### Commission rates

| Layer | Range | Tag | Source |
|---|---|---|---|
| Industry residual to the channel | 15–20% of MRC typical; carrier range 5–25% | Confirmed | [Rev.io](https://www.rev.io/blog/telecom-agent-commissions); market STORM F6 |
| SD-WAN / SASE residual | ~17–20% of MRC | Confirmed (weak; trade blog) | [ChannelPulse](https://channelpulse.netlify.app/articles/telecom-residual-commissions) |
| Avant gross rates on carriers Konative has quoted | Pathfinder rate card, in the high-teens to low-20s % range for the major fiber carriers | **Internal**: exact per-carrier rates are kept out of this public repo; see the private Notion version | Pathfinder, 2026-10 |
| SPIFFs / upfront bonuses | Commonly 1–3× MRC on promoted products (examples: 2× MRC managed network, 1× MRR SASE) | Confirmed (promos) | [Telarus promos](https://promos.telarus.com) |
| **Konative's effective take** (after the Avant split) | **8–14% of customer MRC** if the pass-through is 50–70% | **Assumption: unconfirmed for four months** | market STORM F6 |

**The most important unknown in the model:** whether the Pathfinder gross % is what Konative itself receives as a Trusted Advisor, or what Avant receives before a sub-agent split. If Konative keeps the gross rate, every residual below roughly **doubles**. Both columns are modelled. Resolving this takes reading one agreement (target 2026-11-30, §6).

### Per-deal residual estimates

Price bands are public US list or median figures. Residual = MRC × rate. "Low" uses the effective 8–14% take. "High" uses the 18–22% gross. All rows are **[Assumption]** built from cited price bands.

| Deal type (typical Konative shape) | Customer MRC band | Monthly residual, effective take (8–14%) | Monthly residual, gross (18–22%) | Price source |
|---|---|---|---|---|
| **1G DIA**, single site | $600–1,500 (median ≈ $900) | $50–210 | $110–330 | [Meter](https://meter.com/resources/dedicated-internet-access-pricing); [California Telecom (Lightyear median)](https://californiatelecom.com/blog/enterprise-fiber-cost) |
| **10G DIA**, single site | $1,800–7,500 (median ≈ $2,000) | $145–1,050 | $325–1,650 | same |
| **Managed SD-WAN**, 10-site tribal ops/gaming WAN (overlay only; circuits are separate deals) | $100–500 per site → $1,000–5,000 | $80–700 | $180–1,100 | [Lightyear SD-WAN cost](https://lightyear.ai/blogs/sd-wan-cost); [CostBench](https://costbench.com/best/sd-wan-for-mid-market/) |
| **Transport / Ethernet private line**, 10G metro | $1,500–3,500 | $120–490 | $270–770 | MRC band is my assumption (no clean public 10G EPL median found); directional context: [Lightyear EPL](https://lightyear.ai/blogs/ethernet-private-line-cost) |
| **100G wave** (metro; long-haul is higher) | ≈ $2,050 median; long-haul and constrained routes several × higher | $165–290 per wave (metro median) | $370–450 per wave | Lightyear median ([EPL cost](https://lightyear.ai/blogs/ethernet-private-line-cost), [Zayo waves](https://lightyear.ai/tips/zayo-wavelengths)); [TeleGeography](https://blog.telegeography.com/bandwidth-price-erosion-accelerating-on-some-routes-still-stalled-on-other) |
| **P0 DC multi-tier package**: 2 diverse 100G waves + 2× 10G DIA on diverse carriers (lateral NRC excluded) | ≈ $8,000–15,000 | **$640–2,100** | **$1,440–3,300** | composite of the rows above |
| **Tribal casino / multi-site anchor**: primary + diverse DIA, SD-WAN over 6–10 sites, UCaaS | ≈ $5,000–10,000 | **$400–1,400** (+ UCaaS SPIFF) | **$900–2,200** | market STORM F6 ("anchor deal") |

**What this means:**

1. **Single DIA circuits do not build a business.** A 1G DIA pays roughly the cost of one lunch meeting per month. Prioritize multi-circuit, multi-site and DC packages. Use single DIA only as a door-opener.
2. **One P0 package ≈ 10–20 single-site DIA deals.** This is why the DC wedge stays P0 even though its cycle is long.
3. **Break-even math** [Assumption]: a $10k/month residual floor needs about **$70–125k MRC under management** at the effective take, or **$45–55k** at the gross rate. The July estimate of $80–100k MRC over 24–30 months holds only if the effective-take case is true.
4. **Lag:** residuals start 60–120 days after signature for DIA. DC deals follow the build schedule (often 6–12 months to install). Tribal deals take 12–24+ months end to end [Confirmed, market STORM F6]. **A deal signed in this 90-day window pays first cash in Q2–Q3 2027.** Target signed orders, not cash.
5. **Book value:** residual books trade at roughly 1–1.5× annual residuals, **only if the residuals are evergreen and assignable** [Confirmed category; legal brief §5]. This is unverified for Konative's agreement.
6. **Partner-deal sanity check** [Assumption]: a 4-site redundant-100G request is about 8 circuits at $3–6k = **$24–48k MRC**. Konative's share depends entirely on who is agent of record. If the partner signs as the CLEC and resells, Konative may get a one-time fee or nothing recurring. One such deal could clear most of the break-even floor, or pay zero. The structure matters more than the price.

---

## 3. ICP tiers

Per the 2026-07-15 reshape and the 2026-08-20 lock: the target is anyone buying connectivity. The **wedge** is data-center builders, buyers and brokers, plus tribes.

### P0: Data centers under construction needing multi-tier connectivity

| Field | Definition |
|---|---|
| Account | A named DC site that is permitted or under construction, with power secured or contracted. Builders (developer / GC), buyers (operator, colo, enterprise tenant) and **DC land / site brokers** (referral channel, per the 2026-08-20 lock). Secondary markets the boom moved into (Columbus, SLC, San Antonio, Reno, Alberta, etc.). |
| Buyer roles | VP / director of network or infrastructure, critical-facilities / dry-utilities lead, development PM, the developer's owner's rep. |
| Triggers | Permit or groundbreaking, utility / interconnection agreement, tenant announcement, phase-2 expansion, a stalled schedule caused by fiber. |
| Pain | "Nearby fiber is not deliverable fiber": lateral cost and lead time, path diversity, carrier on-net vs near-net, schedule risk. Fiber cable lead times run 20 weeks to 1 year [Confirmed, STORM F5]. |
| Deal shape | Diverse waves + DIA + DCI + cloud on-ramp. $8–15k+ MRC package. |
| Why P0 | Highest MRC per deal; schedule-critical urgency; the warm mid-build buyer engaged 8/10 in the July roast. |
| Seed list | July 12-account queue: COL5, Stream SATB, Sabey Decatur first; residual gates Novva, Vantage, CAL-3, Sky River Boyd. |

### P1: Tribal enterprise (gaming, government operations, multi-site)

| Field | Definition |
|---|---|
| Account | Tribal gaming enterprises / casinos, tribal governments and Section 17 corporations with multi-site operations (admin, clinic, public safety, hospitality). |
| Buyer roles | Casino / gaming IT director, tribal CIO / IT director, gaming-commission technology lead, CFO / procurement for renewals. |
| Triggers | Circuit or carrier contract renewal, casino expansion or new property, outage or uptime incident, new clinic or admin site, a cybersecurity mandate. |
| Pain | Uptime (gaming floor, payments, surveillance), single-carrier risk, renewal leverage, sovereignty and data control. |
| Deal shape | $5–10k MRC anchor (DIA + diverse path + SD-WAN + UCaaS). |
| Rules | Tribal contracting checklist applies to every deal (authority resolution, limited waiver + arbitration, TERO / licensing check) [legal brief]. Contract with the enterprise / Section 17 entity where possible. |
| Effort mix | Working assumption: ~70% DC / ~30% tribal. The July lock said 90/10; the 2026-08-30 direction stepped up the tribal campaign. |

### P1b: Prior TBCP awardees (Rounds 1–2) moving into operations

| Field | Definition |
|---|---|
| Account | Tribal entities with **already-awarded** TBCP R1/R2 networks that are being built or are entering operations. |
| What they buy (commissionable) | Ongoing IP transit, middle-mile transport, backhaul, DIA for anchor institutions, and operations-phase managed services. This is recurring spend after construction, not the grant itself. |
| Hard rule | If any circuit is paid with grant funds, the **pick-a-side rule** applies. Either Konative is the disclosed carrier-side agent with zero role in specs or bid evaluation, or it is the tribe's paid advisor with no supplier commission on that procurement. Never both. Disclose in writing. [2 CFR 200.318(c); legal brief §6] |
| Timing | "Clock B": grant-built networks buying circuits, mostly 2027+. Research-gated: drawdown was early as of July. |
| Never | "Congrats on your grant" → commission pitch (messaging lock). |

### Opportunistic (not a tier, but take it when it walks in)

- **Carrier / CLEC partners sourcing for their own end clients** (e.g. TOL-1695). Real MRC, but the agent-of-record and channel-conflict questions must be settled in writing first.
- **Inbound multi-site enterprise** from the site or LinkedIn in any vertical (the 2026-08-20 lock: "target is everyone").

### Out of scope (explicit)

- TBCP Round 3 / NEGP **applicants** as brokerage targets, and any grant-writing or application help as a Konative service. Konative does not write grants. The navigator stays a free trust resource.
- Grant-only contacts with no operating connectivity need.
- Hyperscalers buying IRUs or dark fiber direct.
- Residential and single-site SMB broadband below ~$500 MRC (not worth the cycle).
- **Cold outbound of any kind:** cold email, cold-email domains or sequencers, automated LinkedIn, and calls to scraped lists. Also paid lead data or enrichment, and messaging Twenty records with no prior relationship. (Jeramey, 2026-11-15, TOL-3559.)
- Unverified or scraped personas.
- The May 2026 powered-land / three-sided land brokerage / media-flywheel model (stale since the 2026-06-18 pivot). `docs/phase-one-offer.md` ($300k Development Readiness Engagement) belongs to that era and should not be revived without a decision.

---

## 4. Offer

### Front door (free): One-Site Snapshot

Already the locked offer (`llms.txt`: "one-page Market Connectivity Brief / One-Site Snapshot before any meeting ask"). This defines it so it can be produced consistently.

| Element | Content |
|---|---|
| Input | One address or parcel, required services (DIA / wave / DCI / SD-WAN), target in-service date. Nothing else. |
| Output (1 page) | On-net carriers at the address; near-net carriers with lateral distance; a diversity read (distinct carriers and entrances); indicative MRC band per service from public / median data (never a firm quote); lead-time risk; a recommended next step. |
| Variants | **DC:** "Nearby ≠ deliverable" site brief (on-net / near-net / lateral). **Tribal:** "Renewal continuity snapshot" (current carriers, alternatives, diversity gap). The existing `/tribal/carrier-check` (48-hour report) is the same product; merge the naming. |
| Turnaround | 48 hours (matches the carrier-check promise). |
| Effort | ~1–2 hours per snapshot (Pathfinder lookup + write-up) [Assumption]. This caps volume at roughly 5–10 per week with Jeramey's current time. |
| Proof it is non-public | Each snapshot must contain at least one fact a public map cannot give (Pathfinder on-net data, lateral footage, a carrier SE answer). Otherwise it is content marketing (July assumption 3). The October four-site assessment (TOL-1695) is the template: it showed one site with a single on-net carrier needing a sub-1,000 ft lateral for diversity, while another the client worried about had dozens of on-net carriers. |
| Conversion step | Snapshot → "want firm quotes?" → Pathfinder deal registration → quotes → proposal. |
| Rules | No firm pricing or carrier names to a counterparty who has not signed a mutual NDA with non-circumvention (TOL-1695 rule). Internal Avant rates are never shown. |

### Paid tier: options only (open decision; see §8)

The public promise is "suppliers pay; buyers pay nothing" (`llms.txt`, `/answers`). Any paid tier changes that promise and the site copy. These are the choices; prices are deliberately not chosen here.

| Option | What the buyer gets | Who pays | Pros | Cons / risks |
|---|---|---|---|---|
| **A. No paid tier** (status quo) | Snapshot + full brokerage | Suppliers only | Cleanest message; no conflict; matches site copy. | All revenue is lagged residual; no near-term cash; free work for tire-kickers. |
| **B. Multi-site / DC Connectivity Assessment, fee credited against orders** | Multi-site or campus diligence (diversity design, lateral options, carrier RFP pack) | Buyer pays a fixed fee, refunded or credited if they order through Konative | Filters serious buyers; some cash before install; still supplier-paid if they buy. | Fee size is a taste call; buyers may expect it free from a broker; must disclose the commission too. |
| **C. Advisor-side engagement (no supplier commission)** | Konative works as the buyer's paid advisor; no commission on that procurement | Buyer only | **The only compliant structure for grant-funded procurements** (pick-a-side rule); fits P1b. | Consulting-shaped, not book-building; risks drifting toward "grant help". Must stay operations / procurement, never application writing. |
| **D. Construction-phase connectivity diligence for DC developers** | Per-site diligence during permitting / pre-construction, ahead of any order | Developer | Matches P0 urgency; developers pay for diligence already. | Overlaps T4DevCo / WestPorch's work; partner-conflict risk; scope creep toward the stale $300k readiness offer. |

Public reference points for sizing (not recommendations): Lightyear prices procurement as SaaS. Brokers in the category publish no buyer fees. The stale internal anchor was $300k (a powered-land-era engagement, not comparable).

---

## 5. Channels and economics (warm intros only, $0)

**Decided by Jeramey, 2026-11-15 (TOL-3559):** outreach is warm intros only, at $0. There is no cold-email domain or tool and no paid lead data. Cold outbound is **out of scope**. It is not a later option and is not costed here.

| # | Warm channel | What qualifies as warm | Mechanism | Time cost | Expected yield (90 days) [Assumption] | Status |
|---|---|---|---|---|---|---|
| 1 | **Avant** (channel managers, SE bench, Pathfinder) | An existing Avant relationship | Name-checks on target sites; SE joint calls; partner-to-partner referrals; Avant events | Low | 2–4 qualified intros if Avant engages | Asked 2026-07-15; **no reply recorded**. Chase first. |
| 2 | **T4DevCo / WestPorch** (SiteIQ) | An existing partner relationship | DC developer adjacency (Sabey Decatur first); co-sell on sites they already touch | Low | 1–3 P0 site intros | Asked 2026-07-15; **no reply recorded**. |
| 3 | **Tribal relationships** (Synergy, CTUIR, Tolowa networks, TribalNet contacts, Native-owned IT partners) | Someone Jeramey or Tolowa already knows | One named casino-IT or tribal-IT intro per ask, not a campaign; teaming with a Native-owned prime for preference RFPs | Medium | 2–4 tribal meetings | The July plan asked for one Synergy / CTUIR intro; the outcome isn't recorded. |
| 4 | **Existing Twenty contacts with a real prior relationship** | A past two-way conversation, an in-person meeting, a prior inbound, or a current partner or customer. **The rest of Twenty's 7,650 records are not warm and are not contacted.** | A personal 1:1 note from Jeramey that names the prior contact and offers a One-Site Snapshot | Low | Depends on how many qualify (unknown until audited) | Needs a read-only Twenty audit that tags relationship evidence (W3). No writes without approval. |
| 5 | **Referrals** | An introduction from someone in channels 1–4, a snapshot recipient or a customer; DC land / site brokers; AMERIND, Tribal Ready and similar partners asked for an endorsement, not a list | After every snapshot or meeting: "who else is building or renewing?" | Low | 1–3 intros | Not started. |
| 6 | **Inbound** (konative.com, Cal.com, LinkedIn, Ghost newsletter) | Someone came to Konative first, or opted in to the newsletter | Snapshot CTA, carrier check, lateral estimator. Ghost goes only to opted-in subscribers, as nurture. | Low | 1–3 inbound requests per quarter (the TOL-1695 lead came from LinkedIn) | The form → Twenty path is tracked in TOL-489 / W7. The homepage pipeline block is being removed (TOL-3549). |

**Economics.** Cash cost is **$0** on every channel. The only cost is Jeramey's time, so the plan is sized to that.

Time per step [Assumption]:

| Step | Time each |
|---|---|
| Warm intro ask or follow-up | ~15 min |
| One-Site Snapshot | 1–2 h |
| First meeting, including prep | ~1 h |
| Pathfinder registration and quote | ~2 h |
| Proposal | 2–4 h |

The 90-day plan below comes to about **45–50 hours, or roughly 4 hours a week**.

Warm funnel, working backwards [Assumption]:

| Stage | Count | Conversion assumed |
|---|---|---|
| Warm asks | 40 | — |
| Intros | ~16 | 30–50% of asks |
| Qualified meetings | ~8 | ~50% of intros |
| Snapshots (meetings plus inbound) | ~10 | — |
| Quote requests / Pathfinder registrations | ~4 | 30–50% of snapshots |
| Proposals | ~2 | ~50% |
| Signed orders | ~0.5–0.8 | 25–40% of proposals |

A signed order inside 90 days is therefore a **stretch**, not the base case. The base case is a qualified pipeline in Twenty.

**Rules that hold on every channel:**

- Nothing is sent before Jeramey approves the exact batch (TOL-3559, item 2).
- No firm pricing or carrier names go to anyone without a mutual NDA.
- Internal Avant rates are never shown.
- Every touch is logged in Twenty against the stage model in `docs/operations/twenty-connectivity-model.md`. Bulk writes happen only on deduped, sourced records, with an undo log and approval (TOL-462 rules).

---

## 6. 90-day targets (2026-11-16 → 2027-02-13)

Every target is warm-path or inbound and costs $0. Residual cash will not arrive in this window (see the lag point in §2).

| By | Target | Measure (where it shows) |
|---|---|---|
| 2026-11-30 | Avant agreement read: actual split, evergreen clause, assignability, non-solicit scope. This is an input to the model (§2), not a decision. | One-line answer on TOL-3545 |
| 2026-11-30 | TOL-1695 partner deal resolved to a written agent-of-record and fee structure, **or** closed lost | TOL-1695 |
| 2026-12-05 | **Warm-path inventory: ≥ 40 warm contacts**, each with relationship evidence, mapped to P0 / P1 / P1b accounts (channels 1–5). Read-only. | Evidence sheet; no Twenty writes without approval |
| 2026-12-15 | **First warm batch (≤ 10 recipients) proposed to Jeramey**, with recipients, copy version, sender, suppression result and stop condition | TOL-3559, item 2 |
| 2027-01-15 | 40 warm asks made (after approval), giving ~16 intros | Twenty activity log |
| 2027-02-13 | **8 qualified first meetings** (named buyer, real site, timeline) | Twenty opportunities |
| 2027-02-13 | **10 One-Site Snapshots delivered** to people who asked, including **≥ 3 inbound** requests | Twenty (artifact-requested stage) |
| 2027-02-13 | **4 Pathfinder deal registrations, 2 proposals delivered** | Pathfinder IDs on Twenty opportunities |
| 2027-02-13 | Stretch: **1 signed order ≥ $3k MRC**, or a signed SPIFF-bearing order | Twenty "Ordered" stage |
| Ongoing | $0 spend; zero cold sends; zero sends without approval | Send receipts |
| Ongoing | Weekly scoreboard (W8): warm contacts, asks, intros, meetings, snapshots, registrations, proposals, orders, MRC signed | TOL-3545 comments |

Working effort mix: ~70% P0 DC and ~30% P1 / P1b tribal. DC carries the MRC; tribal carries the long cycle and the moat.

---

## 7. Kill criteria

Checked at **day 45 (2026-12-31)** and **day 90 (2027-02-13)**. Each line names what stops and what happens next. Cold outbound is never the fallback.

| # | Trigger | Action |
|---|---|---|
| K1 | The Avant agreement **lacks evergreen residuals that survive termination, or bars assignment**, and Avant won't amend | Stop scaling origination through Avant. Multi-home to a second TSD (the average advisor uses ~2.9) or pause. The "book is the asset" thesis is void. |
| K2 | **2026-12-05: warm-path inventory < 20 real warm contacts** | The warm-only plan cannot reach these targets. Halve the targets, concentrate on the strongest channel plus inbound, and tell Jeramey. |
| K3 | **Day 45: < 3 named meetings from warm channels combined** | Warm reach is too thin at current relationships. Narrow to the one channel that produced, plus inbound, and escalate to Jeramey. |
| K4 | **Day 90: 0 Pathfinder registrations and 0 proposals** | Stop P0 DC origination. Hold the site as inbound / authority only. Make a venture-level continue / hold decision. |
| K5 | **10 snapshots delivered → 0 quote requests** | The snapshot is content, not proof. Stop producing it; redesign around non-public carrier facts or drop it. |
| K6 | Any deal where Konative would both shape a grant-funded procurement **and** take a supplier commission | Stop that deal immediately. Apply the pick-a-side rule. Never both. |
| K7 | Any send without approval, any cold send, any spend, or any complaint | Halt all outreach. Post-mortem before resuming. |
| K8 | Konative takes more than **6 hours a week** of Jeramey's time [Assumption] for 4 straight weeks with 0 qualified opportunities | Cut to inbound and partner deals only. |
| K9 | **Venture-level, 2027-05-15 (6 months):** < $5k MRC signed in total | Wind down active GTM. Keep the site, the navigator and any residuals; no new engine work. |

---

## 8. Decisions still open for Jeramey

Two decisions are open. Both are tracked on TOL-3559.

| # | Decision | Options | Notes |
|---|---|---|---|
| **1** | **Offer and pricing** (TOL-3559, item 1) | Approve the free One-Site Snapshot as the front door, with supplier-paid brokerage behind it. Then pick a paid tier: A none / B assessment with the fee credited against orders / C advisor-side, no commission / D DC construction diligence (§4), and its price. | C is the only structure allowed on a grant-funded procurement. Any paid tier changes the public "buyers pay nothing" line, so the site copy would change with it. |
| **2** | **First-send approval** (TOL-3559, item 2) | Approve, edit or reject the exact first warm batch (≤ 10 recipients) when it is presented around 2026-12-15 | Nothing goes out before this approval. |

**Settled 2026-11-15:**

- Warm intros only, at $0: no cold domain or tool and no paid lead data (TOL-3559).
- The homepage pipeline-metrics block is being removed (TOL-3549).

---

## Sources

Public:
[Rev.io: telecom agent commissions](https://www.rev.io/blog/telecom-agent-commissions) ·
[ChannelPulse: telecom residual commissions](https://channelpulse.netlify.app/articles/telecom-residual-commissions) ·
[Telarus supplier promotions](https://promos.telarus.com) ·
[Meter: DIA pricing](https://meter.com/resources/dedicated-internet-access-pricing) ·
[California Telecom: enterprise fiber cost](https://californiatelecom.com/blog/enterprise-fiber-cost) ·
[Lightyear: business internet cost](https://lightyear.ai/blogs/how-much-business-internet-costs) ·
[Lightyear: Ethernet private line cost](https://lightyear.ai/blogs/ethernet-private-line-cost) ·
[Lightyear: SD-WAN cost](https://lightyear.ai/blogs/sd-wan-cost) ·
[CostBench: SD-WAN for mid-market](https://costbench.com/best/sd-wan-for-mid-market/) ·
[TeleGeography: bandwidth price erosion](https://blog.telegeography.com/bandwidth-price-erosion-accelerating-on-some-routes-still-stalled-on-other) ·
[2 CFR 200.318](https://www.ecfr.gov/current/title-2/subtitle-A/chapter-II/part-200/subpart-D/subject-group-ECFR45ddd4419ad436d/section-200.318) ·
[NTIA TBCP Round 3](https://broadbandusa.ntia.gov/funding-programs/tribal-broadband-connectivity/round-three-notice-of-funding-opportunity) ·
[NTIA NEGP](https://broadbandusa.ntia.gov/funding-programs/native-entities-grant-program)

Internal: Stash `/projects/konative` and `/projects/konative/strategy` (2026-07-15 lock and reshape, 2026-08-20 lock, 2026-08-30 direction, 2026-10-22 Pathfinder research) · Linear TOL-462, TOL-659, TOL-1695, TOL-3545 · live `konative.com` and `konative.com/llms.txt` (fetched 2026-11-15) · repo `docs/strategy/2026-07-*`.

Price bands come from vendor and broker publications and move fast; treat them as directional. Firm numbers come from Pathfinder quotes on real addresses.
