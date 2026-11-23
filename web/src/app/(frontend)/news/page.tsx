import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";

import {
  NEWS_SOURCE_COUNTRY_OPTIONS,
  NEWS_TOPIC_OPTIONS,
  isNewsTopicValue,
  newsCurationSinceIso,
} from "../../../lib/newsConstants";
import {
  formatNewsDate,
  formatNewsDeskStatusLine,
  fetchNewsPageData,
  topicLabel,
  type NewsDoc,
} from "../../../lib/newsPageQuery";
import { getSanityReadClient } from "../../../sanity/readClient";

export const metadata: Metadata = {
  title: "News Archive — Konative",
  description:
    "Archive of curated news (through August 2026) on tribal data centers, tribal energy, broadband grants, and connectivity infrastructure — domestic and international, any market. The feed is paused.",
};

export const revalidate = 3600;
export const dynamic = "force-dynamic";

type NewsPageProps = {
  searchParams: Promise<{
    country?: string;
    topic?: string;
    page?: string;
  }>;
};

const chipActiveStyle: CSSProperties = {
  background: "#C8001F",
  color: "#fff",
  fontFamily: "'Inter', sans-serif",
  fontWeight: 500,
  fontSize: 12,
  padding: "6px 14px",
  textDecoration: "none",
  display: "inline-block",
  whiteSpace: "nowrap",
};

const chipInactiveStyle: CSSProperties = {
  background: "#F9FAFB",
  color: "#374151",
  border: "1px solid #E5E7EB",
  fontFamily: "'Inter', sans-serif",
  fontWeight: 500,
  fontSize: 12,
  padding: "6px 14px",
  textDecoration: "none",
  display: "inline-block",
  whiteSpace: "nowrap",
};

const buildQueryString = (params: Record<string, string | number | undefined>) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  return query.toString();
};

/** Prefer imaged stories for mosaic slots without losing recency order among peers. */
const preferImages = (docs: NewsDoc[], count: number): NewsDoc[] => {
  const withImage = docs.filter((doc) => Boolean(doc.imageUrl));
  const withoutImage = docs.filter((doc) => !doc.imageUrl);
  return [...withImage, ...withoutImage].slice(0, count);
};

function SteelFallback({
  item,
  height,
  children,
}: {
  item: NewsDoc;
  height: number | string;
  children?: ReactNode;
}) {
  const monogram = (item.sourceName || "K").trim().charAt(0).toUpperCase();
  return (
    <span
      className="news-tile__fallback"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height,
        minHeight: typeof height === "number" ? height : undefined,
        padding: 16,
        backgroundColor: "#111111",
        backgroundImage:
          "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        borderLeft: "4px solid #C8001F",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 600,
          fontSize: 10,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "#C8001F",
        }}
      >
        {topicLabel(item.topics)}
      </span>
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          right: 8,
          bottom: -8,
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 800,
          fontSize: 96,
          lineHeight: 1,
          color: "rgba(255,255,255,0.12)",
          pointerEvents: "none",
        }}
      >
        {monogram}
      </span>
      {children}
    </span>
  );
}

function TileMedia({
  item,
  aspect,
  minHeight,
  priority,
}: {
  item: NewsDoc;
  aspect: string;
  minHeight: number;
  priority?: boolean;
}) {
  if (item.imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- feed hostnames vary; CSS background was the prior pattern
      <img
        className="news-tile__media"
        src={item.imageUrl}
        alt=""
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        style={{
          width: "100%",
          height: "100%",
          minHeight,
          aspectRatio: aspect,
          objectFit: "cover",
          display: "block",
          background: "#111",
        }}
      />
    );
  }
  return <SteelFallback item={item} height={minHeight} />;
}

function MetaRow({ item, onDark }: { item: NewsDoc; onDark?: boolean }) {
  return (
    <span
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        alignItems: "center",
      }}
    >
      {item.sourceName ? (
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            fontSize: 10,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            background: "#C8001F",
            color: "#fff",
            padding: "2px 8px",
          }}
        >
          {item.sourceName}
        </span>
      ) : null}
      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 11,
          color: onDark ? "rgba(255,255,255,0.72)" : "#888",
        }}
      >
        {formatNewsDate(item.publishedAt)}
      </span>
    </span>
  );
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const params = await searchParams;

  const country = params.country === "us" || params.country === "ca" ? params.country : "all";
  const topic = params.topic && isNewsTopicValue(params.topic) ? params.topic : "all";
  const page = Number.parseInt(params.page || "1", 10);
  const currentPage = Number.isNaN(page) || page < 1 ? 1 : page;

  let isDataUnavailable = false;
  let isShowingLatestFallback = false;
  let newestPublishedAt: string | undefined;
  let news: {
    docs: NewsDoc[];
    featured?: NewsDoc[];
    page?: number;
    totalPages?: number;
  } = {
    docs: [],
    featured: [],
    page: currentPage,
    totalPages: 1,
  };

  try {
    const client = getSanityReadClient();
    const pageData = await fetchNewsPageData(client, {
      country,
      topic,
      currentPage,
      since: newsCurationSinceIso(),
    });
    isShowingLatestFallback = pageData.isShowingLatestFallback;
    newestPublishedAt = pageData.newestPublishedAt;
    news = {
      docs: pageData.docs,
      featured: pageData.featured,
      page: pageData.page,
      totalPages: pageData.totalPages,
    };
  } catch (_error) {
    isDataUnavailable = true;
  }

  const deskPage = news.page ?? 1;
  const activeFilterCount = (country !== "all" ? 1 : 0) + (topic !== "all" ? 1 : 0);
  const showMosaic = deskPage === 1 && activeFilterCount === 0 && news.docs.length > 0;
  const mosaicDocs = showMosaic ? preferImages(news.docs, 6) : [];
  const mosaicIds = new Set(mosaicDocs.map((doc) => doc.id));
  const listDocs = showMosaic ? news.docs.filter((doc) => !mosaicIds.has(doc.id)) : news.docs;
  const featuredDocs = (news.featured || []).filter((doc) => !mosaicIds.has(doc.id)).slice(0, 6);

  const [lead, secondaryA, secondaryB, ...tertiaries] = mosaicDocs;

  return (
    <main className="news-page" style={{ background: "#fff", minHeight: "100vh" }}>
      {/* Compact masthead — mosaic owns the first viewport */}
      <section className="news-masthead" style={{ padding: "96px 32px 28px", borderBottom: "1px solid #E5E7EB" }}>
        <div
          style={{
            maxWidth: 1440,
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <div style={{ maxWidth: 920 }}>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: 10,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#C8001F",
                margin: "0 0 10px",
              }}
            >
              News Archive · Feed Paused
            </p>
            <h1
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(36px, 5vw, 64px)",
                lineHeight: 0.95,
                textTransform: "uppercase",
                color: "#111",
                margin: 0,
                letterSpacing: "0.01em",
              }}
            >
              Tribal & <span style={{ color: "#C8001F" }}>Infrastructure</span> News
            </h1>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 14,
                lineHeight: 1.5,
                color: "#6B7280",
                margin: "10px 0 0",
                maxWidth: 640,
              }}
            >
              Policy, power, fiber, and capital signals for tribal and rural connectivity — domestic and
              international, any market. This feed is paused: stories run through August 2026 and are kept
              here as an archive.
            </p>
          </div>
          <div
            style={{
              borderLeft: "4px solid #C8001F",
              background: "#F3F4F6",
              color: "#374151",
              padding: "10px 14px",
              fontFamily: "'Inter', sans-serif",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Global Connectivity Desk · Policy · Power · Fiber
          </div>
        </div>
      </section>

      {/* Curated mosaic — browser start page above the fold */}
      {showMosaic && lead ? (
        <section className="news-mosaic-wrap" style={{ padding: "20px 32px 8px" }}>
          <div className="news-mosaic" data-count={mosaicDocs.length}>
            <a
              className="news-tile news-tile--lead"
              href={lead.url}
              target="_blank"
              rel="noreferrer"
              style={{
                gridArea: "lead",
                textDecoration: "none",
                color: "inherit",
                position: "relative",
                overflow: "hidden",
                display: "block",
                minHeight: 320,
                background: "#111",
              }}
            >
              <span style={{ position: "absolute", inset: 0 }}>
                <TileMedia item={lead} aspect="3 / 2" minHeight={320} priority />
              </span>
              <span
                className="news-tile__scrim"
                style={{
                  position: "absolute",
                  inset: 0,
                  background: lead.imageUrl
                    ? "linear-gradient(transparent 35%, rgba(17,17,17,0.88))"
                    : "transparent",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  padding: "28px 24px",
                  gap: 10,
                }}
              >
                <MetaRow item={lead} onDark />
                <span
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(28px, 3.5vw, 44px)",
                    lineHeight: 1,
                    textTransform: "uppercase",
                    color: "#fff",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {lead.title}
                </span>
                {lead.summary ? (
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 14,
                      lineHeight: 1.5,
                      color: "rgba(255,255,255,0.78)",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      maxWidth: 640,
                    }}
                  >
                    {lead.summary}
                  </span>
                ) : null}
              </span>
            </a>

            {secondaryA ? (
              <a
                className="news-tile news-tile--secondary"
                href={secondaryA.url}
                target="_blank"
                rel="noreferrer"
                style={{ gridArea: "sec-a", textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", minHeight: 0 }}
              >
                <TileMedia item={secondaryA} aspect="4 / 5" minHeight={180} />
                <span style={{ padding: "14px 4px 0", display: "flex", flexDirection: "column", gap: 8 }}>
                  <MetaRow item={secondaryA} />
                  <span
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 700,
                      fontSize: 22,
                      lineHeight: 1.1,
                      textTransform: "uppercase",
                      color: "#111",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {secondaryA.title}
                  </span>
                  {secondaryA.summary ? (
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 13,
                        lineHeight: 1.5,
                        color: "#555",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {secondaryA.summary}
                    </span>
                  ) : null}
                </span>
              </a>
            ) : null}

            {secondaryB ? (
              <a
                className="news-tile news-tile--secondary"
                href={secondaryB.url}
                target="_blank"
                rel="noreferrer"
                style={{ gridArea: "sec-b", textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", minHeight: 0 }}
              >
                <TileMedia item={secondaryB} aspect="16 / 9" minHeight={120} />
                <span style={{ padding: "14px 4px 0", display: "flex", flexDirection: "column", gap: 8 }}>
                  <MetaRow item={secondaryB} />
                  <span
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 700,
                      fontSize: 20,
                      lineHeight: 1.1,
                      textTransform: "uppercase",
                      color: "#111",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {secondaryB.title}
                  </span>
                </span>
              </a>
            ) : null}

            {tertiaries.map((item, index) => (
              <a
                key={item.id}
                className="news-tile news-tile--tertiary"
                href={item.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  gridArea: `tert-${index + 1}`,
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 0,
                }}
              >
                <TileMedia item={item} aspect="16 / 9" minHeight={100} />
                <span style={{ padding: "12px 4px 0", display: "flex", flexDirection: "column", gap: 6 }}>
                  <MetaRow item={item} />
                  <span
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 700,
                      fontSize: 18,
                      lineHeight: 1.15,
                      textTransform: "uppercase",
                      color: "#111",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {item.title}
                  </span>
                </span>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      {/* Sticky filter shelf — after the mosaic */}
      <section className="news-filter-shelf" style={{ padding: "0 32px", position: "sticky", top: 64, zIndex: 30 }}>
        <div
          style={{
            maxWidth: 1440,
            margin: "0 auto",
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(8px)",
            borderBottom: "1px solid #E5E7EB",
            padding: "16px 0 14px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "flex-start" }}>
            <div>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: 10,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#666",
                  marginBottom: 8,
                  display: "block",
                }}
              >
                Country
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["all", ...NEWS_SOURCE_COUNTRY_OPTIONS.map((option) => option.value)].map((value) => {
                  const label =
                    value === "all"
                      ? "All"
                      : NEWS_SOURCE_COUNTRY_OPTIONS.find((option) => option.value === value)?.label || value;
                  const isActive = country === value;
                  const query = buildQueryString({
                    country: value === "all" ? undefined : value,
                    topic: topic === "all" ? undefined : topic,
                  });
                  return (
                    <Link key={value} href={query ? `/news?${query}` : "/news"} style={isActive ? chipActiveStyle : chipInactiveStyle}>
                      {label}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: 10,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#666",
                  marginBottom: 8,
                  display: "block",
                }}
              >
                Topic
              </span>
              <div className="news-topic-scroll" style={{ display: "flex", flexWrap: "nowrap", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
                {["all", ...NEWS_TOPIC_OPTIONS.map((option) => option.value)].map((value) => {
                  const label =
                    value === "all"
                      ? "All"
                      : NEWS_TOPIC_OPTIONS.find((option) => option.value === value)?.label || value;
                  const isActive = topic === value;
                  const query = buildQueryString({
                    country: country === "all" ? undefined : country,
                    topic: value === "all" ? undefined : value,
                  });
                  return (
                    <Link key={value} href={query ? `/news?${query}` : "/news"} style={isActive ? chipActiveStyle : chipInactiveStyle}>
                      {label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              color: "#888",
              margin: 0,
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <span>
              {formatNewsDeskStatusLine({
                isDataUnavailable,
                isShowingLatestFallback,
                docsCount: news.docs.length,
                page: news.page ?? 1,
                totalPages: news.totalPages ?? 1,
                activeFilterCount,
                newestPublishedAt,
              })}
            </span>
            {activeFilterCount > 0 ? (
              <Link href="/news" style={{ color: "#C8001F", textDecoration: "none", fontWeight: 600 }}>
                Clear filters
              </Link>
            ) : null}
          </p>
        </div>
      </section>

      {/* Featured tribal shelf */}
      {featuredDocs.length > 0 && topic === "all" && deskPage === 1 ? (
        <section style={{ padding: "28px 32px 8px" }}>
          <div style={{ maxWidth: 1440, margin: "0 auto" }}>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: 10,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#C8001F",
                margin: "0 0 14px",
              }}
            >
              Featured — Tribal & Infrastructure
            </p>
            <div className="news-featured-shelf">
              {featuredDocs.map((item) => (
                <a key={item.id} className="news-featured-tile" href={item.url} target="_blank" rel="noreferrer">
                  <span className="news-featured-tile__media">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.imageUrl} alt="" loading="lazy" />
                    ) : (
                      <SteelFallback item={item} height={140} />
                    )}
                  </span>
                  <span className="news-featured-tile__body">
                    <MetaRow item={item} />
                    <span className="news-featured-tile__title">{item.title}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Dense list rail */}
      <section style={{ padding: "28px 32px 80px" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          {news.docs.length === 0 ? (
            <div
              style={{
                background: "#111",
                color: "#fff",
                borderLeft: "4px solid #C8001F",
                padding: 32,
              }}
            >
              <h2
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700,
                  fontSize: 32,
                  textTransform: "uppercase",
                  margin: "0 0 12px",
                }}
              >
                {isDataUnavailable ? "Feed unavailable" : "No news items match these filters yet."}
              </h2>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "rgba(255,255,255,0.72)", margin: 0 }}>
                {isDataUnavailable
                  ? "Our ingestion and CMS services are reconnecting."
                  : "Try broadening your country/topic filters or run ingestion to populate fresh stories."}
              </p>
            </div>
          ) : listDocs.length === 0 ? null : (
            <>
              {showMosaic ? (
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: 10,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "#C8001F",
                    margin: "0 0 12px",
                  }}
                >
                  More from the desk
                </p>
              ) : null}
              <div className="news-list-rail">
                {listDocs.map((item) => (
                  <a key={item.id} className="news-list-row" href={item.url} target="_blank" rel="noreferrer">
                    <span className="news-list-row__thumb">
                      {item.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.imageUrl} alt="" loading="lazy" />
                      ) : (
                        <SteelFallback item={item} height={72} />
                      )}
                    </span>
                    <span className="news-list-row__body">
                      <MetaRow item={item} />
                      <span className="news-list-row__title">{item.title}</span>
                    </span>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {(news.totalPages ?? 1) > 1 ? (
        <nav aria-label="Pagination" style={{ padding: "0 32px 80px" }}>
          <div
            style={{
              maxWidth: 1440,
              margin: "0 auto",
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            {Array.from({ length: Math.min(news.totalPages ?? 1, 24) }).map((_, index) => {
              const targetPage = index + 1;
              const query = buildQueryString({
                country: country === "all" ? undefined : country,
                topic: topic === "all" ? undefined : topic,
                page: targetPage === 1 ? undefined : targetPage,
              });
              const isCurrentPage = targetPage === deskPage;
              return (
                <Link
                  key={targetPage}
                  href={query ? `/news?${query}` : "/news"}
                  style={
                    isCurrentPage
                      ? {
                          background: "#C8001F",
                          color: "#fff",
                          padding: "8px 14px",
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 12,
                          textDecoration: "none",
                        }
                      : {
                          background: "#F9FAFB",
                          color: "#374151",
                          border: "1px solid #E5E7EB",
                          padding: "8px 14px",
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 12,
                          textDecoration: "none",
                        }
                  }
                >
                  {targetPage}
                </Link>
              );
            })}
          </div>
        </nav>
      ) : null}
    </main>
  );
}
