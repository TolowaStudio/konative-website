import { bookingUrl } from "@/lib/booking";
import type { Metadata } from 'next'
import Link from 'next/link'
import HeroBackdrop from '@/components/marketing/HeroBackdrop'

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Reality vs. Press — Konative',
  description:
    "Konative's editorial scorecard separating real, shovel-ready Canadian data center projects from press-release pipeline. Sourced, methodology-published, updated as the market moves.",
}

type Score = {
  label: string
  value: 'Strong' | 'Mixed' | 'Weak' | 'Unverified'
}

type ProjectAssessment = {
  name: string
  sponsor: string
  province: string
  capacity: string
  announced: string
  reality: number // 0–100
  verdict: 'REAL' | 'TRACKING' | 'PRESS' | 'STALLED'
  oneLine: string
  scores: Score[]
  whatPressSays: string
  whatTheRecordSays: string
  konativeRead: string
  sources: { label: string; url: string }[]
}

const PROJECTS: ProjectAssessment[] = [
  {
    name: 'Wonder Valley',
    sponsor: 'O\'Leary Ventures',
    province: 'Alberta — MD of Greenview',
    capacity: '7.5 GW (proposed) / $70B',
    announced: 'Dec 2024',
    reality: 18,
    verdict: 'PRESS',
    oneLine:
      'World\'s-largest framing, no financing disclosed, no Indigenous consultation, ~12+ months behind preliminary schedule.',
    scores: [
      { label: 'Land control', value: 'Mixed' },
      { label: 'Financing', value: 'Unverified' },
      { label: 'Power agreements', value: 'Weak' },
      { label: 'Water', value: 'Mixed' },
      { label: 'Indigenous consent', value: 'Weak' },
      { label: 'Schedule credibility', value: 'Weak' },
    ],
    whatPressSays:
      '$70B, 7.5 GW BYOP gas-fired AI campus. Largest data centre in the world. Construction begins 2026, first phase operating 2027.',
    whatTheRecordSays:
      'Land sale contract with Greenview signed March 2026; province waived its environmental assessment. Preliminary work is already a year behind schedule. Sturgeon Lake Cree Nation publicly criticized the lack of consultation. Financing partners and offtake have not been disclosed.',
    konativeRead:
      'Treat Wonder Valley as a political artifact, not a build. The waiver of environmental assessment buys speed on paper but creates litigation surface. Until financing and Indigenous consent are visible, every other Canadian project that does those things first has a faster real path to MW.',
    sources: [
      {
        label: 'CBC: No provincial EIA required for Wonder Valley',
        url: 'https://www.cbc.ca/news/canada/edmonton/wonder-valley-data-centre-environmental-impact-assessment-9.7158526',
      },
      {
        label: "Canada's National Observer: Sturgeon Lake Cree slams Alberta and O'Leary",
        url: 'https://www.nationalobserver.com/2026/04/24/news/wonder-valley-kevin-o\'leary-alberta-first-nation',
      },
      {
        label: 'The Energy Mix: $70B Wonder Valley still a mirage',
        url: 'https://www.theenergymix.com/70b-wonder-valley-project-still-a-mirage-as-olearys-ai-dream-stalls-in-alberta/',
      },
    ],
  },
  {
    name: 'Telus Sovereign AI Factory — Rimouski',
    sponsor: 'Telus + NVIDIA',
    province: 'Quebec — Rimouski (expansion to BC Kamloops)',
    capacity: '500 Hopper GPUs (initial cluster), modular expansion',
    announced: '2025',
    reality: 86,
    verdict: 'REAL',
    oneLine:
      'Operating data centre, NVIDIA partnership signed, GPUs landing summer 2026 — actually shipping.',
    scores: [
      { label: 'Land control', value: 'Strong' },
      { label: 'Financing', value: 'Strong' },
      { label: 'Power agreements', value: 'Strong' },
      { label: 'Water', value: 'Strong' },
      { label: 'Indigenous consent', value: 'Strong' },
      { label: 'Schedule credibility', value: 'Strong' },
    ],
    whatPressSays:
      'Telus partners with NVIDIA to launch a Canadian "Sovereign AI Factory" — 500 Hopper GPUs deployed at Rimouski, expansion to Kamloops, BC.',
    whatTheRecordSays:
      'Existing Telus data centre footprint, existing power, existing fiber. NVIDIA hardware schedule disclosed. Sovereignty narrative aligns with the federal C$2B AI Compute Strategy.',
    konativeRead:
      'The closest thing to a "shovel already in the ground" sovereign-AI build in Canada. If you\'re a Canadian capacity buyer who needs MW this year, Rimouski/Kamloops is your benchmark to compare every greenfield pitch against.',
    sources: [
      {
        label: 'BetaKit: Telus + NVIDIA Sovereign AI Factory',
        url: 'https://betakit.com/telus-partners-with-nvidia-to-launch-canadian-sovereign-ai-factory/',
      },
    ],
  },
  {
    name: 'eStruxture CAL-3',
    sponsor: 'eStruxture',
    province: 'Alberta — Rocky View County (Calgary metro)',
    capacity: '90 MW / C$750M (US$585M)',
    announced: '2024',
    reality: 78,
    verdict: 'REAL',
    oneLine:
      'Operator-led, financed, 90 MW Calgary build on track to come online H2 2026.',
    scores: [
      { label: 'Land control', value: 'Strong' },
      { label: 'Financing', value: 'Strong' },
      { label: 'Power agreements', value: 'Mixed' },
      { label: 'Water', value: 'Mixed' },
      { label: 'Indigenous consent', value: 'Unverified' },
      { label: 'Schedule credibility', value: 'Strong' },
    ],
    whatPressSays:
      'C$750M, 90 MW data centre near Calgary — described in the press as "Alberta\'s largest."',
    whatTheRecordSays:
      'eStruxture has operator track record. AESO interim allocation framework caps total large-load at 1,200 MW through 2028; CAL-3 fits inside that envelope. Power density up to 125 kW per cabinet.',
    konativeRead:
      'A credible Alberta build template. Useful as the "benchmark MDC" when sizing partner sites — if your project can\'t articulate why it lands inside CAL-3\'s economics, the press release is doing more work than the diligence.',
    sources: [
      {
        label: 'eStruxture: New $750M Calgary data centre',
        url: 'https://www.estruxture.com/insights/in-the-news/new-750m-data-centre-to-be-built-in-calgary-area-the-largest-in-alberta',
      },
      {
        label: 'Globe and Mail: One of Canada\'s most powerful',
        url: 'https://www.theglobeandmail.com/business/industry-news/property-report/article-new-data-centre-will-be-one-of-canadas-most-powerful/',
      },
    ],
  },
  {
    name: 'Beacon AI — Foothills + Chestermere',
    sponsor: 'Beacon AI Centers',
    province: 'Alberta — Foothills County, Chestermere',
    capacity: '400 MW per campus / ~C$4B each',
    announced: '2025',
    reality: 52,
    verdict: 'TRACKING',
    oneLine:
      'Real CAPEX, real land filings, but timeline has slipped: now 2027–2028 first energization, full build through 2030.',
    scores: [
      { label: 'Land control', value: 'Strong' },
      { label: 'Financing', value: 'Mixed' },
      { label: 'Power agreements', value: 'Mixed' },
      { label: 'Water', value: 'Mixed' },
      { label: 'Indigenous consent', value: 'Unverified' },
      { label: 'Schedule credibility', value: 'Mixed' },
    ],
    whatPressSays:
      '"$10B AI data centre building blitz." 400 MW Foothills campus, 400 MW Chestermere campus targeting Dec 2026 energization.',
    whatTheRecordSays:
      'Construction reported to start late 2025 / early 2026; first facilities now expected 2027–2028, full build-out through 2030. Listed in Alberta Major Projects.',
    konativeRead:
      'A real attempt at hyperscale-class capacity — but the original "energize by Dec 2026" framing has not survived contact with reality. Use the slip as a forecasting signal, not a gotcha: 400 MW Alberta campuses appear to be on a 4–5 year clock, not 18 months. Plan partner expectations accordingly.',
    sources: [
      {
        label: 'DCD: Beacon AI 400 MW Alberta campuses',
        url: 'https://www.datacenterdynamics.com/en/news/details-emerge-around-beacon-ais-planned-400mw-alberta-data-center-campuses/',
      },
      {
        label: 'The Logic: Calgary firm eyes $10B AI data centre blitz',
        url: 'https://thelogic.co/news/beacon-ai-canada-artificial-intelligence-data-centres/',
      },
      {
        label: 'Alberta Major Projects: Beacon Foothills AI Hub',
        url: 'https://majorprojects.alberta.ca/details/Beacon-Foothills-Artificial-Intelligence-Hub/11490',
      },
    ],
  },
  {
    name: 'Stargate Canada (OpenAI)',
    sponsor: 'OpenAI',
    province: 'Unspecified — federal/provincial talks',
    capacity: 'Unspecified',
    announced: 'Q4 2025',
    reality: 12,
    verdict: 'PRESS',
    oneLine:
      'Talks with federal AI minister and unnamed public/private players. No site, no MW, no MOU.',
    scores: [
      { label: 'Land control', value: 'Weak' },
      { label: 'Financing', value: 'Unverified' },
      { label: 'Power agreements', value: 'Weak' },
      { label: 'Water', value: 'Unverified' },
      { label: 'Indigenous consent', value: 'Unverified' },
      { label: 'Schedule credibility', value: 'Weak' },
    ],
    whatPressSays:
      'OpenAI considering Stargate-style infrastructure or capacity purchase in Canada; talks underway with Minister Solomon.',
    whatTheRecordSays:
      'No site disclosed. No MW allocation. No partner stack. Stargate\'s flagship Norway version stalled and Microsoft took over April 2026 — a useful warning that Stargate-branded discussions and Stargate-branded shovels are different things.',
    konativeRead:
      'Stargate Canada is a brand and a meeting calendar, not a project. If a Canadian counterparty cites "we\'re part of the Stargate conversation" as their proof of viability, that\'s the cue to ask for the next three artifacts: site control, MW allocation, capital partner.',
    sources: [
      {
        label: 'DCD: OpenAI considers Stargate capacity in Canada',
        url: 'https://www.datacenterdynamics.com/en/news/openai-considers-stargate-data-center-capacity-in-canada/',
      },
      {
        label: 'CBC: AI sovereignty trade-off in Canada',
        url: 'https://www.cbc.ca/news/business/open-ai-canada-data-centres-digital-sovereignty-9.6935195',
      },
      {
        label: 'CNBC: OpenAI pulls back from Stargate Norway',
        url: 'https://www.cnbc.com/2026/04/15/openai-stargate-norway-project-microsoft.html',
      },
    ],
  },
  {
    name: 'Cohere AI Data Centre',
    sponsor: 'Cohere + Government of Canada',
    province: 'Toronto-led; site unspecified',
    capacity: 'Multi-billion CAD; capacity TBD',
    announced: '2025',
    reality: 44,
    verdict: 'TRACKING',
    oneLine:
      'C$240M federal commitment is real. Site, MW, and operational milestones are not yet public.',
    scores: [
      { label: 'Land control', value: 'Unverified' },
      { label: 'Financing', value: 'Strong' },
      { label: 'Power agreements', value: 'Unverified' },
      { label: 'Water', value: 'Unverified' },
      { label: 'Indigenous consent', value: 'Unverified' },
      { label: 'Schedule credibility', value: 'Unverified' },
    ],
    whatPressSays:
      'Federal government commits up to C$240M to Cohere for a multi-billion-dollar Canadian AI data centre.',
    whatTheRecordSays:
      'Funding commitment is real and tied to the C$2B Sovereign AI Compute Strategy. Site, MW allocation, and operator partner have not been disclosed publicly.',
    konativeRead:
      'Federal capital is the strongest signal in the Canadian DC market right now — and Cohere has it. Watch for the operator selection: that announcement will tell you which partners are inside the federal sovereign-AI tent and which are outside.',
    sources: [],
  },
  {
    name: 'Prophet River First Nation × ABCT Pacific',
    sponsor: 'Prophet River First Nation (majority) + ABCT Pacific',
    province: 'British Columbia — near Fort St. John',
    capacity: 'TBD (large-scale, leveraging Site C)',
    announced: '2025',
    reality: 64,
    verdict: 'REAL',
    oneLine:
      'Indigenous-majority LOI tied to fresh Site C capacity — the structurally cleanest BC path under the 2026 BC Hydro cap.',
    scores: [
      { label: 'Land control', value: 'Strong' },
      { label: 'Financing', value: 'Mixed' },
      { label: 'Power agreements', value: 'Mixed' },
      { label: 'Water', value: 'Strong' },
      { label: 'Indigenous consent', value: 'Strong' },
      { label: 'Schedule credibility', value: 'Mixed' },
    ],
    whatPressSays:
      'Prophet River First Nation signs LOI for major DC near Fort St. John, leveraging Site C.',
    whatTheRecordSays:
      'BC Hydro\'s 2026 Call for Demand caps new AI/DC interconnections at 300 MW + 100 MW respectively. Indigenous-led builds in the Peace region are one of the few structurally privileged paths through that cap.',
    konativeRead:
      'This is the model. Indigenous majority + fresh hydro MW + Pacific connectivity = a path that the rest of the BC market structurally cannot replicate. Konative\'s thesis on Northern BC distributed networks rhymes with this; the difference is gas-pipeline-aligned vs. Site-C-aligned.',
    sources: [
      {
        label: 'BC Hydro: 2026 Call for Demand',
        url: 'https://app.bchydro.com/content/dam/BCHydro/customer-portal/documents/accounts-billing/electrical-connections/2026-cfd-info-session-2026feb09.pdf',
      },
      {
        label: 'DCD: BC Hydro competitive power process for AI and DC',
        url: 'https://www.datacenterdynamics.com/en/news/british-columbia-bc-hydro-launch-competitive-power-process-for-ai-and-data-centers/',
      },
    ],
  },
]

const VERDICT_STYLE: Record<ProjectAssessment['verdict'], { bg: string; fg: string; label: string }> = {
  REAL:     { bg: '#1f3d1f', fg: '#7CD992', label: 'REAL' },
  TRACKING: { bg: '#3d361f', fg: '#F0A050', label: 'TRACKING' },
  PRESS:    { bg: '#3d1f1f', fg: '#F58A8A', label: 'PRESS-ONLY' },
  STALLED:  { bg: '#2a2a2a', fg: '#B0B0B0', label: 'STALLED' },
}

const SCORE_STYLE: Record<Score['value'], { fg: string; dot: string }> = {
  Strong:     { fg: '#7CD992', dot: '#7CD992' },
  Mixed:      { fg: '#F0A050', dot: '#F0A050' },
  Weak:       { fg: '#F58A8A', dot: '#F58A8A' },
  Unverified: { fg: '#94a3b8', dot: '#475569' },
}

function ProjectCard({ p }: { p: ProjectAssessment }) {
  const v = VERDICT_STYLE[p.verdict]
  return (
    <article
      style={{
        background: '#0C2046',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 10,
        padding: '2rem',
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '1.25rem',
      }}
    >
      <header style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2rem)', textTransform: 'uppercase', letterSpacing: '0.005em', margin: 0, color: '#fff', lineHeight: 1 }}>
            {p.name}
          </h3>
          <div style={{ marginTop: 6, color: '#94a3b8', fontSize: '0.85rem' }}>
            {p.sponsor} · {p.province} · {p.capacity} · announced {p.announced}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: v.bg, color: v.fg, padding: '0.4rem 0.7rem', borderRadius: 4, fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.14em' }}>
            {v.label}
          </div>
          <div style={{ color: v.fg, fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800, fontSize: '1.75rem', lineHeight: 1 }}>
            {p.reality}<span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600 }}>/100</span>
          </div>
        </div>
      </header>

      <p style={{ margin: 0, color: '#e2e8f0', fontSize: '1rem', lineHeight: 1.6 }}>{p.oneLine}</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.5rem' }}>
        {p.scores.map(s => {
          const ss = SCORE_STYLE[s.value]
          return (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '0.5rem 0.7rem', borderRadius: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: ss.dot, flexShrink: 0 }} />
              <span style={{ fontSize: '0.78rem', color: '#cbd5e1', flex: 1 }}>{s.label}</span>
              <span style={{ fontSize: '0.78rem', color: ss.fg, fontWeight: 600 }}>{s.value}</span>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.85rem' }}>
        <div>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 600, marginBottom: 4 }}>What the press says</div>
          <div style={{ color: '#cbd5e1', fontSize: '0.92rem', lineHeight: 1.6 }}>{p.whatPressSays}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 600, marginBottom: 4 }}>What the public record says</div>
          <div style={{ color: '#cbd5e1', fontSize: '0.92rem', lineHeight: 1.6 }}>{p.whatTheRecordSays}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.7rem', color: '#C8001F', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 700, marginBottom: 4 }}>Konative read</div>
          <div style={{ color: '#fff', fontSize: '0.95rem', lineHeight: 1.6 }}>{p.konativeRead}</div>
        </div>
      </div>

      {p.sources.length > 0 && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.85rem' }}>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 600, marginBottom: 6 }}>Sources</div>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {p.sources.map(s => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: '#9bb8e0', fontSize: '0.85rem', textDecoration: 'underline' }}>{s.label}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  )
}

export default function RealityVsPressPage() {
  const sorted = [...PROJECTS].sort((a, b) => b.reality - a.reality)

  return (
    <div style={{ background: '#08142D', color: '#f6f7fb', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', background: '#08142D', padding: '5rem 2rem 3rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <HeroBackdrop
          src="https://images.unsplash.com/photo-1575230167650-dce335edc7f4?auto=format&fit=crop&w=2000&q=70"
          alt="Several tower cranes over a large construction site against the sky"
        />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#C8001F', fontSize: 11, fontWeight: 600, letterSpacing: '0.24em', textTransform: 'uppercase', marginBottom: 18 }}>
            <span style={{ width: 28, height: 1, background: '#C8001F' }} />
            Konative Editorial · Reality vs. Press
          </div>
          <h1 style={{ fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800, fontSize: 'clamp(2.4rem, 6vw, 4.5rem)', lineHeight: 0.95, margin: 0, letterSpacing: '0.005em', textTransform: 'uppercase' }}>
            Most announced<br />Canadian data centers<br /><span style={{ color: '#C8001F' }}>aren’t real builds yet.</span>
          </h1>
          <p style={{ marginTop: '1.5rem', color: '#cbd5e1', fontSize: '1.1rem', lineHeight: 1.65, maxWidth: 760 }}>
            We score every major Canadian project on six factors — land control, financing, power agreements, water, Indigenous consent, and schedule credibility — using only public-record sources. The result is a 0–100 Reality Score that tells you which press releases to act on and which to wait out.
          </p>
          <p style={{ marginTop: '0.75rem', color: '#94a3b8', fontSize: '0.95rem', maxWidth: 760, lineHeight: 1.6 }}>
            This scorecard is published by Konative and updated as the public record changes. We don’t take sponsor money to score projects. If you have a primary-source document that should change a score, send it to <a href="mailto:editorial@konative.com" style={{ color: '#C8001F' }}>editorial@konative.com</a>.
          </p>
          <div style={{ marginTop: '1.75rem', display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <Link href="/methodology" style={{ background: 'transparent', border: '1px solid #334155', color: '#f6f7fb', padding: '0.7rem 1.2rem', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>
              Methodology →
            </Link>
            <Link href="/canada" style={{ background: 'transparent', border: '1px solid #334155', color: '#f6f7fb', padding: '0.7rem 1.2rem', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>
              Canadian market overview →
            </Link>
          </div>
        </div>
      </section>

      {/* Legend */}
      <section style={{ padding: '2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {[
            { label: 'REAL', desc: 'Operating, financed, on schedule', bg: '#1f3d1f', fg: '#7CD992' },
            { label: 'TRACKING', desc: 'Real CAPEX or LOI; gaps remain', bg: '#3d361f', fg: '#F0A050' },
            { label: 'PRESS-ONLY', desc: 'Announcement without diligence', bg: '#3d1f1f', fg: '#F58A8A' },
            { label: 'STALLED', desc: 'Was real; has slipped materially', bg: '#2a2a2a', fg: '#B0B0B0' },
          ].map(x => (
            <div key={x.label} style={{ background: '#0C2046', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
              <span style={{ background: x.bg, color: x.fg, padding: '0.25rem 0.55rem', borderRadius: 4, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em' }}>{x.label}</span>
              <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>{x.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Cards */}
      <section style={{ padding: '1rem 2rem 4rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
          {sorted.map(p => <ProjectCard key={p.name} p={p} />)}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, #08142D 0%, #0C2046 100%)', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '3.5rem 2rem' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800, fontSize: '2rem', textTransform: 'uppercase', letterSpacing: '0.005em', margin: '0 0 0.75rem' }}>
            Building or financing a Canadian site?
          </h2>
          <p style={{ color: '#cbd5e1', margin: '0 0 1.75rem', fontSize: '1rem', lineHeight: 1.65 }}>
            Send us the project. We&apos;ll score it on the same six factors against the public record and tell you what the next 90 days actually look like.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={bookingUrl("reality-vs-press")} target="_blank" rel="noopener noreferrer" style={{ background: '#C8001F', color: '#fff', padding: '0.875rem 1.75rem', borderRadius: 6, textDecoration: 'none', fontWeight: 700, fontSize: '0.9375rem' }}>
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
