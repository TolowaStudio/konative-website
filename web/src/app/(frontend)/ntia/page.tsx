import type { Metadata } from "next";
import Link from "next/link";
import PitchLayout, { PitchSection } from "@/components/marketing/PitchLayout";
import TbcpIntelligence from "@/components/TbcpIntelligence";
import { getTbcpSummary } from "@/lib/data/tbcp";
import {
  JsonLd,
  SITE_URL,
  organizationSchema,
  breadcrumbSchema,
  faqSchema,
  serviceSchema,
} from "@/components/seo/JsonLd";

// Public aggregate TBCP data — cache for an hour.
export const revalidate = 3600;
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "NTIA TBCP Round 3 Connectivity Partner | Konative",
  description:
    "TBCP Round 3 and NEGP both close Nov 17, 2026 at 11:59 p.m. ET. Konative brokers the operational connectivity grants don't fund — vendor-neutral, sovereignty-aware, $0 to the Tribe.",
  keywords: [
    "NTIA TBCP Round 3",
    "Tribal Broadband Connectivity Program",
    "Native Entities Grant Program",
    "Tribal broadband grant connectivity partner",
    "sovereignty-aware connectivity broker",
    "post-award connectivity design",
    "vendor-neutral Tribal connectivity",
  ],
  alternates: { canonical: "/ntia" },
};

const PAGE_URL = `${SITE_URL}/ntia`;

/** Program facts — sourced from NTIA TBCP Round 3 / NEGP guidance. */
const facts: { value: string; label: string; note: string }[] = [
  {
    value: "$790M",
    label: "TBCP Round 3 + NEGP available",
    note: "$540M in Tribal Broadband Connectivity Program Round 3 plus $250M in the Native Entities Grant Program (NTIA, June 2026 NOFO).",
  },
  {
    value: "Nov 17, 2026",
    label: "Application deadlines",
    note: "TBCP Round 3 (2026-NTIA-TBCP) and NEGP (2026-NTIA-NEGP) both close November 17, 2026 at 11:59 p.m. ET under the current NTIA notices, via the NTIA grants portal.",
  },
  {
    value: "Spring 2027",
    label: "Awards begin (rolling)",
    note: "Awards are expected on a rolling basis beginning Spring 2027, with execution to follow.",
  },
];

const brings: { num: string; title: string; body: string }[] = [
  {
    num: "01 — Review",
    title: "Connectivity Architecture Review",
    body: "We read your proposed build and map the operational connectivity that will have to run on it — DIA, transport, SD-WAN, voice, redundancy, cloud on-ramps, and security — so it's specified into the proposal, not discovered after award.",
  },
  {
    num: "02 — Source",
    title: "Vendor-Neutral Sourcing",
    body: "Through Avant's portfolio of 100+ suppliers we quote the whole market instead of one carrier. On low-density Tribal lands that neutrality is the difference between a route that exists and one that doesn't.",
  },
  {
    num: "03 — Terms",
    title: "Pre-Negotiated Carrier Terms",
    body: "We line up carrier pricing and terms during the pre-award window so that the moment funding lands, the connectivity contracts are ready to execute — not restarted from zero.",
  },
  {
    num: "04 — Sovereignty",
    title: "Sovereignty-Aware Advisory",
    body: "We understand Tribal jurisdiction and the line between an infrastructure grant and the operational connectivity that runs on top of it. We work with your enterprise and your grant team, not around them.",
  },
  {
    num: "05 — Cost",
    title: "$0 Cost to the Tribe",
    body: "Suppliers pay our commission. The Tribe gets an expert, carrier-neutral connectivity advisor and a single point of contact for every carrier — at no charge, for the life of the account.",
  },
];

const timeline: { phase: string; window: string; body: string }[] = [
  {
    phase: "Pre-Award",
    window: "Now → Nov 17, 2026",
    body: "Engage early. TBCP Round 3 and NEGP both close November 17, 2026. We review connectivity requirements and help specify carrier-grade operational connectivity into the proposal before the relevant deadline.",
  },
  {
    phase: "Award",
    window: "Spring 2027 (rolling)",
    body: "Winners execute. Connectivity design and pre-negotiated carrier contracts move from plan to order the moment funding is confirmed.",
  },
  {
    phase: "Operations",
    window: "2027 and beyond",
    body: "We manage the resulting connectivity contracts — billing, moves/adds/changes, escalations, renewals — for the life of the account.",
  },
];

const eligibility: string[] = [
  "Tribal governments",
  "Tribal colleges & universities (TCUs)",
  "Tribal organizations",
  "Alaska Native Corporations (ANCs)",
  "Native Hawaiian organizations (DHHL)",
];

const faqs: { question: string; answer: string }[] = [
  {
    question: "What is NTIA TBCP Round 3 and how much funding is available?",
    answer:
      "The NTIA Tribal Broadband Connectivity Program (TBCP) Round 3, together with the Native Entities Grant Program (NEGP), makes approximately $790 million available for Tribal broadband. Both current application windows close November 17, 2026 at 11:59 p.m. ET, with awards expected on a rolling basis beginning Spring 2027.",
  },
  {
    question: "Who is eligible to apply?",
    answer:
      "Eligible applicants include Tribal governments, Tribal colleges and universities, Tribal organizations, Alaska Native Corporations, and Native Hawaiian organizations (DHHL). This is a sovereignty-aligned program directed to Native entities.",
  },
  {
    question: "If the grant funds the infrastructure, what does Konative actually do?",
    answer:
      "Federal grants fund infrastructure — fiber, middle-mile, last-mile, and power. They do not fund the operational connectivity layer that runs on top of it: the enterprise internet, SD-WAN, voice, cybersecurity, redundancy, and cloud on-ramps that keep a gaming floor, clinic, government office, or school running. That recurring operational layer is what Konative sources, designs, and manages.",
  },
  {
    question: "What does Konative cost a Tribe or Native entity?",
    answer:
      "Nothing. Konative is a vendor-neutral connectivity brokerage operating as a subagent under Avant Communications. Suppliers pay our commission, so the Tribe gets an expert, carrier-neutral advisor and a single point of contact across every carrier at no cost.",
  },
  {
    question: "We haven't been awarded yet. Is it too early to engage Konative?",
    answer:
      "No — pre-award is the right time. Engaging before the shared TBCP Round 3 and NEGP deadline (November 17, 2026 at 11:59 p.m. ET) lets us specify carrier-grade operational connectivity into your proposal and pre-negotiate carrier terms, so the connectivity is ready to execute the moment funding lands in Spring 2027 rather than restarted from scratch.",
  },
  {
    question: "Is Konative really vendor-neutral?",
    answer:
      "Yes. Konative is not a carrier. We source across Avant's portfolio of 100+ suppliers and recommend what fits your requirement, not what pays us most. On low-density Tribal lands, that neutrality — including fixed wireless and satellite where fiber doesn't reach — is what makes a workable route possible.",
  },
  {
    question: "Does a Round 3 award come with a specific connectivity contract, or does Konative sign anything on our behalf?",
    answer:
      "Neither the grant nor Konative puts the Tribe into a connectivity contract automatically. NTIA's award funds the infrastructure build; the operational connectivity contract — internet, SD-WAN, voice, security — is a separate agreement between the Tribe (or Tribal entity) and the winning carrier once that carrier is selected. Konative runs the sourcing and negotiation process and stays engaged through the life of the contract, but the Tribe contracts directly with the carrier. Pre-negotiating those terms during the pre-award window is what lets execution happen quickly once funding is confirmed, rather than starting the carrier search from scratch in Spring 2027.",
  },
];

export default async function NtiaPage() {
  const tbcpSummary = await getTbcpSummary();
  const service = serviceSchema({
    name: "NTIA TBCP Round 3 Connectivity Partner",
    description:
      "Vendor-neutral, sovereignty-aware connectivity architecture, sourcing, and lifecycle management for Tribal entities applying to the NTIA Tribal Broadband Connectivity Program Round 3 and the Native Entities Grant Program.",
    url: PAGE_URL,
    serviceType: "Tribal broadband connectivity brokerage",
    areaServed: "US",
  });

  const governmentService = {
    "@context": "https://schema.org",
    "@type": "GovernmentService",
    name: "NTIA Tribal Broadband Connectivity Program (TBCP) Round 3 & Native Entities Grant Program (NEGP)",
    serviceType: "Federal broadband grant program",
    description:
      "Federal grant programs administered by the NTIA making approximately $790 million available for Tribal broadband infrastructure. TBCP Round 3 and NEGP both close November 17, 2026 at 11:59 p.m. ET; awards begin on a rolling basis in Spring 2027.",
    provider: {
      "@type": "GovernmentOrganization",
      name: "National Telecommunications and Information Administration (NTIA)",
    },
    audience: {
      "@type": "Audience",
      audienceType:
        "Tribal governments, Tribal colleges & universities, Tribal organizations, Alaska Native Corporations, Native Hawaiian organizations",
    },
  };

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Tribal Enterprise", url: `${SITE_URL}/tribal` },
    { name: "NTIA TBCP Round 3", url: PAGE_URL },
  ]);

  return (
    <>
      <JsonLd
        data={[
          organizationSchema,
          service,
          governmentService,
          faqSchema(faqs),
          breadcrumbs,
        ]}
      />
      <PitchLayout
        eyebrow="NTIA TBCP Round 3 + NEGP · Both close Nov 17, 2026"
        titleLines={[
          { text: "GRANTS FUND", tone: "white" },
          { text: "THE FIBER.", tone: "white" },
          { text: "WE BROKER", tone: "dim" },
          { text: "THE CONNECTIVITY.", tone: "rust" },
        ]}
        subhead="The NTIA Tribal Broadband Connectivity Program Round 3 ($540M) and the Native Entities Grant Program ($250M) put $790M toward Tribal broadband — both close November 17, 2026 at 11:59 p.m. ET. Grants fund the build, not the operational connectivity that runs on it. Konative is the vendor-neutral, sovereignty-aware partner that designs and sources that layer, at no cost to the Tribe."
        primaryCta={{ label: "Request a Round 3 connectivity consult →", href: "/contact#request" }}
        secondaryCta={{ label: "Tribal Enterprise →", href: "/tribal" }}
        heroImage={{
          src: "https://images.unsplash.com/photo-1763515186653-2df0fba44697?auto=format&fit=crop&w=2000&q=70",
          alt: "Excavator digging a trench for rural broadband cable installation",
          credit: { name: "Chandler Cruttenden", url: "https://unsplash.com/@chanphoto" },
        }}
        ctaHeadlineTop="TBCP + NEGP CLOSE"
        ctaHeadlineBottom="NOV 17, 2026 · 11:59 P.M. ET"
        ctaSub="Engage before your program deadline so carrier-grade connectivity is specified into your proposal — ready to execute the moment funding lands in Spring 2027."
      >
        {/* The gap grants don't fund */}
        <PitchSection eyebrow="The Gap" heading="The layer grants don't fund">
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 17,
              lineHeight: 1.75,
              color: "#6B7280",
              maxWidth: 760,
              marginBottom: 40,
            }}
          >
            Federal broadband grants fund <strong style={{ color: "#111111" }}>infrastructure</strong> — fiber,
            middle-mile, last-mile, and power. They do not fund the{" "}
            <strong style={{ color: "#111111" }}>operational connectivity</strong> that runs on top of it: the
            enterprise internet, SD-WAN, voice, cybersecurity, redundancy, and cloud on-ramps that keep a gaming
            floor, clinic, government office, or school actually running. That recurring operational layer is the
            gap — and it is exactly what Konative sources, designs, and manages. See the full picture of what a
            Tribal connectivity broker does across gaming, government, healthcare, and education on the{" "}
            <Link href="/tribal" style={{ color: "#C8001F", textDecoration: "underline" }}>
              Tribal Enterprise Connectivity
            </Link>{" "}
            page.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 16,
            }}
          >
            <div
              style={{
                background: "#fff",
                border: "1px solid #E5E7EB",
                borderTop: "3px solid #6B7280",
                padding: "30px 28px",
              }}
            >
              <div
                style={{
                  fontFamily: '"Barlow Condensed", sans-serif',
                  fontWeight: 700,
                  fontSize: 12,
                  letterSpacing: "0.18em",
                  color: "#6B7280",
                  marginBottom: 12,
                }}
              >
                WHAT THE GRANT FUNDS
              </div>
              <h3
                style={{
                  fontFamily: '"Barlow Condensed", sans-serif',
                  fontWeight: 700,
                  fontSize: 22,
                  textTransform: "uppercase",
                  color: "#111111",
                  lineHeight: 1.05,
                  marginBottom: 12,
                }}
              >
                The Infrastructure
              </h3>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, lineHeight: 1.7, color: "#6B7280", margin: 0 }}>
                Fiber routes, middle-mile and last-mile plant, towers, conduit, and the power to light them.
                One-time capital to put the physical network in the ground.
              </p>
            </div>
            <div
              style={{
                background: "#fff",
                border: "1px solid #E5E7EB",
                borderTop: "3px solid #C8001F",
                padding: "30px 28px",
              }}
            >
              <div
                style={{
                  fontFamily: '"Barlow Condensed", sans-serif',
                  fontWeight: 700,
                  fontSize: 12,
                  letterSpacing: "0.18em",
                  color: "#C8001F",
                  marginBottom: 12,
                }}
              >
                WHAT KONATIVE BROKERS
              </div>
              <h3
                style={{
                  fontFamily: '"Barlow Condensed", sans-serif',
                  fontWeight: 700,
                  fontSize: 22,
                  textTransform: "uppercase",
                  color: "#111111",
                  lineHeight: 1.05,
                  marginBottom: 12,
                }}
              >
                The Operational Connectivity
              </h3>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, lineHeight: 1.7, color: "#6B7280", margin: 0 }}>
                Enterprise internet, SD-WAN, voice, cybersecurity, redundancy, and cloud on-ramps — the recurring
                layer that keeps the enterprise running. Sourced vendor-neutral, at no cost to the Tribe.
              </p>
            </div>
          </div>
        </PitchSection>

        {/* Program facts */}
        <PitchSection eyebrow="The Opportunity" heading="Round 3, by the numbers" background="#0C2046">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 1,
              background: "rgba(255,255,255,0.08)",
            }}
          >
            {facts.map((f, i) => (
              <div key={i} style={{ background: "#0C2046", padding: "32px 28px" }}>
                <div
                  style={{
                    fontFamily: '"Barlow Condensed", sans-serif',
                    fontWeight: 700,
                    fontSize: 40,
                    color: "#C8001F",
                    lineHeight: 1,
                    marginBottom: 10,
                  }}
                >
                  {f.value}
                </div>
                <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 12, color: "#fff", marginBottom: 8 }}>
                  {f.label}
                </div>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,0.4)", margin: 0 }}>
                  {f.note}
                </p>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, lineHeight: 1.6, color: "rgba(255,255,255,0.3)", marginTop: 20 }}>
            Source: NTIA Tribal Broadband Connectivity Program (TBCP) Round 3 &amp; Native Entities Grant Program (NEGP).
            Figures are directional and updated as program guidance evolves.
          </p>
        </PitchSection>

        {/* What Konative brings */}
        <PitchSection eyebrow="Why Konative" heading="What we bring to a Round 3 applicant">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 16,
            }}
          >
            {brings.map((b, i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  border: "1px solid #E5E7EB",
                  borderTop: "3px solid #C8001F",
                  padding: "30px 28px",
                }}
              >
                <div
                  style={{
                    fontFamily: '"Barlow Condensed", sans-serif',
                    fontWeight: 700,
                    fontSize: 12,
                    letterSpacing: "0.18em",
                    color: "#C8001F",
                    marginBottom: 12,
                  }}
                >
                  {b.num}
                </div>
                <h3
                  style={{
                    fontFamily: '"Barlow Condensed", sans-serif',
                    fontWeight: 700,
                    fontSize: 22,
                    textTransform: "uppercase",
                    color: "#111111",
                    lineHeight: 1.05,
                    marginBottom: 10,
                  }}
                >
                  {b.title}
                </h3>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, lineHeight: 1.7, color: "#6B7280", margin: 0 }}>
                  {b.body}
                </p>
              </div>
            ))}
          </div>
        </PitchSection>

        {/* TBCP Round 1–2 intelligence — real data from Supabase */}
        <TbcpIntelligence summary={tbcpSummary} background="#fff" />

        {/* Timeline */}
        <PitchSection eyebrow="The Motion" heading="Pre-award → Award → Operations" background="#F9FAFB">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 0,
            }}
          >
            {timeline.map((t, i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  borderTop: "3px solid #C8001F",
                  borderRight: i < timeline.length - 1 ? "1px solid #E5E7EB" : "none",
                  borderBottom: "1px solid #E5E7EB",
                  borderLeft: "1px solid #E5E7EB",
                  padding: "30px 28px",
                }}
              >
                <div
                  style={{
                    fontFamily: '"Barlow Condensed", sans-serif',
                    fontWeight: 700,
                    fontSize: 12,
                    letterSpacing: "0.18em",
                    color: "#C8001F",
                    marginBottom: 10,
                  }}
                >
                  {`PHASE ${String(i + 1).padStart(2, "0")}`}
                </div>
                <h3
                  style={{
                    fontFamily: '"Barlow Condensed", sans-serif',
                    fontWeight: 700,
                    fontSize: 26,
                    textTransform: "uppercase",
                    color: "#111111",
                    lineHeight: 1,
                    marginBottom: 6,
                  }}
                >
                  {t.phase}
                </h3>
                <div
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 12,
                    color: "#374151",
                    marginBottom: 14,
                  }}
                >
                  {t.window}
                </div>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, lineHeight: 1.7, color: "#6B7280", margin: 0 }}>
                  {t.body}
                </p>
              </div>
            ))}
          </div>
        </PitchSection>

        {/* Eligibility */}
        <PitchSection eyebrow="Eligibility" heading="Who can apply">
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 16,
              lineHeight: 1.75,
              color: "#6B7280",
              maxWidth: 720,
              marginBottom: 32,
            }}
          >
            TBCP Round 3 and the NEGP are directed to Native entities. If you fall into one of the categories below,
            you are eligible to apply — both TBCP Round 3 and NEGP by November 17, 2026 at 11:59 p.m. ET.
          </p>
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 1,
              background: "#E5E7EB",
              border: "1px solid #E5E7EB",
            }}
          >
            {eligibility.map((e, i) => (
              <li
                key={i}
                style={{
                  background: "#F9FAFB",
                  padding: "22px 24px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <span aria-hidden="true" style={{ display: "block", width: 8, height: 8, background: "#C8001F", flexShrink: 0 }} />
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 15, color: "#111111" }}>{e}</span>
              </li>
            ))}
          </ul>
        </PitchSection>

        {/* FAQ */}
        <PitchSection eyebrow="Questions" heading="What a broadband director asks" background="#F9FAFB">
          <div style={{ display: "grid", gap: 16, maxWidth: 860 }}>
            {faqs.map((f, i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  border: "1px solid #E5E7EB",
                  borderLeft: "3px solid #C8001F",
                  padding: "26px 28px",
                }}
              >
                <h3
                  style={{
                    fontFamily: '"Barlow Condensed", sans-serif',
                    fontWeight: 700,
                    fontSize: 21,
                    textTransform: "uppercase",
                    color: "#111111",
                    lineHeight: 1.1,
                    marginBottom: 10,
                  }}
                >
                  {f.question}
                </h3>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, lineHeight: 1.75, color: "#6B7280", margin: 0 }}>
                  {f.answer}
                </p>
              </div>
            ))}
          </div>
        </PitchSection>
      </PitchLayout>
    </>
  );
}
