import { bookingUrl } from "@/lib/booking";
import type { Metadata } from 'next'
import Link from 'next/link'
import HeroBackdrop from '@/components/marketing/HeroBackdrop'

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Gulf Capital Tracker — Saudi & UAE AI Infrastructure | Konative',
  description: 'Konative\'s tracker on Gulf sovereign capital flowing into AI data center infrastructure: HUMAIN, MGX, G42, DataVolt, QIA. Site selection, capital flows, and partnership pipelines.',
}

const ENTITIES = [
  {
    name: 'HUMAIN',
    parent: 'PIF (Saudi Public Investment Fund)',
    launchedNote: 'Launched May 2025',
    headlineNumber: 'C$10B over 5 years',
    headline: 'AMD PARTNERSHIP — 500 MW BUILD ACROSS SAUDI + US',
    summary: 'HUMAIN is the centerpiece of PIF\'s AI infrastructure thesis. Targeting 1.9 GW installed by 2030, 6 GW by 2034. AMD partnership commits up to US$10B over five years to deploy 500 MW of AI compute across Saudi Arabia AND the United States. Blackstone JV adds another US$3B. Already secured up to US$1.2B in additional facility financing.',
    builds: [
      { name: 'AMD-powered AI compute', location: 'Saudi Arabia + United States', mw: '500 MW', status: 'Active build, 5-year commitment' },
      { name: 'stc / centre3 JV', location: 'Saudi Arabia', mw: 'Up to 1 GW AI workloads', status: 'JV announced; build underway' },
      { name: 'xAI Saudi DC', location: 'Saudi Arabia', mw: '500 MW', status: 'Announced with Elon Musk\'s xAI' },
      { name: 'Al Moammar (MIS) build', location: 'Saudi Arabia', mw: 'TBD', status: 'Design + build contract awarded 2025' },
    ],
    konativeAngle: 'HUMAIN US site selection is the single highest-leverage RFP in the Gulf-to-NA pipeline. AMD\'s NA data center footprint will need power, water, and land. Konative covers the markets where 500 MW will land.',
  },
  {
    name: 'MGX × AIP × BlackRock GIP',
    parent: 'Mubadala (Abu Dhabi) + G42',
    launchedNote: 'MGX launched March 2024',
    headlineNumber: 'US$40B',
    headline: 'ALIGNED DATA CENTERS ACQUISITION — LARGEST DC DEAL EVER',
    summary: 'In October 2025, MGX joined BlackRock\'s GIP and AI Infrastructure Partners (AIP) to acquire Aligned Data Centers from Macquarie Asset Management for US$40B. Deal closes H1 2026. Aligned operates 50+ campuses across North and Latin America — instantly making this consortium one of the largest hyperscale operators on the continent.',
    builds: [
      { name: 'Aligned Data Centers (Cornerstone)', location: 'North + Latin America (50+ sites)', mw: 'Multi-GW operating + pipeline', status: 'Acquisition closing H1 2026' },
      { name: 'New site pipeline', location: 'NA expansion', mw: 'TBD — multi-GW commitment', status: 'Aligned\'s existing land bank + new acquisitions' },
    ],
    konativeAngle: 'Aligned\'s under-AIP-management pipeline = the largest single source of Gulf-funded DC capacity expansion in NA. New land near Aligned\'s existing campuses (Phoenix, Dallas, Salt Lake City, Ashburn, Chicago) becomes immediately strategic. Konative is sourcing landholders in those markets right now.',
  },
  {
    name: 'G42 / Stargate UAE',
    parent: 'Abu Dhabi sovereign + OpenAI + Oracle + NVIDIA + SoftBank + Cisco',
    launchedNote: 'Announced May 2025',
    headlineNumber: '5 GW total / 200 MW Q3 2026',
    headline: 'LARGEST AI CAMPUS OUTSIDE THE US',
    summary: 'Stargate UAE is a 5 GW AI infrastructure cluster being built outside Abu Dhabi. First phase (200 MW) goes live Q3 2026. The full 1 GW campus runs on nuclear, solar, and natural gas. The UAE-US AI Acceleration Partnership specifically allows reciprocal US compute capacity buildouts under sovereign-AI security frameworks — meaning G42 builds in the US too.',
    builds: [
      { name: 'Stargate UAE Phase 1', location: 'Abu Dhabi', mw: '200 MW', status: 'Q3 2026 RFS' },
      { name: 'Stargate UAE full campus', location: 'Abu Dhabi (10 sq mi)', mw: '5 GW', status: 'Multi-year buildout' },
      { name: 'G42 US footprint expansion', location: 'United States (TBD)', mw: 'TBD', status: 'Underway via UAE-US AI Acceleration Partnership' },
    ],
    konativeAngle: 'G42\'s US site selection follows the Stargate template: nuclear-adjacent or large gas-fired sites with co-located substations. Watch for site announcements in Texas (ERCOT), Pennsylvania (PJM), and the Mountain West (WECC) — all markets in Konative\'s coverage.',
  },
  {
    name: 'DataVolt',
    parent: 'Vision Invest (Saudi state holding)',
    launchedNote: 'Founded 2023',
    headlineNumber: 'US$20B US commitment',
    headline: 'SUPERMICRO PARTNERSHIP — $20B US BUILDOUT',
    summary: 'DataVolt + Supermicro announced a US$20B joint deal during the Trump administration to deliver computing power and supporting infrastructure for DataVolt data centers across the United States and Saudi Arabia. Saudi sites go live Q2 2026. NEOM\'s Oxagon DC is a US$5B 1.5 GW net-zero AI factory campus DataVolt is anchoring.',
    builds: [
      { name: 'DataVolt US sites', location: 'United States (multiple sites)', mw: 'Multi-GW pipeline', status: 'Phase 1 site selection underway' },
      { name: 'NEOM Oxagon AI factory', location: 'NEOM, Saudi Arabia', mw: '1.5 GW', status: 'Phase 1 build under DataVolt + NEOM JV' },
      { name: 'HUMAIN multi-GW JV', location: 'Saudi Arabia', mw: 'Multi-GW', status: 'Joint development announced' },
    ],
    konativeAngle: 'DataVolt is the most modular-friendly of the Gulf operators — they explicitly underwrite to net-zero designs and integrated energy. They are exactly the build partner Konative\'s thesis was designed for. NA site selection is active.',
  },
]

const TIMELINE = [
  { date: 'Mar 2024', event: 'MGX launched by Mubadala + G42', tag: 'launch' },
  { date: 'May 2025', event: 'HUMAIN launched under PIF', tag: 'launch' },
  { date: 'May 2025', event: 'Stargate UAE announced (G42 + OpenAI + Oracle + NVIDIA + SoftBank + Cisco)', tag: 'launch' },
  { date: 'Aug 2025', event: 'HUMAIN secures up to $1.2B additional facility financing', tag: 'capital' },
  { date: 'Oct 2025', event: 'MGX + GIP + AIP $40B acquisition of Aligned Data Centers announced', tag: 'm&a' },
  { date: 'Q4 2025', event: 'HUMAIN first 50 MW operational target', tag: 'build' },
  { date: 'Q2 2026', event: 'DataVolt Saudi sites go live', tag: 'build' },
  { date: 'H1 2026', event: 'MGX/AIP/GIP × Aligned acquisition closes — Aligned becomes Gulf-controlled hyperscale platform', tag: 'm&a' },
  { date: 'Q3 2026', event: 'Stargate UAE Phase 1 (200 MW) goes live', tag: 'build' },
  { date: '2026 ongoing', event: 'HUMAIN +50 MW per quarter through 2026', tag: 'build' },
  { date: '2030', event: 'HUMAIN 1.9 GW installed target', tag: 'milestone' },
  { date: '2034', event: 'HUMAIN 6 GW installed target', tag: 'milestone' },
]

const TAG_COLORS: Record<string, string> = {
  launch: '#a78bfa',
  capital: '#22c55e',
  'm&a': '#f59e0b',
  build: '#3b82f6',
  milestone: '#ec4899',
}

export default function SaudiTrackerPage() {
  return (
    <div style={{ background: '#0b1020', minHeight: '100vh', color: '#f6f7fb', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '4rem 2rem 3rem', borderBottom: '1px solid #1e293b', background: 'linear-gradient(180deg, #0f1728 0%, #0b1020 100%)' }}>
        <HeroBackdrop
          src="https://images.unsplash.com/photo-1674606071893-2a9023075f70?auto=format&fit=crop&w=2000&q=70"
          alt="A large array of solar panels across a desert, Gulf energy infrastructure"
        />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 960, margin: '0 auto' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C8001F', marginBottom: '0.75rem' }}>
            Intelligence · Gulf Capital Tracker
          </p>
          <h1 style={{ fontSize: 'clamp(2.25rem, 5.5vw, 3.5rem)', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, margin: '0 0 1rem', letterSpacing: '-0.01em', lineHeight: 1.05 }}>
            ~$80 BILLION FROM THE GULF, FLOWING INTO NORTH AMERICAN AI INFRASTRUCTURE
          </h1>
          <p style={{ color: '#94a3b8', maxWidth: 720, lineHeight: 1.65, margin: '0 0 1.5rem', fontSize: '1.0625rem' }}>
            Saudi PIF (HUMAIN), Abu Dhabi sovereign capital (MGX, Mubadala, G42), and Saudi state holdings (Vision Invest / DataVolt) have collectively committed $70–80B to data center infrastructure with material US exposure. The MGX/AIP/GIP acquisition of Aligned Data Centers alone is the largest DC transaction in history at $40B. This is Konative&apos;s tracker on what they&apos;re building, where, and with whom.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a href={bookingUrl("intelligence-saudi")} target="_blank" rel="noopener noreferrer" style={{ background: '#C8001F', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>
              Discuss a Site for a Gulf-Funded Build →
            </a>
            <Link href="/methodology" style={{ background: 'transparent', color: '#f6f7fb', padding: '0.75rem 1.5rem', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem', border: '1px solid #334155' }}>
              How We Score Sites
            </Link>
          </div>
        </div>
      </section>

      {/* Top stats */}
      <section style={{ padding: '2.5rem 2rem', borderBottom: '1px solid #1e293b' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          {[
            { v: '$40B', l: 'MGX/AIP/GIP × Aligned acquisition' },
            { v: '$20B', l: 'DataVolt × Supermicro US commitment' },
            { v: '$10B', l: 'AMD × HUMAIN compute partnership' },
            { v: '5 GW', l: 'Stargate UAE total capacity' },
            { v: '6 GW', l: 'HUMAIN 2034 installed target' },
            { v: '500 MW', l: 'HUMAIN/AMD US capacity (5 yr)' },
          ].map(s => (
            <div key={s.l} style={{ background: '#0f1728', border: '1px solid #1e293b', borderRadius: 8, padding: '1.25rem' }}>
              <div style={{ fontSize: '1.875rem', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, color: '#C8001F', lineHeight: 1, marginBottom: '0.4rem' }}>{s.v}</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Entities */}
      <section style={{ padding: '4rem 2rem' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#64748b', marginBottom: '0.5rem', fontWeight: 600 }}>
            Entities Konative Tracks
          </p>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, margin: '0 0 2.5rem', letterSpacing: '-0.005em' }}>
            FOUR PLAYS, FOUR DIFFERENT US POSTURES
          </h2>

          {ENTITIES.map((e, i) => (
            <div key={e.name} style={{ marginBottom: '3rem', borderTop: i === 0 ? 'none' : '1px solid #1e293b', paddingTop: i === 0 ? 0 : '3rem' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1.75rem', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, margin: 0, color: '#C8001F', letterSpacing: '0.01em' }}>
                  {e.name.toUpperCase()}
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {e.parent} · {e.launchedNote}
                </span>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#22c55e', margin: '0 0 0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                {e.headlineNumber}
              </p>
              <h4 style={{ fontSize: '1.125rem', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 600, margin: '0 0 0.75rem', letterSpacing: '0.01em' }}>
                {e.headline}
              </h4>
              <p style={{ color: '#cbd5e1', margin: '0 0 1.25rem', fontSize: '1rem', lineHeight: 1.7 }}>{e.summary}</p>

              <div style={{ background: '#0f1728', border: '1px solid #1e293b', borderRadius: 8, padding: '1rem', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', marginBottom: '0.6rem' }}>Active builds + commitments</div>
                <div style={{ display: 'grid', gap: '0.6rem' }}>
                  {e.builds.map(b => (
                    <div key={b.name} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '1rem', alignItems: 'baseline', fontSize: '0.85rem', borderBottom: '1px dashed #1e293b', paddingBottom: '0.4rem' }}>
                      <div>
                        <div style={{ color: '#f6f7fb', fontWeight: 500 }}>{b.name}</div>
                        <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{b.location}</div>
                      </div>
                      <div style={{ color: '#C8001F', fontWeight: 600, whiteSpace: 'nowrap' }}>{b.mw}</div>
                      <div style={{ color: '#94a3b8', fontSize: '0.75rem', textAlign: 'right', maxWidth: 200 }}>{b.status}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: '#052e16', border: '1px solid #14532d', borderRadius: 8, padding: '0.875rem' }}>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#22c55e', marginBottom: '0.4rem', fontWeight: 600 }}>Konative angle</div>
                <p style={{ margin: 0, color: '#dcfce7', fontSize: '0.9rem', lineHeight: 1.65 }}>{e.konativeAngle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section style={{ padding: '4rem 2rem', borderTop: '1px solid #1e293b', background: '#0f1728' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#64748b', marginBottom: '0.5rem', fontWeight: 600 }}>
            Activity Timeline
          </p>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, margin: '0 0 2rem', letterSpacing: '-0.005em' }}>
            THE GULF-TO-NA AI INFRASTRUCTURE TIMELINE
          </h2>

          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {TIMELINE.map(t => {
              const color = TAG_COLORS[t.tag] ?? '#64748b'
              return (
                <div key={`${t.date}-${t.event}`} style={{ display: 'grid', gridTemplateColumns: '120px auto 1fr', gap: '1rem', alignItems: 'baseline', background: '#0b1020', border: '1px solid #1e293b', borderRadius: 6, padding: '0.75rem 1rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>{t.date}</span>
                  <span style={{ fontSize: '0.65rem', color: color, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, background: `${color}15`, padding: '2px 8px', borderRadius: 3 }}>{t.tag}</span>
                  <span style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: 1.5 }}>{t.event}</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section style={{ background: 'linear-gradient(135deg, #08142D 0%, #0C2046 100%)', borderTop: '1px solid #1e293b', padding: '3.5rem 2rem' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, margin: '0 0 0.75rem', letterSpacing: '-0.01em' }}>
            WEEKLY GULF CAPITAL TRACKER → YOUR INBOX
          </h2>
          <p style={{ color: '#cbd5e1', margin: '0 0 1.75rem', lineHeight: 1.65, fontSize: '1rem' }}>
            One short email per week: new commitments, new sites, capital movements, and what they mean for North American DC site selection. No filler.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/news" style={{ background: '#C8001F', color: '#fff', padding: '0.875rem 1.75rem', borderRadius: 6, textDecoration: 'none', fontWeight: 700, fontSize: '0.9375rem' }}>
              Subscribe →
            </Link>
            <a href={bookingUrl("intelligence-saudi")} target="_blank" rel="noopener noreferrer" style={{ background: 'transparent', color: '#f6f7fb', padding: '0.875rem 1.75rem', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: '0.9375rem', border: '1px solid #334155' }}>
              Book a Call
            </a>
          </div>
          <p style={{ color: '#475569', fontSize: '0.75rem', marginTop: '2rem' }}>
            Last updated: April 2026. Tracker refreshed weekly via Konative&apos;s Saudi feed automation. <Link href="/methodology" style={{ color: '#94a3b8', textDecoration: 'underline' }}>How we score the sites these dollars are chasing →</Link>
          </p>
        </div>
      </section>
    </div>
  )
}
