/**
 * Generate a Tribal Infrastructure Brief draft from Sanity + grant radar.
 *
 * Sections: grant radar, project registry moves, tribal news, blocked watch,
 * interconnect spotlight, deep-dive placeholder.
 *
 * Usage (from web/):
 *   npx tsx --env-file=.env.local scripts/draft-tribal-brief.ts
 *   npx tsx --env-file=.env.local scripts/draft-tribal-brief.ts --publish
 *
 * --publish  Push draft to Ghost Admin (requires GHOST_* env vars).
 */

import * as fs from "node:fs";
import * as path from "node:path";

import { createClient } from "@sanity/client";

import {
  getInterconnectTier,
  INTERCONNECT_TIER_LABELS,
  slugFromTribalProjectId,
  TRIBAL_STATUS_LABELS,
  type InterconnectTier,
  type TribalStatus,
} from "../src/lib/tribalProjectConstants.ts";
import { TRIBAL_NEWS_TOPIC_VALUES } from "../src/lib/newsConstants.ts";

const PROJECT_ID =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
const DATASET =
  process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || "production";
const TOKEN = process.env.SANITY_API_TOKEN;
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://konative.com")
  .replace(/\\n/g, "")
  .replace(/\n/g, "")
  .replace(/\/$/, "");
const NEWS_WINDOW_DAYS = 14;
const PUBLISH = process.argv.includes("--publish");

/** Active grant deadlines — update when NTIA/DOE publish new NOFOs. */
const GRANT_RADAR = [
  {
    program: "DOE Unleashing Tribal Energy Development (DE-FOA-0003548)",
    amount: "$50M",
    due: "2026-07-24",
    url: "https://www.energy.gov/indianenergy/articles/unleashing-tribal-energy-development-funding-opportunity",
  },
  {
    program: "TBCP Round 3 — Tribal Broadband Connectivity",
    amount: "$540M",
    due: "2026-11-17",
    url: "https://broadbandusa.ntia.gov/funding-programs/tribal-broadband-connectivity/round-three-notice-of-funding-opportunity",
  },
  {
    program: "Native Entities Grant Program (NEGP)",
    amount: "$250M",
    due: "2026-11-17",
    url: "https://broadbandusa.ntia.gov/funding-programs/native-entities-grant-program",
  },
] as const;

interface NewsItem {
  title: string;
  url: string;
  summary?: string;
  sourceName?: string;
  publishedAt: string;
  topics?: string[];
}

interface TribalProject {
  slug: string;
  name: string;
  tribe: string;
  state: string;
  country: string;
  tribalStatus: TribalStatus;
  capacityMw?: number;
  partner?: string;
  summary: string;
  voteOrDate?: string;
  priority: number;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function daysUntil(isoDate: string): number {
  const due = new Date(`${isoDate}T23:59:59Z`);
  return Math.ceil((due.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
}

function formatDate(iso: string): string {
  return iso.slice(0, 10);
}

function topicLabel(value: string): string {
  const labels: Record<string, string> = {
    "tribal-data-center": "Tribal Data Centers",
    "tribal-energy": "Tribal Energy & Power",
    "tribal-broadband": "Tribal Broadband",
    "grants-funding": "Grants & Funding",
  };
  return labels[value] ?? value;
}

function getInterconnectTierForProject(slug: string): InterconnectTier {
  return getInterconnectTier(slug);
}

function buildMarkdown(input: {
  today: string;
  news: NewsItem[];
  projects: TribalProject[];
}): string {
  const { today, news, projects } = input;
  const blocked = projects.filter((p) =>
    ["moratorium", "opposition"].includes(p.tribalStatus),
  );
  const operating = projects.filter((p) => p.tribalStatus === "operating");
  const approved = projects.filter((p) => p.tribalStatus === "approved");
  const tierA = projects
    .filter((p) => getInterconnectTierForProject(p.slug) === "A")
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 6);

  let md = "";
  md += `# Tribal Infrastructure Brief — ${today}\n\n`;
  md += `*Biweekly intelligence on tribal data centers, energy, broadband grants, and interconnect viability — from [Konative](${SITE_URL}).*\n\n`;

  md += `## Grant radar\n\n`;
  for (const g of GRANT_RADAR) {
    const days = daysUntil(g.due);
    const urgency =
      days < 0 ? "closed" : days <= 21 ? `**${days} days left**` : `${days} days out`;
    md += `- **${g.program}** — ${g.amount}, due ${g.due} (${urgency}) — [details](${g.url})\n`;
  }
  md += `\n`;

  md += `## Project moves\n\n`;
  md += `**Operating (${operating.length}):** `;
  md += operating
    .slice(0, 5)
    .map((p) => `${p.name} (${p.state})`)
    .join("; ");
  md += operating.length > 5 ? `; +${operating.length - 5} more on [project tracker](${SITE_URL}/tribal/projects)\n\n` : "\n\n";

  md += `**Approved / construction (${approved.length}):** `;
  md += approved
    .slice(0, 5)
    .map((p) => `${p.name}${p.partner ? ` + ${p.partner}` : ""}`)
    .join("; ");
  md += `\n\nFull registry: [konative.com/tribal/projects](${SITE_URL}/tribal/projects)\n\n`;

  md += `## Tribal news (${NEWS_WINDOW_DAYS}-day window)\n\n`;
  if (news.length === 0) {
    md += `> No new tribal-topic items in Sanity this window. Check [live news feed](${SITE_URL}/news) or run \`npm run ingest-news\`.\n\n`;
  } else {
    for (const topic of TRIBAL_NEWS_TOPIC_VALUES) {
      const bucket = news.filter((n) => n.topics?.includes(topic));
      if (!bucket.length) continue;
      md += `### ${topicLabel(topic)}\n\n`;
      for (const item of bucket.slice(0, 4)) {
        md += `- **${item.title}** (${item.sourceName || "Source"}, ${formatDate(item.publishedAt)}) — [link](${item.url})\n`;
        if (item.summary) {
          md += `  - ${item.summary.slice(0, 220)}${item.summary.length > 220 ? "…" : ""}\n`;
        }
      }
      md += `\n`;
    }
    md += `More: [Tribal & Infrastructure News](${SITE_URL}/news)\n\n`;
  }

  md += `## Blocked watch\n\n`;
  if (blocked.length === 0) {
    md += `No active moratorium or opposition flags in the registry this issue.\n\n`;
  } else {
    for (const p of blocked.slice(0, 8)) {
      md += `- **${p.name}** (${p.tribe}, ${p.state}) — ${TRIBAL_STATUS_LABELS[p.tribalStatus]}`;
      if (p.voteOrDate) md += ` (${p.voteOrDate})`;
      md += `\n  - ${p.summary.slice(0, 200)}${p.summary.length > 200 ? "…" : ""}\n`;
    }
    md += `\n`;
  }

  md += `## Interconnect spotlight (Tier A)\n\n`;
  md += `*Near-term viability: trunk fiber &lt;10 km, 2+ carriers (research framework).*\n\n`;
  for (const p of tierA) {
    md += `- **${p.name}** — ${INTERCONNECT_TIER_LABELS.A} (${p.state}${p.country === "CA" ? ", Canada" : ""})\n`;
  }
  md += `\nFeasibility review: [book a call](${SITE_URL}/call)\n\n`;

  md += `## Deep dive (draft)\n\n`;
  md += `> [DRAFT — pick one: consent case study (Upper Nicola vote), BIA ROW primer, or "power without the building" (Ute → Meta PPA). 2–3 paragraphs.]\n\n`;

  md += `---\n\n`;
  md += `_Tracking a tribal DC project or middle-mile build? **[Reach out](${SITE_URL}/contact)** or subscribe to Konative Dispatch._\n`;

  return md;
}

function markdownToGhostHtml(md: string): string {
  const lines = md.split("\n");
  const out: string[] = [];
  let inList = false;

  const flushList = () => {
    if (inList) {
      out.push("</ul>");
      inList = false;
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flushList();
      continue;
    }
    if (line.startsWith("# ")) {
      flushList();
      out.push(`<h1>${inlineMd(line.slice(2))}</h1>`);
    } else if (line.startsWith("## ")) {
      flushList();
      out.push(`<h2>${inlineMd(line.slice(3))}</h2>`);
    } else if (line.startsWith("### ")) {
      flushList();
      out.push(`<h3>${inlineMd(line.slice(4))}</h3>`);
    } else if (line.startsWith("> ")) {
      flushList();
      out.push(`<blockquote><p>${inlineMd(line.slice(2))}</p></blockquote>`);
    } else if (line.startsWith("- ")) {
      if (!inList) {
        out.push("<ul>");
        inList = true;
      }
      out.push(`<li>${inlineMd(line.slice(2))}</li>`);
    } else if (line.startsWith("---")) {
      flushList();
      out.push("<hr />");
    } else {
      flushList();
      out.push(`<p>${inlineMd(line)}</p>`);
    }
  }
  flushList();
  return out.join("\n");
}

function inlineMd(text: string): string {
  let s = escapeHtml(text);
  s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/\*(.+?)\*/g, "<em>$1</em>");
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return s;
}

async function main() {
  if (!PROJECT_ID) {
    console.error("ERROR: NEXT_PUBLIC_SANITY_PROJECT_ID required");
    process.exit(1);
  }

  const sanity = createClient({
    projectId: PROJECT_ID,
    dataset: DATASET,
    apiVersion: "2024-01-01",
    useCdn: false,
    token: TOKEN,
  });

  const since = new Date(Date.now() - NEWS_WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString();
  console.error(`Fetching tribal news since ${since.slice(0, 10)}…`);

  const news: NewsItem[] = await sanity.fetch(
    `*[_type == "newsItem" && status == "published" && publishedAt > $since && count((topics)[@ in $topics]) > 0] | order(publishedAt desc)[0...50]{
      title, url, summary, sourceName, publishedAt, topics
    }`,
    { since, topics: [...TRIBAL_NEWS_TOPIC_VALUES] },
  );

  const projectsRaw: { id: string; name: string; tribe: string; state: string; country: string; tribalStatus: TribalStatus; capacityMw?: number; partner?: string; summary: string; voteOrDate?: string; priority: number }[] = await sanity.fetch(
    `*[_type == "tribalProject" && defined(location)] | order(coalesce(priority, 100) asc){
      "id": _id,
      name, tribe, state, country, tribalStatus, capacityMw, partner, summary, voteOrDate, priority
    }`,
  );
  const projects: TribalProject[] = projectsRaw.map((row) => ({
    ...row,
    slug: slugFromTribalProjectId(row.id),
  }));

  console.error(`  ${news.length} news items, ${projects.length} tribal projects`);

  const today = new Date().toISOString().slice(0, 10);
  const md = buildMarkdown({ today, news, projects });
  const outPath = path.join(process.cwd(), `.tmp-tribal-brief-${today}.md`);
  fs.writeFileSync(outPath, md);
  console.log(md);
  console.error(`\n✓ Draft written to ${outPath}`);

  if (PUBLISH) {
    const { createGhostDraftPost, ghostAdminKey } = await import("../src/lib/ghost.ts");
    if (!ghostAdminKey()) {
      console.error("ERROR: GHOST_ADMIN_API_KEY required for --publish");
      process.exit(1);
    }
    const html = markdownToGhostHtml(md);
    const slug = `tribal-infrastructure-brief-${today}`;
    const title = `Tribal Infrastructure Brief — ${today}`;
    const excerpt = `Grant radar, tribal DC project moves, interconnect Tier A spotlight, and ${news.length} news items from the last ${NEWS_WINDOW_DAYS} days.`;
    const post = await createGhostDraftPost({
      title,
      slug,
      html,
      customExcerpt: excerpt,
    });
    console.error(`✓ Ghost draft created: ${post.adminUrl}`);
  } else {
    console.error("  Add --publish to push a draft to Ghost Admin.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
