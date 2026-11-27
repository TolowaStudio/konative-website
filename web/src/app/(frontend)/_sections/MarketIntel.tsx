'use client'

import { useState } from 'react'
import { NewsletterConsentCheckbox } from '@/components/NewsletterConsentCheckbox'

interface Article {
  id: string
  title: string
  summary?: string
  category: string
  source?: string
  published_at: string
  url?: string
  image_url?: string | null
}

interface MarketIntelProps {
  articles: Article[]
}

const PLACEHOLDER_BG =
  'repeating-linear-gradient(-55deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 18px), ' +
  'linear-gradient(160deg, #091523 0%, #0C2046 60%, #0f2a55 100%)'

const PLACEHOLDER_ARTICLES: Article[] = [
  { id: '1', title: 'PJM Queue Hits Record 3,000+ GW — What It Means for Data Center Siting',            category: 'Power & Energy',    source: 'Utility Dive',            published_at: '2026-04-19' },
  { id: '2', title: 'Saudi Aramco Energy Ventures Commits $4.2B to North American Digital Infrastructure', category: 'Investment',         source: 'Bloomberg',               published_at: '2026-04-18' },
  { id: '3', title: 'Why Prefabricated Modular Is Now the Default Choice for Sub-100MW Builds',           category: 'Modular DC',         source: 'DataCenter Dynamics',     published_at: '2026-04-17' },
  { id: '4', title: 'Generator Lead Times Now 52 Weeks: The Hidden Constraint on New Deployments',        category: 'Supply Chain',       source: 'DCD Intelligence',        published_at: '2026-04-16' },
  { id: '5', title: 'FERC Order 2023-A: How New Interconnection Rules Are Reshaping Project Timelines',   category: 'Policy',             source: 'Greentech Media',         published_at: '2026-04-15' },
  { id: '6', title: 'CPPIB Targets 3.4 GW Across Four Modular DC Platforms Through 2028',                category: 'Sovereign Capital',  source: 'Infrastructure Investor', published_at: '2026-04-14' },
]

function cardBg(imageUrl?: string | null): string {
  return imageUrl ? `url('${imageUrl}') center/cover no-repeat` : PLACEHOLDER_BG
}

export default function MarketIntel({ articles }: MarketIntelProps) {
  const [email, setEmail]         = useState('')
  const [consent, setConsent]     = useState(false)
  const [submitted, setSubmitted]   = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const display = articles.length > 0 ? articles.slice(0, 6) : PLACEHOLDER_ARTICLES
  const [featured, ...rest] = display
  const sidebarItems = rest.slice(2)

  const handleSubscribe = async () => {
    if (!email || !consent || submitting) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'homepage_market_intel', consent: true }),
      })
      if (res.ok) setSubmitted(true)
    } catch { /* silent */ }
    setSubmitting(false)
  }

  return (
    <section id="market-intel" style={{ background: '#08142D', padding: '100px 0', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 48px' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 60, flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              fontFamily: 'Inter, sans-serif', fontWeight: 600,
              fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase',
              color: '#C8001F', marginBottom: 20,
            }}>
              <span style={{ display: 'block', width: 28, height: 1, background: '#C8001F' }} />
              Market Intelligence
            </div>
            <h2 style={{
              fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800,
              fontSize: 'clamp(44px, 5.5vw, 80px)', lineHeight: 0.9,
              textTransform: 'uppercase', letterSpacing: '0.01em', color: '#fff',
            }}>
              WHAT&apos;S MOVING<br /><span style={{ color: '#C8001F' }}>THE MARKET.</span>
            </h2>
          </div>
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: 14, lineHeight: 1.6,
            color: 'rgba(255,255,255,0.45)', maxWidth: 360,
          }}>
            We stay ahead of the market so your project decisions are grounded in what&apos;s actually happening — not last quarter&apos;s report.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 64 }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <a href={featured.url || '#'} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <div style={{ background: '#0C2046', overflow: 'hidden' }}>
                <div style={{
                  height: 220, position: 'relative',
                  background: cardBg(featured.image_url),
                }}>
                  <span style={{
                    position: 'absolute', bottom: 12, left: 12,
                    background: '#A8001A', color: '#fff',
                    fontFamily: 'Inter, sans-serif', fontWeight: 600,
                    fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
                    padding: '3px 8px',
                  }}>
                    {featured.category}
                  </span>
                </div>
                <div style={{ padding: '20px 24px 24px' }}>
                  <div style={{
                    fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700,
                    fontSize: 22, textTransform: 'uppercase', color: '#fff',
                    lineHeight: 1.15, marginBottom: 10,
                  }}>
                    {featured.title}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
                      {featured.source} · {featured.published_at}
                    </span>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 11, color: '#C8001F' }}>
                      Read →
                    </span>
                  </div>
                </div>
              </div>
            </a>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'rgba(255,255,255,0.08)' }}>
              {rest.slice(0, 2).map((article) => (
                <a key={article.id} href={article.url || '#'} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <div style={{ background: '#0C2046', overflow: 'hidden' }}>
                    <div style={{
                      height: 140, position: 'relative',
                      background: cardBg(article.image_url),
                    }}>
                      <span style={{
                        position: 'absolute', bottom: 8, left: 8,
                        background: '#A8001A', color: '#fff',
                        fontFamily: 'Inter, sans-serif', fontWeight: 600,
                        fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
                        padding: '2px 6px',
                      }}>
                        {article.category}
                      </span>
                    </div>
                    <div style={{ padding: '16px 18px 20px' }}>
                      <div style={{
                        fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700,
                        fontSize: 17, textTransform: 'uppercase', color: '#fff',
                        lineHeight: 1.15, marginBottom: 8,
                      }}>
                        {article.title}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>
                          {article.source}
                        </span>
                        <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 10, color: '#C8001F' }}>
                          Read →
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{
              fontFamily: 'Inter, sans-serif', fontSize: 10,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.2)', padding: '0 20px 12px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
            }}>
              Also in the feed
            </div>
            {sidebarItems.map((article) => (
              <a
                key={article.id}
                href={article.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: 'none', display: 'block',
                  padding: '18px 20px',
                  borderLeft: '2px solid transparent',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <div style={{
                  fontFamily: 'Inter, sans-serif', fontWeight: 600,
                  fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase',
                  color: '#F0A050', marginBottom: 6,
                }}>
                  {article.category}
                </div>
                <div style={{
                  fontFamily: 'Inter, sans-serif', fontSize: 13,
                  lineHeight: 1.45, color: 'rgba(255,255,255,0.65)', marginBottom: 6,
                }}>
                  {article.title}
                </div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>
                  {article.source} · {article.published_at}
                </div>
              </a>
            ))}
            <div style={{ padding: '16px 20px', marginTop: 'auto' }}>
              <a href="/news" style={{
                display: 'block', textAlign: 'center', padding: '14px',
                border: '1px solid rgba(224,123,57,0.3)',
                fontFamily: 'Inter, sans-serif', fontWeight: 600,
                fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
                color: '#C8001F', textDecoration: 'none',
              }}>
                View All Intelligence →
              </a>
            </div>
          </div>
        </div>

        <div style={{
          background: '#1E4FBF', marginTop: 64,
          padding: '40px 48px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 24,
        }}>
          <div>
            <h3 style={{
              fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800,
              fontSize: 32, textTransform: 'uppercase', color: '#fff', lineHeight: 1,
            }}>
              The Intelligence Brief
            </h3>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 6 }}>
              2×/week — curated market digest for energy infrastructure principals.
            </p>
          </div>
          {submitted ? (
            <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 14, color: '#fff' }}>
              Subscribed ✓
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 420 }}>
              <div style={{ display: 'flex', gap: 0 }}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && consent && handleSubscribe()}
                  style={{
                    padding: '14px 18px', width: 260,
                    background: 'rgba(255,255,255,0.12)',
                    border: '1px solid rgba(255,255,255,0.25)', borderRight: 'none',
                    color: '#fff', fontFamily: 'Inter, sans-serif', fontSize: 14, outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={handleSubscribe}
                  disabled={submitting || !consent}
                  style={{
                    padding: '14px 24px', background: '#fff', color: '#1E4FBF',
                    fontFamily: 'Inter, sans-serif', fontWeight: 700,
                    fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
                    border: 'none', cursor: consent ? 'pointer' : 'not-allowed', whiteSpace: 'nowrap',
                    opacity: consent ? 1 : 0.6,
                  }}
                >
                  Subscribe Free
                </button>
              </div>
              <NewsletterConsentCheckbox
                checked={consent}
                onChange={setConsent}
                labelStyle={{ color: 'rgba(255,255,255,0.85)' }}
                linkStyle={{ color: '#fff', textDecoration: 'underline' }}
              />
            </div>
          )}
        </div>

      </div>
    </section>
  )
}
