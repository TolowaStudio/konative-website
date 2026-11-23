'use client'

import { useState } from 'react'
import Link from 'next/link'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

const dealTypes = [
  {
    title: 'Powered Land',
    tag: 'Ground Lease / Acquisition',
    desc: 'Off-market parcels with transmission access. Ideal for long-dated ground lease, outright acquisition, or option-to-buy structure. We source sites that never hit the open market.',
    metrics: [
      { label: 'Typical site size', val: '200–2,000+ acres' },
      { label: 'Power access', val: '115kV – 500kV' },
      { label: 'Deal structure', val: 'Ground lease or fee simple' },
    ],
  },
  {
    title: 'Build-to-Suit',
    tag: 'Development Capital',
    desc: 'We source the site, structure the deal, manage entitlements and construction on behalf of capital partners. You bring the equity; we bring the project.',
    metrics: [
      { label: 'Target capacity', val: '20 – 200+ MW' },
      { label: 'Timeline', val: '18–36 months to operational' },
      { label: 'Exit', val: 'Sale-leaseback or hold' },
    ],
  },
  {
    title: 'Stabilized Assets',
    tag: 'Operating Portfolio',
    desc: 'Stabilized data center facilities with long-term hyperscaler or colo tenancy. Long WALT, investment-grade counterparties, essential infrastructure exposure.',
    metrics: [
      { label: 'Tenancy', val: 'Hyperscaler / Colo operator' },
      { label: 'Lease structure', val: 'NNN, 10–20 year terms' },
      { label: 'Geography', val: 'Tier 1 & emerging US/CA markets' },
    ],
  },
]

const why = [
  { num: '01', head: 'Off-market sourcing', body: 'We find powered land before it reaches the broker network. Most of what we transact never gets listed.' },
  { num: '02', head: 'Principal-level access', body: 'Every investor relationship is handled by a Konative principal. No associates, no handoffs, no SDR queue.' },
  { num: '03', head: 'Operator relationships', body: 'Terry Van Roekel leads revenue and strategic development. His network spans hyperscalers, REITs, and mission-critical developers across North America.' },
  { num: '04', head: 'Full-stack execution', body: 'We source, structure, and manage the deal — power analysis, due diligence, buyer matching, and close. One team, end to end.' },
]

export default function InvestPage() {
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormState('submitting')
    const data = Object.fromEntries(new FormData(e.currentTarget))
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, inquiryType: 'investor' }),
      })
      if (!res.ok) throw new Error('Submit failed')
      setFormState('success')
    } catch {
      setErrorMsg('Something went wrong. Try again or email deals@konative.com.')
      setFormState('error')
    }
  }

  return (
    <div style={{ background: '#0C2046', minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '100px 48px 80px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          fontFamily: 'Inter, sans-serif', fontWeight: 600,
          fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase',
          color: '#C8001F', marginBottom: 20,
        }}>
          <span style={{ display: 'block', width: 28, height: 1, background: '#C8001F' }} />
          For Capital Partners
        </div>

        <h1 style={{
          fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800,
          fontSize: 'clamp(44px, 5.5vw, 80px)', lineHeight: 0.9,
          textTransform: 'uppercase', color: '#fff',
          letterSpacing: '0.01em', marginBottom: 20,
        }}>
          DEPLOY CAPITAL INTO<br />
          <span style={{ color: '#C8001F' }}>THE AI BUILDOUT.</span>
        </h1>

        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: 16, lineHeight: 1.7,
          color: 'rgba(255,255,255,0.5)', maxWidth: 600, marginBottom: 0,
        }}>
          Konative sources, structures, and manages data center land investments for family offices,
          private equity, and infrastructure funds. Powered land, build-to-suit, and operating
          assets across North America — mostly off-market.
        </p>
      </div>

      {/* Deal type cards */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 48px' }}>
        <div style={{
          fontFamily: 'Inter, sans-serif', fontWeight: 600,
          fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.3)', marginBottom: 20,
        }}>
          Deal Types
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 80 }}>
          {dealTypes.map((d, i) => (
            <div key={i} style={{
              background: '#0C2046', padding: '36px 32px',
              borderTop: i === 0 ? '3px solid #C8001F' : '3px solid transparent',
            }}>
              <div style={{
                fontFamily: 'Inter, sans-serif', fontWeight: 600,
                fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase',
                color: '#C8001F', marginBottom: 12,
              }}>
                {d.tag}
              </div>
              <div style={{
                fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700,
                fontSize: 26, textTransform: 'uppercase', color: '#fff',
                lineHeight: 1, marginBottom: 14,
              }}>
                {d.title}
              </div>
              <p style={{
                fontFamily: 'Inter, sans-serif', fontSize: 13,
                lineHeight: 1.7, color: 'rgba(255,255,255,0.45)', marginBottom: 24,
              }}>
                {d.desc}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 20 }}>
                {d.metrics.map((m, j) => (
                  <div key={j} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em' }}>
                      {m.label}
                    </span>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
                      {m.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Konative */}
      <div style={{ background: 'rgba(255,255,255,0.03)', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 48px' }}>
          <div style={{
            fontFamily: 'Inter, sans-serif', fontWeight: 600,
            fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)', marginBottom: 48,
          }}>
            Why Konative
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '40px 80px' }}>
            {why.map((w) => (
              <div key={w.num} style={{ display: 'flex', gap: 20 }}>
                <span style={{
                  fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700,
                  fontSize: 32, color: '#C8001F', lineHeight: 1, minWidth: 36,
                }}>
                  {w.num}
                </span>
                <div>
                  <div style={{
                    fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700,
                    fontSize: 20, textTransform: 'uppercase', color: '#fff',
                    lineHeight: 1, marginBottom: 8,
                  }}>
                    {w.head}
                  </div>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, lineHeight: 1.7, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
                    {w.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact form */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 48px 120px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80 }}>
        <div>
          <div style={{
            fontFamily: 'Inter, sans-serif', fontWeight: 600,
            fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
            color: '#C8001F', marginBottom: 16,
          }}>
            Investor Inquiry
          </div>
          <h2 style={{
            fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800,
            fontSize: 40, textTransform: 'uppercase', color: '#fff',
            lineHeight: 0.95, marginBottom: 16,
          }}>
            READY TO TALK<br />CAPITAL?
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.4)', marginBottom: 0 }}>
            Fill out this form or email <a href="mailto:deals@konative.com" style={{ color: '#C8001F', textDecoration: 'none' }}>deals@konative.com</a> directly.
            A principal will respond within one business day.
          </p>
        </div>

        <div>
          {formState === 'success' ? (
            <div style={{ padding: '40px 0' }}>
              <div style={{
                fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700,
                fontSize: 28, textTransform: 'uppercase', color: '#fff', marginBottom: 12,
              }}>
                WE&rsquo;LL BE IN TOUCH.
              </div>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>
                Inquiry received. Expect a response within one business day.
              </p>
              <Link href="/" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C8001F', textDecoration: 'none' }}>
                ← Back to home
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={labelStyle}>Full Name *</label>
                  <input type="text" name="name" required style={inputStyle} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={labelStyle}>Email *</label>
                  <input type="email" name="email" required style={inputStyle} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={labelStyle}>Organization / Fund</label>
                <input type="text" name="organization" style={inputStyle} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={labelStyle}>Capital type</label>
                <select name="capitalType" style={inputStyle}>
                  <option value="">Select…</option>
                  <option value="family_office">Family office</option>
                  <option value="pe_fund">Private equity / infrastructure fund</option>
                  <option value="reit">REIT / public vehicle</option>
                  <option value="pension_sovereign">Pension / sovereign wealth</option>
                  <option value="corporate">Corporate / strategic</option>
                  <option value="individual_hni">Individual / HNI</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={labelStyle}>Interested in</label>
                <select name="dealInterest" style={inputStyle}>
                  <option value="">Select…</option>
                  <option value="powered_land">Powered land (ground lease / acquisition)</option>
                  <option value="build_to_suit">Build-to-suit development</option>
                  <option value="stabilized_assets">Stabilized operating assets</option>
                  <option value="all_of_above">Open to all of the above</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={labelStyle}>Message</label>
                <textarea name="message" rows={4} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Investment thesis, check size, target markets, timeline — anything helpful" />
              </div>

              {formState === 'error' && (
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#f87171', margin: 0 }}>{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={formState === 'submitting'}
                style={{
                  padding: '16px 40px', background: '#C8001F', color: '#fff',
                  border: 'none', fontFamily: 'Inter, sans-serif', fontWeight: 700,
                  fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.16em',
                  cursor: formState === 'submitting' ? 'not-allowed' : 'pointer',
                  opacity: formState === 'submitting' ? 0.7 : 1, alignSelf: 'flex-start',
                }}
              >
                {formState === 'submitting' ? 'Sending…' : 'Submit Inquiry →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'Inter, sans-serif', fontWeight: 500,
  fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.4)',
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
  color: '#fff', fontFamily: 'Inter, sans-serif', fontSize: 14,
  padding: '12px 16px', outline: 'none', borderRadius: 0,
  width: '100%', boxSizing: 'border-box',
}
