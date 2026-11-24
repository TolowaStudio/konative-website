import { describe, expect, it } from "vitest";

import {
  buildFeaturedNewsFilter,
  buildNewsListFilter,
  formatNewsDeskStatusLine,
  fetchNewsPageData,
  type NewsDoc,
} from "../newsPageQuery";

function docsInCurationWindow(docs: NewsDoc[], sinceIso: string): NewsDoc[] {
  const sinceMs = new Date(sinceIso).getTime();
  return docs.filter((doc) => {
    if (!doc.publishedAt) return false;
    return new Date(doc.publishedAt).getTime() >= sinceMs;
  });
}

function createHonoringClient(pool: NewsDoc[]) {
  return {
    fetch: async <T>(query: string, params?: Record<string, unknown>): Promise<T> => {
      const since = typeof params?.since === "string" ? params.since : undefined;
      if (query.includes('"ca" in coalesce(countries')) {
        return pool.filter((doc) => doc.countries?.includes("ca")) as T;
      }
      if (query.includes('"tax" in coalesce(topics')) {
        return pool.filter((doc) => doc.topics?.includes("tax")) as T;
      }
      if (since && query.includes("publishedAt >= $since")) {
        return docsInCurationWindow(pool, since) as T;
      }
      return pool as T;
    },
  };
}

describe("buildNewsListFilter", () => {
  it("includes the curation window by default", () => {
    const filter = buildNewsListFilter({ country: "all", topic: "all", withWindow: true });
    expect(filter).toContain('status == "published"');
    expect(filter).toContain("defined(publishedAt)");
    expect(filter).toContain("publishedAt >= $since");
  });

  it("omits the curation window for latest-published fallback", () => {
    const filter = buildNewsListFilter({ country: "all", topic: "all", withWindow: false });
    expect(filter).not.toContain("publishedAt >= $since");
    expect(filter).toContain('status == "published"');
    expect(filter).toContain("defined(publishedAt)");
  });

  it("keeps country and topic filters in fallback mode", () => {
    const filter = buildNewsListFilter({
      country: "us",
      topic: "tribal-broadband",
      withWindow: false,
    });
    expect(filter).toContain('"us" in coalesce(countries, [])');
    expect(filter).toContain('"tribal-broadband" in coalesce(topics, [])');
  });
});

describe("buildFeaturedNewsFilter", () => {
  it("matches tribal topics and optional window", () => {
    const withWindow = buildFeaturedNewsFilter({ country: "all", withWindow: true });
    expect(withWindow).toContain("tribal-data-center");
    expect(withWindow).toContain("publishedAt >= $since");

    const withoutWindow = buildFeaturedNewsFilter({ country: "ca", withWindow: false });
    expect(withoutWindow).not.toContain("publishedAt >= $since");
    expect(withoutWindow).toContain('"ca" in coalesce(countries, [])');
  });
});

describe("formatNewsDeskStatusLine", () => {
  it("describes the normal curation window", () => {
    expect(
      formatNewsDeskStatusLine({
        isDataUnavailable: false,
        isShowingLatestFallback: false,
        docsCount: 12,
        page: 1,
        totalPages: 2,
        activeFilterCount: 0,
      }),
    ).toContain("Last 7 days");
  });

  it("describes an empty desk without surfacing archive dates", () => {
    expect(
      formatNewsDeskStatusLine({
        isDataUnavailable: false,
        isShowingLatestFallback: false,
        docsCount: 0,
        page: 1,
        totalPages: 1,
        activeFilterCount: 0,
      }),
    ).toContain("No on-desk stories in the last 7 days");
  });
});

describe("fetchNewsPageData", () => {
  const since = "2026-08-09T00:00:00.000Z";

  it("does not surface archive stories when the live window is empty", async () => {
    const staleOffDesk: NewsDoc[] = [
      {
        id: "news-1",
        title: "Pickleball courts reshape office leasing",
        summary: "Commercial Observer office survey",
        publishedAt: "2026-07-16T12:00:00.000Z",
      },
    ];

    const queries: string[] = [];
    const client = {
      fetch: async <T>(query: string, params?: Record<string, unknown>): Promise<T> => {
        queries.push(query);
        const sinceParam = typeof params?.since === "string" ? params.since : since;
        if (query.includes("publishedAt >= $since")) {
          return docsInCurationWindow(staleOffDesk, sinceParam) as T;
        }
        return staleOffDesk as T;
      },
    };

    const result = await fetchNewsPageData(client, {
      country: "all",
      topic: "all",
      currentPage: 1,
      since,
    });

    expect(queries.some((q) => q.includes("publishedAt >= $since"))).toBe(true);
    expect(result.isShowingLatestFallback).toBe(false);
    expect(result.docs).toEqual([]);
  });

  it("keeps the empty state when filters match nothing", async () => {
    const usOnlyDocs: NewsDoc[] = [
      {
        id: "news-us",
        title: "Fiber backbone expands in Arizona",
        summary: "Tribal connectivity",
        topics: ["tribal-broadband"],
        countries: ["us"],
        publishedAt: "2026-11-20T00:00:00.000Z",
      },
    ];

    const client = createHonoringClient(usOnlyDocs);

    const result = await fetchNewsPageData(client, {
      country: "ca",
      topic: "tax",
      currentPage: 1,
      since,
    });

    expect(result.isShowingLatestFallback).toBe(false);
    expect(result.docs).toEqual([]);
  });

  it("filters default desk to on-topic stories within the window", async () => {
    const mixed: NewsDoc[] = [
      {
        id: "news-off",
        title: "Pickleball courts reshape office leasing",
        summary: "Commercial Observer office survey",
        publishedAt: "2026-11-20T00:00:00.000Z",
      },
      {
        id: "news-fresh",
        title: "Hyperscaler expands tribal data center fiber route",
        summary: "NTIA TBCP-backed backbone supports interconnection queue.",
        topics: ["tribal-broadband"],
        publishedAt: "2026-11-21T00:00:00.000Z",
      },
    ];

    const client = createHonoringClient(mixed);

    const result = await fetchNewsPageData(client, {
      country: "all",
      topic: "all",
      currentPage: 1,
      since,
    });

    expect(result.isShowingLatestFallback).toBe(false);
    expect(result.docs.map((d) => d.id)).toEqual(["news-fresh"]);
  });
});