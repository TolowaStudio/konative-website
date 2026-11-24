import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@sanity/client'
import HeroBackdrop from '@/components/marketing/HeroBackdrop'

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Canada Data Center Market — Konative',
  description: 'Konative\'s Canadian data center intelligence: provincial power markets, hyperscaler builds, First Nations partnerships, and the federal $2B Sovereign AI Compute Strategy. Site selection across Quebec, Ontario, Alberta, and BC.',
}

const PROVINCES = [
  {
    name: 'Quebec',
    iso: 'Hydro-Québec',
    capacityNote: '7× projected DC growth to 1,000+ MW by 2035',
    headline: 'HYDRO POWER + COLD CLIMATE — RE-OPENING TO AI',
    subhead: 'After a multi-year crypto moratorium, Hydro-Québec is launching a new large data centre rate (~13¢/kWh, ~2× current rates) in H2 2026, opening the door to AI infrastructure on the world\'s largest hydro grid. Microsoft has four active builds; Vantage\'s QC61 (30 MW) went live January 2026.',
    keyFacts: [
      'New large-DC rate: ~13¢/kWh (H2 2026), ~2× current large-power rate',
      'Crypto rate adjusted to 19.5¢/kWh — separate tier from AI/DC',
      'Free-cooling viable 9+ months/yr in southern Quebec; 11+ months in north',
      'Active operators: Vantage, Cologix, eStruxture, Microsoft, Equinix',
    ],
    advantage: 'Vast renewable supply (Hydro-Québec 36+ GW system), low long-run carbon, mature operator base. Best-in-class cooling economics outside Nordic Europe.',
    risk: 'Allocation framework still settling. Quebec government runs a competitive process; not all MW will clear market price.',
  },
  {
    name: 'Ontario',
    iso: 'IESO',
    capacityNote: '3 → 16 TWh DC demand by 2050 (423% growth)',
    headline: 'BIGGEST MARKET, TIGHTEST GRID',
    subhead: 'Toronto hosts ~35 existing facilities and is Canada\'s densest peering market (TORIX), but transmission near the GTA is effectively full through the late 2020s. Ontario\'s Bill 40 (2025) gives the Minister of Energy authority to prioritize DC connection requests; IESO forecasts 16 new data centres connecting in the next decade.',
    keyFacts: [
      'TORIX is the largest Canadian internet exchange — Toronto = the Canadian peering capital',
      '13% of new electricity demand through 2035 is data centres',
      'Multi-year system impact study queue; no formal numbered queue but de facto rationing',
      'Bill 40 adds an "economic growth" mandate to IESO and OEB planning',
    ],
    advantage: 'Closest Canadian market to US Northeast hyperscaler footprint; high-quality fiber; deep operator base.',
    risk: 'Sites within 100 km of GTA face the longest interconnect timelines. Eastern Ontario and the I-401 corridor toward Kingston are emerging — that\'s where Konative looks for landholder opportunities.',
  },
  {
    name: 'Alberta',
    iso: 'AESO',
    capacityNote: '30+ AI data centre projects in AESO queue (Feb 2026)',
    headline: 'BEHIND-THE-METER GAS + DEREGULATED MARKET',
    subhead: 'Alberta\'s deregulated structure makes it the only Canadian market where you can credibly co-locate generation with load behind the meter — natural gas + BESS + AESO grid backup. eStruxture\'s C$750M (US$585M) 90 MW Calgary build and AVAX One/BlueFlare\'s 10 MW HPC project are templates for the BYOP play.',
    keyFacts: [
      '30+ AI DC projects in AESO queue as of Feb 2026',
      'Behind-the-meter natural gas + BESS + grid hybrid is the dominant build pattern',
      'Calgary metro is the gravity center; Edmonton corridor expanding',
      'Alberta\'s low effective generation cost makes BYOP economics workable',
    ],
    advantage: 'Fastest path from LOI to powered land in Canada — if you bring your own generation. Existing operator footprint (eStruxture, Cologix Calgary, Compass plans).',
    risk: 'Provincial carbon policy and TIER framework apply to behind-the-meter gas at scale. Site water access is a real diligence item — Alberta is dry.',
  },
  {
    name: 'British Columbia',
    iso: 'BC Hydro',
    capacityNote: 'Capped at 100 MW for new DC + 300 MW for AI under 2026 competitive call',
    headline: 'CONSTRAINED, BUT SITE C IS FRESH MW',
    subhead: 'BC\'s Energy Ministry intends to limit new DC interconnections in 2026 to 300 MW for AI and 100 MW for general DC, banning new crypto entirely. That cap creates scarcity premium — but Site C\'s recent commissioning means there is genuinely new capacity available, and Northern BC fiber routes (BCNET) connect Vancouver to the Pacific cable landings.',
    keyFacts: [
      'Site C Dam (~1.1 GW) recently online — net-new clean MW',
      'Prophet River First Nation has LOI for major DC near Fort St. John leveraging Site C',
      'Upper Nicola Band consulting on $500M proposed AI DC',
      'Vancouver = Pacific cable landing point; cross-border to Seattle is short',
    ],
    advantage: 'Cleanest grid in Canada (>97% non-emitting). Cooling economics excellent. Direct Pacific connectivity.',
    risk: 'Smallest allocation of any major province. Most viable opportunities will be First Nations–partnered builds in the Peace region.',
  },
]

const FIRST_NATIONS_PROJECTS = [
  {
    nation: 'Woodland Cree First Nation',
    location: '~500 km NW of Edmonton, AB',
    capacity: '650 MW (phased)',
    partner: 'Sovereign Digital Infrastructure',
    structure: 'Woodland Cree owns 51% of Mihta Askiy Data Centre',
    status: 'Phase 1 startup mid-2027 on natural gas generation',
    significance: 'Largest announced Indigenous-led DC in North America. Re-uses idle power plant infrastructure.',
  },
  {
    nation: 'Prophet River First Nation',
    location: 'Near Fort St. John, BC',
    capacity: 'TBD (large-scale)',
    partner: 'ABCT Pacific Ltd',
    structure: 'Prophet River owns majority stake under LOI',
    status: 'LOI signed; leveraging Site C Dam completion',
    significance: 'Showcase of how First Nations partnerships unlock new Canadian DC capacity that the BC interconnection cap otherwise restricts.',
  },
  {
    nation: 'Upper Nicola Band',
    location: 'Interior BC',
    capacity: '$500M project value',
    partner: 'Under community consultation',
    structure: 'Lease-revenue model under evaluation',
    status: 'Community consultation phase',
    significance: 'Demonstrates First Nations evaluating DC as long-term land revenue, not just energy partnership.',
  },
  {
    nation: 'Six Nations of the Grand River, Cree Nation Government, FNMPC partners',
    location: 'Ontario / Quebec / Pan-Canada',
    capacity: 'Active opportunity assessment',
    partner: 'Konative target outreach',
    structure: 'Various — early stage',
    significance: 'Konative\'s wedge: bring US tribal-DC playbook learnings (Akwesasne, Navajo, Wind River) to Canadian First Nations conversations.',
  },
]

async function getLiveStats() {
  try {
    const sanity = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
      apiVersion: '2024-01-01',
      // Small aggregate count query, not heavy content — real-time accuracy
      // matters more than CDN latency here, and useCdn:true was serving
      // stale zeroed counts well after real project data existed.
      useCdn: false,
      // dataCenterProject documents are not readable by an anonymous/public
      // query (confirmed: unauthenticated queries return 0 for this type
      // even though 1,670+ real documents exist) — a token is required.
      token: process.env.SANITY_API_TOKEN,
    })
    const stats = await sanity.fetch(`{
      "operational": count(*[_type == "dataCenterProject" && country == "CA" && status == "operational"]),
      "pipeline": count(*[_type == "dataCenterProject" && country == "CA" && status in ["announced","construction"]]),
      "stalled": count(*[_type == "dataCenterProject" && country == "CA" && status in ["stalled","blocked","paused","canceled"]]),
      "totalMw": math::sum(*[_type == "dataCenterProject" && country == "CA" && defined(capacityMw)].capacityMw)
    }`)
    return stats as { operational: number; pipeline: number; stalled: number; totalMw: number }
  } catch {
    return null
  }
}

export default async function CanadaPage() {
  const live = await getLiveStats()
  const headlineStats = [
    {
      v: live?.totalMw ? `${Math.round(live.totalMw).toLocaleString()} MW` : '~10 GW',
      l: 'Tracked Canadian DC capacity (MW sum)',
    },
    {
      v: live ? `${live.operational} / ${live.pipeline}` : '117 / 30+',
      l: 'Operational / pipeline (live dataset)',
    },
    { v: 'C$2B', l: 'Federal Sovereign AI Compute Strategy' },
    { v: '650 MW', l: 'Largest Indigenous-led project (Woodland Cree)' },
  ]
  return (
    <div style={{ background: '#0b1020', minHeight: '100vh', color: '#f6f7fb', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '4rem 2rem 3rem', borderBottom: '1px solid #1e293b', background: 'linear-gradient(180deg, #0f1728 0%, #0b1020 100%)' }}>
        <HeroBackdrop
          src="https://images.unsplash.com/photo-1560279966-2d681f3d4dfc?auto=format&fit=crop&w=2000&q=70"
          alt="Aerial view of a large hydroelectric dam and power infrastructure"
          scrimSide="right"
        />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1160, margin: '0 auto', display: 'flex', justifyContent: 'flex-end' }}>
          {/* Translucent panel behind the copy — guarantees legibility over a
              busy/high-contrast photo (bright water, hard edges) regardless of
              scrim tuning, and reads as an intentional "content card" rather
              than a legibility patch. */}
          <div style={{ maxWidth: 640, background: 'rgba(6,10,20,0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '2rem 2.25rem' }}>
            <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C8001F', marginBottom: '0.75rem' }}>
              Market Intelligence · Canada
            </p>
            <h1 style={{ fontSize: 'clamp(2.25rem, 5.5vw, 3.5rem)', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, margin: '0 0 1rem', letterSpacing: '-0.01em', lineHeight: 1.05 }}>
              CANADA: 10 GW PIPELINE, FOUR DIFFERENT MARKETS
            </h1>
            <p style={{ color: '#c3cbdb', maxWidth: 640, lineHeight: 1.65, margin: '0 0 1.5rem', fontSize: '1.0625rem' }}>
              Canada has {live?.operational ?? 117} operational data centres tracked, {live?.pipeline ?? '30+'} in the pipeline, and {live?.stalled ?? 'multiple'} with stalled or blocked status in our research dataset. The four major markets (Quebec, Ontario, Alberta, BC) operate under structurally different power regimes — and the federal Sovereign AI Compute Strategy is committing C$2B with explicit preference for Indigenous-partnered projects.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link href="/map" style={{ background: '#C8001F', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>
                Explore Canada on the Map →
              </Link>
              <Link href="/contact" style={{ background: 'rgba(255,255,255,0.06)', color: '#f6f7fb', padding: '0.75rem 1.5rem', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem', border: '1px solid #334155' }}>
                Discuss a Canadian Site →
              </Link>
              <Link href="/methodology" style={{ background: 'rgba(255,255,255,0.06)', color: '#f6f7fb', padding: '0.75rem 1.5rem', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem', border: '1px solid #334155' }}>
                How We Score Sites
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Headline stats */}
      <section style={{ padding: '2.5rem 2rem', borderBottom: '1px solid #1e293b' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          {[
            ...headlineStats,
          ].map(s => (
            <div key={s.l} style={{ background: '#0f1728', border: '1px solid #1e293b', borderRadius: 8, padding: '1.25rem' }}>
              <div style={{ fontSize: '1.875rem', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, color: '#C8001F', lineHeight: 1, marginBottom: '0.4rem' }}>{s.v}</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* The Four Provinces */}
      <section style={{ padding: '4rem 2rem' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#64748b', marginBottom: '0.5rem', fontWeight: 600 }}>
            Four Provinces, Four Power Regimes
          </p>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, margin: '0 0 2.5rem', letterSpacing: '-0.005em' }}>
            WHERE TO BUILD A DATA CENTER IN CANADA
          </h2>

          {PROVINCES.map((p, i) => (
            <div key={p.name} style={{ marginBottom: '3rem', borderTop: i === 0 ? 'none' : '1px solid #1e293b', paddingTop: i === 0 ? 0 : '3rem' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1.75rem', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, margin: 0, color: '#C8001F', letterSpacing: '0.01em' }}>
                  {p.name.toUpperCase()}
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{p.iso}</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#22c55e', margin: '0 0 1rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                {p.capacityNote}
              </p>
              <h4 style={{ fontSize: '1.125rem', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 600, margin: '0 0 0.75rem', letterSpacing: '0.01em' }}>
                {p.headline}
              </h4>
              <p style={{ color: '#cbd5e1', margin: '0 0 1.25rem', fontSize: '1rem', lineHeight: 1.7 }}>{p.subhead}</p>

              <div style={{ background: '#0f1728', border: '1px solid #1e293b', borderRadius: 8, padding: '1rem', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', marginBottom: '0.6rem' }}>Key facts</div>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#cbd5e1', fontSize: '0.875rem', lineHeight: 1.7 }}>
                  {p.keyFacts.map(f => <li key={f}>{f}</li>)}
                </ul>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ background: '#052e16', border: '1px solid #14532d', borderRadius: 8, padding: '0.875rem' }}>
                  <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#22c55e', marginBottom: '0.4rem', fontWeight: 600 }}>Konative angle</div>
                  <p style={{ margin: 0, color: '#dcfce7', fontSize: '0.85rem', lineHeight: 1.6 }}>{p.advantage}</p>
                </div>
                <div style={{ background: '#3f1d1d', border: '1px solid #7f1d1d', borderRadius: 8, padding: '0.875rem' }}>
                  <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#f87171', marginBottom: '0.4rem', fontWeight: 600 }}>Watch</div>
                  <p style={{ margin: 0, color: '#fecaca', fontSize: '0.85rem', lineHeight: 1.6 }}>{p.risk}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* First Nations */}
      <section style={{ padding: '4rem 2rem', borderTop: '1px solid #1e293b', background: '#0f1728' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#64748b', marginBottom: '0.5rem', fontWeight: 600 }}>
            The Defining Vector
          </p>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, margin: '0 0 1rem', letterSpacing: '-0.005em' }}>
            FIRST NATIONS LAND + POWER
          </h2>
          <p style={{ color: '#cbd5e1', margin: '0 0 1rem', fontSize: '1.0625rem', lineHeight: 1.65, maxWidth: 760 }}>
            Federal preference for Indigenous-partnered projects in the C$2B Sovereign AI Compute Strategy is not soft language — it is the structural advantage that determines who clears the queue. Indigenous Development Corporations across Canada control land near transmission, near hydroelectric capacity, and near fiber routes. Konative brings cross-border experience: the same partnership patterns that shaped US tribal DC plays now apply north of the border.
          </p>
          <Link href="/intelligence/first-nations" style={{ display: 'inline-block', fontSize: '0.8rem', color: '#facc15', textDecoration: 'none', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '8px 14px', border: '1px solid rgba(250,204,21,0.4)', borderRadius: 4, marginBottom: '2rem' }}>
            Full First Nations + Tribal DC Deep Dive →
          </Link>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {FIRST_NATIONS_PROJECTS.map(fn => (
              <div key={fn.nation} style={{ background: '#0b1020', border: '1px solid #1e293b', borderRadius: 8, padding: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.125rem', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, margin: 0, color: '#C8001F', letterSpacing: '0.01em' }}>
                    {fn.nation.toUpperCase()}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{fn.location}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem 1rem', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
                  <div><span style={{ color: '#64748b' }}>Capacity:</span> <span style={{ color: '#f6f7fb' }}>{fn.capacity}</span></div>
                  <div><span style={{ color: '#64748b' }}>Partner:</span> <span style={{ color: '#f6f7fb' }}>{fn.partner}</span></div>
                  <div><span style={{ color: '#64748b' }}>Structure:</span> <span style={{ color: '#f6f7fb' }}>{fn.structure}</span></div>
                  <div><span style={{ color: '#64748b' }}>Status:</span> <span style={{ color: '#22c55e' }}>{fn.status}</span></div>
                </div>
                <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.875rem', lineHeight: 1.6 }}>{fn.significance}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Federal AI Strategy */}
      <section style={{ padding: '4rem 2rem', borderTop: '1px solid #1e293b' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#64748b', marginBottom: '0.5rem', fontWeight: 600 }}>
            The Federal Lever
          </p>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, margin: '0 0 1rem', letterSpacing: '-0.005em' }}>
            CANADIAN SOVEREIGN AI COMPUTE STRATEGY — C$2B
          </h2>
          <p style={{ color: '#cbd5e1', margin: '0 0 1.5rem', fontSize: '1rem', lineHeight: 1.7, maxWidth: 760 }}>
            Launched December 2024 by Minister François-Philippe Champagne, the Strategy is the largest sovereign DC funding instrument in Canadian history. Application period for the AI Sovereign Compute Infrastructure Program closed February 15, 2026; final applications due June 1, 2026. C$890M Infrastructure Build Layer disbursement begins fiscal year 2026–27.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {[
              { v: 'C$700M', l: 'AI Champions — for new/expanded data centres' },
              { v: 'C$1B', l: 'Public computing infrastructure build' },
              { v: 'C$300M', l: 'AI Compute Access Fund (SMEs)' },
              { v: '100+ MW', l: 'Minimum capacity threshold for sovereign DC RFPs' },
            ].map(x => (
              <div key={x.l} style={{ background: '#0f1728', border: '1px solid #1e293b', borderRadius: 8, padding: '1rem' }}>
                <div style={{ fontSize: '1.5rem', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, color: '#C8001F', marginBottom: '0.35rem' }}>{x.v}</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.45 }}>{x.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, #08142D 0%, #0C2046 100%)', borderTop: '1px solid #1e293b', padding: '3.5rem 2rem' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, margin: '0 0 0.75rem', letterSpacing: '-0.01em' }}>
            BUILDING IN CANADA? START WITH THE GRID, NOT THE GLOSSY DECK.
          </h2>
          <p style={{ color: '#cbd5e1', margin: '0 0 1.75rem', lineHeight: 1.65, fontSize: '1rem' }}>
            We work in all four provinces and across First Nations partnerships. Bring us a site, a parcel, an LOI, or a thesis — we&apos;ll tell you in 60 seconds whether it&apos;s worth chasing, and what the next 90 days look like.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://cal.com/jeramey-james/15min" target="_blank" rel="noopener noreferrer" style={{ background: '#C8001F', color: '#fff', padding: '0.875rem 1.75rem', borderRadius: 6, textDecoration: 'none', fontWeight: 700, fontSize: '0.9375rem' }}>
              Book a Call →
            </a>
            <Link href="/contact" style={{ background: 'transparent', color: '#f6f7fb', padding: '0.875rem 1.75rem', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: '0.9375rem', border: '1px solid #334155' }}>
              Submit a Site
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
