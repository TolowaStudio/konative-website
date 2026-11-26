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
import LateralEstimator from "./LateralEstimator";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Fiber Lateral Cost Estimator — Underground & Aerial Construction Costs",
  description:
    "Free calculator: estimate fiber lateral construction cost and timeline using published FBA 2025 median rates ($18/ft underground, $8/ft aerial). Honest ranges, not fake precision.",
  alternates: { canonical: "/tools/lateral-estimator" },
  openGraph: {
    title: "Fiber Lateral Cost Estimator — Underground & Aerial Construction Costs",
    description:
      "Free calculator: estimate fiber lateral construction cost and timeline using published FBA 2025 median rates ($18/ft underground, $8/ft aerial). Honest ranges, not fake precision.",
    url: `${SITE_URL}/tools/lateral-estimator`,
  },
};

// --- Constants (matching site idiom) ---

const RED = "#C8001F";
const DARK = "#08142D";
const DISPLAY = '"Barlow Condensed", sans-serif';
const BODY = "Inter, sans-serif";
const TEXT = "#111111";
const MUTED = "#6B7280";
const DIVIDER = "#E5E7EB";

const CAL_LINK = bookingUrl("tools-lateral-estimator");

// --- JSON-LD ---

const breadcrumbJsonLd = breadcrumbSchema([
  { name: "Home", url: SITE_URL },
  { name: "Tools", url: `${SITE_URL}/tools` },
  { name: "Fiber Lateral Cost Estimator", url: `${SITE_URL}/tools/lateral-estimator` },
]);

const speakableJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Fiber Lateral Cost & Timeline Estimator",
  url: `${SITE_URL}/tools/lateral-estimator`,
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["#estimator-summary"],
  },
};

const FAQ_ITEMS = [
  {
    question: "How much does a fiber lateral cost per foot or per mile?",
    answer:
      "Per the Fiber Broadband Association's 2025 Deployment Cost Report, underground fiber construction runs a median of $18 per foot — roughly $95,000 per mile — versus a median of $8 per foot for aerial construction, or about $42,000 per mile. A mixed build blends the two based on the share of route that runs underground versus aerial. These are national medians: your actual cost depends on terrain, permitting, and make-ready work at the specific route, which is why any real quote requires route engineering, not a per-mile multiplier.",
  },
  {
    question: "How long does a fiber lateral take to build?",
    answer:
      "Budget three phases: design (1–3 months), permitting (3–6 months, longer on federal or tribal land), and construction (3–12 months depending on distance). A lateral under a mile can land in as little as 7 months start to finish; a lateral over five miles commonly runs 14–21 months once permitting and multi-segment construction are accounted for. Order the lateral early — permitting and outside-plant construction routinely run longer than the network equipment lead time.",
  },
  {
    question: "What makes fiber lateral costs vary so much?",
    answer:
      "Five factors dominate the variance: make-ready work (existing pole or conduit conditions), railroad and highway crossings (bore permits, flagging, insurance requirements), environmental review, tribal or federal land permitting (NEPA, Section 106, tribal right-of-way consent), and right-of-way (ROW) negotiations with private landowners or municipalities. Any one of these can add months and materially change the cost — which is why published medians only describe the starting point, not the number a specific route will actually cost.",
  },
  {
    question: "When should I order the fiber lateral for a data center project?",
    answer:
      "At site selection, not at commissioning. Fiber proximity should be a go/no-go screen alongside power, because a five-mile lateral can add millions to a project and kill its economics before ground breaks. Once a site is chosen, order the lateral during construction — permitting and outside-plant construction commonly run 6 to 18 months and must land before the ready-for-service date. Teams that wait until commissioning to start connectivity are the ones who discover a multimillion-dollar lateral after construction milestones are already locked.",
  },
];

const faqJsonLd = faqSchema(FAQ_ITEMS);

// --- Shared styles (matching /data-center-connectivity + /tribal/funding-navigator) ---

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

// --- What moves the number ---

const MOVERS = [
  {
    num: "01",
    title: "Make-ready work",
    body: "Existing pole or conduit conditions have to support the new build before construction starts. Poor make-ready condition on an aerial route, or unknown conduit congestion underground, is one of the most common sources of mid-project cost growth.",
  },
  {
    num: "02",
    title: "Railroad & highway crossings",
    body: "Every crossing requires its own permit, bore method, flagging, and insurance rider — and railroads in particular can take months to approve a single crossing application, independent of the rest of the route.",
  },
  {
    num: "03",
    title: "Environmental review",
    body: "Wetlands, protected species habitat, and other environmental triggers can require studies and mitigation before a shovel goes in the ground, adding both time and direct cost to the route.",
  },
  {
    num: "04",
    title: "Tribal or federal land permitting",
    body: "Routes crossing tribal trust land or federal land add NEPA review, Section 106 historic-preservation consultation, and tribal right-of-way consent processes on top of standard permitting — commonly the single largest source of schedule risk on a lateral.",
  },
  {
    num: "05",
    title: "Right-of-way (ROW) negotiations",
    body: "Easements and access agreements with private landowners or municipalities are negotiated parcel by parcel. A single holdout landowner on an otherwise-clear route can delay the whole project.",
  },
];

export default function LateralEstimatorPage() {
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
          src="https://images.unsplash.com/photo-1565364507085-325347bae748?auto=format&fit=crop&w=2000&q=70"
          alt="Excavator beside large conduit pipes at an underground cable trench"
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
            Free Tool · No Signup Required
          </div>
          <h1
            style={{
              fontFamily: DISPLAY,
              fontWeight: 800,
              fontSize: "clamp(44px, 6vw, 84px)",
              lineHeight: 0.94,
              textTransform: "uppercase",
              letterSpacing: "0.01em",
              marginBottom: 28,
              maxWidth: 920,
            }}
          >
            <span style={{ display: "block", color: "#fff" }}>Fiber Lateral Cost</span>
            <span style={{ display: "block", color: RED }}>&amp; Timeline Estimator</span>
          </h1>
          <p
            style={{
              fontFamily: BODY,
              fontSize: 17,
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.72)",
              maxWidth: 680,
              marginBottom: 20,
            }}
          >
            An honest range, built on published industry medians — not a made-up number. Enter distance,
            construction type, terrain, and diversity below to see an estimated cost and build-timeline band.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <PitchSection eyebrow="Estimate Your Lateral" heading="Run the numbers">
        <LateralEstimator />
      </PitchSection>

      {/* What moves the number */}
      <PitchSection eyebrow="What Moves The Number" heading="Five things that change a lateral's real cost" background="#F9FAFB">
        <p style={{ fontFamily: BODY, fontSize: 16, lineHeight: 1.75, color: MUTED, maxWidth: 720, marginBottom: 36 }}>
          The estimator above gives you a defensible starting range. These five factors are what a real route
          engineering process resolves — and what separates an estimate from a quote.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {MOVERS.map((item) => (
            <div key={item.num} style={cardStyle}>
              <div style={numberStyle}>{item.num}</div>
              <h3 style={headingStyle}>{item.title}</h3>
              <p style={bodyStyle}>{item.body}</p>
            </div>
          ))}
        </div>
      </PitchSection>

      {/* The lateral warning */}
      <PitchSection eyebrow="The Lateral Warning" heading="A five-mile lateral can kill a site">
        <div style={{ background: "#FFF0F2", borderLeft: `4px solid ${RED}`, padding: "36px 32px" }}>
          <p style={{ fontFamily: BODY, fontSize: 15, lineHeight: 1.75, color: "#374151", maxWidth: 760, marginBottom: 20 }}>
            A five-mile lateral to the nearest backbone can add millions to a project and kill a site&apos;s
            economics before ground breaks. Fiber proximity is now a go/no-go site-selection screen alongside
            power — validate fiber and power together at site selection, not after construction milestones are
            locked.
          </p>
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
            Check your site on the map →
          </Link>
        </div>
      </PitchSection>

      {/* Methodology */}
      <PitchSection eyebrow="Methodology" heading="Where these numbers come from">
        <div style={{ borderLeft: `3px solid ${RED}`, paddingLeft: 32, maxWidth: 780 }}>
          <p style={{ fontFamily: BODY, fontSize: 16, lineHeight: 1.8, color: TEXT, marginBottom: 18 }}>
            Base rates are the published medians from the Fiber Broadband Association&apos;s 2025 Deployment Cost
            Report: $18 per foot underground, $8 per foot aerial. Terrain and diversity multipliers reflect
            typical published ranges for rocky/urban-dense conditions (+40%), rural-easy conditions (-20%), and
            dual diverse entries (roughly 1.8x a single entry, since it is effectively two builds). The &plusmn;35%
            band around the computed midpoint reflects real-world variance driven by terrain, permitting, and
            make-ready work — not statistical padding.
          </p>
          <p style={{ fontFamily: BODY, fontSize: 16, lineHeight: 1.8, color: TEXT, margin: 0 }}>
            This tool reflects published industry medians and mid-2026 market conditions. It is not a quote. A
            real quote requires route engineering — walking the actual path, confirming make-ready condition,
            identifying every crossing and permitting trigger, and getting priced bids from carriers who would
            build it. That is what Konative does, at no cost to you, because suppliers pay our fee when they win
            the business.
          </p>
        </div>
      </PitchSection>

      {/* FAQ */}
      <PitchSection eyebrow="Common Questions" heading="FAQ" background="#F9FAFB">
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
            An estimate isn&apos;t a quote.
            <br />
            <span style={{ color: RED }}>Let&apos;s get you a real one.</span>
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
            Bring us the address, capacity plan, and diversity requirement. We&apos;ll run the supplier market and
            come back with real, priced bids — not a per-mile multiplier.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
            <a href={CAL_LINK} style={primaryBtnStyle}>
              Get a Real Route Quote →
            </a>
            <Link
              href="/data-center-connectivity"
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
              Data-Center Connectivity →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
