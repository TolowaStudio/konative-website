'use client'

import { useState } from 'react'
import { NewsletterConsentCheckbox } from '@/components/NewsletterConsentCheckbox'

const ISO_REGIONS = [
  { name: 'PJM', full: 'Mid-Atlantic & Midwest', states: 'PA, OH, IL, NJ + 10 more', cap: '185 GW', status: 'MONITORING' },
  { name: 'CAISO', full: 'California', states: 'CA', cap: '80 GW', status: 'CONSTRAINED' },
  { name: 'ERCOT', full: 'Texas', states: 'TX', cap: '102 GW', status: 'MONITORING' },
  { name: 'MISO', full: 'Central US & Canada', states: 'MN, IN, MI + 12 more', cap: '196 GW', status: 'MONITORING' },
  { name: 'NYISO', full: 'New York', states: 'NY', cap: '40 GW', status: 'CONSTRAINED' },
  { name: 'ISONE', full: 'New England', states: 'MA, CT, ME + 4 more', cap: '34 GW', status: 'CONSTRAINED' },
  { name: 'SPP', full: 'Great Plains', states: 'KS, OK, NE + 8 more', cap: '95 GW', status: 'MONITORING' },
  { name: 'IESO', full: 'Ontario, Canada', states: 'Ontario', cap: '38 GW', status: 'MONITORING' },
]

const statusColor = (s: string) => s === 'MONITORING' ? '#4ade80' : '#ef4444'

export default function PowerMarketsPage() {
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!consent) return
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'power_markets_early_access', consent: true }),
      })
      if (res.ok) setSubmitted(true)
    } catch (_) {
      // silent
    }
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: '#FFFFFF' }}>
      {/* Page Header */}
      <section style={{ backgroundColor: '#0A0A0A', padding: '80px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: '#C8001F',
            marginBottom: 16,
            marginTop: 0,
          }}>
            POWER MARKETS
          </p>
          <h1 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(48px, 7vw, 88px)',
            lineHeight: 0.92,
            textTransform: 'uppercase',
            color: '#FFFFFF',
            letterSpacing: '0.01em',
            margin: 0,
          }}>
            <span style={{ color: '#C8001F' }}>POWER</span> IS THE CONSTRAINT.<br />WE TRACK IT.
          </h1>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 16,
            lineHeight: 1.6,
            color: 'rgba(255,255,255,0.55)',
            maxWidth: 580,
            marginTop: 16,
            marginBottom: 0,
          }}>
            Real-time availability data across 8 ISO regions — PJM, CAISO, ERCOT, MISO, NYISO, ISONE, SPP, IESO. Interconnection queue depth, capacity utilization, and new-build opportunity scores.
          </p>
          <div style={{
            marginTop: 32,
            display: 'inline-block',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            backgroundColor: '#C8001F',
            color: '#FFFFFF',
            padding: '6px 16px',
          }}>
            LIVE DATA LAUNCHING Q3 2026
          </div>
        </div>
      </section>

      {/* Status Legend */}
      <section style={{
        backgroundColor: '#F2F0EB',
        padding: '20px 32px',
        borderBottom: '1px solid #E0DDD8',
      }}>
        <div style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'row',
          gap: 32,
          alignItems: 'center',
        }}>
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: '#666666',
          }}>
            GRID STATUS:
          </span>
          <div style={{ display: 'flex', flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#4ade80', flexShrink: 0 }} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#555555' }}>
              MONITORING — Capacity available
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ef4444', flexShrink: 0 }} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#555555' }}>
              CONSTRAINED — Interconnection queue depth critical
            </span>
          </div>
        </div>
      </section>

      {/* ISO Regions Grid */}
      <section style={{ backgroundColor: '#0A0A0A', padding: '64px 32px 120px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 1,
            backgroundColor: 'rgba(255,255,255,0.06)',
          }}>
            {ISO_REGIONS.map((r) => (
              <div key={r.name} style={{ backgroundColor: '#1A1A1A', padding: '32px 28px' }}>
                {/* Header row */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 12,
                }}>
                  <span style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 800,
                    fontSize: 36,
                    color: '#FFFFFF',
                    textTransform: 'uppercase',
                    lineHeight: 1,
                  }}>
                    {r.name}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: statusColor(r.status),
                      flexShrink: 0,
                    }} />
                    <span style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      fontSize: 9,
                      letterSpacing: '0.1em',
                      color: statusColor(r.status),
                    }}>
                      {r.status}
                    </span>
                  </div>
                </div>

                {/* Full name */}
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.4)',
                  margin: '0 0 4px',
                }}>
                  {r.full}
                </p>

                {/* States */}
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.25)',
                  margin: '0 0 20px',
                }}>
                  {r.states}
                </p>

                {/* Skeleton chart */}
                <div style={{
                  height: 40,
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <span style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 11,
                    color: 'rgba(255,255,255,0.2)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}>
                    DATA Q3 2026
                  </span>
                </div>

                {/* Capacity row */}
                <div style={{ display: 'flex', gap: 24 }}>
                  <div>
                    <span style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 700,
                      fontSize: 22,
                      color: '#FFFFFF',
                    }}>
                      {r.cap}
                    </span>
                    <span style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 9,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: 'rgba(255,255,255,0.3)',
                      display: 'block',
                      marginTop: 2,
                    }}>
                      Total Capacity
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detail Section */}
      <section style={{ backgroundColor: '#F2F0EB', padding: '80px 32px' }}>
        <div style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 80,
          alignItems: 'center',
        }}>
          {/* Left */}
          <div>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: '#C8001F',
              marginBottom: 16,
              marginTop: 0,
            }}>
              DATA METHODOLOGY
            </p>
            <h2 style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(32px, 4vw, 52px)',
              lineHeight: 0.92,
              textTransform: 'uppercase',
              color: '#111111',
              letterSpacing: '0.01em',
              margin: 0,
            }}>
              HOW WE TRACK<br /><span style={{ color: '#C8001F' }}>GRID AVAILABILITY</span>
            </h2>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 15,
              lineHeight: 1.7,
              color: '#555555',
              maxWidth: 480,
              marginTop: 16,
              marginBottom: 0,
            }}>
              Konative monitors interconnection queue depth, available capacity headroom, and new-build approval timelines across all 8 North American ISO regions. Data aggregated from FERC filings, ISO queue reports, and primary source monitoring.
            </p>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {[
              { num: '8', label: 'ISO Regions Tracked', desc: 'All major North American power markets' },
              { num: 'Q3 2026', label: 'Live Data Launch', desc: 'Real-time interconnection queue monitoring' },
              { num: 'Daily', label: 'Update Frequency', desc: 'FERC filings + ISO reports aggregated' },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', flexDirection: 'row', gap: 24, alignItems: 'flex-start' }}>
                <span style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700,
                  fontSize: 48,
                  color: '#111111',
                  lineHeight: 1,
                  minWidth: 80,
                }}>
                  {item.num}
                </span>
                <div>
                  <p style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: 11,
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    color: '#888888',
                    marginBottom: 4,
                    marginTop: 0,
                  }}>
                    {item.label}
                  </p>
                  <p style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: '#555555',
                    margin: 0,
                  }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Early Access CTA */}
      <section style={{ backgroundColor: '#0A0A0A', padding: '80px 32px', textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(40px, 5vw, 64px)',
            textTransform: 'uppercase',
            color: '#FFFFFF',
            lineHeight: 0.92,
            marginBottom: 24,
            marginTop: 0,
          }}>
            GET <span style={{ color: '#C8001F' }}>EARLY ACCESS</span><br />TO LIVE DATA
          </h2>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 15,
            color: 'rgba(255,255,255,0.55)',
            lineHeight: 1.6,
            maxWidth: 480,
            margin: '0 auto 32px',
          }}>
            Be first to access real-time ISO capacity data when it launches in Q3 2026. Join the waitlist.
          </p>

          {submitted ? (
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 15,
              color: '#4ade80',
              lineHeight: 1.6,
              margin: 0,
            }}>
              You're on the list. We'll reach out when live data launches.
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                maxWidth: 480,
                margin: '0 auto',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'row', gap: 0 }}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  style={{
                    flex: 1,
                    padding: '14px 16px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRight: 'none',
                    backgroundColor: '#1A1A1A',
                    color: '#FFFFFF',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 14,
                    outline: 'none',
                  }}
                />
                <button
                  type="submit"
                  disabled={!consent}
                  style={{
                    padding: '14px 28px',
                    backgroundColor: '#C8001F',
                    color: '#FFFFFF',
                    border: 'none',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: 12,
                    textTransform: 'uppercase',
                    cursor: consent ? 'pointer' : 'not-allowed',
                    letterSpacing: '0.08em',
                    whiteSpace: 'nowrap',
                    opacity: consent ? 1 : 0.6,
                  }}
                >
                  GET EARLY ACCESS
                </button>
              </div>
              <NewsletterConsentCheckbox
                checked={consent}
                onChange={setConsent}
                labelStyle={{ color: 'rgba(255,255,255,0.75)' }}
                linkStyle={{ color: '#fff', textDecoration: 'underline' }}
              />
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
