import {
  NEWS_CURATION_WINDOW_DAYS,
  NEWS_TOPIC_OPTIONS,
  TRIBAL_NEWS_TOPIC_VALUES,
  type NewsTopicValue,
} from "./newsConstants";
import { isNewsDeskEligible } from "./newsTopicFilter";

export const NEWS_ITEMS_PER_PAGE = 24;

/** Scan cap when applying desk topic filter after fetch (Sanity has no regex filter). */
export const NEWS_DESK_SCAN_LIMIT = 400;

export type NewsDoc = {
  id: string;
  title?: string;
  url?: string;
  imageUrl?: string;
  summary?: string;
  sourceName?: string;
  publishedAt?: string;
  countries?: string[];
  topics?: string[];
};

export type NewsPageFilters = {
  country: "all" | "us" | "ca";
  topic: "all" | NewsTopicValue;
  currentPage: number;
  since: string;
};

export type NewsPageData = {
  docs: NewsDoc[];
  featured: NewsDoc[];
  page: number;
  totalPages: number;
  isShowingLatestFallback: boolean;
  newestPublishedAt?: string;
};

type SanityFetchClient = {
  fetch: <T>(query: string, params?: Record<string, unknown>) => Promise<T>;
};

const newsDocProjection = `{
  "id": _id,
  title,
  url,
  imageUrl,
  summary,
  sourceName,
  publishedAt,
  countries,
  topics
}`;

/** GROQ filter for the paginated news list (optional curation window). */
export function buildNewsListFilter(params: {
  country: NewsPageFilters["country"];
  topic: NewsPageFilters["topic"];
  withWindow: boolean;
}): string {
  let filter =
    `_type == "newsItem" && status == "published" && defined(publishedAt)` +
    (params.withWindow ? ` && publishedAt >= $since` : "");

  if (params.country !== "all") {
    filter += ` && "${params.country}" in coalesce(countries, [])`;
  }
  if (params.topic !== "all") {
    filter += ` && "${params.topic}" in coalesce(topics, [])`;
  }

  return filter;
}

/** GROQ filter for the tribal featured shelf (optional curation window). */
export function buildFeaturedNewsFilter(params: {
  country: NewsPageFilters["country"];
  withWindow: boolean;
}): string {
  let filter =
    `_type == "newsItem" && status == "published" && defined(publishedAt)` +
    (params.withWindow ? ` && publishedAt >= $since` : "") +
    ` && (` +
    TRIBAL_NEWS_TOPIC_VALUES.map((topic) => `"${topic}" in coalesce(topics, [])`).join(" || ") +
    `)`;

  if (params.country !== "all") {
    filter += ` && "${params.country}" in coalesce(countries, [])`;
  }

  return filter;
}

export function formatNewsDate(value?: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return "";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function formatNewsDeskStatusLine(params: {
  isDataUnavailable: boolean;
  isShowingLatestFallback: boolean;
  docsCount: number;
  page: number;
  totalPages: number;
  activeFilterCount: number;
  newestPublishedAt?: string;
}): string {
  if (params.isDataUnavailable) {
    return "Live feed is temporarily unavailable while the CMS data connection is recovering.";
  }

  const pageSuffix = ` · ${params.docsCount} on page ${params.page} of ${params.totalPages}${
    params.activeFilterCount > 0 ? " with filters" : ""
  }`;

  if (params.docsCount === 0 && params.activeFilterCount === 0) {
    return `No on-desk stories in the last ${NEWS_CURATION_WINDOW_DAYS} days. Daily ingest runs at 06:00 UTC.${pageSuffix}`;
  }

  return `Last ${NEWS_CURATION_WINDOW_DAYS} days · infrastructure desk filter${pageSuffix}`;
}

export function filterNewsDocsForDesk(
  docs: NewsDoc[],
  options: { applyDeskTopicFilter: boolean },
): NewsDoc[] {
  if (!options.applyDeskTopicFilter) return docs;
  return docs.filter((doc) =>
    isNewsDeskEligible({
      title: doc.title,
      summary: doc.summary,
      topics: doc.topics,
    }),
  );
}

export function topicLabel(topics?: string[]): string {
  const first = topics?.[0];
  if (!first) return "Infrastructure";
  return NEWS_TOPIC_OPTIONS.find((option) => option.value === first)?.label || first;
}

export async function fetchNewsPageData(
  client: SanityFetchClient,
  filters: NewsPageFilters,
): Promise<NewsPageData> {
  const applyDeskTopicFilter = filters.topic === "all";
  const listFilter = buildNewsListFilter({
    country: filters.country,
    topic: filters.topic,
    withWindow: true,
  });

  const queryParams = { since: filters.since };
  const windowBatch = await client.fetch<NewsDoc[]>(
    `*[${listFilter}] | order(publishedAt desc)[0...${NEWS_DESK_SCAN_LIMIT}]${newsDocProjection}`,
    queryParams,
  );

  const eligible = filterNewsDocsForDesk(windowBatch, { applyDeskTopicFilter });
  const total = eligible.length;
  const totalPages = Math.max(1, Math.ceil(total / NEWS_ITEMS_PER_PAGE));
  const safePage = Math.min(filters.currentPage, totalPages);
  const safeStart = (safePage - 1) * NEWS_ITEMS_PER_PAGE;
  const docs = eligible.slice(safeStart, safeStart + NEWS_ITEMS_PER_PAGE);

  const featured =
    filters.topic === "all" && safePage === 1 && docs.length > 0
      ? filterNewsDocsForDesk(
          await client.fetch<NewsDoc[]>(
            `*[${buildFeaturedNewsFilter({ country: filters.country, withWindow: true })}] | order(publishedAt desc)[0...24]${newsDocProjection}`,
            queryParams,
          ),
          { applyDeskTopicFilter: true },
        ).slice(0, 8)
      : [];

  return {
    docs,
    featured,
    page: safePage,
    totalPages,
    isShowingLatestFallback: false,
    newestPublishedAt: undefined,
  };
}
