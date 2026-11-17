import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import {
  isD1TbcpReady,
  queryTbcpAwardBySlug,
  readWithSupabaseFallback,
  SupabaseFallbackDisabledError,
} from "@/lib/db";
import {
  JsonLd,
  breadcrumbSchema,
  SITE_URL,
} from "@/components/seo/JsonLd";

export const revalidate = 3600;
export const dynamic = "force-dynamic";

const RED = "#C8001F";
const DISPLAY = "'Barlow Condensed', sans-serif";
const MONO = "'JetBrains Mono', monospace";
const BODY = "'Inter', sans-serif";

interface Award {
  id: string;
  slug: string;
  grantee_name: string;
  award_amount_usd: number | null;
  nofo_round: string | null;
  project_type: string | null;
  lat: number | null;
  lng: number | null;
  raw_properties: Record<string, unknown>;
}

function parseRawProperties(
  raw: string | Record<string, unknown> | null | undefined,
): Record<string, unknown> {
  if (!raw) return {};
  if (typeof raw === "object") return raw;
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function mapAward(row: {
  id: string;
  slug: string;
  grantee_name: string;
  award_amount_usd: number | null;
  nofo_round: string | null;
  project_type?: string | null;
  lat: number | null;
  lng: number | null;
  raw_properties?: string | Record<string, unknown> | null;
}): Award {
  return {
    id: row.id,
    slug: row.slug,
    grantee_name: row.grantee_name,
    award_amount_usd: row.award_amount_usd,
    nofo_round: row.nofo_round,
    project_type: row.project_type ?? null,
    lat: row.lat,
    lng: row.lng,
    raw_properties: parseRawProperties(row.raw_properties),
  };
}

async function getAward(slug: string): Promise<Award | null> {
  let rows: Award[];
  try {
    rows = await readWithSupabaseFallback<Award[]>(
      "tribal/awards/[slug]",
      async () => {
        const d1Row = await queryTbcpAwardBySlug(slug);
        return d1Row ? [mapAward(d1Row)] : null;
      },
      async () => {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey =
          process.env.SUPABASE_SERVICE_ROLE_KEY ||
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!supabaseUrl || !supabaseKey) return [];

        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data } = await supabase
          .from("tbcp_awards")
          .select("*")
          .eq("slug", slug)
          .single();
        return data ? [data as Award] : [];
      },
    );
  } catch (error) {
    // Fallback is off: a slug missing from a populated D1 is a real 404; an
    // empty D1 is a migration problem and must surface, not render "not found".
    if (error instanceof SupabaseFallbackDisabledError && (await isD1TbcpReady())) {
      return null;
    }
    throw error;
  }
  return rows[0] ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const award = await getAward(slug);
  if (!award) return { title: "Award Not Found" };
  const amt = award.award_amount_usd
    ? `$${(award.award_amount_usd / 1_000_000).toFixed(1)}M`
    : "NTIA";
  return {
    title: `${award.grantee_name} — ${amt} TBCP Award`,
    description: `${award.grantee_name} received a ${amt} grant from the NTIA Tribal Broadband Connectivity Program. Enterprise connectivity brokerage available through Konative.`,
    alternates: { canonical: `/tribal/awards/${slug}` },
  };
}

function fmt(n: number | null) {
  if (!n) return "—";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  return `$${Math.round(n).toLocaleString()}`;
}

const PROJECT_TYPE_LABELS: Record<string, string> = {
  "I": "Infrastructure",
  "P": "Planning",
  "A": "Adoption",
};

export default async function AwardDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const award = await getAward(slug);
  if (!award) notFound();

  const p = award.raw_properties || {};
  const region = p["BIA_REGION"] as string | undefined;
  const pageLink = p["PAGE_LINK"] as string | undefined;
  const awardUrl = `${SITE_URL}/tribal/awards/${award.slug}`;
  const breadcrumbJsonLd = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Tribal Connectivity", url: `${SITE_URL}/tribal` },
    { name: "TBCP Awards", url: `${SITE_URL}/tribal/awards` },
    { name: award.grantee_name, url: awardUrl },
  ]);
  const awardJsonLd = {
    "@context": "https://schema.org",
    "@type": "MonetaryGrant",
    name: `${award.grantee_name} NTIA TBCP Award`,
    description: `${award.grantee_name} received a public NTIA Tribal Broadband Connectivity Program award record tracked by Konative for tribal connectivity planning.`,
    url: awardUrl,
    amount: award.award_amount_usd
      ? {
          "@type": "MonetaryAmount",
          currency: "USD",
          value: award.award_amount_usd,
        }
      : undefined,
    funder: {
      "@type": "GovernmentOrganization",
      name: "National Telecommunications and Information Administration",
      url: "https://www.ntia.gov/",
    },
    recipient: {
      "@type": "Organization",
      name: award.grantee_name,
    },
    isPartOf: {
      "@type": "Dataset",
      name: "NTIA Tribal Broadband Connectivity Program Award Database",
      url: `${SITE_URL}/tribal/awards`,
    },
  };

  return (
    <main style={{ background: "#fff", minHeight: "100vh", paddingTop: 64 }}>
      <JsonLd data={[breadcrumbJsonLd, awardJsonLd]} />
      {/* Hero */}
      <section style={{ background: "#0B1929", padding: "72px 24px 56px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Link href="/tribal/awards" style={{ fontFamily: BODY, fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", textDecoration: "none", display: "inline-block", marginBottom: 24 }}>
            ← All TBCP Awards
          </Link>
          <div style={{ fontFamily: BODY, fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: RED, marginBottom: 16 }}>
            NTIA Tribal Broadband Connectivity Program
          </div>
          <h1 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(32px,5vw,60px)", textTransform: "uppercase", color: "#fff", lineHeight: 1, marginBottom: 24, maxWidth: 900 }}>
            {award.grantee_name}
          </h1>
          <div style={{ display: "flex", gap: 48, flexWrap: "wrap", marginTop: 32 }}>
            {[
              { label: "Award Amount", value: fmt(award.award_amount_usd) },
              { label: "NOFO Round", value: award.nofo_round || "—" },
              { label: "Project Type", value: award.project_type ? (PROJECT_TYPE_LABELS[award.project_type] ?? award.project_type) : "—" },
              { label: "BIA Region", value: region || "—" },
            ].map((s) => (
              <div key={s.label}>
                <div style={{ fontFamily: MONO, fontWeight: 600, fontSize: 24, color: RED, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontFamily: BODY, fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 6 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detail card */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "#E5E7EB", marginBottom: 48 }}>
          {Object.entries({
            "Grantee": award.grantee_name,
            "Award Amount": fmt(award.award_amount_usd),
            "NOFO Round": award.nofo_round || "—",
            "Project Type": award.project_type ? (PROJECT_TYPE_LABELS[award.project_type] ?? award.project_type) : "—",
            "BIA Region": region || "—",
            "Coordinates": award.lat && award.lng ? `${award.lat.toFixed(4)}, ${award.lng.toFixed(4)}` : "—",
          }).map(([k, v]) => (
            <div key={k} style={{ background: "#fff", padding: "20px 24px" }}>
              <div style={{ fontFamily: BODY, fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9CA3AF", marginBottom: 6 }}>{k}</div>
              <div style={{ fontFamily: MONO, fontSize: 14, color: "#111" }}>{v}</div>
            </div>
          ))}
        </div>

        {pageLink && (
          <div style={{ marginBottom: 40 }}>
            <a
              href={pageLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: BODY, fontSize: 13, fontWeight: 600, color: RED, textDecoration: "underline" }}
            >
              View on NTIA NBAM →
            </a>
          </div>
        )}

        {/* Connectivity CTA */}
        <div style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", padding: "40px 36px" }}>
          <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 32, textTransform: "uppercase", color: "#111", lineHeight: 1, marginBottom: 16 }}>
            Building on this award?
          </div>
          <p style={{ fontFamily: BODY, fontSize: 15, color: "#374151", lineHeight: 1.7, marginBottom: 28, maxWidth: 560 }}>
            TBCP infrastructure grants fund the network. Konative brokers the enterprise connectivity, SD-WAN, voice, and security that runs on top — at no cost to your enterprise. We are vendor-neutral and sovereignty-aware.
          </p>
          <Link
            href="/contact"
            style={{ display: "inline-block", fontFamily: BODY, fontWeight: 600, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", background: RED, color: "#fff", padding: "14px 32px", textDecoration: "none" }}
          >
            Talk to a Connectivity Advisor →
          </Link>
        </div>
      </section>

      {/* Back */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 64px" }}>
        <Link href="/tribal/awards" style={{ fontFamily: BODY, fontSize: 13, color: "#6B7280", textDecoration: "none" }}>
          ← Back to all TBCP Awards
        </Link>
      </div>
    </main>
  );
}
