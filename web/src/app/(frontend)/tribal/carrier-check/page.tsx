import { bookingUrl } from "@/lib/booking";
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
import CarrierCheckForm from "./CarrierCheckForm";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Tribal Carrier Availability Check — Free 48-Hour Coverage Report",
  description:
    "Carrier coverage claims on tribal lands are notoriously unreliable. Tell us your location and sites — we'll pull who actually serves you across 100+ suppliers and deliver a written report within 48 hours, free.",
  alternates: { canonical: "/tribal/carrier-check" },
  openGraph: {
    title: "Tribal Carrier Availability Check — Free 48-Hour Coverage Report",
    description:
      "Carrier coverage claims on tribal lands are notoriously unreliable. Tell us your location and sites — we'll pull who actually serves you across 100+ suppliers and deliver a written report within 48 hours, free.",
    url: `${SITE_URL}/tribal/carrier-check`,
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

const CAL_LINK = bookingUrl("tribal-carrier-check");
const FCC_MAP_LINK = "https://broadbandmap.fcc.gov/";

// --- JSON-LD ---

const breadcrumbJsonLd = breadcrumbSchema([
  { name: "Home", url: SITE_URL },
  { name: "Tribal Connectivity", url: `${SITE_URL}/tribal` },
  { name: "Carrier Availability Check", url: `${SITE_URL}/tribal/carrier-check` },
]);

const speakableJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Tribal Carrier Availability Check",
  url: `${SITE_URL}/tribal/carrier-check`,
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["#hero-summary"],
  },
};

const FAQ_ITEMS = [
  {
    question: "How is this free?",
    answer:
      "Konative is paid by the supplier that wins the business, not by the Tribal buyer. That's the standard technology brokerage model, and it holds here too: the coverage report is yours regardless of whether you ever engage us for procurement. No advisory fee, no retainer, no obligation to purchase.",
  },
  {
    question: "What does the report include?",
    answer:
      "A written breakdown of which carriers and regional or tribal-friendly providers can actually serve your location and sites — both wholesale and retail options — sourced across a 100+ supplier portfolio. Where relevant, we include wholesale transport options, benchmark context on what comparable buyers pay, and plain documentation of any redlining: carriers who claim coverage on paper but can't actually deliver a working circuit. That documentation is useful on its own, including for funding applications that require serviceability evidence.",
  },
  {
    question: "How do you know better than the FCC map?",
    answer:
      "We don't replace it — we go further than it can. The FCC National Broadband Map is a genuinely useful starting point, but it's built from carrier self-reported data, and on tribal lands that data is frequently overstated: a carrier reports an area as served when in practice they can't or won't turn up a real circuit there. We contact carriers and regional providers directly, ask the specific serviceability question for your specific sites, and document what they actually say — not what they filed with the FCC.",
  },
  {
    question: "Do you serve Alaska Native villages and Canadian First Nations?",
    answer:
      "Yes. Our carrier and supplier portfolio spans the US and Canada, and we work with Alaska Native villages and First Nations communities alongside lower-48 tribal nations and enterprises. Serviceability and available providers vary a lot by region, which is exactly why a location-specific report is more useful than a general map.",
  },
  {
    question: "What happens after the report?",
    answer:
      "Nothing, unless you want something to happen. You get the written report either way. If you want to move forward, we run a competitive quoting process across the carriers who can actually serve you, compare wholesale and retail terms, and manage the path through installation — still at no cost to you, since suppliers pay our fee.",
  },
];

const faqJsonLd = faqSchema(FAQ_ITEMS);

// --- Shared styles (matching /tribal and /tribal/funding-navigator) ---

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

const WHAT_YOU_GET = [
  {
    num: "01",
    title: "Named carrier & provider serviceability",
    body: "The specific national carriers, regional operators, and tribal-friendly providers that can actually turn up service at your location and sites — not a generic list of who operates somewhere in your state.",
  },
  {
    num: "02",
    title: "Wholesale & retail options",
    body: "Where a wholesale transport arrangement is available and makes sense, we surface it alongside standard retail circuits, so you're comparing the full set of paths to service, not just the first quote offered.",
  },
  {
    num: "03",
    title: "Benchmark context",
    body: "What comparable tribal and rural buyers are actually paying for similar service in similar markets, so you know whether a quote is reasonable before you're deep in a negotiation.",
  },
  {
    num: "04",
    title: "Redlining documentation",
    body: "If a carrier claims coverage it can't deliver, the report says so plainly and in writing. That documentation stands on its own — including as evidence for funding applications that require proof of serviceability gaps.",
  },
];

export default function CarrierCheckPage() {
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
          src="https://images.unsplash.com/photo-1761025483276-e64413c003cb?auto=format&fit=crop&w=2000&q=70"
          alt="A tall telecom tower standing in an open rural field at sunset"
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
            Free Report · 48-Hour Turnaround
          </div>
          <h1
            style={{
              fontFamily: DISPLAY,
              fontWeight: 800,
              fontSize: "clamp(44px, 6vw, 84px)",
              lineHeight: 0.92,
              textTransform: "uppercase",
              letterSpacing: "0.01em",
              marginBottom: 28,
              maxWidth: 920,
            }}
          >
            <span style={{ display: "block", color: "#fff" }}>Who actually serves</span>
            <span style={{ display: "block", color: "#fff" }}>your land?</span>
            <span style={{ display: "block", color: RED }}>We&apos;ll pull it.</span>
          </h1>
          <p
            id="hero-summary"
            style={{
              fontFamily: BODY,
              fontSize: 17,
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.72)",
              maxWidth: 700,
              marginBottom: 40,
            }}
          >
            Carrier coverage claims on tribal lands are notoriously unreliable — a map says
            a provider serves your area, and the provider says otherwise the moment you call.
            A two-person tribal IT shop shouldn&apos;t have to chase fifteen carriers for a
            straight answer. Tell us your location and sites; within 48 hours we deliver a
            written report of which carriers and regional providers can actually serve
            you — wholesale and retail — sourced across a 100+ supplier portfolio.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
            <a href="#request" style={primaryBtnStyle}>
              Get My Free Coverage Report →
            </a>
            <a
              href={CAL_LINK}
              target="_blank"
              rel="noopener noreferrer"
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
              Talk It Through First →
            </a>
          </div>
        </div>
      </section>

      {/* What you get */}
      <PitchSection eyebrow="What You Get" heading="A real answer, in writing">
        <p style={{ fontFamily: BODY, fontSize: 16, lineHeight: 1.75, color: MUTED, maxWidth: 720, marginBottom: 36 }}>
          Not a coverage-map screenshot and not a sales pitch — a structured report built by
          actually contacting the carriers and regional providers who might serve you, and
          documenting what they say.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
          {WHAT_YOU_GET.map((item) => (
            <div key={item.num} style={cardStyle}>
              <div style={numberStyle}>{item.num}</div>
              <h3 style={headingStyle}>{item.title}</h3>
              <p style={bodyStyle}>{item.body}</p>
            </div>
          ))}
        </div>
      </PitchSection>

      {/* Request form */}
      <section id="request" style={{ background: "#F9FAFB", borderTop: `1px solid ${DIVIDER}`, padding: "90px 0" }}>
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 48px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))",
            gap: 56,
          }}
        >
          <div>
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
                color: RED,
                marginBottom: 18,
              }}
            >
              <span style={{ display: "block", width: 28, height: 2, background: RED }} />
              Request Your Report
            </div>
            <h2
              style={{
                fontFamily: DISPLAY,
                fontWeight: 800,
                fontSize: "clamp(30px, 3.4vw, 44px)",
                lineHeight: 1.0,
                textTransform: "uppercase",
                color: TEXT,
                marginBottom: 18,
              }}
            >
              Tell us where, and what
            </h2>
            <p style={{ fontFamily: BODY, fontSize: 15, lineHeight: 1.75, color: MUTED, marginBottom: 24 }}>
              A location and a rough site count is enough to start. The more you tell us about
              current pain and what you need, the sharper the report — but nothing here is a
              hard requirement to get a response.
            </p>
            <p style={{ fontFamily: BODY, fontSize: 13, lineHeight: 1.7, color: MUTED }}>
              Prefer email?{" "}
              <a href="mailto:deals@konative.com" style={{ color: RED, textDecoration: "underline" }}>
                deals@konative.com
              </a>
            </p>
          </div>
          <CarrierCheckForm />
        </div>
      </section>

      {/* What this costs */}
      <PitchSection eyebrow="What This Costs" heading="Nothing. Ever.">
        <div style={{ borderLeft: `3px solid ${RED}`, paddingLeft: 32, maxWidth: 780 }}>
          <p style={{ fontFamily: BODY, fontSize: 17, lineHeight: 1.8, color: TEXT, marginBottom: 18 }}>
            Suppliers pay Konative when they win business — not Tribal buyers, ever. The
            coverage report is yours regardless of whether you engage us for procurement
            afterward. No advisory fee, no retainer, no obligation to purchase.
          </p>
          <p style={{ fontFamily: BODY, fontSize: 17, lineHeight: 1.8, color: TEXT, margin: 0 }}>
            That&apos;s the same commitment we put in writing for every tribal engagement.
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
            Read our sovereignty commitment — six promises, in writing →
          </Link>
        </div>
      </PitchSection>

      {/* Self-serve starting point */}
      <PitchSection eyebrow="Do It Yourself First" heading="Start with the FCC map — then get the real answer" background="#F9FAFB">
        <p style={{ fontFamily: BODY, fontSize: 16, lineHeight: 1.75, color: MUTED, maxWidth: 720, marginBottom: 28 }}>
          The FCC National Broadband Map is a free, public, self-serve starting point, and
          there&apos;s no reason not to look there first.
        </p>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "flex-start" }}>
          <a
            href={FCC_MAP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: BODY,
              fontWeight: 600,
              fontSize: 12,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              background: "#fff",
              color: TEXT,
              padding: "17px 32px",
              border: `1px solid ${DIVIDER}`,
              textDecoration: "none",
              borderRadius: 2,
              whiteSpace: "nowrap",
            }}
          >
            Open the FCC National Broadband Map →
          </a>
          <p style={{ fontFamily: BODY, fontSize: 14, lineHeight: 1.7, color: MUTED, maxWidth: 520, margin: 0 }}>
            Honest caveat: the map is built from carrier-reported data, and on tribal lands
            that data frequently overstates real availability. A provider can show as
            &quot;serving&quot; an area on the map and still tell you no when you call about a
            specific site. That gap is exactly what our report is built to close.
          </p>
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
              fontSize: "clamp(38px, 5vw, 64px)",
              lineHeight: 0.95,
              textTransform: "uppercase",
              color: "#fff",
              marginBottom: 20,
            }}
          >
            Stop guessing.
            <br />
            <span style={{ color: RED }}>Get the real answer.</span>
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
            Free, no obligation, 48-hour turnaround. Tell us your location and sites and we&apos;ll
            find out who can really serve you.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
            <a href="#request" style={{ ...primaryBtnStyle, padding: "18px 44px" }}>
              Get My Free Coverage Report →
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
