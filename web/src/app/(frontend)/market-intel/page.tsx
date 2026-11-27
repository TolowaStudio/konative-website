"use client";

import React, { useState, useEffect } from "react";
import { NewsletterConsentCheckbox } from "@/components/NewsletterConsentCheckbox";

interface Article {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  category: string;
  published_at: string;
}

const categoryLabels: Record<string, string> = {
  "Data Center": "Data Center",
  "Power": "Power / Grid",
  "Investment": "Investment / M&A",
  "Supply Chain": "Supply Chain",
  "Renewable Energy": "Renewable Energy",
  "Real Estate": "Real Estate",
  "Regulatory": "Regulatory",
};

export default function MarketIntelPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    fetch("/api/v1/content?limit=100")
      .then((res) => res.json())
      .then((data) => {
        setArticles(data.articles || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const usedCategories = Array.from(new Set(articles.map((a) => a.category))).filter(Boolean);

  const filtered =
    activeCategory === "all"
      ? articles
      : articles.filter((a) => a.category === activeCategory);

  async function handleSubscribe() {
    if (!email || !consent || subscribing || subscribed) return;
    setSubscribing(true);
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "market_intel_page", consent: true }),
      });
      if (res.ok) setSubscribed(true);
    } catch {
      // silently fail
    } finally {
      setSubscribing(false);
    }
  }

  return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh" }}>
      {/* Page header */}
      <div style={{ background: "#0C2046", padding: "80px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{
            fontFamily: "'Inter', sans-serif", fontWeight: 600,
            fontSize: 10, textTransform: "uppercase", letterSpacing: "0.24em",
            color: "#C8001F", marginBottom: 16,
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <span style={{ display: "block", width: 28, height: 1, background: "#C8001F" }} />
            Live Intelligence
          </div>
          <h1 style={{
            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800,
            fontSize: "clamp(48px, 7vw, 88px)", lineHeight: 0.92,
            textTransform: "uppercase", color: "#FFFFFF",
            letterSpacing: "0.01em", margin: "0 0 20px 0",
          }}>
            MARKET{" "}
            <span style={{ color: "#C8001F" }}>INTELLIGENCE</span>
          </h1>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 16, lineHeight: 1.6,
            color: "rgba(255,255,255,0.55)", maxWidth: 560, margin: 0,
          }}>
            Real signal for data center developers, land investors, and power buyers — not recycled press releases.
            {articles.length > 0 && (
              <span style={{ color: "rgba(255,255,255,0.3)" }}> {articles.length} articles from {usedCategories.length} sources.</span>
            )}
          </p>
        </div>
      </div>

      {/* Sticky filter bar */}
      {articles.length > 0 && (
        <div style={{
          position: "sticky", top: 64, zIndex: 100,
          background: "#fff", borderBottom: "1px solid #E0DDD8", padding: "0 32px",
        }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", gap: 0, overflowX: "auto" }}>
            {(["all", ...usedCategories] as string[]).map((tabValue) => {
              const isActive = activeCategory === tabValue;
              const label = tabValue === "all" ? "ALL" : (categoryLabels[tabValue] || tabValue).toUpperCase();
              return (
                <button
                  key={tabValue}
                  onClick={() => setActiveCategory(tabValue)}
                  style={{
                    fontFamily: "'Inter', sans-serif", fontWeight: 500,
                    fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em",
                    padding: "14px 20px", background: "transparent", border: "none",
                    borderBottom: isActive ? "2px solid #C8001F" : "2px solid transparent",
                    color: isActive ? "#C8001F" : "#555",
                    cursor: "pointer", marginBottom: -1, whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main content */}
      <div style={{ padding: "40px 32px 120px" }}>
        <div style={{
          maxWidth: 1280, margin: "0 auto",
          display: "grid", gridTemplateColumns: "1fr 300px", gap: 60,
        }}>
          {/* Left column — article grid */}
          <div>
            {loading ? (
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "#888", padding: "40px 0" }}>
                Loading intelligence feed...
              </p>
            ) : filtered.length === 0 ? (
              <div>
                <div style={{
                  fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
                  fontSize: 32, textTransform: "uppercase", color: "#111111", marginBottom: 12,
                }}>
                  NO RESULTS
                </div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "#555", margin: 0 }}>
                  No articles match this filter. Try a different category.
                </p>
              </div>
            ) : (
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
                border: "1px solid #E0DDD8",
              }}>
                {filtered.map((article, i) => {
                  const isHovered = hoveredCard === article.id;
                  const totalRows = Math.ceil(filtered.length / 3);
                  const rowIndex = Math.floor(i / 3);
                  const isLastRow = rowIndex === totalRows - 1;
                  const isLastInRow = i % 3 === 2;
                  return (
                    <article
                      key={article.id}
                      onMouseEnter={() => setHoveredCard(article.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      style={{
                        display: "flex", flexDirection: "column",
                        borderLeft: isHovered ? "3px solid #C8001F" : "3px solid transparent",
                        borderRight: isLastInRow ? "none" : "1px solid #E0DDD8",
                        borderBottom: isLastRow ? "none" : "1px solid #E0DDD8",
                        boxShadow: isHovered ? "0 4px 16px rgba(0,0,0,0.08)" : "none",
                        transition: "border-left 0.15s ease, box-shadow 0.15s ease",
                      }}
                    >
                      <div style={{ padding: "20px 20px 24px", display: "flex", flexDirection: "column", flex: 1 }}>
                        <div style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <span style={{
                            display: "inline-block", background: "#C8001F", color: "#fff",
                            fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: 10,
                            letterSpacing: "0.12em", textTransform: "uppercase", padding: "3px 8px",
                          }}>
                            {categoryLabels[article.category] || article.category}
                          </span>
                          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#888" }}>
                            {new Date(article.published_at).toLocaleDateString("en-US", {
                              year: "numeric", month: "short", day: "numeric",
                            })}
                          </span>
                        </div>

                        <div style={{
                          fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
                          fontSize: 18, lineHeight: 1.2, textTransform: "uppercase",
                          color: "#111111", marginBottom: 10, letterSpacing: "0.01em",
                        }}>
                          {article.title}
                        </div>

                        {article.summary && (
                          <p style={{
                            fontFamily: "'Inter', sans-serif", fontSize: 13,
                            lineHeight: 1.6, color: "#555", margin: "0 0 12px 0",
                          }}>
                            {article.summary.length > 160 ? article.summary.slice(0, 157) + "…" : article.summary}
                          </p>
                        )}

                        <div style={{
                          display: "flex", justifyContent: "space-between",
                          alignItems: "center", marginTop: "auto", paddingTop: 12,
                        }}>
                          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#888" }}>
                            {article.source}
                          </span>
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontFamily: "'Inter', sans-serif", fontWeight: 600,
                              fontSize: 11, color: "#C8001F", textDecoration: "none",
                            }}
                          >
                            Read →
                          </a>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right column — Newsletter rail */}
          <div style={{
            background: "#F2F0EB", padding: "40px 32px",
            position: "sticky", top: 128, alignSelf: "start",
          }}>
            <div style={{
              fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 10,
              textTransform: "uppercase", letterSpacing: "0.2em",
              color: "#C8001F", marginBottom: 16,
            }}>
              THE INTELLIGENCE BRIEF
            </div>

            <h3 style={{
              fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
              fontSize: 26, textTransform: "uppercase", color: "#111111",
              lineHeight: 1, margin: "0 0 16px 0",
            }}>
              GET THE FEED IN YOUR INBOX
            </h3>

            <p style={{
              fontFamily: "'Inter', sans-serif", fontSize: 14, lineHeight: 1.6,
              color: "#555", margin: "0 0 24px 0",
            }}>
              Data center land, power, and capital movement — twice a week for developers and investors.
            </p>

            {subscribed ? (
              <div style={{
                fontFamily: "'Inter', sans-serif", fontWeight: 600,
                fontSize: 14, color: "#C8001F", padding: "14px 0",
              }}>
                Subscribed! ✓
              </div>
            ) : (
              <>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  style={{
                    width: "100%", padding: "12px 16px",
                    border: "1px solid #E0DDD8", background: "#fff",
                    fontFamily: "'Inter', sans-serif", fontSize: 14,
                    marginBottom: 10, outline: "none",
                    boxSizing: "border-box", borderRadius: 0,
                  }}
                />
                <NewsletterConsentCheckbox
                  checked={consent}
                  onChange={setConsent}
                  style={{ marginBottom: 10 }}
                />
                <button
                  type="button"
                  onClick={handleSubscribe}
                  disabled={subscribing || !consent}
                  style={{
                    width: "100%", padding: 14, background: "#C8001F",
                    color: "#fff", border: "none",
                    fontFamily: "'Inter', sans-serif", fontWeight: 600,
                    fontSize: 12, textTransform: "uppercase", letterSpacing: "0.12em",
                    cursor: subscribing || !consent ? "not-allowed" : "pointer",
                    opacity: subscribing || !consent ? 0.7 : 1, borderRadius: 0,
                  }}
                >
                  SUBSCRIBE FREE
                </button>
              </>
            )}

            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#888", marginTop: 12 }}>
              Updated daily · {articles.length > 0 ? `${articles.length} articles indexed` : "12 live feeds"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
