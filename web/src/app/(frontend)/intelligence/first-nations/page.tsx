import { bookingUrl } from "@/lib/booking";
import type { Metadata } from 'next'
import Link from 'next/link'
import HeroBackdrop from '@/components/marketing/HeroBackdrop'

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'First Nations + Tribal Data Centers — Konative',
  description: 'Cross-border intelligence on Indigenous-led data center development across Canada and the United States. Sovereignty-first partnership structures, federal funding programs, and the projects shaping 2026–2030.',
}

const PRINCIPLES = [
  {
    label: 'Sovereignty first',
    body: 'A Nation\'s right to say no — or to set the terms — is not a stage of negotiation. It is the precondition for the conversation.',
  },
  {
    label: 'Equity, not lease-only',
    body: 'Lease revenue is one tool. Konative\'s default frame is majority or near-majority equity for the host Nation, with a clear path to operational and economic control over the build.',
  },
  {
    label: 'Energy is the lever',
    body: 'Most Indigenous land assets carry under-utilized hydro, wind, solar, gas, or geothermal potential. The DC build doesn\'t come first — the energy partnership does.',
  },
  {
    label: 'Cross-border learning',
    body: 'Canadian First Nations and US Tribes face structurally similar opportunities and risks. Konative carries the playbook in both directions.',
  },
]

const PROJECTS = [
  {
    nation: 'Woodland Cree First Nation',
    country: 'Canada',
    location: '~500 km NW of Edmonton, AB',
    capacity: '650 MW (phased)',
    partner: 'Sovereign Digital Infrastructure',
    structure: 'Woodland Cree owns 51%',
    status: 'Phase 1 startup mid-2027 on natural gas',
    significance: 'Largest announced Indigenous-led DC in North America. Re-uses idle power plant infrastructure. Establishes the 51% majority-equity template.',
    accent: '#22c55e',
  },
  {
    nation: 'Prophet River First Nation',
    country: 'Canada',
    location: 'Near Fort St. John, BC',
    capacity: 'Large-scale (TBD)',
    partner: 'ABCT Pacific Ltd',
    structure: 'Prophet River majority stake (LOI)',
    status: 'LOI signed; leveraging Site C Dam completion',
    significance: 'Showcase of how First Nations partnerships unlock new BC capacity that the provincial interconnection cap otherwise restricts.',
    accent: '#22c55e',
  },
  {
    nation: 'Upper Nicola Band',
    country: 'Canada',
    location: 'Interior BC',
    capacity: '$500M proposed AI DC',
    partner: 'Under community consultation',
    structure: 'Lease-revenue model under evaluation',
    status: 'Community consultation phase',
    significance: 'Demonstrates Nations evaluating DC as long-term land + lease revenue, not just energy partnership.',
    accent: '#22c55e',
  },
  {
    nation: 'Innava (Navajo Nation–adjacent)',
    country: 'United States',
    location: 'Albuquerque, NM',
    capacity: 'Initial-phase (cybersecurity + data services)',
    partner: 'Workforce + community partners',
    structure: 'Training-and-certification model paired with infra',
    status: 'Operating',
    significance: 'Couples DC build with Navajo youth career pipeline in cybersecurity — the workforce partnership template Konative recommends to all host Nations.',
    accent: '#3b82f6',
  },
  {
    nation: 'US Tribal lands — broader pipeline',
    country: 'United States',
    location: 'Multiple states',
    capacity: '~100+ proposed DC projects on/near tribal land (Honor the Earth tracker)',
    partner: 'Various (in negotiation)',
    structure: 'Wide range — equity, lease, PPA, joint venture',
    status: 'Mixed — including moratoria + active opposition at some Nations',
    significance: 'Roughly 100–160 proposals are tracked across Indian Country. Quality of structure varies dramatically. Konative\'s view: most are not deals worth doing as currently scoped.',
    accent: '#a78bfa',
  },
]

const PROGRAMS = [
  {
    program: 'Canadian Sovereign AI Compute Strategy',
    amount: 'C$2B (2024 → 2031)',
    eligibility: 'Federal preference for Indigenous-partnered projects',
    deadline: 'Application period closed Feb 15 2026; final June 1 2026',
    details: 'C$700M for AI champions / C$1B public infrastructure / C$300M SME access. C$890M Infrastructure Build Layer disbursement begins fiscal 2026–27.',
  },
  {
    program: 'Canadian Indigenous Loan Guarantee Program',
    amount: 'C$5B+ (federal Indigenous loan guarantee corp.)',
    eligibility: 'Indigenous economic participation in major projects',
    deadline: 'Rolling',
    details: 'Federal guarantee makes commercial debt accessible to First Nations equity participants in DC and energy infrastructure deals.',
  },
  {
    program: 'DOE Office of Indian Energy — Tribal Energy NOFO',
    amount: 'US$50M (March 2026 round)',
    eligibility: 'US federally-recognized Tribes',
    deadline: 'Annual',
    details: 'Funds tribal energy infrastructure including grid, generation, and integrated DC opportunity assessments. The DOE explicitly identifies DC partnerships as a Tribal economic vector.',
  },
  {
    program: 'US Tribal Loan Guarantee — DOE LPO',
    amount: 'Up to US$20B',
    eligibility: 'US federally-recognized Tribes for energy + adjacent infrastructure',
    deadline: 'Rolling',
    details: 'DOE Loan Programs Office Tribal Energy Financing Program guarantees commercial debt for Tribal-owned energy + infrastructure (including DC-supporting power).',
  },
  {
    program: 'First Nations Major Projects Coalition (FNMPC)',
    amount: 'Advisory + capital structuring',
    eligibility: 'Canadian First Nations',
    deadline: 'Project-by-project',
    details: 'Not a fund — but the coalition that has structured most of the major Indigenous-equity infra deals in Canada (LNG Canada, Coastal GasLink, etc.). Critical advisory partner for any major DC deal.',
  },
]

const RISKS = [
  {
    title: 'Resistance is real and reasonable',
    body: 'Multiple tribal communities have moratoriums or active opposition to DC development citing water use, sacred sites, sovereignty, and historical extraction patterns. A "yes" from a council is not the same as a "yes" from the community. Konative does not accept engagements where community consent has not been actively built.',
  },
  {
    title: 'Water sovereignty is non-negotiable',
    body: 'In water-stressed regions (Navajo, Hopi, Pueblo lands), DC water consumption is the dominant community concern. Closed-loop liquid cooling and air cooling designs are the only viable approaches. Evaporative cooling on tribal land is, in our view, off the table.',
  },
  {
    title: 'Data sovereignty matters as much as land sovereignty',
    body: 'Hosting a hyperscaler workload doesn\'t mean a Nation has access to or control over the data on it. Structuring data sovereignty provisions — including Tribal data jurisdiction, governance, and audit rights — is a parallel track to physical infrastructure.',
  },
  {
    title: 'Promised jobs often don\'t materialize',
    body: 'A 500 MW DC creates ~50–150 long-term jobs. That\'s real, but smaller than the 1,000+ figures sometimes pitched. Workforce commitments must be in writing, with measurable milestones, and the host Nation\'s training infrastructure must be funded as part of the deal — not as a downstream "phase 2."',
  },
]

export default function FirstNationsPage() {
  return (
    <div style={{ background: '#0b1020', minHeight: '100vh', color: '#f6f7fb', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '4rem 2rem 3rem', borderBottom: '1px solid #1e293b', background: 'linear-gradient(180deg, #0f1728 0%, #0b1020 100%)' }}>
        <HeroBackdrop
          src="https://images.unsplash.com/photo-1678806136612-1e1ab2b970cf?auto=format&fit=crop&w=2000&q=70"
          alt="Remote North American mountain landscape at sunrise"
        />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 960, margin: '0 auto' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C8001F', marginBottom: '0.75rem' }}>
            Intelligence · First Nations + Tribal Data Centers
          </p>
          <h1 style={{ fontSize: 'clamp(2.25rem, 5.5vw, 3.5rem)', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, margin: '0 0 1rem', letterSpacing: '-0.01em', lineHeight: 1.05 }}>
            INDIGENOUS LAND, INDIGENOUS POWER, INDIGENOUS EQUITY
          </h1>
          <p style={{ color: '#94a3b8', maxWidth: 760, lineHeight: 1.65, margin: '0 0 1.25rem', fontSize: '1.0625rem' }}>
            The next phase of North American data center development runs through Indian Country and First Nations land. This is not a soft observation — it is the structural reality of where transmission, water, available generation capacity, and federal preference now align. Konative covers both Canada and the United States, and our default partnership frame is majority Indigenous equity, not lease-only.
          </p>
          <p style={{ color: '#cbd5e1', maxWidth: 760, lineHeight: 1.65, margin: '0 0 1.5rem', fontSize: '0.95rem', borderLeft: '2px solid #C8001F', paddingLeft: '0.875rem' }}>
            We also acknowledge the asymmetry. Indigenous communities have been on the wrong end of every previous extraction cycle — fur, timber, mining, oil, hydro. The data center cycle is different only if it is structured to be different. Konative&apos;s thesis is that the deals worth doing are the ones where the host Nation owns the asset, controls the data jurisdiction, and shapes the workforce pathway.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a href={bookingUrl("intelligence-first-nations")} target="_blank" rel="noopener noreferrer" style={{ background: '#C8001F', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>
              Discuss a Partnership →
            </a>
            <Link href="/methodology" style={{ background: 'transparent', color: '#f6f7fb', padding: '0.75rem 1.5rem', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem', border: '1px solid #334155' }}>
              How We Score Sites
            </Link>
          </div>
        </div>
      </section>

      {/* Headline stats */}
      <section style={{ padding: '2.5rem 2rem', borderBottom: '1px solid #1e293b' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          {[
            { v: '650 MW', l: 'Largest Indigenous-led DC (Woodland Cree, AB)' },
            { v: 'C$2B', l: 'Federal Sovereign AI Compute Strategy (Indigenous preferred)' },
            { v: 'US$20B', l: 'DOE LPO Tribal Energy Financing Program ceiling' },
            { v: '~100+', l: 'DC proposals tracked on/near US tribal land' },
          ].map(s => (
            <div key={s.l} style={{ background: '#0f1728', border: '1px solid #1e293b', borderRadius: 8, padding: '1.25rem' }}>
              <div style={{ fontSize: '1.875rem', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, color: '#C8001F', lineHeight: 1, marginBottom: '0.4rem' }}>{s.v}</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Konative principles */}
      <section style={{ padding: '4rem 2rem' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#64748b', marginBottom: '0.5rem', fontWeight: 600 }}>
            How Konative Works
          </p>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, margin: '0 0 2rem', letterSpacing: '-0.005em' }}>
            FOUR PRINCIPLES FOR INDIGENOUS DC PARTNERSHIPS
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {PRINCIPLES.map((p, i) => (
              <div key={p.label} style={{ background: '#0f1728', border: '1px solid #1e293b', borderRadius: 8, padding: '1.5rem' }}>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#C8001F', marginBottom: '0.75rem', fontWeight: 600 }}>0{i + 1}</div>
                <h3 style={{ fontSize: '1.125rem', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, margin: '0 0 0.5rem', color: '#f6f7fb' }}>
                  {p.label}
                </h3>
                <p style={{ color: '#cbd5e1', margin: 0, fontSize: '0.9rem', lineHeight: 1.65 }}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section style={{ padding: '4rem 2rem', borderTop: '1px solid #1e293b', background: '#0f1728' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#64748b', marginBottom: '0.5rem', fontWeight: 600 }}>
            Indigenous-Led + Indigenous-Hosted Projects
          </p>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, margin: '0 0 2rem', letterSpacing: '-0.005em' }}>
            WHAT&apos;S BEING BUILT
          </h2>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {PROJECTS.map(fn => (
              <div key={fn.nation} style={{ background: '#0b1020', border: '1px solid #1e293b', borderLeft: `3px solid ${fn.accent}`, borderRadius: 8, padding: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, margin: 0, color: '#C8001F', letterSpacing: '0.01em' }}>
                      {fn.nation.toUpperCase()}
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{fn.location} · {fn.country}</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: fn.accent, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, background: `${fn.accent}15`, padding: '3px 10px', borderRadius: 3 }}>
                    {fn.country === 'Canada' ? 'CAN' : 'USA'}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem 1.5rem', fontSize: '0.8rem', margin: '0.75rem 0' }}>
                  <div><span style={{ color: '#64748b' }}>Capacity:</span> <span style={{ color: '#f6f7fb' }}>{fn.capacity}</span></div>
                  <div><span style={{ color: '#64748b' }}>Partner:</span> <span style={{ color: '#f6f7fb' }}>{fn.partner}</span></div>
                  <div><span style={{ color: '#64748b' }}>Structure:</span> <span style={{ color: '#f6f7fb' }}>{fn.structure}</span></div>
                  <div><span style={{ color: '#64748b' }}>Status:</span> <span style={{ color: '#22c55e' }}>{fn.status}</span></div>
                </div>
                <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.875rem', lineHeight: 1.65 }}>{fn.significance}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Federal programs */}
      <section style={{ padding: '4rem 2rem', borderTop: '1px solid #1e293b' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#64748b', marginBottom: '0.5rem', fontWeight: 600 }}>
            Federal + Coalition Frameworks
          </p>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, margin: '0 0 2rem', letterSpacing: '-0.005em' }}>
            THE PROGRAMS THAT MAKE INDIGENOUS DC EQUITY VIABLE
          </h2>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {PROGRAMS.map(p => (
              <div key={p.program} style={{ background: '#0f1728', border: '1px solid #1e293b', borderRadius: 8, padding: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.125rem', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, margin: 0, color: '#f6f7fb', letterSpacing: '0.01em' }}>
                    {p.program}
                  </h3>
                  <span style={{ fontSize: '0.875rem', color: '#22c55e', fontWeight: 700 }}>{p.amount}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.4rem 1.5rem', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
                  <div><span style={{ color: '#64748b' }}>Eligibility:</span> <span style={{ color: '#cbd5e1' }}>{p.eligibility}</span></div>
                  <div><span style={{ color: '#64748b' }}>Deadline:</span> <span style={{ color: '#cbd5e1' }}>{p.deadline}</span></div>
                </div>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.65 }}>{p.details}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Risks */}
      <section style={{ padding: '4rem 2rem', borderTop: '1px solid #1e293b', background: '#0f1728' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#64748b', marginBottom: '0.5rem', fontWeight: 600 }}>
            What We Don&apos;t Pretend
          </p>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, margin: '0 0 2rem', letterSpacing: '-0.005em' }}>
            REAL RISKS, REAL CONSTRAINTS
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {RISKS.map(r => (
              <div key={r.title} style={{ background: '#3f1d1d', border: '1px solid #7f1d1d', borderRadius: 8, padding: '1.25rem' }}>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#f87171', marginBottom: '0.5rem', fontWeight: 700 }}>Watch</div>
                <h3 style={{ fontSize: '1rem', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, margin: '0 0 0.5rem', color: '#fecaca' }}>
                  {r.title}
                </h3>
                <p style={{ margin: 0, color: '#fca5a5', fontSize: '0.85rem', lineHeight: 1.65 }}>{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, #08142D 0%, #0C2046 100%)', borderTop: '1px solid #1e293b', padding: '3.5rem 2rem' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, margin: '0 0 0.75rem', letterSpacing: '-0.01em' }}>
            INDIGENOUS DC PARTNERSHIP? START HERE.
          </h2>
          <p style={{ color: '#cbd5e1', margin: '0 0 1.75rem', lineHeight: 1.65, fontSize: '1rem' }}>
            Whether you&apos;re an Indigenous Development Corp evaluating a DC opportunity, a hyperscaler looking to host on Indigenous land with the right structure, or a capital partner seeking sovereign-aligned infra exposure — Konative starts every conversation with the host Nation&apos;s priorities.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={bookingUrl("intelligence-first-nations")} target="_blank" rel="noopener noreferrer" style={{ background: '#C8001F', color: '#fff', padding: '0.875rem 1.75rem', borderRadius: 6, textDecoration: 'none', fontWeight: 700, fontSize: '0.9375rem' }}>
              Book a Call →
            </a>
            <Link href="/canada" style={{ background: 'transparent', color: '#f6f7fb', padding: '0.875rem 1.75rem', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: '0.9375rem', border: '1px solid #334155' }}>
              Canada Market Deep Dive
            </Link>
          </div>
          <p style={{ color: '#475569', fontSize: '0.75rem', marginTop: '2rem' }}>
            Konative is led by Jeramey James, who carries direct experience with tribal enterprise infrastructure operations and Indigenous economic development. <Link href="/about" style={{ color: '#94a3b8', textDecoration: 'underline' }}>Meet the team →</Link>
          </p>
        </div>
      </section>
    </div>
  )
}
