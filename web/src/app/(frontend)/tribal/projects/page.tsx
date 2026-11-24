import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd, breadcrumbSchema, SITE_URL } from "@/components/seo/JsonLd";
import { fetchTribalProjects } from "@/lib/tribalProjects";

import ProjectsGridClient from "./ProjectsGridClient";

export const revalidate = 3600;

const RED = "#C8001F";
const DISPLAY = "'Barlow Condensed', sans-serif";
const BODY = "'Inter', sans-serif";

export const metadata: Metadata = {
  title: "Tribal & First Nations Data Center Tracker | Konative",
  description:
    "Searchable registry of tribal and First Nations data center projects across the US and Canada — status, partner equity, interconnect relevance, and political outcomes.",
  alternates: { canonical: "/tribal/projects" },
  openGraph: {
    title: "Tribal & First Nations Data Center Tracker | Konative",
    description:
      "Curated US/CA tribal DC project intelligence: moratoria, approvals, stranded coal infrastructure, and interconnect viability.",
    url: `${SITE_URL}/tribal/projects`,
  },
};

export default async function TribalProjectsPage() {
  let projects = await fetchTribalProjects().catch(() => []);
  const isDataUnavailable = projects.length === 0;

  const usCount = projects.filter((p) => p.country === "US").length;
  const caCount = projects.filter((p) => p.country === "CA").length;
  const operatingCount = projects.filter(
    (p) => p.tribalStatus === "operating",
  ).length;

  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Tribal Connectivity", url: `${SITE_URL}/tribal` },
    { name: "DC Project Tracker", url: `${SITE_URL}/tribal/projects` },
  ]);

  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Tribal & First Nations Data Center Project Tracker",
    description:
      "Structured registry of data center projects on or led by Tribal nations and First Nations in the United States and Canada.",
    url: `${SITE_URL}/tribal/projects`,
    creator: { "@type": "Organization", name: "Konative", url: SITE_URL },
    license: "https://creativecommons.org/licenses/by/4.0/",
    isAccessibleForFree: true,
    spatialCoverage: { "@type": "Place", name: "North America" },
    size: `${projects.length} records`,
  };

  return (
    <main style={{ background: "#fff", minHeight: "100vh", paddingTop: 64 }}>
      <JsonLd data={[breadcrumb, datasetSchema]} />

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
            Tribal DC Intelligence · US + Canada
          </div>
          <h1
            style={{
              fontFamily: DISPLAY,
              fontWeight: 800,
              fontSize: "clamp(36px,6vw,68px)",
              textTransform: "uppercase",
              color: "#fff",
              lineHeight: 0.95,
              marginBottom: 24,
            }}
          >
            Tribal & First Nations
            <br />
            <span style={{ color: RED }}>Data Center Tracker</span>
          </h1>
          <p
            style={{
              fontFamily: BODY,
              fontSize: 16,
              color: "rgba(255,255,255,0.65)",
              maxWidth: 680,
              lineHeight: 1.75,
              marginBottom: 32,
            }}
          >
            Moratoria, member votes, stranded coal corridors, and shovel-ready
            FN campuses — structured for connectivity buyers. Filter by status,
            country, and interconnect relevance.{" "}
            <Link
              href="/news"
              style={{ color: RED, fontWeight: 600, textDecoration: "none" }}
            >
              Tribal news feed →
            </Link>
          </p>
          <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
            {[
              { label: "Projects tracked", value: projects.length.toString() },
              { label: "United States", value: usCount.toString() },
              { label: "Canada", value: caCount.toString() },
              { label: "Operating", value: operatingCount.toString() },
            ].map((s) => (
              <div key={s.label}>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
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

      <section
        style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px 64px" }}
      >
        {isDataUnavailable ? (
          <p
            style={{
              fontFamily: BODY,
              fontSize: 14,
              color: "#9CA3AF",
              padding: "48px 0",
            }}
          >
            Project data temporarily unavailable. Run{" "}
            <code>npm run seed:tribal-projects</code> against Sanity or check
            back shortly.
          </p>
        ) : (
          <ProjectsGridClient projects={projects} />
        )}
      </section>

      <section style={{ background: "#0B1929", padding: "56px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
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
            Need interconnect feasibility on a tribal site?
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
            Konative brokers carrier diversity, lateral build economics, and
            TBCP-funded backbone context — vendor-neutral, at no cost to your
            enterprise.
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
