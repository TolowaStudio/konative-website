import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import {
  queryTbcpAwardsList,
  isD1TbcpReady,
  readWithSupabaseFallback,
} from "@/lib/db";
import { JsonLd, breadcrumbSchema, SITE_URL } from "@/components/seo/JsonLd";
import IndexTableClient, { type AwardRow } from "./IndexTableClient";

// Revalidate hourly — data changes when NTIA announces new awards.
export const revalidate = 3600;
export const dynamic = "force-dynamic";

const RED = "#C8001F";
const DISPLAY = "'Barlow Condensed', sans-serif";
const MONO = "'JetBrains Mono', monospace";
const BODY = "'Inter', sans-serif";

// --- Metadata -----------------------------------------------------------

export const metadata: Metadata = {
  title:
    "Tribal Connectivity Index — NTIA TBCP Award Database | Konative",
  description:
    "A free, searchable index of every NTIA Tribal Broadband Connectivity Program (TBCP) award — grantee, amount, NOFO round, and project type. Published by Konative as a public resource for tribal connectivity planning.",
  alternates: { canonical: "/tribal/index" },
  openGraph: {
    title: "Tribal Connectivity Index — NTIA TBCP Award Database | Konative",
    description:
      "A free, searchable index of every NTIA Tribal Broadband Connectivity Program (TBCP) award — grantee, amount, NOFO round, and project type. Published by Konative as a public resource for tribal connectivity planning.",
    url: `${SITE_URL}/tribal/index`,
  },
};

// --- Data ---------------------------------------------------------------

async function getAwards(): Promise<AwardRow[]> {
  return readWithSupabaseFallback<AwardRow[]>(
    "tribal/index",
    async () =>
      (await isD1TbcpReady())
        ? ((await queryTbcpAwardsList(1000)) as AwardRow[] | null)
        : null,
    async () => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey =
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!supabaseUrl || !supabaseKey) return [];

      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase
        .from("tbcp_awards")
        .select(
          "id,slug,grantee_name,award_amount_usd,nofo_round,project_type,lat,lng"
        )
        .order("award_amount_usd", { ascending: false })
        .limit(1000);
      if (error) {
        console.error("[tribal/index] Supabase error:", error.message);
        return [];
      }
      return (data as AwardRow[]) || [];
    },
  );
}

function fmt(n: number | null) {
  if (!n) return "—";
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  return `$${Math.round(n).toLocaleString()}`;
}

// --- Page ---------------------------------------------------------------

export default async function TribalIndexPage() {
  const awards = await getAwards();

  const totalFunded = awards.reduce(
    (s, a) => s + (a.award_amount_usd ?? 0),
    0
  );

  // --- JSON-LD ---
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Tribal Connectivity", url: `${SITE_URL}/tribal` },
    { name: "Connectivity Index", url: `${SITE_URL}/tribal/index` },
  ]);

  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "NTIA Tribal Broadband Connectivity Program (TBCP) Award Index",
    description:
      "A complete index of NTIA Tribal Broadband Connectivity Program awards, including grantee name, award amount, NOFO round, and project type. Published by Konative as a free public resource for tribal connectivity planning.",
    url: `${SITE_URL}/tribal/index`,
    creator: {
      "@type": "Organization",
      name: "Konative",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Tolowa Pacific / Konative",
      url: SITE_URL,
    },
    license: "https://creativecommons.org/licenses/by/4.0/",
    isAccessibleForFree: true,
    measurementTechnique: "Federal grant award records from NTIA NBAM",
    variableMeasured: "Broadband infrastructure grant amounts and recipients",
    temporalCoverage: "2021/..",
    spatialCoverage: {
      "@type": "Place",
      name: "United States",
    },
    size: `${awards.length} records`,
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "NTIA TBCP Award Recipients",
    description: `${awards.length} Tribal Broadband Connectivity Program award recipients`,
    numberOfItems: awards.length,
    itemListElement: awards.slice(0, 50).map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: a.grantee_name,
      url: `${SITE_URL}/tribal/awards/${a.slug}`,
    })),
  };

  return (
    <main style={{ background: "#fff", minHeight: "100vh", paddingTop: 64 }}>
      <JsonLd data={[breadcrumb, datasetSchema, itemListSchema]} />

      {/* Hero */}
      <section style={{ background: "#0B1929", padding: "72px 24px 56px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <nav style={{ marginBottom: 24 }}>
            <Link
              href="/tribal"
              style={{
                fontFamily: BODY,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
                textDecoration: "none",
              }}
            >
              ← Tribal Connectivity
            </Link>
          </nav>
          <div
            style={{
              fontFamily: BODY,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: RED,
              marginBottom: 16,
            }}
          >
            Tribal Connectivity Index · Free Public Resource
          </div>
          <h1
            style={{
              fontFamily: DISPLAY,
              fontWeight: 800,
              fontSize: "clamp(40px,6vw,72px)",
              textTransform: "uppercase",
              color: "#fff",
              lineHeight: 0.95,
              marginBottom: 24,
            }}
          >
            NTIA TBCP
            <br />
            <span style={{ color: RED }}>Award Database</span>
          </h1>

          {/* Lede */}
          <p
            style={{
              fontFamily: BODY,
              fontSize: 16,
              color: "rgba(255,255,255,0.65)",
              maxWidth: 640,
              lineHeight: 1.75,
              marginBottom: 32,
            }}
          >
            Every grant from the NTIA Tribal Broadband Connectivity Program
            (TBCP) — searchable, filterable, and free. Published by Konative as
            a public planning resource for tribal connectivity teams.{" "}
            <Link
              href="/call"
              style={{ color: RED, fontWeight: 600, textDecoration: "none" }}
            >
              Talk to a connectivity advisor →
            </Link>
          </p>

          {/* Stats strip */}
          <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
            {[
              { label: "Total Awards", value: awards.length.toString() },
              {
                label: "Total Funded",
                value: fmt(totalFunded),
              },
            ].map((s) => (
              <div key={s.label}>
                <div
                  style={{
                    fontFamily: MONO,
                    fontWeight: 600,
                    fontSize: 28,
                    color: RED,
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontFamily: BODY,
                    fontSize: 11,
                    color: "rgba(255,255,255,0.4)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginTop: 4,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Table section */}
      <section
        style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px 64px" }}
      >
        {awards.length === 0 ? (
          <p
            style={{
              fontFamily: BODY,
              fontSize: 14,
              color: "#9CA3AF",
              padding: "48px 0",
            }}
          >
            {/* VERIFY: If this shows, check SUPABASE_SERVICE_ROLE_KEY is set in Vercel env */}
            Award data temporarily unavailable. Please check back shortly.
          </p>
        ) : (
          <IndexTableClient awards={awards} />
        )}
      </section>

      {/* CTA strip */}
      <section style={{ background: "#0B1929", padding: "56px 24px" }}>
        <div
          style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}
        >
          <div
            style={{
              fontFamily: DISPLAY,
              fontWeight: 800,
              fontSize: "clamp(28px,4vw,48px)",
              textTransform: "uppercase",
              color: "#fff",
              marginBottom: 16,
            }}
          >
            Your tribe received an award?
          </div>
          <p
            style={{
              fontFamily: BODY,
              fontSize: 16,
              color: "rgba(255,255,255,0.55)",
              marginBottom: 32,
              lineHeight: 1.7,
            }}
          >
            Infrastructure grants build the network. Konative brokers the
            connectivity, SD-WAN, voice, and security that runs on top — at no
            cost to your enterprise.
          </p>
          <Link
            href="/call"
            style={{
              display: "inline-block",
              fontFamily: BODY,
              fontWeight: 600,
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              background: RED,
              color: "#fff",
              padding: "16px 40px",
              textDecoration: "none",
            }}
          >
            Talk to a Connectivity Advisor →
          </Link>
        </div>
      </section>
    </main>
  );
}
