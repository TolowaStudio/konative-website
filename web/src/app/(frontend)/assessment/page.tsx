'use client'

const TOOL_URL = 'https://t4-infra-eval.vercel.app/'

const criteria = [
  { label: 'Power availability', desc: 'Transmission access, substation proximity, available MW' },
  { label: 'Fiber connectivity', desc: 'On-net, near-net, or off-net status and path options' },
  { label: 'Site characteristics', desc: 'Acreage, zoning, topography, flood / environmental risk' },
  { label: 'Development readiness', desc: 'Entitlements, permitting timeline, utility interconnection status' },
  { label: 'Market positioning', desc: 'Demand signals, comparable transactions, buyer appetite by region' },
]

export default function AssessmentPage() {
  return (
    <div style={{ background: '#0C2046', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '100px 48px 0' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          fontFamily: 'Inter, sans-serif', fontWeight: 600,
          fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase',
          color: '#C8001F', marginBottom: 20,
        }}>
          <span style={{ display: 'block', width: 28, height: 1, background: '#C8001F' }} />
          Site Evaluation Tool
        </div>

        <h1 style={{
          fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800,
          fontSize: 'clamp(44px, 5.5vw, 80px)', lineHeight: 0.9,
          textTransform: 'uppercase', color: '#fff',
          letterSpacing: '0.01em', marginBottom: 20,
        }}>
          KNOW WHAT YOUR<br />
          <span style={{ color: '#C8001F' }}>SITE IS WORTH.</span>
        </h1>

        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: 16, lineHeight: 1.7,
          color: 'rgba(255,255,255,0.5)', maxWidth: 600, marginBottom: 60,
        }}>
          Our infrastructure evaluation tool scores any parcel against the five factors
          data center developers actually care about — power, fiber, site characteristics,
          development readiness, and market demand.
        </p>
      </div>

      {/* Two-column layout */}
      <div style={{
        maxWidth: 1100, margin: '0 auto', padding: '0 48px 120px',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80,
      }}>
        {/* Left — criteria list */}
        <div>
          <div style={{
            fontFamily: 'Inter, sans-serif', fontWeight: 600,
            fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)', marginBottom: 28,
          }}>
            What gets evaluated
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {criteria.map((item, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.03)',
                borderLeft: '3px solid #C8001F',
                padding: '18px 24px',
                display: 'flex', flexDirection: 'column', gap: 4,
              }}>
                <div style={{
                  fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700,
                  fontSize: 17, textTransform: 'uppercase', color: '#fff', letterSpacing: '0.02em',
                }}>
                  {item.label}
                </div>
                <div style={{
                  fontFamily: 'Inter, sans-serif', fontSize: 13,
                  color: 'rgba(255,255,255,0.4)', lineHeight: 1.5,
                }}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>

          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: 12,
            color: 'rgba(255,255,255,0.2)', marginTop: 24, lineHeight: 1.6,
          }}>
            Results include a scored summary you can share with buyers, lenders, or partners.
            No account required.
          </p>
        </div>

        {/* Right — CTA panel */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '52px 48px',
          }}>
            <div style={{
              fontFamily: 'Inter, sans-serif', fontWeight: 600,
              fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
              color: '#C8001F', marginBottom: 16,
            }}>
              Powered by Tier IV DevCo
            </div>

            <div style={{
              fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800,
              fontSize: 36, textTransform: 'uppercase', color: '#fff',
              lineHeight: 1, marginBottom: 16,
            }}>
              T4 INFRASTRUCTURE<br />EVALUATION
            </div>

            <p style={{
              fontFamily: 'Inter, sans-serif', fontSize: 14, lineHeight: 1.7,
              color: 'rgba(255,255,255,0.45)', marginBottom: 36,
            }}>
              Built by the team that has developed mission-critical data center
              projects across North America. Takes under 10 minutes. Get a scored
              readiness report you can act on.
            </p>

            <a
              href={TOOL_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block', padding: '18px 44px',
                background: '#C8001F', color: '#fff',
                fontFamily: 'Inter, sans-serif', fontWeight: 700,
                fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase',
                textDecoration: 'none', marginBottom: 16,
              }}
            >
              Launch Site Evaluator →
            </a>

            <div style={{
              fontFamily: 'Inter, sans-serif', fontSize: 11,
              color: 'rgba(255,255,255,0.2)', letterSpacing: '0.05em',
            }}>
              Opens in a new tab · No account required
            </div>
          </div>

          <div style={{
            marginTop: 24, padding: '20px 24px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px dashed rgba(255,255,255,0.08)',
          }}>
            <p style={{
              fontFamily: 'Inter, sans-serif', fontSize: 13,
              color: 'rgba(255,255,255,0.35)', margin: 0, lineHeight: 1.6,
            }}>
              After your evaluation, bring the results to Konative and we&apos;ll help you
              take next steps — whether that&apos;s finding a buyer, structuring a deal, or
              connecting with capital.{' '}
              <a href="/contact" style={{ color: '#C8001F', textDecoration: 'none' }}>
                Get in touch →
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
