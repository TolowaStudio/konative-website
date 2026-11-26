import { createHash } from "node:crypto";

import { XMLParser } from "fast-xml-parser";
import type { SanityClient } from "@sanity/client";

import { newsCurationSinceIso, type NewsTopicValue } from "./newsConstants";
import { inferNewsTopicsFromText, isNewsDeskEligible } from "./newsTopicFilter";

type SourceDoc = {
  _id: string;
  id: string;
  name: string;
  slug?: string;
  feedUrl?: string;
  countries?: string[];
  topics?: string[];
};

type ParsedItem = {
  title: string;
  url: string;
  imageUrl?: string;
  summary?: string;
  publishedAt: string;
  rawFingerprint: string;
};

type PerSourceResult = {
  sourceName: string;
  sourceSlug?: string;
  discovered: number;
  created: number;
  skipped: number;
  status: "succeeded" | "partial" | "failed";
  error?: string;
};

type RunOptions = {
  sourceSlug?: string;
  maxSources?: number;
};

export type NewsIngestionSummary = {
  sourceCount: number;
  discovered: number;
  created: number;
  skipped: number;
  results: PerSourceResult[];
};

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
  parseTagValue: true,
  trimValues: true,
});

const stripHtml = (value: string) => value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const asArray = <T>(value: T | T[] | undefined): T[] => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

const normalizeDate = (value: unknown) => {
  if (!value || typeof value !== "string") return new Date().toISOString();
  const parsed = new Date(value);
  if (Number.isNaN(parsed.valueOf())) return new Date().toISOString();
  return parsed.toISOString();
};

const isHttpUrl = (value: unknown): value is string =>
  typeof value === "string" && /^https?:\/\//i.test(value.trim());

const looksLikeImageUrl = (url: string) =>
  /\.(jpe?g|png|webp|gif|avif)(\?|#|$)/i.test(url) || /\/image\//i.test(url);

/** Pull first absolute <img src> from HTML fragments in description / content:encoded. */
const firstImgSrc = (html: unknown): string | undefined => {
  if (typeof html !== "string" || !html.includes("<img")) return undefined;
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  const src = match?.[1]?.trim();
  return isHttpUrl(src) ? src : undefined;
};

const mediaUrls = (node: unknown): string[] => {
  const urls: string[] = [];
  for (const entry of asArray(node as Record<string, unknown> | Record<string, unknown>[] | undefined)) {
    if (!entry || typeof entry !== "object") continue;
    const record = entry as Record<string, unknown>;
    if (isHttpUrl(record.url)) urls.push(record.url.trim());
    if (isHttpUrl(record.href)) urls.push(String(record.href).trim());
    // Nested media:group → media:content / media:thumbnail
    urls.push(...mediaUrls(record["media:content"]));
    urls.push(...mediaUrls(record["media:thumbnail"]));
    urls.push(...mediaUrls(record["media:group"]));
  }
  return urls;
};

const enclosureUrl = (enclosure: unknown): string | undefined => {
  for (const entry of asArray(enclosure as Record<string, unknown> | Record<string, unknown>[] | undefined)) {
    if (!entry || typeof entry !== "object") continue;
    const record = entry as Record<string, unknown>;
    const url = typeof record.url === "string" ? record.url.trim() : "";
    if (!isHttpUrl(url)) continue;
    const type = typeof record.type === "string" ? record.type : "";
    if (type.startsWith("image/") || looksLikeImageUrl(url) || !type) return url;
  }
  return undefined;
};

const pickImageUrl = (item: any): string | undefined => {
  const htmlBlob = [item?.["content:encoded"], item?.description, item?.content, item?.summary]
    .map((value) => (typeof value === "string" ? value : typeof value?.["#text"] === "string" ? value["#text"] : ""))
    .join(" ");

  const candidates = [
    item?.image?.url,
    enclosureUrl(item?.enclosure),
    ...mediaUrls(item?.["media:content"]),
    ...mediaUrls(item?.["media:thumbnail"]),
    ...mediaUrls(item?.["media:group"]),
    item?.thumbnail?.url,
    item?.["itunes:image"]?.href,
    typeof item?.["itunes:image"] === "string" ? item["itunes:image"] : undefined,
    // Atom link rel="enclosure" / image
    ...asArray(item?.link)
      .filter((link: any) => {
        const rel = String(link?.rel || "").toLowerCase();
        const type = String(link?.type || "");
        return rel === "enclosure" || rel === "image" || type.startsWith("image/");
      })
      .map((link: any) => link?.href),
    firstImgSrc(htmlBlob),
  ];

  return candidates.find((value) => isHttpUrl(value))?.trim();
};

const fingerprintFor = (sourceId: string, rawFingerprint: string, publishedAt: string) =>
  createHash("sha256").update(`${sourceId}::${rawFingerprint}::${publishedAt}`).digest("hex");

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

function parseFeed(xmlText: string): ParsedItem[] {
  const parsed = parser.parse(xmlText);

  const rssItems = asArray(parsed?.rss?.channel?.item).map((item: any) => {
    const linkValue = typeof item?.link === "string" ? item.link : item?.link?.href;
    return {
      title: String(item?.title || "").trim(),
      url: String(linkValue || "").trim(),
      imageUrl: pickImageUrl(item),
      summary: stripHtml(String(item?.description || item?.["content:encoded"] || "").trim()),
      publishedAt: normalizeDate(item?.pubDate || item?.published || item?.updated),
      rawFingerprint: String(item?.guid || linkValue || item?.title || "").trim(),
    };
  });

  const atomItems = asArray(parsed?.feed?.entry).map((entry: any) => {
    const links = asArray(entry?.link);
    const primaryLink = links.find((link: any) => link?.href)?.href || links[0]?.href;
    const summary = entry?.summary || entry?.content || "";
    return {
      title: String(entry?.title || "").trim(),
      url: String(primaryLink || "").trim(),
      imageUrl: pickImageUrl(entry),
      summary: stripHtml(String(summary || "").trim()),
      publishedAt: normalizeDate(entry?.published || entry?.updated),
      rawFingerprint: String(entry?.id || primaryLink || entry?.title || "").trim(),
    };
  });

  return [...rssItems, ...atomItems].filter((item) => item.title && item.url && item.rawFingerprint);
}

async function ingestSource(sanity: SanityClient, source: SourceDoc): Promise<PerSourceResult> {
  const runDoc = {
    _type: "ingestionRun" as const,
    runLabel: `Source ingest: ${source.name}`,
    status: "running" as const,
    source: { _type: "reference" as const, _ref: source._id },
    startedAt: new Date().toISOString(),
    itemsDiscovered: 0,
    itemsCreated: 0,
    itemsSkipped: 0,
  };

  const run = await sanity.create(runDoc);

  if (!source.feedUrl) {
    const error = "No feedUrl configured for this source.";
    await sanity
      .patch(run._id)
      .set({ status: "partial", completedAt: new Date().toISOString(), errorLog: error })
      .commit();
    return {
      sourceName: source.name,
      sourceSlug: source.slug,
      discovered: 0,
      created: 0,
      skipped: 0,
      status: "partial",
      error,
    };
  }

  try {
    const response = await fetch(source.feedUrl, {
      headers: {
        "user-agent": "KonativeNewsBot/1.0 (+https://konative.com)",
      },
    });

    if (!response.ok) {
      throw new Error(`Feed request failed with status ${response.status}`);
    }

    const xml = await response.text();
    const parsedItems = parseFeed(xml);

    let created = 0;
    let skipped = 0;

    for (const item of parsedItems) {
      // Live desk only retains the curation window — skip older feed entries on create.
      if (item.publishedAt < newsCurationSinceIso()) {
        skipped += 1;
        continue;
      }

      const sourceTopics = (source.topics?.length ? source.topics : ["construction"]) as NewsTopicValue[];
      if (
        !isNewsDeskEligible({
          title: item.title,
          summary: item.summary,
          topics: sourceTopics,
        })
      ) {
        skipped += 1;
        continue;
      }

      const resolvedTopics = inferNewsTopicsFromText(
        { title: item.title, summary: item.summary },
        sourceTopics,
      );

      const ingestFingerprint = fingerprintFor(source._id, item.rawFingerprint, item.publishedAt);
      const stableId = `newsitem.${ingestFingerprint}`;

      const existingId = await sanity.fetch<string | null>(
        `*[_type == "newsItem" && ingestFingerprint == $fp][0]._id`,
        { fp: ingestFingerprint },
      );

      if (existingId) {
        // Backfill imageUrl when a later ingest finds a photo the original create missed.
        if (item.imageUrl) {
          try {
            const existingImage = await sanity.fetch<string | null>(
              `*[_id == $id][0].imageUrl`,
              { id: existingId },
            );
            if (!existingImage) {
              await sanity.patch(existingId).set({ imageUrl: item.imageUrl }).commit();
            }
          } catch {
            // Non-fatal — skip still counts as skip.
          }
        }
        skipped += 1;
        continue;
      }

      const normalizedDate =
        typeof item.publishedAt === "string" ? item.publishedAt.slice(0, 10) : new Date().toISOString().slice(0, 10);
      const itemSlug = `${slugify(item.title)}-${normalizedDate}`;

      try {
        await sanity.create({
          _id: stableId,
          _type: "newsItem",
          title: item.title,
          slug: { _type: "slug", current: itemSlug },
          status: "published",
          url: item.url,
          imageUrl: item.imageUrl,
          summary: item.summary?.slice(0, 350),
          contentType: "news",
          source: { _type: "reference", _ref: source._id },
          sourceName: source.name,
          publishedAt: item.publishedAt,
          discoveredAt: new Date().toISOString(),
          countries: source.countries?.length ? source.countries : ["us"],
          topics: resolvedTopics,
          ingestFingerprint,
        });
        created += 1;
      } catch {
        skipped += 1;
      }
    }

    await sanity
      .patch(source._id)
      .set({ lastIngestedAt: new Date().toISOString(), lastIngestError: "" })
      .commit();

    await sanity
      .patch(run._id)
      .set({
        status: "succeeded",
        completedAt: new Date().toISOString(),
        itemsDiscovered: parsedItems.length,
        itemsCreated: created,
        itemsSkipped: skipped,
      })
      .commit();

    return {
      sourceName: source.name,
      sourceSlug: source.slug,
      discovered: parsedItems.length,
      created,
      skipped,
      status: "succeeded",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown ingest error";

    await sanity
      .patch(source._id)
      .set({ lastIngestedAt: new Date().toISOString(), lastIngestError: message })
      .commit();

    await sanity
      .patch(run._id)
      .set({
        status: "failed",
        completedAt: new Date().toISOString(),
        errorLog: message,
      })
      .commit();

    return {
      sourceName: source.name,
      sourceSlug: source.slug,
      discovered: 0,
      created: 0,
      skipped: 0,
      status: "failed",
      error: message,
    };
  }
}

export async function runNewsIngestion(sanity: SanityClient, options: RunOptions = {}): Promise<NewsIngestionSummary> {
  const sources = await sanity.fetch<SourceDoc[]>(
    `*[_type == "newsSource" && active == true && ($sourceSlug == null || slug.current == $sourceSlug)] | order(priority desc)[0...$max]{
      "_id": _id,
      "id": _id,
      name,
      "slug": slug.current,
      feedUrl,
      countries,
      topics,
      priority
    }`,
    {
      sourceSlug: options.sourceSlug ?? null,
      max: options.maxSources ?? 100,
    },
  );

  const results: PerSourceResult[] = [];
  let discovered = 0;
  let created = 0;
  let skipped = 0;

  for (const source of sources) {
    const result = await ingestSource(sanity, source);
    discovered += result.discovered;
    created += result.created;
    skipped += result.skipped;
    results.push(result);
  }

  return {
    sourceCount: sources.length,
    discovered,
    created,
    skipped,
    results,
  };
}
