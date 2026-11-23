import type { Metadata } from "next";
import Link from "next/link";
import HeroBackdrop from "@/components/marketing/HeroBackdrop";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Intelligence — Konative",
  description:
    "Konative's public connectivity intelligence: live markets, datacenter signals, site methodology, Canada market analysis, and weekly infrastructure briefings.",
};

const RED = "#C8001F";
const TEXT = "#111111";
const STEEL = "#374151";
const MUTED = "#6B7280";
const DIVIDER = "#E5E7EB";
const SURFACE = "#F9FAFB";
const DARK = "#0A0F1E";
const DISPLAY = '"Barlow Condensed", sans-serif';
const BODY = "Inter, sans-serif";

const sections = [
  {
    href: "/markets",
    label: "Live Markets",
    eyebrow: "Market Layer",
    headline: "Connectivity demand, routes, and coverage by market",
    summary: "The public market surface for route availability, active metros, and where Konative is seeing connectivity pressure build.",
  },
  {
    href: "/datacenters",
    label: "Demand Signals",
    eyebrow: "Early Warning",
    headline: "Data-center projects reveal where network demand is forming",
    summary: "Projects, facilities, power filings, permits, and interconnection points help prioritize where connectivity checks should begin.",
  },
  {
    href: "/tribal/awards",
    label: "Tribal Awards",
    eyebrow: "Regional Intelligence",
    headline: "Funded Tribal projects that need an operating connectivity plan",
    summary: "Search TBCP awards and turn program context into address lists, requirements, supplier comparisons, and installation action.",
  },
  {
    href: "/licenses",
    label: "Data Sources",
    eyebrow: "How We Work",
    headline: "Know what the public map can—and cannot—prove",
    summary: "Sources, confidence, dates, and limitations behind Konative's public infrastructure and demand intelligence.",
  },
  {
    href: "/news",
    label: "News Feed",
    eyebrow: "News + Analysis",
    headline: "Tribal data centers, energy, broadband grants, and infrastructure coverage",
    summary: "Curated external briefings on DOE and NTIA programs, tribal DC projects, connectivity grants, and market signals tied to procurement decisions.",
  },
  {
    href: "/governors",
    label: "Stalled-Project Tracker",
    eyebrow: "Proprietary Tracker",
    headline: "Stalled & blocked data-center projects — live map",
    summary: "Governor-level context for stalled, canceled, paused, and blocked data-center projects in NV, WV, FL, and OK. Konative's proprietary signal layer for where demand is locked up.",
  },
  {
    href: "/tribal/index",
    label: "Tribal Index",
    eyebrow: "Proprietary Tracker",
    headline: "Tribal & First Nations DC project index",
    summary: "Searchable index of Tribal and First Nations data-center projects across the US and Canada — partner structures, land type, opportunity class, and current status.",
  },
  {
    href: "/map",
    label: "Infrastructure Map",
    eyebrow: "Proprietary Data",
    headline: "North American power, transmission & interconnection map",
    summary: "Konative's proprietary infrastructure map covering North American power, transmission, interconnection, and indigenous-lands layers — the data engine behind every connectivity feasibility check.",
  },
];

const metrics = [
  ["12", "Active markets"],
  ["US + CA", "Markets covered"],
  ["14", "Tier-1 networks indexed"],
  ["48h", "Target brief turnaround"],
];

export default function IntelligenceIndexPage() {
  return (
    <main style={{ background: "#fff", minHeight: "100vh", color: TEXT, fontFamily: BODY }}>
      <section style={{ position: "relative", overflow: "hidden", background: DARK, borderBottom: `1px solid ${DIVIDER}` }}>
        <HeroBackdrop
          src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=2000&q=70"
          alt="Dense network cabling running through a dark data-center server room"
        />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 1180, margin: "0 auto", padding: "150px 48px 76px" }}>
          <p style={eyebrowStyle}>Intelligence</p>
          <h1 style={titleStyle}>
            THE SIGNAL LAYER <span style={{ color: RED }}>BEHIND BROKERAGE.</span>
          </h1>
          <p style={ledeStyle}>
            Konative publishes the market evidence behind the transaction: route activity, datacenter demand, power constraints, supplier signals, and the methodology we use to turn noisy infrastructure news into buying decisions.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 0, border: `1px solid ${DIVIDER}`, marginTop: 44, background: "#fff" }}>
            {metrics.map(([value, label]) => (
              <div key={label} style={{ padding: "24px 22px", borderRight: `1px solid ${DIVIDER}`, borderTop: `3px solid ${RED}` }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 31, fontWeight: 700, lineHeight: 1, color: TEXT }}>{value}</div>
                <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: MUTED, marginTop: 9, fontWeight: 700 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "72px 48px 36px" }}>
        <div style={{ background: DARK, color: "#fff", padding: "36px", display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: 28, alignItems: "center" }}>
          <div>
            <p style={{ ...eyebrowStyle, color: RED, marginBottom: 12 }}>Featured tool</p>
            <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(34px, 5vw, 58px)", lineHeight: 0.95, margin: "0 0 14px", textTransform: "uppercase" }}>
              Check a specific location
            </h2>
            <p style={{ color: "rgba(255,255,255,0.62)", lineHeight: 1.7, fontSize: 16, margin: 0, maxWidth: 660 }}>
              Public datasets create a starting hypothesis. Address-level supplier checks create a real connectivity answer. Send us the location, capacity, diversity, and timing requirements.
            </p>
          </div>
          <Link href="/contact#request" style={{ background: RED, color: "#fff", padding: "16px 28px", textDecoration: "none", fontSize: 12, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
            Request a review
          </Link>
        </div>
      </section>

      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "36px 48px 96px" }}>
        <p style={eyebrowStyle}>Research + trackers</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
          {sections.map((section) => (
            <Link key={section.href} href={section.href} style={{ display: "flex", flexDirection: "column", minHeight: 255, textDecoration: "none", color: "inherit", background: section.href === "/markets" ? SURFACE : "#fff", border: `1px solid ${DIVIDER}`, borderTop: `3px solid ${RED}`, padding: "28px 26px" }}>
              <p style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: RED, margin: "0 0 12px", fontWeight: 800 }}>
                {section.eyebrow}
              </p>
              <h2 style={{ fontSize: 29, fontFamily: DISPLAY, fontWeight: 800, margin: "0 0 14px", lineHeight: 0.98, textTransform: "uppercase", color: TEXT }}>
                {section.headline}
              </h2>
              <p style={{ color: MUTED, margin: 0, fontSize: 14, lineHeight: 1.65 }}>{section.summary}</p>
              <p style={{ color: RED, margin: "auto 0 0", paddingTop: 24, fontSize: 12, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {section.label}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section style={{ background: DARK, color: "#fff", padding: "72px 48px", textAlign: "center" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p style={{ ...eyebrowStyle, justifyContent: "center", color: RED }}>Weekly brief</p>
          <h2 style={{ fontSize: "clamp(34px, 5vw, 58px)", fontFamily: DISPLAY, fontWeight: 800, margin: "0 0 16px", textTransform: "uppercase", lineHeight: 0.95 }}>
            One short intelligence read. No filler.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.62)", margin: "0 auto 28px", lineHeight: 1.7, maxWidth: 620 }}>
            The weekly digest covers what moved in the connectivity markets: site selection, capital flows, carrier supply, utility constraints, and the deals worth knowing.
          </p>
          <Link href="/news" style={{ background: RED, color: "#fff", padding: "16px 32px", textDecoration: "none", fontWeight: 800, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Read the feed
          </Link>
        </div>
      </section>
    </main>
  );
}

const eyebrowStyle = {
  fontSize: 11,
  letterSpacing: "0.16em",
  textTransform: "uppercase" as const,
  color: RED,
  margin: "0 0 18px",
  fontWeight: 800,
};

const titleStyle = {
  fontFamily: DISPLAY,
  fontWeight: 800,
  fontSize: "clamp(54px, 8vw, 104px)",
  lineHeight: 0.9,
  textTransform: "uppercase" as const,
  color: "#ffffff",
  letterSpacing: "0.005em",
  margin: "0 0 28px",
  maxWidth: 920,
};

const ledeStyle = {
  fontSize: 18,
  lineHeight: 1.65,
  color: "rgba(255,255,255,0.78)",
  maxWidth: 720,
  margin: 0,
};
