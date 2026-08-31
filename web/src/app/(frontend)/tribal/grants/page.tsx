import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import PitchLayout, { PitchSection } from "@/components/marketing/PitchLayout";
import {
  JsonLd,
  SITE_URL,
  breadcrumbSchema,
  faqSchema,
  serviceSchema,
} from "@/components/seo/JsonLd";

const RED = "#C8001F";
const DISPLAY = '"Barlow Condensed", sans-serif';
const BODY = "Inter, sans-serif";
const TEXT = "#111111";
const MUTED = "#6B7280";
const DIVIDER = "#E5E7EB";
const SURFACE = "#F9FAFB";
const DARK = "#0A0F1E";

const PAGE_URL = `${SITE_URL}/tribal/grants`;

export const metadata: Metadata = {
  title: "TBCP 3 & NEGP Broadband Funding Help for Tribal Nations | Konative",
  description:
    "Konative helps Tribal nations and Native entities turn TBCP 3 and NEGP broadband funding into carrier-ready connectivity scopes, supplier comparisons, resilient network requirements, and procurement-ready next steps.",
  alternates: { canonical: "/tribal/grants" },
  openGraph: {
    title: "TBCP 3 & NEGP Broadband Funding Help for Tribal Nations | Konative",
    description:
      "A practical guide for Tribal connectivity teams preparing for TBCP 3 and NEGP funding: what to clarify, what Konative can help source, and how to move from funding opportunity to carrier-ready scope.",
    url: PAGE_URL,
  },
};

const FAQ_ITEMS = [
  {
    question: "What are TBCP 3 and NEGP?",
    answer:
      "TBCP 3 is the 2026 round of NTIA's Tribal Broadband Connectivity Program (2026-NTIA-TBCP). NEGP is the Native Entities Grant Program (2026-NTIA-NEGP), the Native entity set-aside under the Digital Equity Act. Under the current NTIA notices, both application windows close November 17, 2026 at 11:59 p.m. ET. Together, the 2026 funding lane is intended to support broadband connectivity, infrastructure availability, adoption, and related activities for Tribal and Native communities. Konative is not NTIA and does not administer grant awards.",
  },
  {
    question: "How can Konative help with TBCP 3 or NEGP?",
    answer:
      "Konative helps Tribal teams translate funding intent into carrier-ready connectivity requirements: locations, bandwidth, fiber or transport needs, SD-WAN, voice, cloud connectivity, managed security, resilience, service dates, supplier comparisons, and quote-to-install coordination. We do not replace grant counsel, engineering, or NTIA program guidance.",
  },
  {
    question: "Does Konative charge Tribal nations for brokerage help?",
    answer:
      "No. Konative's brokerage compensation is paid by the supplier that wins the business. Tribal buyers can use Konative to compare the supplier market at no cost and with no obligation to purchase.",
  },
  {
    question: "Should we talk to Konative before or after applying?",
    answer:
      "Both can be useful. Before applying, Konative can help clarify service requirements and commercial assumptions. After an award or during procurement, Konative can help compare carrier options, resilience designs, service terms, and implementation paths.",
  },
  {
    question: "Can Konative write the grant application?",
    answer:
      "Konative is not positioned as a grant-writing firm. We can support the connectivity and supplier-market side of the plan, and we can collaborate with a Tribe's grant writer, engineer, counsel, ISP partner, or broadband consultant.",
  },
  {
    question: "What should a Tribal team prepare before contacting Konative?",
    answer:
      "Helpful inputs include target service areas, facilities, current circuits or vendors, known bandwidth needs, funding program context, procurement constraints, required service dates, resilience requirements, and any existing engineering or grant materials.",
  },
];

const breadcrumbJsonLd = breadcrumbSchema([
  { name: "Home", url: SITE_URL },
  { name: "Tribal Connectivity", url: `${SITE_URL}/tribal` },
  { name: "TBCP 3 & NEGP Help", url: PAGE_URL },
]);

const serviceJsonLd = serviceSchema({
  name: "TBCP 3 and NEGP connectivity scope support",
  description:
    "Vendor-neutral connectivity brokerage support for Tribal nations and Native entities preparing TBCP 3 and Native Entities Grant Program broadband projects. Konative helps define carrier-ready requirements, compare suppliers, and coordinate quote-to-install paths.",
  url: PAGE_URL,
  serviceType: "Tribal Connectivity Brokerage",
  areaServed: "United States",
});

const cardStyle: CSSProperties = {
  background: "#fff",
  border: `1px solid ${DIVIDER}`,
  borderTop: `3px solid ${RED}`,
  padding: "30px 28px",
};

const darkCardStyle: CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderTop: `3px solid ${RED}`,
  padding: "30px 28px",
};

const labelStyle: CSSProperties = {
  fontFamily: BODY,
  fontWeight: 700,
  fontSize: 10,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: RED,
  marginBottom: 12,
};

const cardTitleStyle: CSSProperties = {
  fontFamily: DISPLAY,
  fontWeight: 800,
  fontSize: 25,
  lineHeight: 1,
  textTransform: "uppercase",
  color: TEXT,
  margin: "0 0 12px",
};

const darkCardTitleStyle: CSSProperties = {
  ...cardTitleStyle,
  color: "#fff",
};

const bodyStyle: CSSProperties = {
  fontFamily: BODY,
  fontSize: 14,
  lineHeight: 1.75,
  color: MUTED,
  margin: 0,
};

const darkBodyStyle: CSSProperties = {
  ...bodyStyle,
  color: "rgba(255,255,255,0.62)",
};

const ctaLinkStyle: CSSProperties = {
  fontFamily: BODY,
  fontWeight: 700,
  fontSize: 12,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: RED,
  textDecoration: "none",
  borderBottom: `1px solid ${RED}`,
  paddingBottom: 2,
};

export default function TribalGrantsPage() {
  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={faqSchema(FAQ_ITEMS)} />

      <PitchLayout
        eyebrow="TBCP 3 & NEGP · 2026 Tribal Broadband Funding"
        titleLines={[
          { text: "TURN FUNDING", tone: "white" },
          { text: "INTO A CARRIER-", tone: "dim" },
          { text: "READY SCOPE.", tone: "rust" },
        ]}
        subhead="NTIA's 2026 TBCP 3 and Native Entities Grant Program funding lane is active. Konative helps Tribal nations and Native entities turn the opportunity into clear connectivity requirements, supplier comparisons, resilient network options, and procurement-ready next steps."
        primaryCta={{ label: "Start the Scope Builder →", href: "/tribal/scope" }}
        secondaryCta={{ label: "Browse TBCP Awards →", href: "/tribal/awards" }}
        ctaHeadlineTop="BRING US THE GRANT CONTEXT."
        ctaHeadlineBottom="WE'LL SHAPE THE NETWORK ASK."
        ctaSub="Use Konative to turn locations, facilities, requirements, deadlines, and funding context into a supplier-ready connectivity scope."
      >
        <PitchSection eyebrow="Why This Page Exists" heading="Funding is not the finish line">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: 32, alignItems: "start" }}>
            <div>
              <p style={{ fontFamily: BODY, fontSize: 17, lineHeight: 1.8, color: MUTED, maxWidth: 720, margin: "0 0 22px" }}>
                A broadband funding opportunity creates urgency, but the hard work is translating that opportunity
                into a buildable and operable network plan. Tribal teams still need to define service areas,
                facilities, transport paths, bandwidth, resilience, security, procurement rules, and supplier options.
              </p>
              <p style={{ fontFamily: BODY, fontSize: 17, lineHeight: 1.8, color: MUTED, maxWidth: 720, margin: 0 }}>
                Konative is the vendor-neutral brokerage layer for that work. We help organize the connectivity side
                of the project, compare the carrier market, and support the path from scope to quote to installation.
              </p>
            </div>
            <aside style={{ background: SURFACE, border: `1px solid ${DIVIDER}`, padding: 28 }}>
              <div style={labelStyle}>2026 funding lane</div>
              <h2 style={{ ...cardTitleStyle, fontSize: 31 }}>TBCP 3 / NEGP</h2>
              <p style={bodyStyle}>
                The 2026 Tribal broadband funding lane should be treated as two connected motions: applicants
                preparing scopes before deadline pressure, and awardees preparing for procurement and implementation.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 22 }}>
                <a href="https://broadbandusa.ntia.gov/funding-programs/tribal-broadband-connectivity/round-three-notice-of-funding-opportunity" style={ctaLinkStyle}>
                  NTIA TBCP →
                </a>
                <a href="https://broadbandusa.ntia.gov/funding-programs/native-entities-grant-program" style={ctaLinkStyle}>
                  NEGP →
                </a>
              </div>
            </aside>
          </div>
        </PitchSection>

        <PitchSection eyebrow="What We Help Clarify" heading="The questions behind a fundable network scope" background="#F9FAFB">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
            {[
              ["01", "Where service is needed", "Service addresses, anchors, communities, facilities, paths, construction boundaries, and priority sites."],
              ["02", "What the network must do", "Internet, transport, fiber, SD-WAN, voice, cloud connectivity, managed security, fixed wireless, or colocation."],
              ["03", "How resilient it must be", "Diverse paths, BGP, backup circuits, LTE/5G failover, public safety requirements, clinic uptime, and gaming floor continuity."],
              ["04", "What suppliers can serve it", "Carrier availability, quote normalization, service terms, install timelines, and renewal or migration options."],
              ["05", "How procurement should proceed", "RFP readiness, quote comparison, contract review support, award milestones, and internal approval sequence."],
              ["06", "What happens after funding", "Provisioning, install management, rate auditing, change orders, renewals, and post-build operating connectivity."],
            ].map(([num, title, body]) => (
              <div key={num} style={cardStyle}>
                <div style={labelStyle}>{num}</div>
                <h3 style={cardTitleStyle}>{title}</h3>
                <p style={bodyStyle}>{body}</p>
              </div>
            ))}
          </div>
        </PitchSection>

        <PitchSection eyebrow="How Konative Fits" heading="We are the brokerage layer, not the grant administrator">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 18 }}>
            {[
              {
                title: "What we do",
                body:
                  "We help define carrier-ready requirements, identify supplier options, compare quotes, structure resilience, coordinate provisioning, and keep the connectivity decision moving.",
              },
              {
                title: "What we do not do",
                body:
                  "We do not administer NTIA awards, replace legal counsel, promise eligibility, certify grant compliance, or act as the Tribe's engineer of record.",
              },
              {
                title: "Who we work beside",
                body:
                  "Grant writers, broadband consultants, engineers, ISPs, Tribal broadband authorities, EDCs, IT directors, procurement teams, and program managers.",
              },
            ].map((item) => (
              <div key={item.title} style={cardStyle}>
                <h3 style={cardTitleStyle}>{item.title}</h3>
                <p style={bodyStyle}>{item.body}</p>
              </div>
            ))}
          </div>
        </PitchSection>

        <PitchSection eyebrow="The Review" heading="What a Grant-to-Network Review produces" background={DARK}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
            {[
              ["Connectivity scope", "A plain-English summary of sites, services, bandwidth, resilience, security, and service-date requirements."],
              ["Supplier market run", "A structured request that can be taken to carriers and providers through Konative's vendor-neutral brokerage process."],
              ["Quote comparison", "Normalized supplier options so decision makers can compare pricing, terms, install timelines, and service tradeoffs."],
              ["Procurement next step", "A practical path for RFP, quote review, award alignment, or implementation support depending on project stage."],
            ].map(([title, body]) => (
              <div key={title} style={darkCardStyle}>
                <h3 style={darkCardTitleStyle}>{title}</h3>
                <p style={darkBodyStyle}>{body}</p>
              </div>
            ))}
          </div>
        </PitchSection>

        <PitchSection eyebrow="Start Here" heading="Three ways to use this page">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 18 }}>
            <div style={cardStyle}>
              <div style={labelStyle}>For applicants</div>
              <h3 style={cardTitleStyle}>Pressure-test the scope before deadline pressure</h3>
              <p style={{ ...bodyStyle, marginBottom: 22 }}>
                Use Konative to clarify service needs, locations, and commercial assumptions before the project becomes a rushed procurement.
              </p>
              <Link href="/tribal/scope?context=tbcp3-applicant" style={ctaLinkStyle}>
                Build applicant scope →
              </Link>
            </div>
            <div style={cardStyle}>
              <div style={labelStyle}>For awardees</div>
              <h3 style={cardTitleStyle}>Move from award record to operating connectivity</h3>
              <p style={{ ...bodyStyle, marginBottom: 22 }}>
                Bring us the award, facilities, service needs, and timeline. We will help shape the supplier-ready connectivity request.
              </p>
              <Link href="/tribal/scope?context=tbcp3-awardee" style={ctaLinkStyle}>
                Build awardee scope →
              </Link>
            </div>
            <div style={cardStyle}>
              <div style={labelStyle}>For partners</div>
              <h3 style={cardTitleStyle}>Add a carrier-market lane to your project</h3>
              <p style={{ ...bodyStyle, marginBottom: 22 }}>
                If you advise Tribal broadband projects, Konative can support the connectivity sourcing and supplier comparison layer.
              </p>
              <Link href="/contact?context=tbcp3-partner" style={ctaLinkStyle}>
                Talk partnership →
              </Link>
            </div>
          </div>
        </PitchSection>

        <PitchSection eyebrow="Common Questions" heading="TBCP 3 / NEGP FAQ" background="#F9FAFB">
          <div style={{ display: "flex", flexDirection: "column", gap: 34 }}>
            {FAQ_ITEMS.map((item) => (
              <div key={item.question} style={{ borderBottom: `1px solid ${DIVIDER}`, paddingBottom: 34 }}>
                <h3 style={{ ...cardTitleStyle, fontSize: 23 }}>{item.question}</h3>
                <p style={{ fontFamily: BODY, fontSize: 15, lineHeight: 1.75, color: MUTED, margin: 0 }}>
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </PitchSection>
      </PitchLayout>
    </>
  );
}
