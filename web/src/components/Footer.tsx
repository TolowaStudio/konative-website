"use client";

import { bookingUrl } from "@/lib/booking";
import Link from "next/link";
import { postalAddress } from "@/lib/newsletter/consent";

const RED = "#C8001F";
const TEXT = "#111111";
const STEEL = "#374151";
const MUTED = "#6B7280";
const DIVIDER = "#E5E7EB";
const SURFACE = "#F9FAFB";

export default function Footer() {
  return (
    <footer style={{ background: "#fff", borderTop: `1px solid ${DIVIDER}`, padding: "64px 0 32px" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 42, marginBottom: 48 }}>
          <div style={{ minWidth: 0 }}>
            <Link href="/" style={{ display: "inline-block", marginBottom: 16, textDecoration: "none", fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800, fontSize: 23, letterSpacing: "0.04em", textTransform: "uppercase" }}>
              <span style={{ color: TEXT }}>KO</span>
              <span style={{ color: RED }}>NATIVE</span>
            </Link>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, lineHeight: 1.7, color: MUTED, maxWidth: 330 }}>
              Native-owned, vendor-neutral connectivity brokerage — domestic and international, any market — for data centers, Tribal enterprises, and infrastructure buyers. Nearby fiber is not deliverable fiber.
            </p>
            <Link href="/call" style={{ display: "inline-block", marginTop: 18, background: RED, color: "#fff", padding: "12px 18px", textDecoration: "none", fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Book a call
            </Link>
          </div>

          <FooterGroup
            title="Who We Serve"
            links={[
              ["I need data-center connectivity", "/data-center-connectivity"],
              ["I'm a tribal nation / enterprise", "/tribal"],
              ["I'm an enterprise / multi-site", "/connectivity"],
            ]}
          />
          <FooterGroup
            title="Intelligence"
            links={[
              ["Intelligence Hub", "/intelligence"],
              ["News Archive", "/news"],
              ["Tribal DC Tracker", "/tribal/projects"],
              ["Market Coverage", "/markets"],
              ["TBCP 3 / NEGP Awardees", "/tribal/grants"],
              ["Voice-to-Scope", "/tribal/scope"],
              ["TBCP Awards", "/tribal/awards"],
              ["Connectivity Map", "/map"],
              ["Stalled Projects", "/governors"],
              ["Dispatch", "/dispatch"],
            ]}
          />
          <FooterGroup
            title="Company"
            links={[
              ["About — Native-owned", "/about"],
              ["Contact", "/contact"],
              ["Privacy", "/privacy"],
              ["Terms", "/terms"],
              ["Data Sources", "/licenses"],
              ["Book a call", bookingUrl("components-footer")],
            ]}
          />
        </div>

        <div style={{ borderTop: `1px solid ${DIVIDER}`, paddingTop: 24, display: "flex", justifyContent: "space-between", gap: 20, flexWrap: "wrap", fontFamily: "Inter, sans-serif", fontSize: 11, color: MUTED }}>
          <span>© 2026 Konative · a trade name of Tolowa Pacific LLC · {postalAddress()}</span>
          <span style={{ color: STEEL, fontWeight: 700 }}>Connectivity brokerage · Market intelligence · Avant partner</span>
        </div>
      </div>
    </footer>
  );
}

function FooterGroup({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div style={{ background: SURFACE, borderTop: `3px solid ${RED}`, padding: "18px 18px 14px" }}>
      <h4 style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: RED, marginBottom: 16 }}>
        {title}
      </h4>
      {links.map(([label, href]) => (
        <Link key={label} href={href} style={{ display: "block", fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: STEEL, textDecoration: "none", marginBottom: 10 }}>
          {label}
        </Link>
      ))}
    </div>
  );
}
