# Account enrichment — 12-account validation queue

**Date:** 2026-08-28  
**Method:** Public web only via **Firecrawl CLI** (keyless tier, v1.23.3). **BrowserOS Neo was not used** — not available on this Cloud Agent account.  
**Scope:** Accounts **named in-repo** (`docs/strategy/2026-07-15-validated-business-model-wedge-moat.md`). No invented people or emails. Org switchboards and published government/program pages only where noted.

**UPL / privacy:** Personal staff emails were not harvested. Property/casino main lines are included only where published as the org’s public contact number.

---

## Summary table

| Account | Legal / operator entity | HQ / market | Public connectivity or IT surface | Named properties (public) | DIA / connectivity trigger (public) | Org contact (switchboard only) |
|---------|-------------------------|-------------|-----------------------------------|---------------------------|-------------------------------------|--------------------------------|
| Cologix COL5 | Cologix Inc. | Denver CO (corp); site: Lewis Center OH | [cologix.com/connectivity](https://cologix.com/connectivity/) | COL5 @ 6787 Green Meadows Dr, Columbus OH | RFS **Q3 2026**; AI-ready; diverse fiber to COL1–4; 50+ networks, Ohio IX | Cologix sales: [cologix.com/contact](https://cologix.com/contact/) · **1-866-931-9661** |
| Stream SATB | Stream Data Centers | Dallas TX (corp) | [streamdatacenters.com/locations/san-antonio-iii](https://www.streamdatacenters.com/locations/san-antonio-iii/) | SATB / San Antonio III @ 11203 Military Dr W, San Antonio TX 78251 | **200 MW** campus (1.5M SF); SATB1 under construction; **120 MW** still available per operator page | [streamdatacenters.com/contact-stream](https://www.streamdatacenters.com/contact-stream/) |
| Sabey Decatur | Sabey Data Centers | Seattle WA (corp) | [sabeydecaturdatacenter.com](https://sabeydecaturdatacenter.com/) | Decatur Township, Indianapolis IN (130-acre campus) | MDC approved **Mar 2026** (per local press cited in July ops); phased build **2026+**; up to **250 MW** utility ramp per site materials | Site contact form on [sabeydecaturdatacenter.com](https://sabeydecaturdatacenter.com/) |
| Novva West Jordan | Novva Data Centers | West Jordan UT | [novva.com/data-center-facilities/utah](https://www.novva.com/data-center-facilities/utah/) | 6477 W Wells Park Rd, West Jordan UT 84081 | **100-acre** campus; on-site **200 MW** substation; **HOLD** in strategy (July: fully leased) — verify before outreach | **1-888-NOVVADC** · [novva.com/contact](https://www.novva.com/contact/) |
| Vantage NV1 | Vantage Data Centers | Denver CO (corp) | [vantage-dc.com/features/connectivity](https://vantage-dc.com/features/connectivity/) | Reno (NV1) campus, Sparks / Storey County NV | **224 MW** / 1.1M SF; first building **Q2 2026**; carrier-neutral MMRs; **gated** (existing buildings leased per strategy) | [vantage-dc.com data-center-locations](https://vantage-dc.com/data-center-locations/north-america/reno-nevada/) |
| eStruxture CAL-3 | eStruxture Data Centers | Montreal QC (corp) | [estruxture.com/data-centers/calgary/cal-3](https://www.estruxture.com/data-centers/calgary/cal-3) | Calgary AB (also in `web/data/canada-dc/research/projects.csv`) | **90 MW** Tier III design; launch **fall 2026**; >125 kW/cabinet; **gated** (CoreWeave phase per strategy) | [estruxture.com/contact](https://www.estruxture.com/contact/) |
| Choctaw — Pocola | Choctaw Nation of Oklahoma (gaming) | Durant OK (Nation) | [choctawcasinos.com/pocola](https://www.choctawcasinos.com/pocola/) | Choctaw Casino & Resort — Pocola OK | **$140M** expansion announced **2026-06-24** ([newsroom](https://www.choctawcasinos.com/newsroom/choctaw-casino-resort-pocola-announces-140-million-construction-and-expansion-project/)) | **888-652-4628** (property line) |
| Alabama-Coushatta — Naskila | Alabama-Coushatta Tribe of Texas | Livingston TX | [naskila.com](https://www.naskila.com/) | Naskila Casino Livingston; **Leggett** site (10314 US-59 N, Livingston TX 77351) | Multi-site expansion (**Leggett now open** per operator site) | **936-563-2946** (936.563.2WIN) · [naskila.com/contact](https://www.naskila.com/contact/) |
| Ho-Chunk — Beloit | Ho-Chunk Nation | Black River Falls WI (Nation) | [ho-chunkgaming.com/beloit](https://www.ho-chunkgaming.com/beloit/) | Ho-Chunk Gaming Beloit, 777 Willowbrook Rd, Beloit WI 53511 | New campus under construction; **1,500 slots / 44 tables**; **opening date not stated** on official page as of scrape | Property page only (no dedicated IT line published) |
| Wilton — Sky River | Wilton Rancheria + Boyd Gaming | Elk Grove CA area | [skyriver.com](https://www.skyriver.com/) | Sky River Casino, 1 Sky River Pkwy, Elk Grove CA 95757 | Opened **2022-08-15**; **hotel + parking garage** announced **2024-06** ([Sacramento Business Journal](https://www.bizjournals.com/sacramento/news/2024/06/07/sky-river-casino-hotel-plans.html)); **gated** per strategy (circuit ownership) | **1-800-GAMBLER** on site; property at skyriver.com |
| Choctaw Nation TBCP II | Choctaw Nation of Oklahoma | Durant OK | [NTIA TBCP II awardee page](https://broadbandusa.ntia.gov/funding-programs/tribal-broadband-connectivity-program-round-2/awardee/choctaw-nation-oklahoma-tbcp-infrastructure-deployment-project) | ~228 mi fiber; ~330 households (award scope) | **$46,303,150** infrastructure deployment — **enterprise layer** only for Konative (not grant admin) | Nation switchboard via [choctawnation.com](https://www.choctawnation.com/) (not scraped for personal emails) |
| Muscogee Creek TBCP II | Muscogee (Creek) Nation | Okmulgee OK | [NTIA TBCP II awardee page](https://broadbandusa.ntia.gov/funding-programs/tribal-broadband-connectivity-program-round-2/awardee/muscogee-creek-nation-tbcp-infrastructure-deployment-project) | FTTP + fixed wireless; ~4,400 households (award scope) | **$41,216,619** — route via **property-led** gaming ops (Lake Eufaula / River Spirit) per strategy; TE-05 contacts **unverified** in July ops | Nation contact via public government site (no personal emails added) |

---

## DC accounts (detail)

### 1. Cologix COL5

- **Legal name:** Cologix, Inc.
- **Site address:** 6787 Green Meadows Drive, Columbus, Ohio (Lewis Center market)
- **Public status:** Expected ready for service **Q3 2026**; AI-ready colocation; direct fiber ring to COL1–4 ([COL5 page](https://cologix.com/data-centers/columbus/col5/))
- **Connectivity / IT pages:** [Connectivity hub](https://cologix.com/connectivity/) — 700+ networks, 360+ cloud providers, Ohio IX, AWS Direct Connect, GCP on-ramps cited on facility page
- **DIA relevance:** Mid-build hyperscale-adjacent site needing diverse paths, waves, DCI, and blended IP before tenant handoff — fits Market Connectivity Brief motion
- **Emails:** None added (use Cologix corporate contact)

### 2. Stream SATB (San Antonio III)

- **Legal name:** Stream Data Centers
- **Site address:** 11203 Military Drive W, San Antonio, TX 78251
- **Public status:** Third San Antonio campus; **$400M** investment; **200 MW** at full build; SATB1 **300,000 SF** + **334 MW** CPS substation on-site; **120 MW** across three buildings still available ([SATB page](https://www.streamdatacenters.com/locations/san-antonio-iii/))
- **Connectivity:** Wholesale colocation; CPS Energy partnership; near SATA1 (San Antonio II)
- **DIA relevance:** Active construction + available MW — lateral/DIA/diversity proof before lease-up
- **Emails:** None added

### 3. Sabey Decatur (Indianapolis)

- **Legal name:** Sabey Data Centers
- **Site:** Decatur Township, Marion County, Indiana (~130 acres)
- **Public status:** Community-facing site [sabeydecaturdatacenter.com](https://sabeydecaturdatacenter.com/) — permitting/site prep **2026**; AES Indiana utility ramp to **250 MW** over 5 years (materials on site)
- **Connectivity:** Not a dedicated “IT” page; utility and fiber planning are the public hook for brokerage
- **DIA relevance:** Approved MDC (local press, July 2026 ops) — construction-phase connectivity diligence
- **Note:** Legal challenge by residents reported in local press (Mirror Indy) — sensitivity for outreach tone
- **Emails:** None added

### 4. Novva — West Jordan UT

- **Legal name:** Novva Data Centers
- **Site address:** 6477 West Wells Park Road, West Jordan, UT 84081
- **Public status:** Flagship **100-acre** campus; **1.5M SF**; on-campus **200 MW** substation ([Utah facility page](https://www.novva.com/data-center-facilities/utah/))
- **Connectivity:** “Unprecedented connectivity” / blended bandwidth solutions marketed; OCP-ready
- **Strategy gate:** Listed as **HOLD** in 12-account queue (July ops: fully leased 2023) — confirm lease status before any brief
- **Emails:** None added

### 5. Vantage NV1 — Reno

- **Legal name:** Vantage Data Centers
- **Site:** Sparks / Storey County, Nevada (**NV1** campus)
- **Public status:** **224 MW** critical IT load; **137 acres**; **1.1M SF**; first facility **Q2 2026**; private **500 MW** on-site substation ([Reno campus page](https://vantage-dc.com/data-center-locations/north-america/reno-nevada/))
- **Connectivity:** [Connectivity features](https://vantage-dc.com/features/connectivity/) — two MMRs per building, carrier-neutral
- **Strategy gate:** Buildings 1–2 leased — **residual** lane only unless warm intro opens new scope
- **Emails:** None added

### 6. eStruxture CAL-3 — Calgary

- **Legal name:** eStruxture Data Centers Inc.
- **Site:** Calgary, Alberta (coordinates in repo: `web/data/canada-dc/research/projects.csv`)
- **Public status:** **90 MW**, Tier III design, launch **fall 2026** ([CAL-3 page](https://www.estruxture.com/data-centers/calgary/cal-3)); repo RFS **2026-10-01**
- **Connectivity:** Carrier-neutral colocation; high-density AI/HPC positioning
- **Strategy gate:** CoreWeave phase noted in July ops — coordinate timing with tenant build
- **Emails:** None added

---

## Tribal gaming accounts (detail)

### 7. Choctaw Casino & Resort — Pocola

- **Legal name:** Choctaw Nation of Oklahoma (gaming enterprise)
- **Property:** Choctaw Casino & Resort — Pocola, Oklahoma
- **Public trigger:** **$140 million** construction and expansion ([2026-06-24 newsroom](https://www.choctawcasinos.com/newsroom/choctaw-casino-resort-pocola-announces-140-million-construction-and-expansion-project/))
- **Connectivity need (inferred):** New/expanded gaming, hotel, F&B — WAN, DIA, SD-WAN, security for payments and surveillance during build
- **Switchboard:** 888-652-4628
- **Emails:** None added

### 8. Alabama-Coushatta — Naskila (Livingston + Leggett)

- **Legal name:** Alabama-Coushatta Tribe of Texas
- **Properties:** Naskila Casino (Livingston); **Leggett** location at 10314 US-59 N, Livingston TX 77351 (operator advertises Leggett **now open**)
- **Public pages:** [naskila.com](https://www.naskila.com/), [contact](https://www.naskila.com/contact/)
- **Connectivity need:** Multi-site electronic gaming + travel center (Ischoopa) — redundancy across sites
- **Switchboard:** 936-563-2946
- **Emails:** None added

### 9. Ho-Chunk Gaming — Beloit

- **Legal name:** Ho-Chunk Nation
- **Property:** Ho-Chunk Gaming Beloit, 777 Willowbrook Rd, Beloit, WI 53511
- **Public status:** Vertical construction documented on [official Beloit microsite](https://www.ho-chunkgaming.com/beloit/); amenities include 312-room hotel, 2,000-seat event center, 1,500 slots, 44 table games
- **Opening date:** **Not published** on official property page as of 2026-08-28 scrape (third-party social posts mention Sept 2026 — **not used** as fact here)
- **Connectivity need:** Greenfield casino + hotel — primary and backup internet, WAN to Nation systems, gaming and surveillance networks
- **Emails:** None added

### 10. Wilton Rancheria — Sky River (Boyd Gaming)

- **Legal name:** Wilton Rancheria (casino operated with Boyd Gaming Corporation)
- **Property:** Sky River Casino, 1 Sky River Parkway, Elk Grove, CA 95757 ([skyriver.com](https://www.skyriver.com/))
- **Public status:** Open since August 2022; **hotel and parking garage** expansion announced June 2024
- **Connectivity need:** Hotel expansion adds new MDF/IDF, guest Wi-Fi, POS, surveillance backhaul — **circuit ownership question** per strategy (gate before outreach)
- **Note:** `wiltonrancheria.com` resolves to a domain-for-sale parking page — use **skyriver.com** and Boyd press releases only
- **Emails:** None added

---

## TBCP II enterprise-layer accounts (detail)

These are **not** grant-administration targets. Konative’s angle is post-build **enterprise connectivity** (DIA, transport, SD-WAN) once infrastructure is deployed — firewalled from TBCP 3/NEGP applicant messaging.

### 11. Choctaw Nation of Oklahoma — TBCP II

- **Award:** Tribal Broadband Connectivity Program Round 2 — Infrastructure Deployment
- **Amount:** **$46,303,150** ([NTIA awardee page](https://broadbandusa.ntia.gov/funding-programs/tribal-broadband-connectivity-program-round-2/awardee/choctaw-nation-oklahoma-tbcp-infrastructure-deployment-project))
- **Scope (public):** ~228 miles buried fiber; ~330 tribal households, 3 businesses, 2 CAIs
- **Konative routing:** Strategy links TBCP context into **Pocola gaming expansion** (TE-01) — **not** a separate cold send
- **Site award index:** Konative `/tribal/awards` pages may exist for SEO — verify slug before personalization

### 12. Muscogee (Creek) Nation — TBCP II

- **Award:** TBCP II Infrastructure Deployment Project
- **Amount:** **$41,216,619** ([NTIA awardee page](https://broadbandusa.ntia.gov/funding-programs/tribal-broadband-connectivity-program-round-2/awardee/muscogee-creek-nation-tbcp-infrastructure-deployment-project))
- **Scope (public):** Fiber + fixed wireless; ~4,400 tribal households, 10 businesses, 4 CAIs
- **Konative routing:** Property-led via **Lake Eufaula / River Spirit** gaming properties (TE-05); July ops flagged **contacts unverified** — do not send until verified in Twenty

---

## Accounts explicitly not enriched

The following appear in **other** repo scripts (e.g. `web/scripts/seed-twenty-deals.ts`) but are **not** in the 12-account queue named in strategy docs — **skipped per instructions:**

- Navajo Nation, Cherokee Nation, Lummi Nation, Eastern Band Cherokee, Muscogee Nation WAN RFP (seed example), etc.
- Generic DC seeds (Stargate Ames, Loudoun, Tracy, Samsung Taylor, New Albany corridor, Whitestown, Permian Basin, Jackson MS)

---

## Enrichment tooling notes

| Tool | Used? | Notes |
|------|-------|-------|
| Firecrawl CLI | **Yes** | Keyless tier; scrapes saved under `.firecrawl/` (gitignored) |
| BrowserOS Neo | **No** | Not installed / not available on this Cloud Agent |
| Twenty CRM | **No writes** | No API token on VM |
| Personal email scraping | **No** | UPL/privacy hard rule |

**Refresh cadence:** Re-scrape operator and NTIA pages before any send; construction dates and MW availability change frequently.

---

## Related

- `docs/ops/2026-08-28-twenty-campaign-readiness.md`
- `docs/strategy/2026-07-15-validated-business-model-wedge-moat.md`
- `web/data/canada-dc/research/projects.csv` (CAL-3 row)
