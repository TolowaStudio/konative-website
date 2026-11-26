import { DATA_CENTER_OFFER } from "@/content/offers";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import PitchLayout, { PitchSection } from "@/components/marketing/PitchLayout";
import MapEmbed from "@/components/MapEmbed";
import {
  JsonLd,
  faqSchema,
  breadcrumbSchema,
  dataCenterConnectivityServiceSchema,
  SITE_URL,
} from "@/components/seo/JsonLd";
import { siteOpenGraphImage } from "@/lib/seo/siteOpenGraph";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Data Center Connectivity Broker | Transport, Dark Fiber & Interconnection | Konative",
  description:
    "Native-owned, vendor-neutral data-center connectivity broker — domestic and international. Konative assembles any connectivity package and proves multi-path deliverability for mid-build sites. No certification claims; suppliers pay us.",
  alternates: { canonical: "/data-center-connectivity" },
  openGraph: {
    title: "Data Center Connectivity Broker | Transport, Dark Fiber & Interconnection | Konative",
    description:
      "Nearby fiber is not deliverable fiber. Konative proves multi-path deliverability for mid-build sites and sources laterals, waves, DIA, DCI, and cloud on-ramps — suppliers pay us.",
    url: `${SITE_URL}/data-center-connectivity`,
    images: [siteOpenGraphImage()],
  },
};

// --- JSON-LD data ---

const breadcrumbJsonLd = breadcrumbSchema([
  { name: "Home", url: SITE_URL },
  { name: "Data Center Connectivity", url: `${SITE_URL}/data-center-connectivity` },
]);

const FAQ_ITEMS = [
  {
    question: "What is a data center connectivity broker?",
    answer:
      "A data-center connectivity broker is a vendor-neutral intermediary who represents the facility owner or developer — not any single carrier. The broker surveys the market for transport, dark fiber, cross-connects, and cloud on-ramps, compares commercial terms across multiple suppliers, designs diverse and redundant routes, and manages the order through installation. Because suppliers pay the broker's fee, there is no cost to the buyer.",
  },
  {
    question: "What connectivity does Konative broker for data centers?",
    answer:
      "Konative brokers the full network layer into and between data-center facilities: long-haul and metro transport, lit and dark fiber, 10G/100G/400G wavelengths, data-center interconnection (DCI), cross-connects and carrier-neutral colocation, cloud on-ramps (AWS Direct Connect, Azure ExpressRoute, Google Interconnect, Oracle FastConnect), diverse internet access, and managed security. All sourced through Avant's portfolio of 100+ suppliers.", // VERIFY: "100+" supplier count — verify current number at avant.com
  },
  {
    question: "Why use a broker instead of going directly to a carrier?",
    answer:
      "A single carrier can only quote its own network. A broker quotes the whole market, identifies serviceability and construction exposure before they become delivery problems, normalizes pricing so terms are truly comparable, and holds the supplier accountable through provisioning. Because suppliers compete for the business, buyers typically see better pricing and faster timelines than they would negotiating alone.",
  },
  {
    question: "Does Konative cost anything?",
    answer:
      "No. Konative is paid by the supplier that wins the business, not by the buyer. This is the standard technology brokerage model. There is no advisory fee, no retainer, and no obligation to purchase.",
  },
  {
    question: "What information do you need to start a connectivity sourcing engagement?",
    answer:
      "Konative starts with four inputs: (1) site address and development stage, (2) capacity profile — initial and ultimate bandwidth, transport, wavelength, and cloud requirements, (3) physical resilience requirements — carrier diversity, route diversity, building entrances, and failover assumptions, and (4) commercial milestones — ready-for-service date and contract structure preferences. From there we run the supplier market and return a normalized comparison.",
  },
  {
    question: "What is Avant and why does it matter?",
    answer:
      "Avant is North America's largest technology services distributor. As an Avant sub-agent, Konative has access to Avant's portfolio of 100+ carriers and cloud providers, enabling us to compare real quotes from the whole market rather than the two or three suppliers any single agent typically carries.", // VERIFY: "100+" supplier count — verify current number at avant.com
  },
  {
    question: "Do you still help with powered land or site selection?",
    answer:
      "Yes — site and land buyers are a natural fit. If you are evaluating a site or securing powered land for a data center campus, connectivity is typically the next constraint after power. Konative can run a connectivity feasibility check alongside your land and power work, so you understand carrier availability, diversity options, and construction exposure before you commit to a site.",
  },
  {
    question: "Can you help with a site that is still in development or pre-construction?",
    answer:
      "Yes. Early engagement is better — carrier serviceability, route diversity, and construction lead times can affect site selection decisions. Konative can assess connectivity feasibility at the address or parcel level and give you a frank picture of what exists, what needs to be built, and what that costs before you are locked into a location.",
  },
  {
    question: "Who holds the contract — Konative or the carrier?",
    answer:
      "The carrier does. Konative runs the sourcing process — collecting bids, comparing serviceability and pricing across suppliers, and negotiating terms — but the facility owner or developer signs directly with the winning carrier. Konative is not a party to that agreement and does not take on carrier service-delivery liability. What Konative does take on is the ongoing relationship: staying in the account after signing to manage installation, escalations, and renewals.",
  },
  {
    question: "What happens after installation if there's an outage or a service issue?",
    answer:
      "Call Konative first. Post-installation, Konative remains the single point of contact across every carrier in your stack — that includes outage escalation, billing disputes, and moves/adds/changes. Rather than you managing a separate support relationship with each carrier, Konative works the escalation on your behalf and keeps pressure on the SLA. This ongoing role is part of the brokerage relationship, not a separate paid service.",
  },
  {
    question: "How much does a fiber lateral cost?",
    answer:
      "Per the Fiber Broadband Association's 2025 Deployment Cost Report, underground fiber construction runs a median of $18 per foot — roughly $95,000 per mile — versus a median of $8 per foot for aerial. Distance and terrain dominate the math: a short lateral across a business park and a five-mile bore under a highway are entirely different projects. That is why Konative scopes laterals parcel-by-parcel, using real construction quotes from the suppliers who would actually build the route, rather than quoting a universal per-mile figure.",
  },
  {
    question: "Which data center markets are hardest to get connectivity in right now?",
    answer:
      "The growth moved to secondary markets — Columbus, Salt Lake City, San Antonio, Reno, and Alberta among them — and those are exactly the markets where carrier density is thinnest. Metro dark fiber remains concentrated in Northern Virginia, Silicon Valley, Chicago, and Dallas, so a site in a boom market often has far fewer suppliers who can actually serve it. In those markets the regional fiber providers matter most, and a broker who can quote them — not just the national names — is the difference between a competitive process and a single take-it-or-leave-it bid.",
  },
  {
    question: "When in a data center build should connectivity be sourced?",
    answer:
      "Earlier than feels necessary, in three stages. At site selection, fiber proximity should be a go/no-go screen alongside power — a bad lateral can kill a site's economics before ground breaks. During construction, laterals and dark fiber should be ordered, because permitting and outside-plant construction commonly run 6 to 18 months and must land before ready-for-service. At commissioning, waves, transit, and cross-connects come online. Teams that start connectivity at commissioning instead of site selection are the ones who discover a multimillion-dollar lateral after construction milestones are locked.",
  },
];

const faqJsonLd = faqSchema(FAQ_ITEMS);

// --- Style constants (matching /connectivity pillar) ---

const RED = "#C8001F";
const DISPLAY = '"Barlow Condensed", sans-serif';
const BODY = "Inter, sans-serif";
const TEXT = "#111111";
const MUTED = "#6B7280";
const DIVIDER = "#E5E7EB";

const cardStyle: CSSProperties = {
  background: "#fff",
  padding: "30px 28px",
  border: `1px solid ${DIVIDER}`,
  borderTop: `3px solid ${RED}`,
};
const numberStyle: CSSProperties = {
  fontFamily: DISPLAY,
  fontWeight: 700,
  fontSize: 12,
  letterSpacing: "0.18em",
  color: RED,
  marginBottom: 12,
};
const headingStyle: CSSProperties = {
  fontFamily: DISPLAY,
  fontWeight: 700,
  fontSize: 22,
  textTransform: "uppercase",
  color: TEXT,
  lineHeight: 1.05,
  marginBottom: 10,
};
const bodyStyle: CSSProperties = {
  fontFamily: BODY,
  fontSize: 13,
  lineHeight: 1.7,
  color: MUTED,
};

// FAQ styles
const faqQStyle: CSSProperties = {
  fontFamily: DISPLAY,
  fontWeight: 700,
  fontSize: 20,
  lineHeight: 1.2,
  textTransform: "uppercase",
  color: TEXT,
  marginBottom: 12,
};
const faqAStyle: CSSProperties = {
  fontFamily: BODY,
  fontSize: 15,
  lineHeight: 1.75,
  color: MUTED,
  margin: 0,
};

// Bridge section card styles
const bridgeCardBase: CSSProperties = {
  background: "#fff",
  border: `1px solid ${DIVIDER}`,
  borderTop: `3px solid ${RED}`,
  padding: "36px 32px",
  display: "flex",
  flexDirection: "column",
};
const bridgeNumStyle: CSSProperties = {
  fontFamily: DISPLAY,
  fontWeight: 700,
  fontSize: 11,
  letterSpacing: "0.2em",
  color: RED,
  marginBottom: 10,
};
const bridgeTitleStyle: CSSProperties = {
  fontFamily: DISPLAY,
  fontWeight: 800,
  fontSize: 26,
  textTransform: "uppercase",
  lineHeight: 1.0,
  color: TEXT,
  marginBottom: 14,
};
const bridgeDescStyle: CSSProperties = {
  fontFamily: BODY,
  fontSize: 14,
  lineHeight: 1.7,
  color: MUTED,
  flexGrow: 1,
  marginBottom: 24,
};
const bridgeCtaStyle: CSSProperties = {
  fontFamily: BODY,
  fontWeight: 600,
  fontSize: 12,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: RED,
  textDecoration: "none",
  borderBottom: `1px solid ${RED}`,
  paddingBottom: 2,
  alignSelf: "flex-start",
};

// Market & pricing intelligence styles (dark stat band + benchmark table)
const statTileStyle: CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderTop: `3px solid ${RED}`,
  padding: "32px 28px",
};
const statNumberStyle: CSSProperties = {
  fontFamily: DISPLAY,
  fontWeight: 800,
  fontSize: "clamp(40px, 4.5vw, 56px)",
  lineHeight: 0.95,
  color: "#fff",
  marginBottom: 10,
};
const statLabelStyle: CSSProperties = {
  fontFamily: BODY,
  fontWeight: 600,
  fontSize: 11,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "#FF526B",
  marginBottom: 12,
};
const statBodyStyle: CSSProperties = {
  fontFamily: BODY,
  fontSize: 13,
  lineHeight: 1.65,
  color: "rgba(255,255,255,0.6)",
  margin: 0,
};
const marketCardStyle: CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderTop: `3px solid ${RED}`,
  padding: "30px 28px",
};
const marketTitleStyle: CSSProperties = {
  fontFamily: DISPLAY,
  fontWeight: 700,
  fontSize: 22,
  textTransform: "uppercase",
  color: "#fff",
  lineHeight: 1.05,
  marginBottom: 10,
};
const marketBodyStyle: CSSProperties = {
  fontFamily: BODY,
  fontSize: 13,
  lineHeight: 1.7,
  color: "rgba(255,255,255,0.6)",
  margin: 0,
};
const thStyle: CSSProperties = {
  fontFamily: DISPLAY,
  fontWeight: 700,
  fontSize: 14,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: TEXT,
  textAlign: "left",
  padding: "14px 20px",
  borderBottom: `2px solid ${TEXT}`,
  whiteSpace: "nowrap",
};
const tdServiceStyle: CSSProperties = {
  fontFamily: BODY,
  fontWeight: 600,
  fontSize: 14,
  lineHeight: 1.5,
  color: TEXT,
  padding: "18px 20px",
  borderBottom: `1px solid ${DIVIDER}`,
  verticalAlign: "top",
  minWidth: 190,
};
const tdBenchmarkStyle: CSSProperties = {
  fontFamily: BODY,
  fontWeight: 600,
  fontSize: 14,
  lineHeight: 1.5,
  color: RED,
  padding: "18px 20px",
  borderBottom: `1px solid ${DIVIDER}`,
  verticalAlign: "top",
  minWidth: 200,
};
const tdNotesStyle: CSSProperties = {
  fontFamily: BODY,
  fontSize: 13,
  lineHeight: 1.65,
  color: MUTED,
  padding: "18px 20px",
  borderBottom: `1px solid ${DIVIDER}`,
  verticalAlign: "top",
  minWidth: 280,
};

export default function DataCenterConnectivityPage() {
  return (
    <>
      <JsonLd data={dataCenterConnectivityServiceSchema} />
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={faqJsonLd} />

      <PitchLayout
        eyebrow="Data Center Connectivity · Avant Partner"
        titleLines={[
          { text: "NEARBY FIBER IS NOT", tone: "white" },
          { text: "DELIVERABLE", tone: "rust" },
          { text: "FIBER.", tone: "white" },
        ]}
        subhead="Konative is a Native-owned, vendor-neutral connectivity broker. We put together any connectivity package — domestic and international, any market — and map which carriers can actually reach your mid-build site before the schedule slips. No SBA 8(a), NMSDC, or other certification claims beyond ownership. Suppliers pay us; you get a One-Page Site Brief, then a competitive quote set."
        primaryCta={{ label: `Get a ${DATA_CENTER_OFFER} →`, href: "/contact?projectType=data_center#request" }}
        secondaryCta={{ label: "Lateral Cost Estimator →", href: "/tools/lateral-estimator" }}
        heroImage={{
          src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=2000&q=70",
          alt: "Dense cable management and network cabling running along a data center server aisle",
          credit: { name: "Taylor Vick", url: "https://unsplash.com/@tvick" },
        }}
        ctaHeadlineTop="MID-BUILD?"
        ctaHeadlineBottom="PROVE DELIVERABILITY FIRST."
        ctaSub="Bring the parcel, capacity plan, diversity requirement, and ready-for-service date. We return a site-specific brief — meet points, extension risk, and carrier-validation questions — then run the market."
      >
        {/* Section 1: What we broker for data centers */}
        <PitchSection eyebrow="What We Broker" heading="Connectivity into the facility">
          <p style={{ fontFamily: BODY, fontSize: 16, lineHeight: 1.75, color: MUTED, maxWidth: 720, marginBottom: 36 }}>
            Konative sources and manages every network layer a data center or campus requires — from long-haul
            transport and dark fiber to cross-connects and cloud on-ramps — across domestic and international markets.
            One vendor-neutral broker, the whole carrier market, no supplier bias.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
            {[
              {
                num: "01",
                title: "Cross-Connects & Interconnection",
                body: "Data-center cross-connects and interconnection circuits that stitch facilities, cages, carrier hotels, and internet exchanges together — sourced and managed across neutral and carrier-specific environments.",
              },
              {
                num: "02",
                title: "Interconnection / Peering",
                body: "Public and private peering, internet exchange access, and interconnection at carrier-neutral facilities — designed to reduce transit costs and latency for high-volume or latency-sensitive workloads.",
              },
              {
                num: "03",
                title: "Dark Fiber & Transport",
                body: "Long-haul and metro dark fiber, IRUs, lit fiber, and 10G/100G/400G wavelengths between campuses, carrier hotels, and clouds — competitive multi-supplier quoting on every route.",
              },
              {
                num: "04",
                title: "Carrier-Neutral Colocation",
                body: "Colocation in carrier-neutral facilities — power, space, and cross-connect access across major and secondary markets, sourced to fit your resilience and commercial requirements.",
              },
              {
                num: "05",
                title: "Cloud On-Ramps",
                body: "Private, low-latency dedicated connections into AWS Direct Connect, Azure ExpressRoute, Google Cloud Interconnect, and Oracle FastConnect — off the public internet, with committed SLAs.",
              },
              {
                num: "06",
                title: "Diverse & Redundant Routes",
                body: "Carrier-diverse and path-diverse design so a single fiber cut or supplier failure never takes the facility — sourced across the full market with independent physical paths.",
              },
            ].map((item) => (
              <div key={item.num} style={cardStyle}>
                <div style={numberStyle}>{item.num}</div>
                <h3 style={headingStyle}>{item.title}</h3>
                <p style={bodyStyle}>{item.body}</p>
              </div>
            ))}
          </div>
        </PitchSection>

        {/* Section 2: Powered-land bridge */}
        <PitchSection eyebrow="Site & Land Buyers" heading="Securing powered land or a site? Connectivity is the next constraint." background="#F9FAFB">
          <p style={{ fontFamily: BODY, fontSize: 16, lineHeight: 1.75, color: MUTED, maxWidth: 720, marginBottom: 36 }}>
            Land and power are the headline constraints in the AI buildout — but every site also needs a credible
            network plan before it can operate. Visitors who arrive from our powered-land and capacity pages land
            here because connectivity brokerage is what Konative delivers: sourcing the transport, dark fiber,
            and interconnection that turns a powered site into a functioning data center campus.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            <div style={bridgeCardBase}>
              <div style={bridgeNumStyle}>01</div>
              <h3 style={bridgeTitleStyle}>Evaluating a site?</h3>
              <p style={bridgeDescStyle}>
                Connectivity feasibility — carrier availability, route diversity, and construction exposure — can
                affect which site you choose. Konative can run a connectivity check at the address or parcel level
                before you commit, so the network picture is part of your site decision, not an afterthought.
              </p>
              <Link href="/call" style={bridgeCtaStyle}>
                Talk to us about your site →
              </Link>
            </div>
            <div style={bridgeCardBase}>
              <div style={bridgeNumStyle}>02</div>
              <h3 style={bridgeTitleStyle}>Secured the land?</h3>
              <p style={bridgeDescStyle}>
                Once the site is set, connectivity is typically the next item on the critical path. Konative runs
                the sourcing plan: capacity and diversity requirements, supplier RFPs, commercial term comparison,
                and order management through installation — one point of contact for the life of every circuit.
              </p>
              <Link href="/call" style={bridgeCtaStyle}>
                Start the sourcing plan →
              </Link>
            </div>
          </div>
        </PitchSection>

        {/* Section 3: Vendor-neutral + Avant + no cost */}
        <PitchSection eyebrow="Why a Broker" heading="We work for you. Not the carrier.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
            {[
              {
                num: "01",
                title: "Vendor-neutral by design",
                body: "Konative carries no inventory and owns no network. We represent the buyer's requirements across the full market — not the supplier that pays the highest commission.",
              },
              {
                num: "02",
                title: "100+ suppliers via Avant", // VERIFY: "100+" supplier count — verify current number at avant.com
                body: "As an Avant sub-agent, Konative accesses North America's largest technology services distributor portfolio. You get quotes from the whole market, normalized and compared, not just the two or three carriers any single agent typically carries.",
              },
              {
                num: "03",
                title: "No cost to the buyer",
                body: "Suppliers pay Konative's fee when they win the business. There is no advisory charge, no retainer, and no obligation to purchase — ever.",
              },
              {
                num: "04",
                title: "One point of contact for life",
                body: "We stay in the account through provisioning, installation, escalation, billing disputes, and renewal — one accountable advisor for the life of every service.",
              },
            ].map((item) => (
              <div key={item.num} style={cardStyle}>
                <div style={numberStyle}>{item.num}</div>
                <h3 style={headingStyle}>{item.title}</h3>
                <p style={bodyStyle}>{item.body}</p>
              </div>
            ))}
          </div>
        </PitchSection>

        {/* Section 4: Proof map */}
        <PitchSection eyebrow="Infrastructure Data" heading="The infrastructure behind every connection">
          <p style={{ fontFamily: BODY, fontSize: 16, lineHeight: 1.75, color: MUTED, maxWidth: 720, marginBottom: 36 }}>
            Konative&apos;s brokerage is backed by a proprietary infrastructure map covering North American power,
            transmission, interconnection, and indigenous-lands layers — the data engine we use to assess connectivity
            feasibility before a single carrier quote is collected.
          </p>
          <MapEmbed
            readout={false}
            height={460}
            caption="North American power, transmission, and interconnection infrastructure — the map behind our data-center connectivity work." /* VERIFY */
          />
          <div style={{ marginTop: 20 }}>
            <Link
              href="/map"
              style={{
                fontFamily: BODY,
                fontWeight: 600,
                fontSize: 12,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: RED,
                textDecoration: "none",
                borderBottom: `1px solid ${RED}`,
                paddingBottom: 2,
              }}
            >
              Explore the full interactive map →
            </Link>
          </div>
        </PitchSection>

        {/* Section 5: Proprietary proof trackers */}
        <PitchSection eyebrow="Proprietary Intelligence" heading="Live trackers behind our connectivity work" background="#F9FAFB">
          <p style={{ fontFamily: BODY, fontSize: 16, lineHeight: 1.75, color: MUTED, maxWidth: 720, marginBottom: 36 }}>
            Konative maintains proprietary trackers that surface where data-center demand is forming, stalling, or shifting — the intelligence layer that informs every sourcing engagement.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            <div style={bridgeCardBase}>
              <div style={bridgeNumStyle}>01</div>
              <h3 style={bridgeTitleStyle}>Stalled &amp; blocked projects</h3>
              <p style={bridgeDescStyle}>
                Live tracker of stalled, canceled, paused, and blocked data-center projects in NV, WV, FL, and OK — with governor-level policy context. Where projects die is where connectivity demand disappears; knowing the map is part of every route-diversity assessment.
              </p>
              <Link href="/governors" style={bridgeCtaStyle}>
                View the stalled-project tracker →
              </Link>
            </div>
            <div style={bridgeCardBase}>
              <div style={bridgeNumStyle}>02</div>
              <h3 style={bridgeTitleStyle}>Canada DC market</h3>
              <p style={bridgeDescStyle}>
                Quebec, Ontario, Alberta, and BC provincial analysis — power markets, hyperscaler builds, First Nations partnerships, and the federal Sovereign AI Compute Strategy. Canada is an active sourcing market for cross-border connectivity and land plays.
              </p>
              <Link href="/canada" style={bridgeCtaStyle}>
                Explore the Canada market →
              </Link>
            </div>
          </div>
        </PitchSection>

        {/* Section 6: 2026 market & pricing intelligence — the fiber bottleneck + where the boom moved */}
        <PitchSection eyebrow="2026 Market & Pricing Intelligence" heading="The fiber bottleneck, in four numbers" background="#0A0F1E">
          <p style={{ fontFamily: BODY, fontSize: 16, lineHeight: 1.75, color: "rgba(255,255,255,0.6)", maxWidth: 720, marginBottom: 36 }}>
            North American data-center capacity is booming and fragile at the same time. Construction pipelines are
            at record scale while the physical inputs — fiber, power equipment, construction crews — are the tightest
            they have been in a decade. Connectivity procurement is where build schedules are saved or lost.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 16, marginBottom: 64 }}>
            {[
              {
                number: "~35 GW",
                label: "Under construction",
                body: "Data-center capacity under construction in North America — a record pipeline, all of it needing network before it can serve a single workload. (JLL)",
              },
              {
                number: "20 wks–1 yr",
                label: "Fiber cable lead times",
                body: "Current lead times for fiber cable — roughly 20 weeks for the largest buyers, stretching to a year for smaller ones. Order timing is now a schedule risk.",
              },
              {
                number: "2.3x",
                label: "US fiber miles needed by 2029",
                body: "Growth in US fiber miles required by 2029 — from 159.6M to 372.9M. (Fiber Broadband Association / Cartesian)",
              },
              {
                number: "~50%",
                label: "2026 builds facing delay",
                body: "Share of planned 2026 US data-center builds facing delay or cancellation on power equipment shortages. (TD Cowen / Bloomberg reporting)",
              },
            ].map((stat) => (
              <div key={stat.label} style={statTileStyle}>
                <div style={statNumberStyle}>{stat.number}</div>
                <div style={statLabelStyle}>{stat.label}</div>
                <p style={statBodyStyle}>{stat.body}</p>
              </div>
            ))}
          </div>

          {/* Where the boom moved */}
          <h3 style={{
            fontFamily: DISPLAY, fontWeight: 800,
            fontSize: "clamp(28px, 3vw, 40px)", lineHeight: 0.95,
            textTransform: "uppercase", color: "#fff", marginBottom: 20,
          }}>
            Where the boom moved
          </h3>
          <p style={{ fontFamily: BODY, fontSize: 15, lineHeight: 1.75, color: "rgba(255,255,255,0.6)", maxWidth: 720, marginBottom: 32 }}>
            The 2026 deal map does not look like the 2020 deal map. Growth left the legacy hubs — and landed in
            markets where the carrier infrastructure hasn&apos;t caught up.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, marginBottom: 32 }}>
            <div style={marketCardStyle}>
              <div style={statLabelStyle}>The 2026 leaders</div>
              <h4 style={marketTitleStyle}>Secondary markets lead</h4>
              <p style={marketBodyStyle}>
                Columbus, Salt Lake City, San Antonio, Indianapolis, and Reno lead 2026 deal activity — land,
                power, and permitting economics pulled the buildout out of the legacy hubs.
              </p>
            </div>
            <div style={marketCardStyle}>
              <div style={statLabelStyle}>The next wave</div>
              <h4 style={marketTitleStyle}>Tertiary &amp; Canada</h4>
              <p style={marketBodyStyle}>
                Central Washington, Iowa, and Kansas City form the tertiary wave, while Alberta and Montreal
                anchor the Canadian market — active sourcing geographies for cross-border capacity.
              </p>
            </div>
            <div style={marketCardStyle}>
              <div style={statLabelStyle}>The catch</div>
              <h4 style={marketTitleStyle}>Fiber didn&apos;t follow</h4>
              <p style={marketBodyStyle}>
                Metro dark fiber density is still concentrated in Northern Virginia, Silicon Valley, Chicago, and
                Dallas. The boom moved to exactly the markets with the thinnest carrier density — which is where
                a lateral makes or breaks the project.
              </p>
            </div>
          </div>
          <p style={{ fontFamily: BODY, fontSize: 15, lineHeight: 1.75, color: "rgba(255,255,255,0.75)", maxWidth: 720, margin: 0 }}>
            We work these markets through 100+ suppliers — regional fiber included, not just the national names.
          </p>
        </PitchSection>

        {/* Section 7: Published benchmarks + the lateral warning */}
        <PitchSection eyebrow="Published Benchmarks" heading="What connectivity actually costs in 2026">
          <p style={{ fontFamily: BODY, fontSize: 16, lineHeight: 1.75, color: MUTED, maxWidth: 720, marginBottom: 36 }}>
            Most brokers won&apos;t publish numbers. We will — because a developer who walks in knowing the market
            is a better client, and because the ranges below are only the starting point of what a real sourcing
            process beats.
          </p>
          <div style={{ overflowX: "auto", border: `1px solid ${DIVIDER}`, borderTop: `3px solid ${RED}`, background: "#fff" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thStyle}>What you&apos;re buying</th>
                  <th style={thStyle}>Published benchmark</th>
                  <th style={thStyle}>What moves it</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdServiceStyle}>Underground fiber construction</td>
                  <td style={tdBenchmarkStyle}>Median $18/ft (~$95K/mile)</td>
                  <td style={tdNotesStyle}>
                    Aerial runs a median of $8/ft (Fiber Broadband Association 2025 Deployment Cost Report). 92% of
                    builders reported cost increases in 2025 — these figures are moving up, not down.
                  </td>
                </tr>
                <tr>
                  <td style={tdServiceStyle}>Dedicated Internet Access (1G)</td>
                  <td style={tdBenchmarkStyle}>Typically $700&ndash;1,500/mo</td>
                  <td style={tdNotesStyle}>Market and building status — a lit building quotes very differently from one that needs construction.</td>
                </tr>
                <tr>
                  <td style={tdServiceStyle}>Dedicated Internet Access (10G)</td>
                  <td style={tdBenchmarkStyle}>Typically $4,000&ndash;7,500/mo</td>
                  <td style={tdNotesStyle}>Same drivers as 1G — plus carrier density at the address, which is why secondary markets quote wider.</td>
                </tr>
                <tr>
                  <td style={tdServiceStyle}>Metro wavelengths (10G&ndash;100G)</td>
                  <td style={tdBenchmarkStyle}>Few hundred to low thousands/mo</td>
                  <td style={tdNotesStyle}>100G wave pricing has fallen roughly 11% per year — one of the few line items trending in the buyer&apos;s favor.</td>
                </tr>
                <tr>
                  <td style={tdServiceStyle}>Dark fiber IRUs</td>
                  <td style={tdBenchmarkStyle}>Custom-quoted</td>
                  <td style={tdNotesStyle}>
                    Published metro quotes span roughly $750&ndash;$3,000 per strand-mile plus annual maintenance;
                    long-haul is negotiated route-by-route. Anyone quoting you a universal IRU price is guessing.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ fontFamily: BODY, fontSize: 13, lineHeight: 1.7, color: MUTED, maxWidth: 720, marginTop: 20, marginBottom: 56 }}>
            Methodology: ranges reflect published industry sources and live market quoting as of mid-2026. Your
            parcel, lateral distance, and diversity requirements move these materially — that&apos;s exactly what
            we scope.
          </p>

          {/* The lateral warning */}
          <div style={{ background: "#FFF0F2", borderLeft: `4px solid ${RED}`, padding: "36px 32px" }}>
            <div style={{
              fontFamily: BODY, fontWeight: 600,
              fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase",
              color: RED, marginBottom: 12,
            }}>
              The Lateral Warning
            </div>
            <h3 style={{
              fontFamily: DISPLAY, fontWeight: 800,
              fontSize: "clamp(26px, 3vw, 38px)", lineHeight: 1.0,
              textTransform: "uppercase", color: TEXT, marginBottom: 16,
            }}>
              A five-mile lateral can kill a site.
            </h3>
            <p style={{ fontFamily: BODY, fontSize: 15, lineHeight: 1.75, color: "#374151", maxWidth: 760, marginBottom: 20 }}>
              A five-mile lateral to the nearest backbone can add millions to a project and kill a site&apos;s
              economics before ground breaks. Fiber proximity is now a go/no-go site-selection screen alongside
              power. Validate power and fiber before you lock construction milestones — we run that diligence
              with stamped-letter rigor through our supplier bench and proprietary market map.
            </p>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
              <Link href="/map" style={bridgeCtaStyle}>
                Check your site on the map →
              </Link>
              <Link href="/tools/lateral-estimator" style={bridgeCtaStyle}>
                Estimate your lateral →
              </Link>
            </div>
          </div>
        </PitchSection>

        {/* Section 8: FAQ */}
        <PitchSection eyebrow="Common Questions" heading="FAQ" background="#F9FAFB">
          <p style={{ fontFamily: BODY, fontSize: 14, lineHeight: 1.7, color: MUTED, maxWidth: 720, marginBottom: 32 }}>
            More on brokerage pricing, contract structure, and response times in the{" "}
            <Link href="/answers" style={{ color: RED, textDecoration: "underline" }}>full Answers knowledge base</Link>.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            {FAQ_ITEMS.map((faq, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: "0 40px",
                  paddingBottom: 40,
                  borderBottom: i < FAQ_ITEMS.length - 1 ? `1px solid ${DIVIDER}` : "none",
                }}
              >
                <div>
                  <h3 style={faqQStyle}>{faq.question}</h3>
                </div>
                <div>
                  <p style={faqAStyle}>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 48, textAlign: "center" }}>
            <Link
              href="/contact?projectType=data_center#request"
              style={{
                fontFamily: BODY,
                fontWeight: 600,
                fontSize: 12,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                background: RED,
                color: "#fff",
                padding: "16px 36px",
                textDecoration: "none",
                borderRadius: 2,
                display: "inline-block",
              }}
            >
              Get a {DATA_CENTER_OFFER} →
            </Link>
          </div>
        </PitchSection>
      </PitchLayout>
    </>
  );
}
