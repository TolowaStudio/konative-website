import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { PitchSection } from "@/components/marketing/PitchLayout";
import HeroBackdrop from "@/components/marketing/HeroBackdrop";
import {
  JsonLd,
  faqSchema,
  breadcrumbSchema,
  SITE_URL,
} from "@/components/seo/JsonLd";
import DeadlineCountdown from "./DeadlineCountdown";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "$790M Tribal Broadband Funding Navigator — TBCP Round 3 & NEGP Deadlines",
  description:
    "TBCP Round 3 ($540M) and NEGP ($250M) both close Nov 17, 2026 at 11:59 p.m. ET. Free navigator: eligibility, eligible uses, and an application checklist.",
  alternates: { canonical: "/tribal/funding-navigator" },
  openGraph: {
    title: "$790M Tribal Broadband Funding Navigator — TBCP Round 3 & NEGP Deadlines",
    description:
      "TBCP Round 3 ($540M) and NEGP ($250M) both close Nov 17, 2026 at 11:59 p.m. ET. Free navigator: eligibility, eligible uses, and an application checklist.",
    url: `${SITE_URL}/tribal/funding-navigator`,
  },
};

// --- Constants (matching /tribal pillar idiom) ---

const RED = "#C8001F";
const DARK = "#08142D";
const DISPLAY = '"Barlow Condensed", sans-serif';
const BODY = "Inter, sans-serif";
const TEXT = "#111111";
const MUTED = "#6B7280";
const DIVIDER = "#E5E7EB";

const CAL_LINK = "https://cal.com/jeramey-james/15min";

// --- JSON-LD ---

const breadcrumbJsonLd = breadcrumbSchema([
  { name: "Home", url: SITE_URL },
  { name: "Tribal Connectivity", url: `${SITE_URL}/tribal` },
  { name: "Funding Navigator", url: `${SITE_URL}/tribal/funding-navigator` },
]);

const speakableJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "$790M Tribal Broadband Funding Navigator",
  url: `${SITE_URL}/tribal/funding-navigator`,
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["#hero-summary"],
  },
};

const FAQ_ITEMS = [
  {
    question: "What are the application deadlines for TBCP Round 3 and NEGP?",
    answer:
      "Both NTIA funding opportunities opened June 17, 2026. Under the current NTIA notices, TBCP Round 3 (2026-NTIA-TBCP, $540 million) and the Native Entities Grant Program (2026-NTIA-NEGP, $250 million) both close November 17, 2026 at 11:59 p.m. ET. Applications for each program are submitted through the NTIA grants portal. Awards are expected on a rolling basis beginning Spring 2027.",
  },
  {
    question: "What is the difference between TBCP Round 3 and the NEGP?",
    answer:
      "TBCP Round 3 is the larger program ($540M, run by NTIA BroadbandUSA) and funds both broadband infrastructure deployment and broadband use and adoption projects — including affordability subsidies, devices, digital skills, telehealth, and distance learning. The NEGP ($250M, under the Digital Equity Act) makes smaller grants of $500,000 to $2.5 million for Native entities' digital equity and inclusion activities, with a 10% match that can be waived. If you are building network infrastructure, TBCP Round 3 is the fit; if you are running a focused digital-equity program, NEGP may be the faster path.",
  },
  {
    question: "Can we apply to both programs?",
    answer:
      "Both opportunities are open simultaneously and share a November 17, 2026 deadline at 11:59 p.m. ET. Many Tribal Nations have needs that map to each: infrastructure under TBCP Round 3 and digital-equity programming under NEGP. Read both NOFOs carefully for scope and duplication-of-funding rules, and confirm your application strategy with your NTIA program officer. Splitting a coherent story across two sharp applications is usually stronger than stretching one application to cover everything.",
  },
  {
    question: "What if we miss a deadline?",
    answer:
      "Treat each program deadline as hard unless NTIA announces otherwise: TBCP Round 3 and NEGP both close November 17, 2026 at 11:59 p.m. ET. If a window closes without an application, the practical next moves are: pursue FY2026 E-Rate for eligible anchor institutions (the Tribal library Category Two floor is now $66,385 with a 90% maximum discount, and the FCC's T-LEAP program offers free application help), watch for future federal windows, and get procurement-ready now so the next opportunity is not a scramble. Konative can help you scope requirements either way.",
  },
  {
    question: "Does Konative charge for this navigator or for application-window help?",
    answer:
      "No. This page is free with no signup, and a working session during the application window costs nothing. Konative is a vendor-neutral connectivity brokerage paid by suppliers when they win business — not by Tribes, and never from grant funds. We do not write grants and no federal money flows through us.",
  },
  {
    question: "What happens after awards are announced?",
    answer:
      "NTIA expects to make awards on a rolling basis beginning Spring 2027. Funded projects then move into procurement and build: selecting carriers, pricing circuits and transport, and executing the network the application promised. That post-award phase is where a broker earns its keep — making carriers compete on the build and the ongoing connectivity instead of accepting the first quote.",
  },
  {
    question: "How does a connectivity broker fit alongside our grant writer?",
    answer:
      "They are different jobs on the same application. Your grant writer owns the narrative, compliance, and submission. Konative pressure-tests the technical and commercial side: is the network scoped realistically, are the carrier costs in the budget defensible, and can the promised service levels actually be procured in your service area? We work alongside grant writers and Native-owned advisors such as AMERIND Critical Infrastructure, Tribal Ready, and MuralNet — partners, not competitors.",
  },
  {
    question: "Is an affordability subsidy really an eligible use of TBCP funds?",
    answer:
      "Yes. TBCP Round 3 program materials list broadband use and adoption projects as eligible alongside infrastructure deployment — including affordability subsidies for free or reduced-cost service, devices, digital skills training, telehealth, and distance learning. With the Affordable Connectivity Program gone, this is one of the few federal paths to directly lowering household broadband costs on Tribal lands. Confirm the specifics against the TBCP Round 3 NOFO.",
  },
];

const faqJsonLd = faqSchema(FAQ_ITEMS);

// --- Shared styles (matching /tribal) ---

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

const thStyle: CSSProperties = {
  fontFamily: DISPLAY,
  fontWeight: 700,
  fontSize: 18,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  color: TEXT,
  textAlign: "left",
  padding: "16px 20px",
  borderBottom: `3px solid ${RED}`,
  verticalAlign: "bottom",
};
const rowLabelStyle: CSSProperties = {
  fontFamily: BODY,
  fontWeight: 600,
  fontSize: 12,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: TEXT,
  textAlign: "left",
  padding: "16px 20px",
  borderBottom: `1px solid ${DIVIDER}`,
  verticalAlign: "top",
  whiteSpace: "nowrap",
};
const tdStyle: CSSProperties = {
  fontFamily: BODY,
  fontSize: 13.5,
  lineHeight: 1.65,
  color: MUTED,
  padding: "16px 20px",
  borderBottom: `1px solid ${DIVIDER}`,
  verticalAlign: "top",
};

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

const primaryBtnStyle: CSSProperties = {
  fontFamily: BODY,
  fontWeight: 600,
  fontSize: 12,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  background: RED,
  color: "#fff",
  padding: "18px 40px",
  textDecoration: "none",
  borderRadius: 2,
  display: "inline-block",
};

// --- Data ---

const COMPARISON_ROWS: Array<{ label: string; tbcp: string; negp: string }> = [
  {
    label: "Total funding",
    tbcp: "$540 million",
    negp: "$250 million",
  },
  {
    label: "Program",
    tbcp: "Tribal Broadband Connectivity Program, Round 3 — run by NTIA BroadbandUSA",
    negp: "Native Entities Grant Program — under the Digital Equity Act",
  },
  {
    label: "Award size",
    tbcp: "Not fixed in program materials — see the NOFO",
    negp: "$500,000 to $2.5 million per award",
  },
  {
    label: "Eligible entities",
    tbcp: "Tribal governments, Tribal organizations, Tribal colleges and universities, the Department of Hawaiian Home Lands, and Alaska Native entities",
    negp: "Native entities, for digital equity and inclusion activities",
  },
  {
    label: "Eligible uses",
    tbcp: "Broadband infrastructure deployment AND broadband use/adoption projects — including affordability subsidies (free or reduced-cost service), devices, digital skills, telehealth, and distance learning",
    negp: "Digital equity and inclusion activities serving Native communities",
  },
  {
    label: "Cost share / match",
    tbcp: "No match highlighted in program materials — confirm in the NOFO",
    negp: "10% match, waivable",
  },
  {
    label: "Deadline",
    tbcp: "November 17, 2026 · 11:59 p.m. ET, via the NTIA grants portal (2026-NTIA-TBCP)",
    negp: "November 17, 2026 · 11:59 p.m. ET, via the NTIA grants portal (2026-NTIA-NEGP; amended July 30, 2026)",
  },
  {
    label: "Awards",
    tbcp: "Rolling, beginning Spring 2027",
    negp: "Rolling, beginning Spring 2027",
  },
];

const DECISION_SCENARIOS = [
  {
    num: "01",
    title: "Building network infrastructure",
    body: "Fiber, middle-mile, last-mile, towers — anything that puts broadband infrastructure in the ground or on a pole. TBCP Round 3 is the program built for this, and at $540 million it is where the deployment money lives.",
  },
  {
    num: "02",
    title: "Affordability, adoption, devices, or skills",
    body: "Subsidizing free or reduced-cost service for households, distributing devices, running digital skills training, telehealth, or distance learning. These are eligible under TBCP Round 3 use/adoption — and, for focused programs, under NEGP too. Size and scope decide which fits.",
  },
  {
    num: "03",
    title: "A smaller, focused digital-equity project",
    body: "If the project is a defined digital equity and inclusion program in the $500K to $2.5M range — not a network build — NEGP is purpose-built for it. Note the 10% match, which can be waived.",
  },
  {
    num: "04",
    title: "Not sure which — or whether — to pursue",
    body: "Application windows are finite and oversubscription is the norm. Book a free working session: we will map your situation to the right program, sanity-check scope, and point you to the right partners for the pieces we don't do.",
  },
];

const CHECKLIST_ITEMS = [
  {
    title: "SAM.gov registration current",
    body: "Your entity's SAM.gov registration and UEI must be active to apply. Renewals and new registrations can take weeks — start this first, today.",
  },
  {
    title: "Tribal resolution or authorization",
    body: "A Tribal council resolution (or equivalent authorizing document) approving the application and designating the authorized representative.",
  },
  {
    title: "Project narrative",
    body: "The story of the project: documented need, service area, who is served, technical approach, and outcomes. Sharp beats sweeping — oversubscription rewards focus.",
  },
  {
    title: "Budget and budget narrative",
    body: "Line-item budget mapped to eligible uses, with a narrative justifying each line. Carrier and circuit costs should reflect real market pricing, not guesses.",
  },
  {
    title: "Coverage and need data",
    body: "Maps, speed data, unserved and underserved counts for your service area. Federal reviewers weight documented need heavily.",
  },
  {
    title: "Environmental and historic preservation awareness",
    body: "Infrastructure projects trigger environmental (NEPA) and historic preservation review obligations. You don't need the studies done to apply — you need a plan that shows you know they're coming.",
  },
  {
    title: "Letters of partnership",
    body: "Commitments from partners: anchor institutions, carriers, Native-owned advisors, neighboring Tribes or consortia. Real letters, specific commitments.",
  },
  {
    title: "Project management and staffing plan",
    body: "Who runs this after award — named roles, capacity, and any partners filling gaps. Reviewers fund teams they believe can execute.",
  },
  {
    title: "Post-award reporting plan",
    body: "Federal awards carry ongoing reporting and compliance obligations. Showing you have a plan for them signals you'll be a low-risk grantee.",
  },
  {
    title: "NTIA grants portal account",
    body: "Applications go through the NTIA grants portal. Create the account and walk the submission flow well before deadline week.",
  },
];

const CONTEXT_STATS = [
  {
    stat: "275 / $2.2B",
    label: "TBCP to date",
    body: "275 awards and $2.2 billion obligated of the $3 billion program — this money is real and it moves.",
  },
  {
    stat: "$5B+",
    label: "Round 1 demand",
    body: "Round 1 requests exceeded $5 billion. Oversubscription is the norm — applications must be sharp to compete.",
  },
  {
    stat: "$66,385",
    label: "FY2026 E-Rate floor",
    body: "The FY2026 E-Rate Tribal library Category Two funding floor, at up to a 90% discount. A separate program worth pursuing — the FCC's T-LEAP (Tribal Library E-Rate Advocacy Program) offers free help.",
  },
  {
    stat: "Closed",
    label: "USDA ReConnect",
    body: "USDA ReConnect currently has no open application window. Right now, the NTIA programs on this page are the live federal path.",
  },
];

const PRIMARY_SOURCES = [
  {
    label: "NTIA announcement — two new funding opportunities for Tribal lands (June 17, 2026)",
    href: "https://www.ntia.gov/press-release/2026/ntia-announces-two-new-funding-opportunities-expand-broadband-connectivity-tribal-lands",
  },
  {
    label: "TBCP Round 3 — current NTIA funding notice and application resources",
    href: "https://broadbandusa.ntia.gov/funding-programs/tribal-broadband-connectivity/round-three-notice-of-funding-opportunity",
  },
  {
    label: "Native Entities Grant Program — current NTIA funding notice and application resources",
    href: "https://broadbandusa.ntia.gov/funding-programs/native-entities-grant-program",
  },
];

export default function FundingNavigatorPage() {
  return (
    <div style={{ background: "#fff", color: TEXT }}>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={speakableJsonLd} />

      {/* Hero */}
      <section
        style={{
          position: "relative",
          background: DARK,
          padding: "160px 0 96px",
          overflow: "hidden",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <HeroBackdrop
          src="https://images.unsplash.com/photo-1552772588-12592fc15a64?auto=format&fit=crop&w=2000&q=70"
          alt="Power transmission lines crossing a wide rural landscape at dusk"
        />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 1100, margin: "0 auto", padding: "0 48px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontFamily: BODY,
              fontWeight: 600,
              fontSize: 10,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "#FF526B",
              marginBottom: 28,
            }}
          >
            <span style={{ display: "block", width: 36, height: 2, background: RED }} />
            Free Resource · No Signup Required
          </div>
          <h1
            style={{
              fontFamily: DISPLAY,
              fontWeight: 800,
              fontSize: "clamp(48px, 6.5vw, 92px)",
              lineHeight: 0.9,
              textTransform: "uppercase",
              letterSpacing: "0.01em",
              marginBottom: 28,
              maxWidth: 900,
            }}
          >
            <span style={{ display: "block", color: "#fff" }}>$790M is on the table.</span>
            <span style={{ display: "block", color: RED }}>The clock is running.</span>
          </h1>
          <p
            id="hero-summary"
            style={{
              fontFamily: BODY,
              fontSize: 17,
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.72)",
              maxWidth: 680,
              marginBottom: 36,
            }}
          >
            On June 17, 2026, NTIA opened two funding opportunities for Tribal Nations — TBCP
            Round 3 ($540 million) and the Native Entities Grant Program ($250 million).
            Under the current NTIA notices, both close November 17, 2026 at 11:59 p.m. ET
            via the NTIA grants portal. This navigator
            explains eligibility, eligible uses, and how to get an application in on time.
          </p>
          <DeadlineCountdown />
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
            <a href={CAL_LINK} style={primaryBtnStyle}>
              Book a Free Application-Window Working Session →
            </a>
            <Link
              href="/tribal/sovereignty"
              style={{
                fontFamily: BODY,
                fontWeight: 600,
                fontSize: 12,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                background: "rgba(255,255,255,0.08)",
                color: "#fff",
                padding: "17px 32px",
                border: "1px solid rgba(255,255,255,0.35)",
                textDecoration: "none",
                borderRadius: 2,
              }}
            >
              Read Our Sovereignty Commitment →
            </Link>
          </div>
        </div>
      </section>

      {/* Program comparison */}
      <PitchSection eyebrow="The Two Programs" heading="TBCP Round 3 vs. the Native Entities Grant Program">
        <p style={{ fontFamily: BODY, fontSize: 16, lineHeight: 1.75, color: MUTED, maxWidth: 720, marginBottom: 36 }}>
          Two programs, two deadlines. The facts below are drawn from NTIA program materials —
          the Notices of Funding Opportunity linked in the sources section are the binding
          documents, so confirm every detail there before you build a budget around it.
        </p>
        <div style={{ overflowX: "auto", border: `1px solid ${DIVIDER}` }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760, background: "#fff" }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, width: "18%" }} aria-label="Attribute" />
                <th style={{ ...thStyle, width: "41%" }}>TBCP Round 3</th>
                <th style={{ ...thStyle, width: "41%" }}>Native Entities Grant Program</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.label}>
                  <th scope="row" style={rowLabelStyle}>
                    {row.label}
                  </th>
                  <td style={tdStyle}>{row.tbcp}</td>
                  <td style={tdStyle}>{row.negp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PitchSection>

      {/* Which program fits */}
      <PitchSection eyebrow="Decision Helper" heading="Which program fits your project" background="#F9FAFB">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
          {DECISION_SCENARIOS.map((item) => (
            <div key={item.num} style={cardStyle}>
              <div style={numberStyle}>{item.num}</div>
              <h3 style={headingStyle}>{item.title}</h3>
              <p style={bodyStyle}>{item.body}</p>
            </div>
          ))}
        </div>
      </PitchSection>

      {/* Application checklist */}
      <PitchSection eyebrow="Get Application-Ready" heading="The application checklist">
        <p style={{ fontFamily: BODY, fontSize: 16, lineHeight: 1.75, color: MUTED, maxWidth: 720, marginBottom: 36 }}>
          Ten things that separate applications that get funded from applications that get
          filed. None of them can start the week of the deadline.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
          {CHECKLIST_ITEMS.map((item, i) => (
            <div key={item.title} style={cardStyle}>
              <div style={numberStyle}>{String(i + 1).padStart(2, "0")}</div>
              <h3 style={headingStyle}>{item.title}</h3>
              <p style={bodyStyle}>{item.body}</p>
            </div>
          ))}
        </div>
      </PitchSection>

      {/* Context strip */}
      <section style={{ background: DARK, padding: "72px 0", borderTop: `1px solid ${DIVIDER}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 48px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontFamily: BODY,
              fontWeight: 600,
              fontSize: 10,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "#FF526B",
              marginBottom: 32,
            }}
          >
            <span style={{ display: "block", width: 28, height: 2, background: RED }} />
            The Landscape, In Numbers
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 24 }}>
            {CONTEXT_STATS.map((item) => (
              <div
                key={item.label}
                style={{
                  borderTop: `3px solid ${RED}`,
                  paddingTop: 18,
                }}
              >
                <div
                  style={{
                    fontFamily: DISPLAY,
                    fontWeight: 800,
                    fontSize: 40,
                    lineHeight: 1,
                    color: "#fff",
                    marginBottom: 8,
                  }}
                >
                  {item.stat}
                </div>
                <div
                  style={{
                    fontFamily: BODY,
                    fontWeight: 600,
                    fontSize: 11,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.55)",
                    marginBottom: 12,
                  }}
                >
                  {item.label}
                </div>
                <p style={{ fontFamily: BODY, fontSize: 13, lineHeight: 1.7, color: "rgba(255,255,255,0.6)", margin: 0 }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Honest role statement */}
      <PitchSection eyebrow="Where Konative Fits" heading="What we do — and what we don't">
        <div
          style={{
            borderLeft: `3px solid ${RED}`,
            paddingLeft: 32,
            maxWidth: 780,
          }}
        >
          <p style={{ fontFamily: BODY, fontSize: 17, lineHeight: 1.8, color: TEXT, marginBottom: 18 }}>
            Konative doesn&apos;t write grants — and the money never flows through us. We&apos;re a
            vendor-neutral connectivity brokerage. We help you scope the network your application
            promises, pressure-test carrier costs in your budget, and — when you&apos;re funded —
            make carriers compete for the build and the circuits.
          </p>
          <p style={{ fontFamily: BODY, fontSize: 17, lineHeight: 1.8, color: TEXT, margin: 0 }}>
            Grant writers and Native-owned advisors (AMERIND Critical Infrastructure, Tribal
            Ready, MuralNet) are partners we work alongside, not against.
          </p>
        </div>
        <div style={{ marginTop: 32 }}>
          <Link
            href="/tribal/sovereignty"
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
            Read our sovereignty commitment →
          </Link>
        </div>
      </PitchSection>

      {/* Primary sources */}
      <PitchSection eyebrow="Primary Sources" heading="Go straight to NTIA" background="#F9FAFB">
        <p style={{ fontFamily: BODY, fontSize: 16, lineHeight: 1.75, color: MUTED, maxWidth: 720, marginBottom: 32 }}>
          Everything on this page traces to NTIA primary sources. The NOFOs are the binding
          documents — read them, and confirm program specifics with your NTIA program officer.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 0, border: `1px solid ${DIVIDER}`, background: "#fff" }}>
          {PRIMARY_SOURCES.map((src, i) => (
            <a
              key={src.href}
              href={src.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 24,
                padding: "22px 28px",
                borderBottom: i < PRIMARY_SOURCES.length - 1 ? `1px solid ${DIVIDER}` : "none",
                textDecoration: "none",
              }}
            >
              <span style={{ fontFamily: BODY, fontWeight: 600, fontSize: 14, lineHeight: 1.5, color: TEXT }}>
                {src.label}
              </span>
              <span
                style={{
                  fontFamily: BODY,
                  fontWeight: 600,
                  fontSize: 12,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: RED,
                  whiteSpace: "nowrap",
                }}
              >
                ntia.gov →
              </span>
            </a>
          ))}
        </div>
      </PitchSection>

      {/* FAQ */}
      <PitchSection eyebrow="Common Questions" heading="FAQ">
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
      </PitchSection>

      {/* CTA band */}
      <section style={{ background: DARK, padding: "90px 0", borderTop: `1px solid ${DIVIDER}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 48px", textAlign: "center" }}>
          <h2
            style={{
              fontFamily: DISPLAY,
              fontWeight: 800,
              fontSize: "clamp(40px, 5vw, 68px)",
              lineHeight: 0.92,
              textTransform: "uppercase",
              color: "#fff",
              marginBottom: 20,
            }}
          >
            The window is open.
            <br />
            <span style={{ color: RED }}>Use it.</span>
          </h2>
          <p
            style={{
              fontFamily: BODY,
              fontSize: 16,
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.5)",
              maxWidth: 560,
              margin: "0 auto 36px",
            }}
          >
            A free working session during the application window: we map your project to the
            right program, sanity-check the network scope and carrier costs, and point you to
            the right partners for everything else.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
            <a href={CAL_LINK} style={{ ...primaryBtnStyle, padding: "18px 44px" }}>
              Book a Working Session →
            </a>
            <Link
              href="/contact"
              style={{
                fontFamily: BODY,
                fontWeight: 600,
                fontSize: 12,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                background: "rgba(255,255,255,0.08)",
                color: "#fff",
                padding: "17px 32px",
                border: "1px solid rgba(255,255,255,0.35)",
                textDecoration: "none",
                borderRadius: 2,
              }}
            >
              Contact Us →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
