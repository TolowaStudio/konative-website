/**
 * Seed curated tribal infrastructure news items into Sanity.
 *
 * Usage (from web/ directory):
 *   SANITY_API_TOKEN=<token> npx tsx scripts/seed-curated-tribal-news.ts
 *
 * Safe to re-run — uses stable _id and ingestFingerprint for dedupe.
 */

import { createHash } from "node:crypto";

import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  console.error("ERROR: NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN are required.");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: "2024-01-01", token, useCdn: false });

type CuratedItem = {
  id: string;
  title: string;
  url: string;
  summary: string;
  sourceId: string;
  sourceName: string;
  publishedAt: string;
  countries: ("us" | "ca")[];
  topics: string[];
  contentType?: "news" | "regulation" | "investment" | "analysis";
};

const sources = [
  {
    _id: "newsSource-doe-indian-energy",
    name: "DOE Office of Indian Energy",
    slug: "doe-indian-energy",
    sourceUrl: "https://www.energy.gov/indianenergy",
    feedUrl: "",
    sourceType: "government" as const,
    active: true,
    countries: ["us"],
    topics: ["tribal-energy", "tribal-data-center", "grants-funding"],
  },
  {
    _id: "newsSource-ntia-tbcp",
    name: "NTIA Tribal Broadband",
    slug: "ntia-tbcp",
    sourceUrl: "https://www.ntia.gov/funding-programs/internet-all/tribal-broadband-connectivity-program",
    feedUrl: "https://broadbandusa.ntia.gov/taxonomy/term/140/feed",
    sourceType: "government" as const,
    active: true,
    countries: ["us"],
    topics: ["tribal-broadband", "grants-funding"],
  },
  {
    _id: "newsSource-ntia-press",
    name: "NTIA",
    slug: "ntia-press",
    sourceUrl: "https://www.ntia.gov/press-release",
    feedUrl: "",
    sourceType: "government" as const,
    active: true,
    countries: ["us"],
    topics: ["tribal-broadband", "grants-funding"],
  },
  {
    _id: "newsSource-benton-institute",
    name: "Benton Institute",
    slug: "benton-institute",
    sourceUrl: "https://www.benton.org",
    feedUrl: "",
    sourceType: "industry" as const,
    active: true,
    countries: ["us"],
    topics: ["tribal-broadband", "grants-funding"],
  },
  {
    _id: "newsSource-tribal-business-news",
    name: "Tribal Business News",
    slug: "tribal-business-news",
    sourceUrl: "https://tribalbusinessnews.com",
    feedUrl: "",
    sourceType: "industry" as const,
    active: true,
    countries: ["us"],
    topics: ["tribal-broadband", "grants-funding", "tribal-data-center"],
  },
  {
    _id: "newsSource-cbc-news",
    name: "CBC News",
    slug: "cbc-news",
    sourceUrl: "https://www.cbc.ca/news",
    feedUrl: "",
    sourceType: "newsroom" as const,
    active: true,
    countries: ["ca"],
    topics: ["tribal-data-center", "tribal-energy"],
  },
  // DCD feed is owned by newsSource-datacenter-dynamics (seed-news-sources.ts).
  // Keep this id only as an inactive alias so re-seeds do not double-ingest the same RSS.
  {
    _id: "newsSource-dcd",
    name: "Data Centre Dynamics (legacy alias)",
    slug: "datacenter-dynamics-tribal",
    sourceUrl: "https://www.datacenterdynamics.com",
    feedUrl: "",
    sourceType: "rss" as const,
    active: false,
    countries: ["ca", "us"],
    topics: ["tribal-data-center", "construction"],
  },
  {
    _id: "newsSource-anishinabek-news",
    name: "Anishinabek News",
    slug: "anishinabek-news",
    sourceUrl: "https://anishinabeknews.ca",
    feedUrl: "",
    sourceType: "newsroom" as const,
    active: true,
    countries: ["ca"],
    topics: ["tribal-data-center"],
  },
  {
    _id: "newsSource-mvskoke-media",
    name: "MVSKOKE Media",
    slug: "mvskoke-media",
    sourceUrl: "https://www.mvskokemedia.com",
    feedUrl: "",
    sourceType: "newsroom" as const,
    active: true,
    countries: ["us"],
    topics: ["tribal-data-center"],
  },
  {
    _id: "newsSource-native-news-online",
    name: "Native News Online",
    slug: "native-news-online",
    sourceUrl: "https://nativenewsonline.net",
    feedUrl: "",
    sourceType: "newsroom" as const,
    active: true,
    countries: ["us"],
    topics: ["tribal-data-center"],
  },
  {
    _id: "newsSource-solar-power-world",
    name: "Solar Power World",
    slug: "solar-power-world",
    sourceUrl: "https://www.solarpowerworldonline.com",
    feedUrl: "",
    sourceType: "industry" as const,
    active: true,
    countries: ["us"],
    topics: ["tribal-energy"],
  },
  {
    _id: "newsSource-merrittherald",
    name: "Merritt Herald",
    slug: "merrittherald",
    sourceUrl: "https://www.merrittherald.com",
    feedUrl: "",
    sourceType: "newsroom" as const,
    active: true,
    countries: ["ca"],
    topics: ["tribal-data-center"],
  },
  {
    _id: "newsSource-financial-post",
    name: "Financial Post",
    slug: "financial-post",
    sourceUrl: "https://financialpost.com",
    feedUrl: "",
    sourceType: "newsroom" as const,
    active: true,
    countries: ["ca"],
    topics: ["tribal-data-center", "tribal-energy"],
  },
];

const items: CuratedItem[] = [
  {
    id: "curated-doe-data-centers-exploring-opportunity-tribes",
    title: "Data Centers: Exploring the Opportunity for Tribes",
    url: "https://www.energy.gov/indianenergy/articles/data-centers-exploring-opportunity-tribes",
    summary:
      "DOE Office of Indian Energy outlines how tribal nations can pursue data center partnerships beyond land leases — through power sales, infrastructure ownership, and energy project funding.",
    sourceId: "newsSource-doe-indian-energy",
    sourceName: "DOE Office of Indian Energy",
    publishedAt: "2026-01-15T12:00:00.000Z",
    countries: ["us"],
    topics: ["tribal-data-center", "tribal-energy", "grants-funding"],
    contentType: "analysis",
  },
  {
    id: "curated-doe-harnessing-data-centers-tribal-economic-development",
    title: "Harnessing Data Centers for Tribal Economic Development",
    url: "https://www.energy.gov/indianenergy/harnessing-data-centers-tribal-economic-development",
    summary:
      "Central DOE hub for tribal data center resources: webinars, fact sheets, site evaluation support, developer introductions, and links to energy funding that can power data center projects.",
    sourceId: "newsSource-doe-indian-energy",
    sourceName: "DOE Office of Indian Energy",
    publishedAt: "2026-03-01T12:00:00.000Z",
    countries: ["us"],
    topics: ["tribal-data-center", "tribal-energy"],
    contentType: "analysis",
  },
  {
    id: "curated-doe-data-centers-faq",
    title: "Data Centers for Tribal Economic Development: Frequently Asked Questions",
    url: "https://www.energy.gov/indianenergy/articles/data-centers-tribal-economic-development-frequently-asked-questions",
    summary:
      "DOE answers common tribal leader questions on data center siting, trust land development, water use, power sales, geography, jobs, and available technical assistance.",
    sourceId: "newsSource-doe-indian-energy",
    sourceName: "DOE Office of Indian Energy",
    publishedAt: "2026-05-14T12:00:00.000Z",
    countries: ["us"],
    topics: ["tribal-data-center"],
    contentType: "analysis",
  },
  {
    id: "curated-doe-unleashing-tribal-energy-development-3548",
    title: "Unleashing Tribal Energy Development (DE-FOA-0003548): $50 Million",
    url: "https://www.energy.gov/indianenergy/current-funding-and-technical-assistance-opportunities",
    summary:
      "Open DOE funding opportunity includes data center pre-feasibility studies and power/transmission infrastructure planning. Applications due July 24, 2026.",
    sourceId: "newsSource-doe-indian-energy",
    sourceName: "DOE Office of Indian Energy",
    publishedAt: "2026-04-01T12:00:00.000Z",
    countries: ["us"],
    topics: ["grants-funding", "tribal-energy", "tribal-data-center"],
    contentType: "regulation",
  },
  {
    id: "curated-doe-34m-clean-energy-tribal-communities",
    title: "DOE Announces $34 Million for Clean Energy in Tribal Communities",
    url: "https://www.energy.gov/articles/us-department-energy-announces-34-million-deploy-clean-energy-technologies-american-indian",
    summary:
      "18 tribal communities receive awards for solar, microgrids, and electrification — building the energy infrastructure that data centers and broadband projects depend on.",
    sourceId: "newsSource-doe-indian-energy",
    sourceName: "DOE Office of Indian Energy",
    publishedAt: "2024-05-15T12:00:00.000Z",
    countries: ["us"],
    topics: ["tribal-energy", "grants-funding"],
    contentType: "investment",
  },
  {
    id: "curated-ntia-790m-tribal-funding-2026",
    title: "NTIA Announces $790 Million in New Tribal Broadband Funding",
    url: "https://www.ntia.gov/press-release/2026/ntia-announces-two-new-funding-opportunities-expand-broadband-connectivity-tribal-lands",
    summary:
      "TBCP Round 3 ($540M) and Native Entities Grant Program ($250M) opened June 17, 2026. Both current application windows close November 17, 2026 at 11:59 p.m. ET; awards are expected beginning Spring 2027.",
    sourceId: "newsSource-ntia-press",
    sourceName: "NTIA",
    publishedAt: "2026-06-17T12:00:00.000Z",
    countries: ["us"],
    topics: ["grants-funding", "tribal-broadband"],
    contentType: "regulation",
  },
  {
    id: "curated-ntia-tbcp-reforms-2025",
    title: "NTIA Announces Tribal Broadband Program Reforms to Maximize Connectivity",
    url: "https://www.ntia.gov/press-release/2025/ntia-announces-tribal-broadband-program-reforms-maximize-tribal-connectivity-and-reduce-red-tape",
    summary:
      "NTIA streamlines tribal broadband programs to reduce red tape, increase flexibility, and align grant opportunities with tribal connectivity needs ahead of Round 3.",
    sourceId: "newsSource-ntia-press",
    sourceName: "NTIA",
    publishedAt: "2025-11-12T12:00:00.000Z",
    countries: ["us"],
    topics: ["grants-funding", "tribal-broadband", "regulations"],
    contentType: "regulation",
  },
  {
    id: "curated-ntia-162m-recommended-awards-2025",
    title: "NTIA Recommends $162 Million in Tribal Broadband Infrastructure Awards",
    url: "https://www.ntia.gov/press-release/2025/biden-harris-administration-recommends-award-more-162-million-expand-internet-use-tribal-lands",
    summary:
      "Four tribal entities recommended for TBCP Round 2 infrastructure awards including Pueblo de Cochiti and Taos Pueblo in New Mexico.",
    sourceId: "newsSource-ntia-press",
    sourceName: "NTIA",
    publishedAt: "2025-01-16T12:00:00.000Z",
    countries: ["us"],
    topics: ["grants-funding", "tribal-broadband"],
    contentType: "investment",
  },
  {
    id: "curated-ntia-65m-equitable-distribution-2025",
    title: "NTIA Awards $6.5 Million in Equitable Distribution Tribal Broadband Funding",
    url: "https://www.ntia.gov/press-release/2025/ntia-awards-65-million-equitable-distribution-funding-advance-tribal-broadband-access",
    summary:
      "Nine tribal applications recommended for equitable distribution awards up to $500,000 each for tribes that have not previously received TBCP funding.",
    sourceId: "newsSource-ntia-press",
    sourceName: "NTIA",
    publishedAt: "2025-12-23T12:00:00.000Z",
    countries: ["us"],
    topics: ["grants-funding", "tribal-broadband"],
    contentType: "investment",
  },
  {
    id: "curated-benton-negp-competition",
    title: "NTIA Opens Native Entities Grant Program Competition",
    url: "https://www.benton.org/blog/ntia-opens-native-entities-grant-program-competition",
    summary:
      "Analysis of the $250M NEGP set-aside under the Digital Equity Act — streamlined requirements, BEAD alignment, and November 17, 2026 deadline.",
    sourceId: "newsSource-benton-institute",
    sourceName: "Benton Institute",
    publishedAt: "2026-06-18T12:00:00.000Z",
    countries: ["us"],
    topics: ["grants-funding", "tribal-broadband"],
    contentType: "analysis",
  },
  {
    id: "curated-tbn-790m-funding",
    title: "NTIA Opens $790M in New Tribal Broadband and Digital Inclusion Funding",
    url: "https://tribalbusinessnews.com/sections/economic-development/15652-ntia-opens-790m-in-new-tribal-broadband-and-digital-inclusion-funding",
    summary:
      "Round-up of TBCP Round 3 and NEGP eligibility, award ranges, matching requirements, and application timeline for tribal nations.",
    sourceId: "newsSource-tribal-business-news",
    sourceName: "Tribal Business News",
    publishedAt: "2026-06-17T12:00:00.000Z",
    countries: ["us"],
    topics: ["grants-funding", "tribal-broadband"],
    contentType: "news",
  },
  {
    id: "curated-muscogee-tbcp-41m",
    title: "Muscogee (Creek) Nation Awarded $41.2M for Tribal Broadband Deployment",
    url: "https://broadbandusa.ntia.gov/funding-programs/tribal-broadband-connectivity-program-round-2/awardee/muscogee-creek-nation-tbcp-infrastructure-deployment-project",
    summary:
      "TBCP Round 2 infrastructure award to deploy fiber-to-the-premise and fixed wireless for approximately 4,400 households on Muscogee Nation lands in Oklahoma.",
    sourceId: "newsSource-ntia-tbcp",
    sourceName: "NTIA Tribal Broadband",
    publishedAt: "2025-02-01T12:00:00.000Z",
    countries: ["us"],
    topics: ["grants-funding", "tribal-broadband"],
    contentType: "investment",
  },
  {
    id: "curated-cbc-woodland-cree-data-centre",
    title: "Indigenous-Led Data Centre in Alberta Slated for Development",
    url: "https://www.cbc.ca/news/canada/edmonton/first-indigenous-data-centre-abandoned-power-plant-1.7586072",
    summary:
      "Woodland Cree First Nation plans the Mihta Askiy Data Centre — 650 MW on-site natural gas generation at an abandoned power plant site, 51% Indigenous ownership.",
    sourceId: "newsSource-cbc-news",
    sourceName: "CBC News",
    publishedAt: "2025-06-01T12:00:00.000Z",
    countries: ["ca"],
    topics: ["tribal-data-center", "tribal-energy"],
    contentType: "investment",
  },
  {
    id: "curated-dcd-wiikwemkoong-data-center",
    title: "Wiikwemkoong Unceded Territory Installs Indigenous-Led Data Center",
    url: "https://www.datacenterdynamics.com/en/news/canadian-indian-reserve-wiikwemkoong-installs-data-center/",
    summary:
      "Ontario First Nation deploys containerized data center for digital sovereignty — migrating community data from external cloud storage to tribally controlled infrastructure.",
    sourceId: "newsSource-datacenter-dynamics",
    sourceName: "Data Centre Dynamics",
    publishedAt: "2025-05-23T12:00:00.000Z",
    countries: ["ca"],
    topics: ["tribal-data-center"],
    contentType: "investment",
  },
  {
    id: "curated-anishinabek-wiikwemkoong",
    title: "Wiikwemkoong Unceded Territory to Install State-of-the-Art Data Centre",
    url: "https://anishinabeknews.ca/2025/06/wiikwemkoong-unceded-territory-to-install-state-of-the-art-data-centre/",
    summary:
      "Community-led data sovereignty initiative empowers Wiikwemkoong to protect databases, networking, and cultural knowledge on-nation.",
    sourceId: "newsSource-anishinabek-news",
    sourceName: "Anishinabek News",
    publishedAt: "2025-06-01T12:00:00.000Z",
    countries: ["ca"],
    topics: ["tribal-data-center"],
    contentType: "news",
  },
  {
    id: "curated-malahat-dmg-ai-data-centers",
    title: "Malahat Nation Partners on Indigenous-Led AI Data Center Campus",
    url: "https://financialpost.com/globe-newswire/dmg-blockchain-solutions-announces-additional-partnership-with-malahat-nation-to-establish-indigenous-led-regulated-utility-for-clean-energy-and-ai-infrastructure",
    summary:
      "Malahat Nation and DMG Blockchain plan Canada's first Indigenous-led regulated utility and AI data center campus on Vancouver Island.",
    sourceId: "newsSource-financial-post",
    sourceName: "Financial Post",
    publishedAt: "2025-10-28T12:00:00.000Z",
    countries: ["ca"],
    topics: ["tribal-data-center", "tribal-energy"],
    contentType: "investment",
  },
  {
    id: "curated-upper-nicola-bell-data-centre",
    title: "Upper Nicola Band Votes Yes on One of Canada's Largest AI Data Centres",
    url: "https://www.merrittherald.com/upper-nicola-indian-band-vote-yes-on-welcoming-one-of-the-countrys-largest-ai-data-centres/",
    summary:
      "Bell plans 296 MW AI data centre modules on Upper Nicola lands in BC — closed-loop cooling, mass timber construction, and district energy heat recovery.",
    sourceId: "newsSource-merrittherald",
    sourceName: "Merritt Herald",
    publishedAt: "2025-06-04T12:00:00.000Z",
    countries: ["ca"],
    topics: ["tribal-data-center"],
    contentType: "investment",
  },
  {
    id: "curated-colville-tribes-microgrids",
    title: "Colville Tribes Deploy Solar Microgrids with Future Data Center Integration",
    url: "https://www.solarpowerworldonline.com/2025/11/washington-tribes-set-to-deploy-multiple-solar-powered-microgrids-across-reservation/",
    summary:
      "Confederated Tribes of the Colville Reservation advance energy sovereignty through solar + storage microgrids, with plans to support future data center and telecom infrastructure.",
    sourceId: "newsSource-solar-power-world",
    sourceName: "Solar Power World",
    publishedAt: "2025-11-01T12:00:00.000Z",
    countries: ["us"],
    topics: ["tribal-energy", "tribal-data-center"],
    contentType: "investment",
  },
  {
    id: "curated-mvskoke-tech-park-rejected",
    title: "Mvskoke Tech Park Data Center Plan Rejected by Muscogee National Council",
    url: "https://www.mvskokemedia.com/mvskoke-tech-park-plan-crashes/",
    summary:
      "Muscogee (Creek) Nation National Council votes 4-11 against hyperscale data center on Looped Square Ranch — community raised water, power, and land-use concerns.",
    sourceId: "newsSource-mvskoke-media",
    sourceName: "MVSKOKE Media",
    publishedAt: "2025-11-15T12:00:00.000Z",
    countries: ["us"],
    topics: ["tribal-data-center", "sustainability"],
    contentType: "news",
  },
  {
    id: "curated-muscogee-time-cover-data-center-fight",
    title: "Two Muscogee Women Featured in TIME for AI Data Center Leadership",
    url: "https://nativenewsonline.net/currents/two-muscogee-women-featured-on-cover-of-time-for-leadership-on-ai-data-center-fight/",
    summary:
      "Jordan Harmon and Mackenzie Roberts led community opposition to a proposed hyperscale data center on Muscogee land — a national story on tribal sovereignty and AI infrastructure.",
    sourceId: "newsSource-native-news-online",
    sourceName: "Native News Online",
    publishedAt: "2026-06-01T12:00:00.000Z",
    countries: ["us"],
    topics: ["tribal-data-center"],
    contentType: "analysis",
  },
];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const fingerprint = (sourceId: string, url: string) =>
  createHash("sha256").update(`${sourceId}::${url}`).digest("hex");

async function seedSources() {
  console.log(`Seeding ${sources.length} tribal news sources…`);
  for (const src of sources) {
    const { _id, slug, ...rest } = src;
    await client.createOrReplace({
      _id,
      _type: "newsSource",
      slug: { _type: "slug", current: slug },
      priority: 80,
      ...rest,
    });
    console.log(`  ✓ ${src.name}`);
  }
}

async function seedItems() {
  console.log(`\nSeeding ${items.length} curated news items…`);
  let created = 0;
  let updated = 0;

  for (const item of items) {
    const ingestFingerprint = fingerprint(item.sourceId, item.url);
    const slug = slugify(item.title).slice(0, 90);
    const doc = {
      _id: item.id,
      _type: "newsItem" as const,
      title: item.title,
      slug: { _type: "slug" as const, current: slug },
      status: "published" as const,
      url: item.url,
      summary: item.summary,
      contentType: item.contentType ?? "news",
      source: { _type: "reference" as const, _ref: item.sourceId },
      sourceName: item.sourceName,
      publishedAt: item.publishedAt,
      discoveredAt: new Date().toISOString(),
      countries: item.countries,
      topics: item.topics,
      ingestFingerprint,
    };

    const existing = await client.getDocument(item.id);
    await client.createOrReplace(doc);
    if (existing) {
      updated++;
      console.log(`  ✓ updated  ${item.title.slice(0, 60)}…`);
    } else {
      created++;
      console.log(`  + created  ${item.title.slice(0, 60)}…`);
    }
  }

  console.log(`\nDone. Created: ${created}  Updated: ${updated}`);
}

async function main() {
  await seedSources();
  await seedItems();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
