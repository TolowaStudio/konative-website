import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import {
  JsonLd,
  breadcrumbSchema,
  SITE_URL,
} from "@/components/seo/JsonLd";
import { queryTbcpAwardsList, readWithSupabaseFallback } from "@/lib/db";
import AwardsClient from "./AwardsClient";

export const revalidate = 3600;
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "NTIA TBCP Award Database | Tribal Connectivity Index | Konative",
  description:
    "Search NTIA Tribal Broadband Connectivity Program award records by grantee, amount, NOFO round, and project type. Published by Konative as a public tribal connectivity planning resource.",
  alternates: { canonical: "/tribal/awards" },
  openGraph: {
    title: "NTIA TBCP Award Database | Tribal Connectivity Index | Konative",
    description:
      "Search NTIA Tribal Broadband Connectivity Program award records by grantee, amount, NOFO round, and project type. Published by Konative as a public tribal connectivity planning resource.",
    url: `${SITE_URL}/tribal/awards`,
  },
};

const breadcrumbJsonLd = breadcrumbSchema([
  { name: "Home", url: SITE_URL },
  { name: "Tribal Connectivity", url: `${SITE_URL}/tribal` },
  { name: "TBCP Awards", url: `${SITE_URL}/tribal/awards` },
]);

const datasetJsonLd = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: "NTIA Tribal Broadband Connectivity Program Award Database",
  description:
    "Searchable public records for NTIA Tribal Broadband Connectivity Program awards, including grantee, award amount, NOFO round, and project type.",
  url: `${SITE_URL}/tribal/awards`,
  creator: {
    "@type": "Organization",
    name: "Konative",
    url: SITE_URL,
  },
  publisher: {
    "@type": "Organization",
    name: "Konative",
    url: SITE_URL,
  },
  isAccessibleForFree: true,
  measurementTechnique: "Public NTIA Tribal Broadband Connectivity Program award records",
  temporalCoverage: "2021/..",
  spatialCoverage: {
    "@type": "Place",
    name: "United States",
  },
};

const collectionPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "NTIA TBCP Award Database",
  description:
    "A searchable Konative index of NTIA Tribal Broadband Connectivity Program award records for tribal connectivity planning.",
  url: `${SITE_URL}/tribal/awards`,
  isPartOf: {
    "@type": "WebSite",
    name: "Konative",
    url: SITE_URL,
  },
  about: datasetJsonLd,
};

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

async function getAwards() {
  type Mapped = ReturnType<typeof mapRow>;
  return readWithSupabaseFallback<Mapped[]>(
    "tribal/awards",
    async () => {
      const d1Rows = await queryTbcpAwardsList(500);
      return d1Rows ? d1Rows.map(mapRow) : null;
    },
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
          "id,slug,grantee_name,award_amount_usd,nofo_round,project_type,lat,lng,raw_properties",
        )
        .order("award_amount_usd", { ascending: false })
        .limit(500);
      if (error) {
        console.error("[tribal/awards] Supabase error:", error.message);
        return [];
      }
      return (data ?? []).map(mapRow);
    },
  );
}

function mapRow(row: {
  id: string;
  slug: string;
  grantee_name: string;
  award_amount_usd: number | null;
  nofo_round: string | null;
  project_type?: string | null;
  lat: number | null;
  lng: number | null;
  raw_properties?: string | Record<string, unknown> | null;
}) {
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

export default async function TBCPAwardsPage() {
  const awards = await getAwards();

  return (
    <>
      <JsonLd data={[breadcrumbJsonLd, datasetJsonLd, collectionPageJsonLd]} />
      <AwardsClient awards={awards} />
    </>
  );
}
