import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JsonLd, SITE_URL, breadcrumbSchema, faqSchema } from "@/components/seo/JsonLd";
import { siteOpenGraphImage } from "@/lib/seo/siteOpenGraph";

export const revalidate = 3600;

const RED = "#C8001F";
const DARK = "#08111F";
const NAVY = "#0C2046";
const TEXT = "#111827";
const MUTED = "#667085";
const LINE = "#E5E7EB";
const DISPLAY = "'Barlow Condensed', sans-serif";

export const metadata: Metadata = {
  title: "About — Native-Owned Connectivity Brokerage | Konative",
  description:
    "One sourcing desk for Tribal enterprises and data-center builds. Konative is founded and majority-owned by Jeramey James, Tolowa Dee-ni' Nation — a Native-owned AVANT connectivity brokerage with written sovereignty commitments.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Konative — One Desk, Two Rooms",
    description:
      "Native-owned AVANT desk for Tribal enterprises and data-center builds — published benchmarks and a written sovereignty commitment.",
    url: `${SITE_URL}/about`,
    type: "profile",
    images: [siteOpenGraphImage()],
  },
};

// Person + Organization + Breadcrumb schema. Ownership is stated as a factual
// claim (enrolled citizen, majority owner) — NOT as a certified credential,
// since no formal MBE/8(a)/TERO certification exists yet.
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/about#jeramey-james`,
  name: "Jeramey James",
  jobTitle: "Founder & Principal",
  worksFor: { "@id": `${SITE_URL}/#organization` },
  image: `${SITE_URL}/team/jeramey-james.png`,
  sameAs: ["https://www.linkedin.com/in/jerameyjames/"],
  memberOf: {
    "@type": "Organization",
    name: "Tolowa Dee-ni' Nation",
  },
  description:
    "Enrolled citizen of the Tolowa Dee-ni' Nation, former tribal enterprise CIO, and founder of Konative — a Native-owned connectivity and infrastructure brokerage.",
};

const orgAboutSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Konative",
  url: SITE_URL,
  founder: { "@id": `${SITE_URL}/about#jeramey-james` },
  description:
    "A Native-owned, vendor-neutral connectivity and infrastructure brokerage serving Tribal nations, federally funded broadband programs, and data-center developers across North America.",
};

const ABOUT_FAQ = [
  {
    question: "Is Konative really a Native-owned business?",
    answer:
      "Yes. Konative is founded and majority-owned by Jeramey James, an enrolled citizen of the Tolowa Dee-ni' Nation. Native ownership is a matter of fact about who owns and controls the firm — not a marketing label.",
  },
  {
    question: "Does Native ownership matter for our procurement?",
    answer:
      "It often does. Many Tribal nations, tribal enterprises, and federally funded programs extend procurement preference to Native-owned businesses, and many Tribes prefer to keep dollars inside Indian Country. Eligibility rules vary by program, so confirm the specifics with your procurement office — but Konative qualifies as a Native-owned vendor.",
  },
  {
    question: "Is Konative a certified Minority/Native-Owned Business Enterprise?",
    answer:
      "Konative is Native-owned by ownership fact today; formal certification (for example SBA 8(a), NMSDC MBE, a state DBE/MBE, or tribal TERO status) is a separate credentialing step we can pursue where a specific program requires it. We will never claim a certification we do not hold.",
  },
  {
    question: "Why does a Native-owned broker serve Tribal enterprises better?",
    answer:
      "Sovereignty-first is our default, not an accommodation. We understand tribal governance, procurement, and the difference between a grant-funded build and an operating network — because we have lived it. A vendor-neutral broker that shares that context represents the Tribe's interest, not a carrier's.",
  },
];

export default function AboutPage() {
  return (
    <div style={{ background: "#fff", color: TEXT }}>
      <JsonLd
        data={[
          personSchema,
          orgAboutSchema,
          breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "About", url: `${SITE_URL}/about` },
          ]),
          faqSchema(ABOUT_FAQ),
        ]}
      />

      {/* Hero */}
      <section style={{ background: DARK, color: "#fff", padding: "128px 32px 88px", borderBottom: `1px solid ${LINE}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 26 }}>
            <span style={{ display: "block", width: 36, height: 2, background: RED }} />
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: RED }}>
              Native-owned · Tolowa Dee-ni&apos; · Vendor-neutral
            </span>
          </div>
          <h1 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(44px, 6.5vw, 88px)", lineHeight: 0.92, textTransform: "uppercase", letterSpacing: "0.01em", margin: "0 0 24px", maxWidth: 960 }}>
            One sourcing desk for<br /><span style={{ color: RED }}>Tribal enterprises and data-center builds.</span>
          </h1>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 18, lineHeight: 1.7, color: "rgba(255,255,255,0.72)", maxWidth: 680, margin: 0 }}>
            Konative is founded and majority-owned by Jeramey James, an enrolled citizen of the
            Tolowa Dee-ni&apos; Nation — a Native-owned AVANT desk built to sit in both rooms,
            with published benchmarks and a written sovereignty commitment.
          </p>
        </div>
      </section>

      {/* Founder */}
      <section style={{ padding: "88px 32px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 56, alignItems: "start" }} className="about-founder-grid">
          <div>
            <div style={{ position: "relative", width: "100%", aspectRatio: "4/5", background: NAVY, border: `1px solid ${LINE}`, overflow: "hidden" }}>
              <Image
                src="/team/jeramey-james.png"
                alt="Jeramey James, Founder & Principal of Konative, enrolled citizen of the Tolowa Dee-ni' Nation"
                fill
                sizes="340px"
                style={{ objectFit: "cover", objectPosition: "center top" }}
              />
            </div>
            <div style={{ marginTop: 18 }}>
              <p style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 26, textTransform: "uppercase", margin: 0 }}>Jeramey James</p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: MUTED, margin: "4px 0 0" }}>Founder &amp; Principal</p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: RED, fontWeight: 600, margin: "2px 0 0" }}>Enrolled citizen, Tolowa Dee-ni&apos; Nation</p>
              <a href="https://www.linkedin.com/in/jerameyjames/" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: 12, fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 600, color: TEXT, textDecoration: "none", borderBottom: `1px solid ${LINE}`, paddingBottom: 2 }}>
                LinkedIn →
              </a>
            </div>
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
              <span style={{ display: "block", width: 28, height: 2, background: RED }} />
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: RED }}>
                Who owns Konative
              </span>
            </div>
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(30px, 4vw, 48px)", lineHeight: 1.0, textTransform: "uppercase", margin: "0 0 24px", maxWidth: 620 }}>
              Native-owned is a fact here, not a label.
            </h2>
            {[
              "Konative is founded and majority-owned by Jeramey James, an enrolled citizen of the Tolowa Dee-ni' Nation — the coastal people of what is now the far Northern California and Southern Oregon border. That ownership is not decorative. It shapes who is accountable, where the value stays, and whose interest the firm represents.",
              "Jeramey spent his career on the operator's side of the table: a former tribal enterprise CIO who built and ran real networks, won federal broadband funding, and stood up ISPs and enterprise technology for sovereign organizations. Konative exists because Tribal nations kept getting sold a single carrier's answer when what they needed was the whole market — brokered by someone who works for them.",
              "As a vendor-neutral broker, Konative is paid by the supplier that wins the business, never by the Tribe. That model, run by a Native-owned firm, means a Tribal nation gets an advocate who understands sovereignty, procurement, and grant timelines — and a competitive market answer instead of a sales pitch.",
            ].map((p, i) => (
              <p key={i} style={{ fontFamily: "Inter, sans-serif", fontSize: 16, lineHeight: 1.75, color: MUTED, margin: "0 0 18px", maxWidth: 640 }}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Why it matters */}
      <section style={{ background: "#F7F8FA", borderBlock: `1px solid ${LINE}`, padding: "88px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
            <span style={{ display: "block", width: 28, height: 2, background: RED }} />
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: RED }}>
              Why it matters for your nation
            </span>
          </div>
          <h2 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(30px, 4vw, 52px)", lineHeight: 0.98, textTransform: "uppercase", margin: "0 0 44px", maxWidth: 720 }}>
            Keep the dollars, and the trust, in Indian Country.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", border: `1px solid ${LINE}` }}>
            {[
              ["Procurement preference", "Many Tribal nations, tribal enterprises, and federally funded programs extend preference to Native-owned vendors. Konative qualifies — confirm your program's specific rules with your procurement office and we'll help you document it."],
              ["Shared context", "Sovereignty, TERO, grant compliance, and the gap between a funded build and a sustainable operating network aren't concepts we studied. They're where our founder worked."],
              ["Dollars stay home", "Choosing a Native-owned broker keeps advisory value inside Indian Country instead of routing it to an outside carrier's sales channel."],
              ["Vendor-neutral, always", "We represent the Tribe, not a supplier. Suppliers pay our fee, so the market answer we bring you is the whole market — not one carrier's."],
            ].map(([title, body], i) => (
              <div key={title} style={{ padding: 28, background: "#fff", borderRight: `1px solid ${LINE}`, borderTop: i >= 2 ? `1px solid ${LINE}` : "none" }}>
                <span style={{ color: RED, fontWeight: 800, fontSize: 12, fontFamily: "Inter, sans-serif" }}>0{i + 1}</span>
                <h3 style={{ fontFamily: DISPLAY, textTransform: "uppercase", fontSize: 24, margin: "12px 0 10px" }}>{title}</h3>
                <p style={{ fontFamily: "Inter, sans-serif", color: MUTED, lineHeight: 1.65, margin: 0, fontSize: 15 }}>{body}</p>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: MUTED, marginTop: 20, maxWidth: 720, lineHeight: 1.6 }}>
            A note on certification: Konative is Native-owned by ownership fact today. Formal
            credentials (SBA 8(a), NMSDC MBE, state DBE/MBE, tribal TERO) are a separate step we
            pursue where a specific program requires one — we will never claim a certification we
            do not hold.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: NAVY, padding: "90px 32px", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(34px, 5vw, 60px)", lineHeight: 0.94, textTransform: "uppercase", color: "#fff", margin: "0 0 18px" }}>
            Work with a broker<br /><span style={{ color: RED }}>who answers to you.</span>
          </h2>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 16, lineHeight: 1.7, color: "rgba(255,255,255,0.6)", margin: "0 auto 32px", maxWidth: 520 }}>
            Tell us what your nation or project needs. We&apos;ll run the market and bring you a real answer — at no cost to you.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact#request" style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", background: RED, color: "#fff", padding: "16px 34px", textDecoration: "none", borderRadius: 2 }}>
              Start a conversation
            </Link>
            <Link href="/call" style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", background: "transparent", color: "#fff", padding: "15px 30px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 2 }}>
              Book a 15-min call
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
