import { bookingUrl } from "@/lib/booking";
import type { Metadata } from 'next'
import Link from 'next/link'
import HeroBackdrop from '@/components/marketing/HeroBackdrop'

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Partners — Konative',
  description:
    'The Konative Partner Ticker — a curated, vetted bench of capital, legal, energy, modular, connectivity, and GTM partners working alongside Konative on responsible MDC development.',
}

type Partner = {
  name: string
  role: string
  url?: string
  blurb: string
  founding?: boolean
  inaugural?: boolean
  comingSoon?: boolean
}

const PARTNERS: Partner[] = [
  {
    name: 'Tolowa Studio',
    role: 'GTM & Web — MOTION Framework',
    url: 'https://tolowastudio.com',
    blurb:
      "Tolowa Studio is the AI-native venture studio behind Konative. Its MOTION framework — Business OS, Web OS, GTM OS — is what installs durable marketing, intake, and automation into modular DC partners who would rather build than learn HubSpot. Konative is MOTION's first vertical instance.",
    inaugural: true,
    founding: true,
  },
  {
    name: 'Tier IV DevCo',
    role: 'Development & Diligence',
    blurb:
      'Tier IV DevCo coordinates deal flow across the partner ecosystem and delivers behind-the-meter generation, financing, and remarketing capabilities. Konative routes qualified opportunities into T4 for diligence and execution.',
    founding: true,
    comingSoon: true,
  },
  {
    name: 'FlexDomes',
    role: 'Modular DC Structures',
    blurb:
      'FlexDomes designs and delivers modular dome data center structures — fast-build, lower-water, community-friendly. Konative\'s qualified site pipeline funnels into FlexDomes for technical fit and deployment.',
    founding: true,
    comingSoon: true,
  },
  {
    name: 'Partner slot',
    role: 'Capital — Infrastructure / Sovereign',
    blurb:
      'Reserved for one anchor capital partner aligned with responsible, community-first MDC development. Inquire below.',
    comingSoon: true,
  },
  {
    name: 'Partner slot',
    role: 'Connectivity & Network',
    blurb:
      'Reserved for one carrier/IX partner with North American footprint and behind-the-meter site experience.',
    comingSoon: true,
  },
  {
    name: 'Partner slot',
    role: 'Indigenous Energy / Tribal Enterprise',
    blurb:
      'Reserved for a partner with First Nations and tribal-enterprise track record on co-developed energy + DC builds.',
    comingSoon: true,
  },
  {
    name: 'Partner slot',
    role: 'Legal / Regulatory',
    blurb:
      'Reserved for a firm with sovereign, regulatory, and cross-border experience for hyperscale-class transactions.',
    comingSoon: true,
  },
]

function PartnerCard({ p }: { p: Partner }) {
  const ring = p.inaugural ? '#C8001F' : 'rgba(255,255,255,0.08)'
  const bg = p.inaugural ? 'linear-gradient(135deg, #0C2046 0%, #102b5a 100%)' : '#0C2046'
  return (
    <article
      style={{
        background: bg,
        border: `1px solid ${ring}`,
        borderRadius: 10,
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {p.inaugural && (
        <div style={{
          position: 'absolute', top: 14, right: 14,
          background: '#C8001F', color: '#fff',
          padding: '0.25rem 0.55rem', borderRadius: 4,
          fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em',
        }}>
          INAUGURAL SPONSOR
        </div>
      )}
      {p.comingSoon && !p.inaugural && (
        <div style={{
          position: 'absolute', top: 14, right: 14,
          background: 'rgba(255,255,255,0.06)', color: '#94a3b8',
          padding: '0.25rem 0.55rem', borderRadius: 4,
          fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em',
        }}>
          {p.founding ? 'FOUNDING — ANNOUNCING SOON' : 'OPEN SLOT'}
        </div>
      )}

      <div style={{ marginTop: p.inaugural || p.comingSoon ? '1.25rem' : 0 }}>
        <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 600, marginBottom: 4 }}>
          {p.role}
        </div>
        <h3 style={{
          fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800,
          fontSize: 'clamp(1.5rem, 2.5vw, 1.85rem)', textTransform: 'uppercase',
          letterSpacing: '0.005em', margin: 0, color: '#fff', lineHeight: 1,
        }}>
          {p.name}
        </h3>
      </div>

      <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.92rem', lineHeight: 1.6 }}>
        {p.blurb}
      </p>

      {p.url && (
        <a href={p.url} target="_blank" rel="noopener noreferrer"
           style={{ color: '#C8001F', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', marginTop: 'auto' }}>
          Visit {p.name} →
        </a>
      )}
    </article>
  )
}

export default function PartnersPage() {
  return (
    <div style={{ background: '#08142D', color: '#f6f7fb', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', background: '#08142D', padding: '5rem 2rem 3rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <HeroBackdrop
          src="https://images.unsplash.com/photo-1606814540563-5c02d62fd409?auto=format&fit=crop&w=2000&q=70"
          alt="Blue light passing over fiber-optic carrier network cabling"
        />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#C8001F', fontSize: 11, fontWeight: 600, letterSpacing: '0.24em', textTransform: 'uppercase', marginBottom: 18 }}>
            <span style={{ width: 28, height: 1, background: '#C8001F' }} />
            The Partner Ticker
          </div>
          <h1 style={{ fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800, fontSize: 'clamp(2.4rem, 6vw, 4.5rem)', lineHeight: 0.95, margin: 0, letterSpacing: '0.005em', textTransform: 'uppercase' }}>
            A small bench of vetted partners.<br />
            <span style={{ color: '#C8001F' }}>No pay-to-play.</span>
          </h1>
          <p style={{ marginTop: '1.5rem', color: '#cbd5e1', fontSize: '1.1rem', lineHeight: 1.65, maxWidth: 760 }}>
            Konative routes qualified opportunities to a curated bench of partners across capital, modular, connectivity, energy, legal, and GTM. Every partner is collectively vetted for community-first, low-water, behind-the-meter alignment. We keep it small on purpose.
          </p>
          <div style={{ marginTop: '1.75rem', display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <Link href="/contact" style={{ background: '#C8001F', color: '#fff', padding: '0.7rem 1.2rem', borderRadius: 6, textDecoration: 'none', fontWeight: 700, fontSize: '0.875rem' }}>
              Apply to be a partner →
            </Link>
            <Link href="/reality-vs-press" style={{ background: 'transparent', border: '1px solid #334155', color: '#f6f7fb', padding: '0.7rem 1.2rem', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>
              See our editorial standards →
            </Link>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section style={{ padding: '3rem 2rem 4rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {PARTNERS.map(p => <PartnerCard key={p.name + p.role} p={p} />)}
        </div>
      </section>

      {/* Standards */}
      <section style={{ padding: '3rem 2rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 600, marginBottom: 12 }}>
            Partner standards
          </div>
          <h2 style={{ fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', textTransform: 'uppercase', letterSpacing: '0.005em', margin: '0 0 1rem' }}>
            What it takes to be in the ticker
          </h2>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {[
              ['Community-first', 'No drop-and-run projects. Local consent and benefit are real prerequisites.'],
              ['Low-water-by-design', 'Closed-loop, air-cooled, or otherwise water-light. We don\'t route deals that drain watersheds.'],
              ['Behind-the-meter capable', 'Or willing to use it. Grid-only thinking is the slowest path.'],
              ['Indigenous-partnership literate', 'Co-development, real consultation, durable equity structures.'],
              ['Editorial independence', 'Sponsorship does not buy a Reality Score. Period.'],
              ['Quality over quantity', 'We keep the bench small on purpose. Each role has one or two seats.'],
            ].map(([h, b]) => (
              <li key={h} style={{ background: '#0C2046', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '1rem' }}>
                <div style={{ fontWeight: 700, color: '#fff', marginBottom: 4 }}>{h}</div>
                <div style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.55 }}>{b}</div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, #08142D 0%, #0C2046 100%)', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '3.5rem 2rem' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800, fontSize: '2rem', textTransform: 'uppercase', letterSpacing: '0.005em', margin: '0 0 0.75rem' }}>
            Want a seat on the ticker?
          </h2>
          <p style={{ color: '#cbd5e1', margin: '0 0 1.75rem', fontSize: '1rem', lineHeight: 1.65 }}>
            We add partners by invitation and collective vetting. If you align with the standards above and want to be considered, send a one-paragraph note.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={bookingUrl("partners")} target="_blank" rel="noopener noreferrer" style={{ background: '#C8001F', color: '#fff', padding: '0.875rem 1.75rem', borderRadius: 6, textDecoration: 'none', fontWeight: 700, fontSize: '0.9375rem' }}>
              Book a Call →
            </a>
            <Link href="/contact" style={{ background: 'transparent', color: '#f6f7fb', padding: '0.875rem 1.75rem', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: '0.9375rem', border: '1px solid #334155' }}>
              Apply via Contact
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
