"use client";

import Link from "next/link";

const RED = "#C8001F";
const DARK = "#08111F";
const TEXT = "#111827";
const MUTED = "#667085";
const LINE = "#E5E7EB";
const DISPLAY = "'Barlow Condensed', sans-serif";

const outcomes = [
  ["Provider options", "Identify suppliers that can serve each address and requirement."],
  ["Comparable pricing", "Normalize recurring, installation, construction, term, and escalation costs."],
  ["Resilience review", "Check carrier, path, entrance, transport, and failover assumptions."],
  ["One accountable team", "Manage sourcing, ordering, installation, escalation, and renewal."],
];

const gtmMotions = [
  ["Tribal awards", "Use TBCP and NEGP signals to move from public funding to operating connectivity, security, voice, cloud, and managed network needs."],
  ["Gaming uptime", "Review casino and hospitality WAN, payments, surveillance, guest access, voice, cybersecurity, and failover before renewal pressure hits."],
  ["Data-center build signals", "Turn map, power, stalled-project, and Canada market signals into early carrier, fiber-path, transport, DCI, and cloud on-ramp reviews."],
  ["Canada partnerships", "Build a credible northern lane with First Nations, Indigenous economic development, carrier, engineering, and capital partners."],
];

const signalRows = [
  ["164", "proposed tribal contacts — pending review, 0 approved for campaign"],
  ["17", "TBCP award-matched organizations ready for approval review"],
  ["60", "gaming and casino contacts for uptime and resilience outreach"],
  ["US + Canada", "operating focus for tribal, Indigenous, rural, and data-center connectivity"],
];

export default function HomePage() {
  return (
    <main style={{ color: TEXT, background: "#fff" }}>
      <section style={{ minHeight: "88dvh", position: "relative", overflow: "hidden", background: DARK }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 72% 28%, rgba(200,0,31,.18), transparent 36%), linear-gradient(90deg,#08111F 0%,#0B1424 60%,#101A2C 100%)" }} />
        <div className="home-hero-grid" style={{ position: "relative", maxWidth: 1320, margin: "0 auto", padding: "116px 32px 72px", display: "grid", gridTemplateColumns: "minmax(0, .95fr) minmax(440px, .9fr)", gap: 42, alignItems: "center" }}>
          <div>
            <p style={eyebrow}>Indigenous-owned connectivity brokerage · AVANT partner</p>
            <h1 className="home-hero-title" style={{ fontFamily: DISPLAY, fontSize: "clamp(54px,7.4vw,108px)", lineHeight: .86, letterSpacing: "-.025em", textTransform: "uppercase", color: "#fff", maxWidth: 840, margin: "0 0 28px" }}>
              Source the network behind <span style={{ color: RED }}>critical infrastructure.</span>
            </h1>
            <p className="home-hero-copy" style={{ maxWidth: 680, color: "rgba(255,255,255,.72)", fontSize: 18, lineHeight: 1.7, marginBottom: 36 }}>
              Konative is a vendor-neutral, sovereignty-aware brokerage for tribal and rural enterprises, Indigenous partners, and data-center teams across the United States and Canada. We use public data, maps, awards, and market signals to source internet, fiber, transport, cloud, voice, security, colocation, and interconnection.
            </p>
            <div className="home-hero-actions" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/call" style={primary}>Book a connectivity review</Link>
              <Link href="/tribal/grants" style={secondary}>TBCP 3 / NEGP help</Link>
            </div>
            <div className="home-signal-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", maxWidth: 800, marginTop: 48, border: "1px solid rgba(255,255,255,.15)" }}>
              {["Tribal + rural", "Data-center connectivity", "US + Canada", "Map-backed outreach"].map(x => <div key={x} style={{ padding: "16px 18px", color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: ".11em", textTransform: "uppercase", borderRight: "1px solid rgba(255,255,255,.12)" }}>{x}</div>)}
            </div>
          </div>
          <div className="home-hero-map" style={{ minHeight: 520, border: "1px solid rgba(255,255,255,.16)", background: "rgba(255,255,255,.04)", boxShadow: "0 28px 80px rgba(0,0,0,.32)", position: "relative", overflow: "hidden" }}>
            <img className="home-map-image" src="/images/connectivity-map-hero.png" alt="North America connectivity opportunity map with data center, network, and Indigenous land signal layers" />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(8,17,31,0) 40%, rgba(8,17,31,.74) 100%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", left: 18, right: 18, bottom: 18, background: "rgba(8,17,31,.86)", border: "1px solid rgba(255,255,255,.12)", padding: 16 }}>
              <p style={{ color: RED, fontSize: 10, fontWeight: 800, letterSpacing: ".16em", textTransform: "uppercase", marginBottom: 8 }}>Live sourcing surface</p>
              <p style={{ color: "rgba(255,255,255,.76)", fontSize: 13, lineHeight: 1.55, margin: 0 }}>Public infrastructure signals become reviewed market questions, not automated claims.</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "96px 32px" }}>
        <p style={{ ...eyebrow, color: RED }}>Start with your situation</p>
        <h2 style={sectionTitle}>Two go-to-market lanes. One sourcing desk.</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,430px),1fr))", gap: 18, marginTop: 42 }}>
          <Door href="/tribal/grants" number="01" title="TBCP 3 & Tribal grants" body="Turn TBCP 3, NEGP, award records, renewals, gaming uptime, healthcare, education, and rural enterprise needs into carrier-neutral sourcing and installed service." cta="Plan funded connectivity" />
          <Door href="/data-center-connectivity" number="02" title="Data-center connectivity" body="Determine whether a site can obtain the internet, transport, dark fiber, wavelengths, cloud access, DCI, and physical diversity its operating plan requires." cta="Evaluate site connectivity" />
        </div>
        <p style={{ color: MUTED, marginTop: 22, lineHeight: 1.7 }}>Also sourcing multi-site enterprise, gaming and hospitality, healthcare, public safety, UCaaS/CCaaS, managed networks, cloud, mobility, cybersecurity, and Canada partnership opportunities.</p>
      </section>

      <section style={{ background: "#fff", borderBlock: `1px solid ${LINE}`, padding: "88px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: 42, alignItems: "start" }}>
            <div>
              <p style={{ ...eyebrow, color: RED }}>GTM engine</p>
              <h2 style={sectionTitle}>The site feeds reviewed outreach, not generic traffic.</h2>
              <p style={{ color: MUTED, lineHeight: 1.75, fontSize: 16, maxWidth: 650, marginTop: 24 }}>
                Every useful visitor should land in a lane, campaign, or partner motion. Konative turns public award data, market maps, stalled-project signals, and relationship context into approved Twenty CRM queues before any outreach begins.
              </p>
            </div>
            <div style={{ border: `1px solid ${LINE}`, background: "#F7F8FA" }}>
              {signalRows.map(([value, label]) => (
                <div key={value} style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 18, padding: "20px 24px", borderBottom: `1px solid ${LINE}`, alignItems: "baseline" }}>
                  <strong style={{ fontFamily: DISPLAY, fontSize: 34, lineHeight: 1, color: RED, textTransform: "uppercase" }}>{value}</strong>
                  <span style={{ color: MUTED, lineHeight: 1.55, fontSize: 14 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,260px),1fr))", gap: 0, marginTop: 44, border: `1px solid ${LINE}` }}>
            {gtmMotions.map(([title, body], i) => (
              <div key={title} style={{ padding: 28, borderRight: `1px solid ${LINE}`, background: i % 2 === 0 ? "#fff" : "#F9FAFB" }}>
                <span style={{ color: RED, fontWeight: 800, fontSize: 12 }}>0{i + 1}</span>
                <h3 style={{ fontFamily: DISPLAY, textTransform: "uppercase", fontSize: 28, lineHeight: 1, margin: "14px 0 12px" }}>{title}</h3>
                <p style={{ color: MUTED, lineHeight: 1.65, margin: 0, fontSize: 14 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "#F7F8FA", borderBlock: `1px solid ${LINE}`, padding: "88px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <p style={{ ...eyebrow, color: RED }}>What you receive</p>
          <h2 style={sectionTitle}>A market answer—not one carrier&apos;s answer.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", marginTop: 40, border: `1px solid ${LINE}` }}>
            {outcomes.map(([title, body], i) => <div key={title} style={{ padding: 28, background: "#fff", borderRight: `1px solid ${LINE}` }}><span style={{ color: RED, fontWeight: 800, fontSize: 12 }}>0{i + 1}</span><h3 style={{ fontFamily: DISPLAY, textTransform: "uppercase", fontSize: 27, margin: "14px 0 10px" }}>{title}</h3><p style={{ color: MUTED, lineHeight: 1.65, margin: 0 }}>{body}</p></div>)}
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "96px 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 30, alignItems: "end", flexWrap: "wrap", marginBottom: 34 }}>
          <div><p style={{ ...eyebrow, color: RED }}>Connectivity opportunity map</p><h2 style={sectionTitle}>Demand, infrastructure, and funding context.</h2></div>
          <p style={{ color: MUTED, maxWidth: 430, lineHeight: 1.7 }}>The map is an evidence layer, not a promise of serviceability. We combine public infrastructure signals with supplier sourcing to answer a specific address.</p>
        </div>
        <div className="home-map-band" style={{ minHeight: 560, height: "min(64vw, 640px)", position: "relative", border: `1px solid ${LINE}`, overflow: "hidden", background: "#EEF2F4" }}>
          <img className="home-map-image" src="/images/connectivity-map-hero.png" alt="North America connectivity opportunity map with data center, network, and Indigenous land signal layers" />
          <div style={{ position: "absolute", left: 18, bottom: 18, background: "rgba(255,255,255,.94)", padding: 16, maxWidth: 390, border: `1px solid ${LINE}` }}>
            <strong>Need a real answer for a site?</strong>
            <p style={{ color: MUTED, fontSize: 13, lineHeight: 1.5 }}>Submit the address and requirement. Konative will initiate a market and serviceability review.</p>
            <Link href="/contact#request" style={{ color: RED, fontWeight: 800, textDecoration: "none", textTransform: "uppercase", fontSize: 11, letterSpacing: ".1em" }}>Check this location →</Link>
          </div>
        </div>
      </section>

      <section style={{ background: DARK, padding: "84px 32px", color: "#fff", textAlign: "center" }}>
        <div style={{ maxWidth: 850, margin: "0 auto" }}><p style={eyebrow}>One requirement is enough to start</p><h2 style={{ ...sectionTitle, color: "#fff", fontSize: "clamp(48px,7vw,82px)" }}>Bring the addresses. We&apos;ll run the market.</h2><p style={{ color: "rgba(255,255,255,.65)", lineHeight: 1.7, margin: "22px auto 30px", maxWidth: 650 }}>Share a funded project, renewal, new site, RFP, Canada partnership idea, or urgent service problem. We will organize the requirement and identify the fastest credible sourcing path.</p><Link href="/call" style={primary}>Book a discovery call</Link></div>
      </section>
    </main>
  );
}

function Door({ href, number, title, body, cta }: { href: string; number: string; title: string; body: string; cta: string }) {
  return <Link href={href} style={{ textDecoration: "none", color: TEXT, border: `1px solid ${LINE}`, borderTop: `4px solid ${RED}`, padding: "34px", minHeight: 300, display: "flex", flexDirection: "column" }}><span style={{ color: RED, fontWeight: 800 }}>{number}</span><h3 style={{ fontFamily: DISPLAY, fontSize: "clamp(38px,5vw,58px)", lineHeight: .95, textTransform: "uppercase", margin: "30px 0 18px" }}>{title}</h3><p style={{ color: MUTED, lineHeight: 1.7, maxWidth: 540 }}>{body}</p><span style={{ marginTop: "auto", paddingTop: 24, color: RED, fontWeight: 800, textTransform: "uppercase", fontSize: 11, letterSpacing: ".11em" }}>{cta} →</span></Link>;
}

const eyebrow = { color: "#FF526B", textTransform: "uppercase" as const, letterSpacing: ".16em", fontWeight: 800, fontSize: 11, marginBottom: 18 };
const sectionTitle = { fontFamily: DISPLAY, fontSize: "clamp(42px,6vw,72px)", lineHeight: .92, textTransform: "uppercase" as const, margin: 0, maxWidth: 820 };
const primary = { display: "inline-block", padding: "16px 25px", background: RED, color: "#fff", textDecoration: "none", textTransform: "uppercase" as const, fontWeight: 800, letterSpacing: ".1em", fontSize: 12 };
const secondary = { ...primary, background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.35)" };
