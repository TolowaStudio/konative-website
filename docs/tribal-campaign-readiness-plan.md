# Konative Tribal Campaign Readiness Plan

Last updated: 2026-06-24

## Goal

Prepare Konative for a real campaign to Tribal nations and Tribal enterprises tied to NTIA Tribal Broadband Connectivity Program activity, especially recent awardees and the newly opened TBCP 3 / Native Entities Grant Program window.

The campaign should not be a generic email push. It should be a coordinated operating motion:

1. public grant and award data mapped to Twenty CRM records,
2. a campaign-ready website that answers funding, services, trust, and next-step questions,
3. contact and scope-capture paths that route into Twenty,
4. outbound sequences that are respectful, useful, and segment-specific,
5. a transaction lane that can turn interest into carrier quotes, working scopes, and signed business.

## Current Context

- Konative is now positioned as a vendor-neutral, sovereignty-aware connectivity brokerage and Avant sub-agent.
- Twenty CRM is the source of truth for contacts, companies, opportunities, and campaign status.
- The website already has a strong base: `/tribal`, `/tribal/awards`, `/tribal/index`, `/contact`, 249+ generated award detail pages, and working form infrastructure.
- The build passes and the current test suite passes.
- The contact form persists to Sanity first and can forward to Twenty/n8n when webhook environment variables are configured.
- The Tolowa Studio SOW builder is reusable, but the Konative version needs a different question set around grant implementation, facilities, carrier requirements, procurement, resilience, timeline, and current contracts.
- The existing tribal outreach scripts already match Twenty CRM contacts to TBCP awards and generate segmented outbound emails, but the data, copy, compliance posture, and CRM logging need a campaign-hardening pass before live sending.

## Market And Funding Facts To Anchor

Use official NTIA/BroadbandUSA pages as the source of truth during campaign copy and data refresh:

- TBCP is a $3 billion program for Tribal broadband infrastructure deployment, broadband use and adoption, distance learning, and telehealth.
- The official BroadbandUSA award-recipient page currently lists 271 TBCP awardees and notes the data can change when awards are modified or terminated.
- NTIA announced TBCP 3 and NEGP on June 17, 2026. Applications opened June 17, 2026; both current application windows close November 17, 2026 at 11:59 p.m. ET, with rolling awards expected beginning Spring 2027.
- TBCP 3 is opportunity `2026-NTIA-TBCP`, with up to $540 million available. Official NOFO guidance says no required match, with approximate single-applicant ranges of $500,000-$2.5 million for use/adoption and $1 million-$25 million for infrastructure.
- NEGP is opportunity `2026-NTIA-NEGP`, with at least $250 million set aside for Native Entities under the Digital Equity Act. Official NOFO guidance includes a 10% match requirement with a waiver petition path and an expected award range of $500,000-$2.5 million.
- Campaign messaging should distinguish already-awarded Tribes from TBCP 3 / NEGP applicants and pre-award planning prospects.

## Campaign Segments

### Segment A: Recent / Direct Award Match

Contacts whose Twenty company or nation matches a TBCP award record.

Primary message: "Your award creates implementation and operating connectivity decisions. We help compare carriers, design resilient service paths, and manage the quote-to-install process at no cost to the Nation."

Primary CTA: Grant-to-Network Review.

### Segment B: TBCP 3 / NEGP Applicant Or Planning Prospect

Tribal governments, broadband authorities, Native entities, TCUs, and related orgs that may apply in the current window.

Primary message: "Before the application or award turns into procurement, define service requirements, route constraints, resilience needs, and commercial assumptions."

Primary CTA: Project Scope Builder or planning call.

### Segment C: Tribal Enterprise / Gaming

Tribal casinos, EDCs, healthcare, education, public safety, and government operations with immediate connectivity needs, regardless of award status.

Primary message: "We source internet, fiber, SD-WAN, voice, cloud connectivity, and managed security from the carrier market with no cost to the buyer."

Primary CTA: Connectivity options review.

### Segment D: Partners And Influencers

Consultants, grant writers, ISPs, engineers, legal/procurement advisors, and public-sector broadband teams.

Primary message: "Konative is the carrier-market and brokerage layer for funded Tribal connectivity projects."

Primary CTA: Partner referral conversation.

## Smart Marketing Strategy

The marketing strategy is to make Konative the practical bridge between "Tribal broadband funding exists" and "this Nation has a carrier-ready, procurement-ready connectivity path." The campaign should compete on usefulness, timing, and specificity, not volume.

### Strategic Priority Order

1. **Own the active funding moment.** The TBCP 3 / NEGP window is current and time-sensitive, so the first production landing page is `/tribal/grants`.
2. **Turn funding interest into scoped requirements.** The highest-value conversion is not a newsletter signup; it is a project, facility, circuit, renewal, or procurement requirement that can enter Twenty and become a supplier-market run.
3. **Use award data as proof and personalization.** Public award records should feed SEO pages, outbound personalization, and CRM segmentation, but every claim must be source-backed and date-stamped.
4. **Build trust through disclaimers and precision.** Be explicit that Konative is not NTIA, not a grant administrator, not legal counsel, and not an ISP. This makes the brokerage lane more credible.
5. **Pilot before scale.** Outreach should start with reviewed Segment A records and only scale after form routing, reply handling, opt-out handling, and Twenty logging are proven.

### Core Message

TBCP 3 / NEGP funding can help expand Tribal broadband access, but funding alone does not define the operating network. Konative helps Tribal teams turn funding context into carrier-ready connectivity scopes, supplier comparisons, resilient network options, and procurement-ready next steps at no cost to the Tribal buyer.

### Page Cluster

The public site should become a small but complete "Tribal broadband funding to operating connectivity" cluster:

- `/tribal/grants` — core TBCP 3 / NEGP landing page and AEO answer hub.
- `/tribal/awards` — public award table for proof, browsing, and awardee SEO.
- `/tribal/awards/[slug]` — long-tail awardee pages for award-specific outreach and search.
- `/tribal/index` — searchable connectivity index / data proof layer.
- `/tribal/scope` — Grant-to-Network Scope Builder adapted from Tolowa Studio's SOW builder.
- `/contact?context=tbcp3-*` — fallback conversion path until `/tribal/scope` is live.
- Planned supporting pages: `/tribal/grants/tbcp-3-vs-negp`, `/tribal/grants/deadline-checklist`, `/tribal/grants/after-award`, and `/tribal/grants/negp-match`.

### SEO And AEO Strategy

SEO jobs:

- Rank for "TBCP 3 help", "TBCP 3 broadband funding", "Native Entities Grant Program broadband", "Tribal broadband funding support", "Tribal broadband procurement", "TBCP award implementation", and awardee-specific long-tail queries.
- Internally link `/tribal/grants` from homepage, footer, `/tribal`, `/tribal/awards`, and relevant award detail pages.
- Keep page titles literal and current. Avoid clever names that do not match search intent.
- Add FAQPage, Service, BreadcrumbList, and eventually HowTo schema when the scope builder ships.
- Add source/date notes to claims that may change.

AEO jobs:

- Answer the specific questions people will ask AI systems: "What is TBCP 3?", "What is NEGP?", "Who can help a Tribe prepare broadband connectivity requirements?", "What happens after a TBCP award?", "How do Tribal nations compare carriers for grant-funded broadband?", and "Is Konative NTIA?"
- Use short, direct FAQ answers with clear caveats.
- Separate "grant administration" from "connectivity brokerage" in plain language.
- Publish a source-backed update whenever NTIA changes deadline, eligibility, award timing, or guidance.

### Content Calendar

Week 1:

- Launch `/tribal/grants`.
- Publish a short Dispatch item: "TBCP 3 / NEGP is open: what connectivity teams should clarify first."
- Add homepage and footer links.

Week 2:

- Publish "TBCP 3 readiness checklist for Tribal IT and broadband teams."
- Launch and test `/tribal/scope`.
- Update award pages to link to `/tribal/grants`.

Week 3:

- Publish "What happens after a Tribal broadband award: carrier sourcing, resilience, and procurement."
- Create partner-facing page or section for grant writers, engineers, and broadband consultants.
- Build one downloadable or email-friendly checklist from the page content.

Week 4:

- Publish pilot-response learnings and FAQs from real calls.
- Tighten copy based on replies, questions, and form submissions.
- Expand long-tail pages only where they map to real CRM segments.

### Campaign Metrics

Measure:

- qualified `/tribal/grants` visits,
- CTA clicks to contact/scope builder,
- completed submissions with campaign context,
- Segment A reply rate,
- meetings booked,
- scoped opportunities created in Twenty,
- supplier-market runs started,
- quotes presented,
- closed/won brokerage opportunities,
- pages indexed and AI-cited.

## Website Readiness Workstream

### P0: Campaign Landing Path

Create or refine `/tribal/grants` as the main TBCP 3 / NEGP campaign path that explains:

- what TBCP / NEGP funding can mean for operating connectivity,
- what Konative does and does not do,
- how the no-cost brokerage model works,
- how Avant supplier access matters,
- what information is needed for a first review,
- clear disclaimers that Konative does not administer NTIA grants and prospects should confirm program requirements with NTIA/program counsel.

Acceptance:

- Page answers "Why are you contacting us?" in the first viewport.
- Includes direct links to `/tribal/awards`, `/tribal/index`, `/contact`, and the scope builder.
- Includes FAQ JSON-LD and campaign-specific metadata.
- Is added to the sitemap and linked from the homepage/footer.

Status on 2026-06-24:

- `/tribal/grants` exists as the core TBCP 3 / NEGP landing page with FAQ, BreadcrumbList, and Service JSON-LD.
- Homepage, Tribal page, footer, and sitemap now link the grant lane.

### P0: Contact Form Campaign Routing

Extend the contact flow so campaign submissions carry:

- campaign source,
- segment,
- award slug or grantee name when known,
- funding program,
- current project stage,
- service locations,
- requested service categories,
- urgency,
- preferred next step.

Acceptance:

- Test submission creates a Sanity record.
- Test submission forwards to Twenty/n8n with campaign fields intact.
- Twenty record can be tied to company, person, opportunity, and campaign.
- Failure state gives a direct fallback email.

Status on 2026-06-24:

- `/contact` preserves `context`, `campaign`, `segment`, `awardSlug`, `lane`, and `source` URL parameters in the submitted API payload.
- Server validation now accepts campaign metadata and scope-builder payload fields.
- Organization is marked required in the UI to match server validation.
- CRM forwarding is awaited and logs non-2xx responses. Set `CRM_WEBHOOK_REQUIRED=true` during launch tests when CRM routing failure should fail the public response.

### P0: Voice-To-Scope Builder

Adapt the Tolowa Studio SOW builder into a Konative "Grant-to-Network Scope Builder."

Question set:

1. Who is the buyer and which Tribal entity or enterprise is involved?
2. What funding context applies: TBCP I, TBCP II, TBCP 3, NEGP, BEAD, RFP, renewal, or none?
3. What facilities or service areas need connectivity?
4. What services are needed: DIA, fiber, transport, SD-WAN, voice, cloud connectivity, security, wireless, colocation?
5. What resilience is required: diverse paths, BGP, backup wireless, uptime requirements, public safety/health/gaming constraints?
6. What stage is the project in: planning, award received, procurement, quote comparison, renewal, urgent outage/risk?
7. What systems, vendors, contracts, or circuits exist today?
8. What deadlines, procurement rules, grant milestones, or approvals matter?

Output:

- Working scope Markdown.
- Structured JSON payload.
- Sanity submission.
- Twenty/n8n webhook.
- Optional Cal.com booking handoff.

Status on 2026-06-24:

- `/tribal/scope` is live in code as a guided voice/typed Grant-to-Network Scope Builder.
- The builder posts through `/api/contact` with `audience=tribes`, `projectType=tribal_funded`, `context=tbcp3-negp-scope-builder`, `scopeTool=tribal-voice-to-scope`, `scopeMarkdown`, and structured `scopeAnswers`.
- Desktop and mobile Playwright smoke checks passed on the local dev server.

### P1: Content Cleanup And Trust

- Update stale copy that says the Tribal Connectivity Index is "planned" if the route is live.
- Verify and normalize supplier-count claims across site and emails.
- Add a short "How we are compensated" explanation.
- Add a "What we are not" section: not NTIA, not a grant administrator, not legal counsel, not an ISP.
- Add proof points from public data: award index, maps, market intelligence, and generated award pages.

### P1: QA And Analytics

- Run build and tests.
- Playwright-check `/`, `/tribal`, `/tribal/awards`, `/tribal/index`, `/contact`, and the new scope builder on desktop and mobile.
- Submit test forms in staging and production with a campaign marker.
- Confirm analytics events for CTA click, form submit, scope-builder submit, Cal.com click, and award-page CTA.

## CRM And Data Workstream

### P0: Data Safety Before Outreach

Twenty is the heart of the campaign, so do not send until:

- exposed/stale API tokens are rotated,
- Twenty image/version is pinned or otherwise deployment-risk reviewed,
- current restore/dedupe status is understood,
- campaign-specific custom fields or tags are defined,
- a "do not contact" / opt-out field is available,
- source records can be tied back to award data and email sends.

### P0: Award Data Refresh

Refresh TBCP award data from official NTIA/BroadbandUSA sources before matching.

Minimum fields:

- grantee name,
- award amount,
- round / NOFO,
- state,
- project type,
- project description,
- source URL,
- last checked date.

Important distinction:

- "Award recipient" campaign records should not be mixed with "TBCP 3 / NEGP applicant" prospects. They are different intents.

### P0: Matching And Segmentation

Harden `web/scripts/tribal-outreach-match.ts`:

- record match confidence,
- store match reason,
- separate company-domain matches from name-only matches,
- flag ambiguous matches for human review,
- export review CSV before email send,
- write campaign membership back to Twenty instead of only local JSON.

### P0: Campaign Objects In Twenty

Create a campaign structure:

- Campaign: `2026 Tribal Grants Connectivity`.
- Segments: Award Match, Applicant/Planning, Tribal Enterprise/Gaming, Partner.
- Statuses: Research, Matched, Needs Review, Ready, Contacted, Replied, Meeting Booked, Scoped, Quoting, Won, Nurture, Opt Out.
- Opportunity stages: Discovery, Scope Review, Supplier Market Run, Quote Presented, Procurement Support, Closed Won/Lost.

### P1: Outreach Logging

Before live sends:

- log every email attempt to Twenty,
- log Resend ID,
- log sequence step,
- log timestamp,
- log subject variant,
- log failure reason,
- suppress duplicates across people at the same organization unless intentionally multi-threading.

Status on 2026-06-24:

- Local outreach logs are now ignored by git because they can include recipient PII and Resend IDs.
- The current sender still needs Twenty-backed logging before full campaign launch.
- Live sends now require `ALLOW_TRIBAL_OUTREACH_LIVE=true`, an explicit `--segment`, and `--limit 10` or less unless `--force` is used after approval review.

## Outreach Workstream

### Sequence 1: Award Match

Use a three-touch sequence over 10-14 days:

1. congratulations + relevant project context + no-cost carrier-market review,
2. useful follow-up with "implementation checklist" or "questions to ask before procurement",
3. short close-the-loop note with a direct booking link and scope-builder link.

### Sequence 2: Applicant / Planning

Use a TBCP 3 / NEGP readiness sequence:

1. application window / planning angle,
2. scope-builder invitation,
3. procurement and implementation readiness checklist.

### Sequence 3: Tribal Gaming / Enterprise

Use a business-continuity and cost-control sequence:

1. WAN / SD-WAN / security / voice review,
2. rate audit / renewal timing,
3. direct ask for a 20-minute connectivity options review.

### Sequence 4: Partners

Use a referral and collaboration sequence:

1. explain the brokerage lane,
2. show where Konative fits alongside grant writers, engineers, ISPs, and consultants,
3. ask for a referral/introduction workflow.

## Transaction Readiness

Before the campaign launches, prepare the actual business path:

- discovery-call agenda,
- Grant-to-Network Review one-pager,
- intake checklist,
- supplier quote request template,
- carrier comparison table,
- "no-cost brokerage" explanation,
- procurement-safe email language,
- mutual action plan,
- opportunity handoff from Twenty to Avant / Pathfinder process,
- follow-up templates for quote presented, procurement support, install status, renewal audit, and post-install review.

## Suggested 30-Day Execution Plan

### Week 1: Audit And Foundation

- Refresh official award/funding data.
- Audit Twenty campaign readiness and rotate/review API access.
- Run form-routing tests into Sanity and Twenty/n8n.
- Decide campaign URL and CTA language.
- Draft landing page and scope-builder question set.

### Week 2: Build And QA

- Build campaign landing path.
- Adapt and launch Konative scope builder.
- Add campaign fields to contact route and webhook payloads.
- Add analytics events and QA pages.
- Update stale tribal page copy and FAQ claims.

### Week 3: CRM Matching And Collateral

- Refresh match script and export review CSV.
- Human-review Segment A.
- Create Twenty campaign/status fields.
- Create one-pagers and call scripts.
- Dry-run email sequences for 5-10 records per segment.

### Week 4: Pilot Launch

- Send to a small Segment A batch first.
- Watch replies, bounces, form submissions, Cal.com bookings, and Twenty logs daily.
- Tune copy after real responses.
- Expand to Segment B and C only after routing and response handling are proven.

## Definition Of Ready For Campaign Launch

- Official award and funding data refreshed with source dates.
- Twenty campaign records matched, deduped, segmented, and reviewed.
- Website build and tests pass.
- Campaign landing path live.
- Contact form and scope builder tested end-to-end into Sanity and Twenty/n8n.
- Cal.com / direct email fallback works.
- Outreach send script has dry-run review and live-send guardrails.
- Microsoft 365 / Outlook is the email integration lane when email integration is needed; do not plan on Gmail integration.
- Opt-out handling exists.
- First-call and post-call transaction materials are ready.

## Immediate Next Build Tickets

1. Export/update the live n8n Twenty intake workflow into source control so checked-in workflow matches production runtime fixes.
2. Run a real end-to-end staging submission from `/tribal/scope` through Sanity, n8n, Twenty, Resend notification, and booking fallback.
3. Harden `tribal-outreach-match.ts` with match confidence, reason, ambiguous flags, and review CSV.
4. Add campaign logging to Twenty/n8n before live outreach, including send status, Resend ID, subject, timestamp, sequence step, and failure reason.
5. Add do-not-contact / opt-out suppression and require `Approved for outreach` before live sends.
6. Add supporting SEO/AEO pages for TBCP 3 vs NEGP, deadline checklist, after-award implementation, and NEGP match planning.
7. Update award detail pages to link to `/tribal/grants` and `/tribal/scope` with award-specific campaign metadata.

## Sources To Recheck Before Sending

- NTIA TBCP program page.
- BroadbandUSA TBCP program page.
- BroadbandUSA award recipients page.
- NTIA / BroadbandUSA TBCP 3 and NEGP NOFO pages.
- Resend account/domain status.
- Twenty production counts, dedupe status, and API token status.
