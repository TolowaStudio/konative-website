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
| Cold email record | 225 delivered → 0 human replies (July). The 102-send tribal test got 0 replies, meetings or opportunities. | 2026-07-15 brief; Stash 2026-07-14 |
| CRM | Twenty has 7,650 people and 3,878 companies. 605 eligible tribal contacts, 164 proposed, **0 campaign-ready**. | TOL-462 |
| Sending path | Mailgun console session is blocked (needs a human re-login). Cold sending through Mailgun or Resend is prohibited by both providers' terms. | TOL-462, TOL-659 |
| Site vs strategy | `llms.txt` matches the lock: DC primary, tribal secondary. The **homepage does not**. Lane 01 is "TBCP 3 & Tribal grants → Plan funded connectivity", and the hero CTA pair includes "TBCP 3 / NEGP help". The homepage also publishes internal pipeline counts ("164 proposed tribal contacts…", "17 TBCP award-matched organizations…"). This is W2 work. | live homepage fetched 2026-11-15 |

**One-line read:** the model is sound and the wedge is defensible. But four months after the July lock, Konative has one inbound opportunity, no warm-path conversions on record and no compliant cold path. The binding constraint is **origination volume through warm channels**, not strategy.

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

**The most important unknown in the model:** whether the Pathfinder gross % is what Konative itself receives as a Trusted Advisor, or what Avant receives before a sub-agent split. If Konative keeps the gross rate, every residual below roughly **doubles**. Both columns are modelled. Resolving this takes reading one agreement (Decision D1).

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
| Sequencing tension | July lock: 90% DC / 10% tribal nurture. The 2026-08-30 Jeramey direction: *intensify* the tribal campaign. **These conflict; see Decision D4.** |

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
- Unverified or scraped personas; any bulk-list cold send.
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

### Paid tier: options only (Jeramey decides; D2)

The public promise is "suppliers pay; buyers pay nothing" (`llms.txt`, `/answers`). Any paid tier changes that promise and the site copy. These are the choices; prices are deliberately not chosen here.

| Option | What the buyer gets | Who pays | Pros | Cons / risks |
|---|---|---|---|---|
| **A. No paid tier** (status quo) | Snapshot + full brokerage | Suppliers only | Cleanest message; no conflict; matches site copy. | All revenue is lagged residual; no near-term cash; free work for tire-kickers. |
| **B. Multi-site / DC Connectivity Assessment, fee credited against orders** | Multi-site or campus diligence (diversity design, lateral options, carrier RFP pack) | Buyer pays a fixed fee, refunded or credited if they order through Konative | Filters serious buyers; some cash before install; still supplier-paid if they buy. | Fee size is a taste call; buyers may expect it free from a broker; must disclose the commission too. |
| **C. Advisor-side engagement (no supplier commission)** | Konative works as the buyer's paid advisor; no commission on that procurement | Buyer only | **The only compliant structure for grant-funded procurements** (pick-a-side rule); fits P1b. | Consulting-shaped, not book-building; risks drifting toward "grant help". Must stay operations / procurement, never application writing. |
| **D. Construction-phase connectivity diligence for DC developers** | Per-site diligence during permitting / pre-construction, ahead of any order | Developer | Matches P0 urgency; developers pay for diligence already. | Overlaps T4DevCo / WestPorch's work; partner-conflict risk; scope creep toward the stale $300k readiness offer. |

Public reference points for sizing (not recommendations): Lightyear prices procurement as SaaS. Brokers in the category publish no buyer fees. The stale internal anchor was $300k (a powered-land-era engagement, not comparable).

---

## 5. Channels and economics

Ranked by expected meetings per Jeramey-hour. Every cost below is **[Assumption]** except where noted.

| # | Channel | Mechanism | Cash cost | Time cost | Expected yield (90 days) | Status |
|---|---|---|---|---|---|---|
| 1 | **Avant** (channel managers; SE bench; Pathfinder) | Name-checks on target sites; SE joint calls; partner-to-partner referrals; Avant events | $0 | Low | 2–4 qualified intros if Avant engages | Asked 2026-07-15; **no reply recorded**. Chase first. |
| 2 | **T4DevCo / WestPorch** (SiteIQ) | DC developer adjacency; Sabey Decatur; co-sell on sites they already touch | $0 | Low | 1–3 P0 site intros | Asked 2026-07-15; **no reply recorded**. Partner-conflict check needed for Offer D. |
| 3 | **Tribal relationships** (Synergy, CTUIR, Tolowa networks, TribalNet contacts, Native-owned IT teaming partners) | One named casino-IT intro per ask, not a campaign; teaming with a Native-owned prime for preference RFPs | $0 | Medium | 2–4 tribal meetings | The July plan asked for one Synergy / CTUIR intro; outcome not recorded. |
| 4 | **Inbound** (konative.com forms, Cal.com, LinkedIn) | Snapshot CTA; carrier check; lateral estimator; LinkedIn presence | $0 | Low | 1–3 inbound per quarter (the TOL-1695 lead came from LinkedIn) | The form → Twenty path is tracked in TOL-489 / W7. The homepage CTA does not lead with the snapshot (W2). |
| 5 | **Partners** (AMERIND, Tribal Ready, grant consultants, DC land brokers) | Konative as their multi-carrier quoting layer; ask for endorsement, not leads | $0 | Medium | 0–2 referrals | Not started. |
| 6 | **Cold (residual only)** | Plain-text, one sourced trigger, snapshot offer, opt-out; only after a warm-path search fails | Needs a dedicated sending domain + sequencer: **money, so needs:jeramey** | High | Low. July cold: 225 → 0 human replies. | **Blocked:** no compliant path. Mailgun and Resend prohibit cold sending, and a violation risks the transactional mail. CAN-SPAM (sender and advertiser both liable) and WA CEMA ($100/email, private right of action) apply [TOL-659]. Mailgun console login is also blocked (TOL-462). |

**Economics of cold, honestly** [Assumption]: at July's 0/225 human-reply rate, cold produces no meetings. Even at a 1–2% reply rate on trigger-verified contacts, 100 verified sends gives 1–2 conversations. Each verified contact costs ~$0.02–0.03 to find plus $0.004 to verify (TOL-659) and ~10 minutes of human verification. Cold is not worth reopening until warm channels 1–3 have been worked and either produced or failed (the July rule: cold only after the warm-path search fails).

**CRM discipline:** every touch is logged in Twenty against the stage model in `docs/operations/twenty-connectivity-model.md` (Target → … → Residual active). Bulk writes only on deduped, sourced records with an undo log and Jeramey's batch approval (TOL-462 rules).

---

## 6. 90-day targets (2026-11-16 → 2027-02-13)

Targets are leading indicators. Residual cash will not arrive in this window (§2, lag).

| Week | Target | Measure (where it shows) |
|---|---|---|
| By 2026-11-30 | Avant agreement read: Konative's actual split, evergreen clause, assignability, non-solicit scope | One-line answer on TOL-3545 (D1) |
| By 2026-11-30 | TOL-1695 partner deal resolved to a written agent-of-record + fee structure, **or** closed lost | TOL-1695 |
| By 2026-12-15 | Warm channels 1–3 each asked for a specific named intro (re-ask Avant + T4 with a fresh site list) | Twenty activity log |
| By 2026-12-31 | **20 P0 + 12 P1 + 6 P1b** named accounts in Twenty with sourced trigger + verified role (deduped, undo-logged) | Twenty, W3 |
| By 2027-01-15 | **10 One-Site Snapshots delivered** to people who asked for one | Twenty (artifact-requested stage) |
| By 2027-02-13 | **8 qualified first meetings** (named buyer, real site, timeline) | Twenty opportunities |
| By 2027-02-13 | **4 Pathfinder deal registrations, 2 proposals delivered** | Pathfinder IDs on Twenty opps |
| By 2027-02-13 | **≥1 signed order ≥ $3k MRC**, or a signed SPIFF-bearing order | Twenty "Ordered" stage |
| Ongoing | Bounce < 2%, complaints = 0, zero sends without approval | send receipts |
| Ongoing | Weekly scoreboard (W8): accounts, snapshots, meetings, registrations, proposals, orders, MRC signed | TOL-3545 comments |

Mix assumption: ~70% effort P0 DC, ~30% P1 / P1b tribal, pending D4.

---

## 7. Kill criteria

Checked at **day 45 (2026-12-31)** and **day 90 (2027-02-13)**. Each line names what stops and what happens next.

| # | Trigger | Action |
|---|---|---|
| K1 | The Avant agreement **lacks evergreen residuals that survive termination, or bars assignment**, and Avant won't amend | Stop scaling origination through Avant. Multi-home to a second TSD (the average advisor uses ~2.9) or pause. The "book is the asset" thesis is void. |
| K2 | **Day 45: < 3 named meetings from warm channels 1–3 combined** | Warm-path thesis fails at current relationships. Reshape to partner-led only (channel 5), or pause outbound and go inbound-only. Escalate to Jeramey. |
| K3 | **Day 90: 0 Pathfinder registrations and 0 proposals** | Stop P0 DC origination. Hold the site as inbound / authority only. Make a venture-level continue / hold decision. |
| K4 | **10 snapshots delivered → 0 quote requests** | The snapshot is content, not proof. Stop producing it; redesign around non-public carrier facts or drop it. |
| K5 | Any deal where Konative would both shape a grant-funded procurement **and** take a supplier commission | Stop that deal immediately. Apply the pick-a-side rule. Never both. |
| K6 | Any cold send off a compliant path, any complaint, or bounce ≥ 2% | Halt all sending. Post-mortem before any resume. |
| K7 | Jeramey time on Konative > **6 hours/week** [Assumption, to be set in D5] for 4 straight weeks with 0 qualified opportunities | Cut to inbound + partner deals only. |
| K8 | **Venture-level, 2027-05-15 (6 months):** < $5k MRC signed in total | Wind down active GTM. Keep the site, navigator and residuals; no new campaign spend or engine work. |

---

## 8. Decisions for Jeramey

Each decision has options and a recommendation. Price and taste calls are left open on purpose.

| # | Decision | Options | Recommendation |
|---|---|---|---|
| **D1** | **Read the Avant agreement** (this needs you; the agreement is not shared). What is Konative's split on Pathfinder gross rates? Are residuals evergreen past termination? Is it assignable? What is the non-solicit scope? | Read it yourself / have counsel redline against the four-clause checklist (legal brief §5; counsel = spend, ask first) | Read it yourself this week. It halves or doubles every number in §2. |
| **D2** | **Paid tier** | A none / B credited assessment / C advisor-side (no commission) / D DC construction diligence (§4) | Your call on price. Note: C is required for any grant-funded deal; B is the lowest-regret way to test willingness to pay. |
| **D3** | **TOL-1695 partner-deal posture** | (a) Insist Konative is agent of record on Avant orders; (b) accept a one-time referral fee; (c) onboard the partner as a channel supplier through Avant / Telarus (the drafted reply); (d) walk | Get the agent of record and fee **in writing** before more free work. The deal could be most of break-even, or zero. |
| **D4** | **DC vs tribal effort split.** The July lock says 90/10 DC. The 2026-08-30 direction says intensify tribal. | 90/10 · 70/30 · 50/50 | 70/30. DC carries the MRC; tribal carries the moat and long cycle. Reconfirm. |
| **D5** | **Your weekly hours for Konative** (sets snapshot volume and K7) | 3 / 6 / 10 h | Your call. 6 h ≈ 3–4 snapshots + 2 calls per week. |
| **D6** | **Cold path** | (a) Stay warm-only until K2 is checked; (b) approve a dedicated cold domain + sequencer (monthly cost, separate from transactional mail) | (a). Revisit at day 45. |
| **D7** | **Homepage alignment (W2):** the homepage leads with "TBCP 3 & Tribal grants" and shows internal pipeline counts, against the July messaging lock and `llms.txt` | Approve W2 to re-lead with the DC hero + snapshot CTA and remove the internal counts from public view | Approve W2 scope. The exact copy diff comes back to you before deploy. |
| **D8** | **Public-claim consistency item** (internal; details in the private Notion version) | Confirm and correct the source document | Confirm before the next tribal-lane send. |

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
