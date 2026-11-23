import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import PitchLayout, { PitchSection } from "@/components/marketing/PitchLayout";
import MapEmbed from "@/components/MapEmbed";
import { HOME_CONNECTIVITY_DEFAULT } from "@/content/homeConnectivity";
import {
  JsonLd,
  faqSchema,
  breadcrumbSchema,
  serviceSchema,
  SITE_URL,
} from "@/components/seo/JsonLd";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Connectivity Broker | Vendor-Neutral Internet, Fiber & Network Brokerage | Konative",
  description:
    "Konative is a vendor-neutral connectivity broker — an Avant sub-agent sourcing internet, fiber, dark fiber, transport, cloud on-ramps, UCaaS, SASE, mobility, colocation, and data-center interconnection from 100+ suppliers at no cost to you.",
  alternates: { canonical: "/connectivity" },
  openGraph: {
    title: "Connectivity Broker | Vendor-Neutral Internet, Fiber & Network Brokerage | Konative",
    description:
      "Konative is a vendor-neutral connectivity broker — an Avant sub-agent sourcing internet, fiber, dark fiber, transport, cloud on-ramps, UCaaS, SASE, mobility, colocation, and data-center interconnection from 100+ suppliers at no cost to you.",
    url: `${SITE_URL}/connectivity`,
  },
};

// --- JSON-LD data ---

const connectivityServiceJsonLd = serviceSchema({
  name: "Vendor-neutral connectivity brokerage",
  description:
    "Konative brokers internet, fiber, dark fiber, transport, wavelengths, SD-WAN, UCaaS/CCaaS, cloud on-ramps, SASE, mobility, colocation, and data-center interconnection from 100+ suppliers through Avant's partner network — at no cost to the buyer.",
  url: `${SITE_URL}/connectivity`,
  serviceType: "Connectivity Brokerage",
  areaServed: ["United States", "Canada"],
});

const breadcrumbJsonLd = breadcrumbSchema([
  { name: "Home", url: SITE_URL },
  { name: "Connectivity", url: `${SITE_URL}/connectivity` },
]);

const FAQ_ITEMS = [
  {
    question: "What is a connectivity broker?",
    answer:
      "A connectivity broker is a vendor-neutral intermediary who represents the buyer — not any single carrier. The broker solicits quotes from multiple suppliers, compares commercial terms, designs the right solution, and stays involved through provisioning and renewal. Because suppliers pay the broker's fee, there is no cost to the buyer.",
  },
  {
    question: "What does Konative broker?",
    answer:
      "Konative brokers the full connectivity stack: dedicated internet access (DIA), lit and dark fiber, wavelengths and transport, SD-WAN, UCaaS and CCaaS, cloud on-ramps (AWS Direct Connect, Azure ExpressRoute, Google Interconnect), SASE and managed security, fixed wireless and mobility, colocation, and data-center interconnection. All sourced through Avant's portfolio of 100+ suppliers.",
  },
  {
    question: "Why use a broker instead of going directly to a carrier?",
    answer:
      "A single carrier can only quote its own network. A broker quotes the whole market, identifies supplier constraints before they become delivery problems, normalizes pricing so terms are truly comparable, and holds the supplier accountable through installation. Because suppliers compete for the business, buyers typically see better pricing and terms than they would negotiating alone.",
  },
  {
    question: "Does Konative cost anything?",
    answer:
      "No. Konative is paid by the supplier that wins the business, not by the buyer. This is the standard technology brokerage model — the same way travel agents and insurance brokers operate. There is no advisory fee, no retainer, and no obligation to purchase.",
  },
  {
    question: "What is Avant and why does it matter?",
    answer:
      "Avant is North America's largest technology services distributor. As an Avant sub-agent, Konative has access to Avant's portfolio of 100+ carriers and cloud providers, enabling us to compare real quotes from the whole market rather than the two or three suppliers any single agent typically carries.", /* VERIFY: "100+" supplier count is the public Avant portfolio figure — verify current number at avant.com */
  },
  {
    question: "What types of organizations does Konative serve?",
    answer:
      "Konative serves two primary markets: (1) Tribal enterprises — gaming, government, healthcare, education, and other Tribal businesses that need carrier-grade connectivity with a sovereignty-aware advisor — and (2) data center developers, operators, and AI infrastructure teams that need transport, dark fiber, interconnection, and cloud on-ramps. Konative also serves rural and multi-site enterprises in underserved markets.",
  },
  {
    question: "How does the process work?",
    answer:
      "Konative starts with a requirements brief covering locations, bandwidth, resilience needs, and timeline. We then run the supplier market, collect quotes, and present a normalized comparison. After selection, we manage the order through provisioning and installation, then stay in the account for renewals and lifecycle support — one point of contact for the life of the service.",
  },
  {
    question: "What is the difference between /tribal and /data-center-connectivity?",
    answer:
      "Both are connectivity brokerage services, just optimized for different buyers. The Tribal page (/tribal) is focused on Tribal enterprises, sovereignty-aware procurement, and federally funded broadband projects. The data-center connectivity page (/data-center-connectivity) is focused on the network layer into data center facilities — transport, dark fiber, cross-connects, cloud on-ramps, and interconnection for developers and operators.",
  },
  {
    question: "Do I contract with Konative or with the carrier that wins the business?",
    answer:
      "You contract directly with the winning carrier. Konative runs the sourcing process — collecting quotes, comparing terms, and negotiating on your behalf — but is not a party to the resulting service agreement. This is the standard brokerage structure: Konative represents you in the market, the carrier delivers and is contractually accountable for the service, and Konative stays engaged after signing to manage escalations, billing, and renewals.",
  },
  {
    question: "What happens after I submit a requirement — how fast do you respond?",
    answer:
      "Every submission is reviewed and triaged immediately, not queued for a batch response. Inquiries with clear signals — a named organization, a business email, a specific bandwidth or timeline — are prioritized for same-business-day follow-up. Less-defined or exploratory inquiries are still answered, typically within one to a few business days. A principal or advisor reviews every request personally before it's routed, so the reply you get is scoped to your actual situation, not a generic auto-response.",
  },
];

const faqJsonLd = faqSchema(FAQ_ITEMS);

// --- Style constants (matching PitchLayout / existing pages) ---

const c = HOME_CONNECTIVITY_DEFAULT;

const cardStyle: CSSProperties = {
  background: "#fff",
  padding: "30px 28px",
  border: "1px solid #E5E7EB",
  borderTop: "3px solid #C8001F",
};
const numberStyle: CSSProperties = {
  fontFamily: '"Barlow Condensed", sans-serif',
  fontWeight: 700,
  fontSize: 12,
  letterSpacing: "0.18em",
  color: "#C8001F",
  marginBottom: 12,
};
const headingStyle: CSSProperties = {
  fontFamily: '"Barlow Condensed", sans-serif',
  fontWeight: 700,
  fontSize: 22,
  textTransform: "uppercase",
  color: "#111111",
  lineHeight: 1.05,
  marginBottom: 10,
};
const bodyStyle: CSSProperties = {
  fontFamily: "Inter, sans-serif",
  fontSize: 13,
  lineHeight: 1.7,
  color: "#6B7280",
};

const RED = "#C8001F";
const DISPLAY = '"Barlow Condensed", sans-serif';
const BODY = "Inter, sans-serif";
const TEXT = "#111111";
const MUTED = "#6B7280";
const DIVIDER = "#E5E7EB";

// Wedge card styles
const wedgeCardBase: CSSProperties = {
  background: "#fff",
  border: `1px solid ${DIVIDER}`,
  borderTop: `3px solid ${RED}`,
  padding: "36px 32px",
  display: "flex",
  flexDirection: "column",
};
const wedgeNumStyle: CSSProperties = {
  fontFamily: DISPLAY,
  fontWeight: 700,
  fontSize: 11,
  letterSpacing: "0.2em",
  color: RED,
  marginBottom: 10,
};
const wedgeEyebrowStyle: CSSProperties = {
  fontFamily: BODY,
  fontWeight: 600,
  fontSize: 10,
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: MUTED,
  marginBottom: 8,
};
const wedgeTitleStyle: CSSProperties = {
  fontFamily: DISPLAY,
  fontWeight: 800,
  fontSize: 28,
  textTransform: "uppercase",
  lineHeight: 1.0,
  color: TEXT,
  marginBottom: 14,
};
const wedgeDescStyle: CSSProperties = {
  fontFamily: BODY,
  fontSize: 14,
  lineHeight: 1.7,
  color: MUTED,
  flexGrow: 1,
  marginBottom: 24,
};
const wedgeCtaStyle: CSSProperties = {
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

export default function ConnectivityPage() {
  return (
    <>
      <JsonLd data={connectivityServiceJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={faqJsonLd} />

      <PitchLayout
        eyebrow="Connectivity Brokerage · Avant Partner"
        titleLines={[
          { text: "ONE BROKER.", tone: "white" },
          { text: "EVERY NETWORK.", tone: "rust" },
        ]}
        subhead="Konative is a vendor-neutral connectivity broker — a certified Avant sub-agent that sources, designs, and manages internet, fiber, transport, cloud on-ramps, colocation, and interconnection from 100+ suppliers across the United States and Canada. We work for you, not the carrier, and because suppliers pay our fee, it costs you nothing."
        primaryCta={{ label: "Book a Discovery Call →", href: "/call" }}
        secondaryCta={{ label: "Contact Us →", href: "/contact" }}
        heroImage={{
          src: "https://images.unsplash.com/photo-1604869515882-4d10fa4b0492?auto=format&fit=crop&w=2000&q=70",
          alt: "Illuminated bundle of optical fibers glowing white and blue in a dark network room",
          credit: { name: "Denny Müller", url: "https://unsplash.com/@redaquamedia" },
        }}
        ctaHeadlineTop="ONE REQUIREMENT."
        ctaHeadlineBottom="THE WHOLE MARKET."
        ctaSub="Tell us what you need — we'll quote it across the full supplier portfolio and recommend the best fit. No cost to you."
      >
        {/* Section 1: What we broker */}
        <PitchSection eyebrow="The Portfolio" heading="What we broker">
          <p style={{ fontFamily: BODY, fontSize: 16, lineHeight: 1.75, color: MUTED, maxWidth: 720, marginBottom: 36 }}>
            Through Avant&apos;s supplier portfolio, Konative sources and manages every layer of the connectivity stack —
            from last-mile internet to long-haul dark fiber to cloud on-ramps and managed security. One brokerage, every
            network type, no carrier bias.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
            {c.portfolioItems.map((item, i) => (
              <div key={i} style={cardStyle}>
                <div style={numberStyle}>{String(i + 1).padStart(2, "0")}</div>
                <h3 style={headingStyle}>{item.name}</h3>
                <p style={bodyStyle}>{item.blurb}</p>
              </div>
            ))}
          </div>
        </PitchSection>

        {/* Section 2: How it works / vendor-neutral + Avant model */}
        <PitchSection eyebrow="Why a Broker" heading="We work for you. Not the carrier." background="#F9FAFB">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
            {[
              {
                num: "01",
                title: "Vendor-neutral by design",
                body: "Konative carries no inventory and owns no network. We represent the buyer's requirements across the full market — not the supplier that pays the highest commission.",
              },
              {
                num: "02",
                title: "100+ suppliers via Avant",
                body: "As an Avant sub-agent, Konative accesses North America's largest technology services distributor portfolio. You get quotes from the whole market, normalized and compared.", /* VERIFY: "100+" supplier count is the public Avant portfolio figure — verify current number at avant.com */
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

        {/* Section 3: Two wedge markets */}
        <PitchSection eyebrow="Where We Lean In" heading="Two markets. One brokerage.">
          <p style={{ fontFamily: BODY, fontSize: 16, lineHeight: 1.75, color: MUTED, maxWidth: 720, marginBottom: 36 }}>
            Konative concentrates on two connectivity markets where vendor-neutral brokerage creates the most value
            for buyers who are underserved or over-sold by direct carrier reps.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
            {/* Wedge 1: Tribal */}
            <div style={wedgeCardBase}>
              <div style={wedgeNumStyle}>01</div>
              <div style={wedgeEyebrowStyle}>For Tribal Enterprises</div>
              <h3 style={wedgeTitleStyle}>Tribal &amp; Rural Enterprise Connectivity</h3>
              <p style={wedgeDescStyle}>
                Casinos, government, healthcare, and education on Tribal lands need carrier-grade connectivity,
                redundancy, and security — but rarely have a neutral advisor who understands sovereignty and federal
                funding. Konative is that advisor: vendor-neutral, sovereignty-aware, and built for this market.
              </p>
              <Link href="/tribal" style={wedgeCtaStyle}>
                Explore Tribal Connectivity →
              </Link>
            </div>
            {/* Wedge 2: Data center */}
            <div style={wedgeCardBase}>
              <div style={wedgeNumStyle}>02</div>
              <div style={wedgeEyebrowStyle}>For Data Centers &amp; Developers</div>
              <h3 style={wedgeTitleStyle}>Data-Center Connectivity</h3>
              <p style={wedgeDescStyle}>
                Developers build the campus and strategy — but someone has to source the network. Konative brokers
                transport, dark fiber, wavelengths, cross-connects, and cloud on-ramps into the facility, using our
                proprietary US &amp; Canada data-center map to get ahead of demand.
              </p>
              <Link href="/data-center-connectivity" style={wedgeCtaStyle}>
                Data-Center Connectivity →
              </Link>
            </div>
          </div>
        </PitchSection>

        {/* Section 4: Proof map */}
        <PitchSection eyebrow="Infrastructure Data" heading="Backed by real infrastructure data">
          <p style={{ fontFamily: BODY, fontSize: 16, lineHeight: 1.75, color: MUTED, maxWidth: 720, marginBottom: 36 }}>
            Konative&apos;s brokerage is grounded in a proprietary infrastructure map — power, transmission,
            interconnection, and indigenous-lands layers across the US and Canada. This is the data engine behind
            how we assess carrier reach and infrastructure context for every engagement.
          </p>
          <MapEmbed
            readout={false}
            height={460}
            caption="Power, transmission, interconnection and indigenous-lands layers — the data engine behind Konative's brokerage." /* VERIFY */
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

        {/* Section 5: FAQ */}
        <PitchSection eyebrow="Common Questions" heading="FAQ" background="#F9FAFB">
          <p style={{ fontFamily: BODY, fontSize: 14, lineHeight: 1.7, color: MUTED, maxWidth: 720, marginBottom: 32 }}>
            For Tribal-specific procurement and NTIA funding questions, see the{" "}
            <Link href="/tribal" style={{ color: RED, textDecoration: "underline" }}>Tribal Connectivity FAQ</Link>{" "}
            or the full{" "}
            <Link href="/answers" style={{ color: RED, textDecoration: "underline" }}>Answers knowledge base</Link>.
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
              href="/call"
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
              Book a 15-Min Call →
            </Link>
          </div>
        </PitchSection>
      </PitchLayout>
    </>
  );
}
