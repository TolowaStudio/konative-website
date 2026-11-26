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

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Our Sovereignty Commitment — What Tribal Buyers Should Demand | Konative",
  description:
    "Six commitments Konative puts in writing for every Tribal engagement: you own the contracts, you own the data, no lock-in, transparent economics, no grant-farming, and we show up.",
  alternates: { canonical: "/tribal/sovereignty" },
  openGraph: {
    title: "Our Sovereignty Commitment — What Tribal Buyers Should Demand | Konative",
    description:
      "Six commitments Konative puts in writing for every Tribal engagement: you own the contracts, you own the data, no lock-in, transparent economics, no grant-farming, and we show up.",
    url: `${SITE_URL}/tribal/sovereignty`,
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

const CAL_LINK = bookingUrl("tribal-sovereignty");

// --- JSON-LD ---

const breadcrumbJsonLd = breadcrumbSchema([
  { name: "Home", url: SITE_URL },
  { name: "Tribal Connectivity", url: `${SITE_URL}/tribal` },
  { name: "Sovereignty Commitment", url: `${SITE_URL}/tribal/sovereignty` },
]);

const FAQ_ITEMS = [
  {
    question: "Who signs the carrier contracts — Konative or the Tribe?",
    answer:
      "The Tribe or tribal enterprise, always. Every carrier agreement is between the carrier and your organization. Konative acts as agent-of-record working on your behalf — we negotiate and manage the relationship, but we are never a party that sits between you and your network. If Konative disappeared tomorrow, every contract, every circuit, and every service would still be yours.",
  },
  {
    question: "How does Konative actually get paid?",
    answer:
      "Suppliers pay us a commission when they win your business — typically 15 to 20 percent of monthly recurring charges, which is the industry-standard technology brokerage model. You pay us nothing: no advisory fee, no retainer, no percentage of anything. And we will disclose our commission on any specific deal — just ask.",
  },
  {
    question: "What happens to our data if we stop working with Konative?",
    answer:
      "Nothing changes, because it was yours all along. Network documentation, quotes, and inventory live in your systems; we keep copies only with your permission. Data sovereignty means your data stays under your jurisdiction — ending the relationship doesn't require an export, a handover negotiation, or a request. You already have everything.",
  },
  {
    question: "Does Konative take a percentage of grant awards or charge for funding help?",
    answer:
      "No. We don't grant-farm: we don't take percentages of awards, we don't write grants for fees, and federal money never touches our hands. Our funding-window help — like the free TBCP Round 3 and NEGP navigator — costs nothing. We benefit only if, once you're funded, you choose to run your carrier procurement through us, and even then the suppliers pay us, not you.",
  },
  {
    question: "Do you compete with Native-owned organizations like AMERIND or Tribal Ready?",
    answer:
      "No — we work alongside them. AMERIND Critical Infrastructure, Tribal Ready, MuralNet, and tribally-owned telecoms like NTUA cover funding strategy, network builds, advocacy, and operations. Konative's lane is multi-carrier procurement and lifecycle management: making the carrier market compete for your business and managing those services over time. Different jobs, same team, and the Tribe gets the whole stack.",
  },
  {
    question: "What does 'no lock-in' mean in practice?",
    answer:
      "No exclusivity clause, no minimum term on our relationship, and no termination fee — ever. If we stop being useful, fire us and keep everything: the contracts (they're already in your name), the documentation (it's already in your systems), and the carrier relationships. The only thing that ends is our involvement.",
  },
];

const faqJsonLd = faqSchema(FAQ_ITEMS);

// --- Data ---

const COMMITMENTS = [
  {
    num: "01",
    title: "You own the contracts",
    body: "Every carrier agreement is between the carrier and the Tribe or tribal enterprise. Konative is agent-of-record working for you, not the carrier. We negotiate on your behalf, but we never sit between you and your network.",
  },
  {
    num: "02",
    title: "You own the data",
    body: "Network documentation, quotes, and inventory live in your systems. We keep copies only with permission. Data sovereignty means your data stays under your jurisdiction — full stop.",
  },
  {
    num: "03",
    title: "You can walk away anytime",
    body: "No exclusivity, no lock-in, no termination fees. If we stop being useful, fire us and keep everything — the contracts, the documentation, the carrier relationships.",
  },
  {
    num: "04",
    title: "Our economics are transparent",
    body: "Suppliers pay us a commission — typically 15 to 20 percent of monthly recurring charges, the industry standard. You pay us nothing. We'll disclose our commission on any deal; ask us.",
  },
  {
    num: "05",
    title: "We don't grant-farm",
    body: "We don't take percentages of grant awards, we don't write grants for fees, and the federal money never touches our hands. Funding help is free; we earn only when carriers compete for your business.",
  },
  {
    num: "06",
    title: "We show up",
    body: "In person — at TribalNet, at regional convenings, before the deal and after it. A partner you only see at contract signing isn't a partner.",
  },
];

const PARTNERS = [
  {
    name: "AMERIND Critical Infrastructure",
    body: "Tribally-owned, focused on Tribal broadband advocacy and infrastructure programs.",
  },
  {
    name: "Tribal Ready",
    body: "Native-focused broadband data and funding-readiness advisors.",
  },
  {
    name: "MuralNet",
    body: "Nonprofit helping Tribal Nations build and operate their own community networks.",
  },
  {
    name: "NTUA — Navajo Tribal Utility Authority",
    body: "Tribally-owned utility whose 550+ mile fiber backbone and Shiprock data center show what tribal ownership builds.",
  },
];

// --- Shared styles (matching /tribal) ---

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

export default function SovereigntyPage() {
  return (
    <div style={{ background: "#fff", color: TEXT }}>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={faqJsonLd} />

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
          src="https://images.unsplash.com/photo-1783099372643-4a30fc3f4568?auto=format&fit=crop&w=2000&q=70"
          alt="A vast open plain stretching to the horizon under a big open sky"
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
            Our Sovereignty Commitment
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
            <span style={{ display: "block", color: "#fff" }}>Sovereignty isn&apos;t a talking point.</span>
            <span style={{ display: "block", color: RED }}>It&apos;s the contract.</span>
          </h1>
          <p
            style={{
              fontFamily: BODY,
              fontSize: 17,
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.72)",
              maxWidth: 680,
              marginBottom: 40,
            }}
          >
            Every outside connectivity partner will tell you they respect sovereignty. Here is
            what tribal buyers should demand from any of them — and what Konative puts in
            writing: who owns the contracts, who owns the data, what it costs to leave, and
            where our money actually comes from.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
            <a href={CAL_LINK} style={primaryBtnStyle}>
              Book a 15-Min Call →
            </a>
            <Link
              href="/tribal/funding-navigator"
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
              $790M Funding Navigator →
            </Link>
          </div>
        </div>
      </section>

      {/* The commitment */}
      <PitchSection eyebrow="In Writing" heading="Six commitments. Every engagement.">
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {COMMITMENTS.map((item, i) => (
            <div
              key={item.num}
              style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr 2fr",
                gap: "0 40px",
                padding: "36px 0",
                borderBottom: i < COMMITMENTS.length - 1 ? `1px solid ${DIVIDER}` : "none",
                alignItems: "start",
              }}
            >
              <div
                style={{
                  fontFamily: DISPLAY,
                  fontWeight: 800,
                  fontSize: 40,
                  lineHeight: 1,
                  color: RED,
                }}
              >
                {item.num}
              </div>
              <h3
                style={{
                  fontFamily: DISPLAY,
                  fontWeight: 700,
                  fontSize: 26,
                  lineHeight: 1.05,
                  textTransform: "uppercase",
                  color: TEXT,
                  margin: 0,
                }}
              >
                {item.title}
              </h3>
              <p style={{ fontFamily: BODY, fontSize: 15, lineHeight: 1.75, color: MUTED, margin: 0 }}>
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </PitchSection>

      {/* Why we lead with this */}
      <PitchSection eyebrow="Why We Lead With This" heading="The bar for outside partners is high. It should be." background="#F9FAFB">
        <div style={{ borderLeft: `3px solid ${RED}`, paddingLeft: 32, maxWidth: 780 }}>
          <p style={{ fontFamily: BODY, fontSize: 17, lineHeight: 1.8, color: TEXT, marginBottom: 18 }}>
            Indian Country has seen outside consultants extract fees and disappear. A March
            2026 federal False Claims Act suit over $2.1 million in alleged fraudulent billing
            on a tribal broadband project is only the latest reminder. Skepticism toward outside
            partners isn&apos;t cynicism — it&apos;s pattern recognition.
          </p>
          <p style={{ fontFamily: BODY, fontSize: 17, lineHeight: 1.8, color: TEXT, margin: 0 }}>
            That&apos;s why we lead with the commitment instead of the pitch. Every item above is
            checkable: read a contract, ask for a commission disclosure, or try to find the
            termination fee. There isn&apos;t one.
          </p>
        </div>
      </PitchSection>

      {/* Partner ecosystem */}
      <PitchSection eyebrow="Partner Ecosystem" heading="Alongside — never against">
        <p style={{ fontFamily: BODY, fontSize: 16, lineHeight: 1.75, color: MUTED, maxWidth: 720, marginBottom: 36 }}>
          Konative works alongside — never against — Native-owned and tribally-focused
          organizations. They do funding, builds, and advocacy; we do multi-carrier procurement
          and lifecycle management. Together the Tribe gets the whole stack.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
          {PARTNERS.map((p) => (
            <div
              key={p.name}
              style={{
                background: "#fff",
                padding: "30px 28px",
                border: `1px solid ${DIVIDER}`,
                borderTop: `3px solid ${RED}`,
              }}
            >
              <h3
                style={{
                  fontFamily: DISPLAY,
                  fontWeight: 700,
                  fontSize: 22,
                  textTransform: "uppercase",
                  color: TEXT,
                  lineHeight: 1.05,
                  marginBottom: 10,
                }}
              >
                {p.name}
              </h3>
              <p style={{ fontFamily: BODY, fontSize: 13, lineHeight: 1.7, color: MUTED, margin: 0 }}>{p.body}</p>
            </div>
          ))}
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
            Hold us to it.
            <br />
            <span style={{ color: RED }}>In writing.</span>
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
            Fifteen minutes. Bring your hardest questions about contracts, data, and
            commissions. Grant help is free and separate — use the funding navigator if you need the Sept 17 window.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
            <a href={CAL_LINK} style={{ ...primaryBtnStyle, padding: "18px 44px" }}>
              Book a 15-Min Call →
            </a>
            <Link
              href="/tribal/funding-navigator"
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
              Open the Funding Navigator →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
