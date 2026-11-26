import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { createClient as createSanity } from '@sanity/client'

export const revalidate = 3600;

// ── Market definitions ────────────────────────────────────────────────────────

export const MARKETS: Record<string, {
  name: string; abbr: string; country: string
  iso: string; isoFull: string
  headline: string; subheadline: string
  tier: 'primary' | 'emerging' | 'developing'
  fiberBrief?: string
}> = {
  virginia: {
    name: 'Virginia', abbr: 'VA', country: 'US',
    iso: 'PJM', isoFull: 'PJM Interconnection',
    headline: 'THE DATA CENTER CAPITAL OF THE WORLD',
    subheadline: 'Northern Virginia hosts more data center capacity than any other market on Earth. Power is the constraint.',
    tier: 'primary',
    fiberBrief: 'Northern Virginia has the densest metro dark-fiber footprint in North America, alongside Silicon Valley, Chicago, and Dallas — but density has created its own bottleneck. Routes into Ashburn and the Data Center Alley corridor are congested, with construction crews, conduit space, and carrier capacity all under pressure from the sheer volume of concurrent builds. New entrants should expect real competition for dig windows and route access even where fiber already exists nearby.',
  },
  texas: {
    name: 'Texas', abbr: 'TX', country: 'US',
    iso: 'ERCOT', isoFull: 'Electric Reliability Council of Texas',
    headline: 'THE LONE STAR GRID',
    subheadline: 'ERCOT\'s deregulated market and abundant renewables make Texas a top-tier expansion target for hyperscalers.',
    tier: 'primary',
    fiberBrief: 'Dallas remains one of the four markets with the deepest concentration of metro dark fiber in North America, giving it a mature, multi-carrier bench for laterals and long-haul transport. San Antonio is rising fast as a secondary hub behind Dallas, drawing overflow demand and new hyperscale investment, but its regional carrier density is still catching up — buyers there should expect a smaller supplier bench and plan lateral routes earlier than they would in Dallas proper.',
  },
  georgia: {
    name: 'Georgia', abbr: 'GA', country: 'US',
    iso: 'SERC', isoFull: 'SERC Reliability Corporation',
    headline: 'THE SOUTHEAST CORRIDOR',
    subheadline: 'Atlanta is the connectivity hub of the Southeast. Georgia Power and TVA territory with strong incentive programs.',
    tier: 'primary',
    fiberBrief: 'Atlanta anchors network connectivity for the entire Southeast, with a mature carrier-neutral colocation base and multiple long-haul routes converging on the metro. Regional fiber options thin out quickly outside the Atlanta core, so sites elsewhere in Georgia Power or TVA territory should budget for longer laterals and confirm carrier serviceability early rather than assuming Atlanta-level density extends statewide.',
  },
  michigan: {
    name: 'Michigan', abbr: 'MI', country: 'US',
    iso: 'MISO', isoFull: 'Midcontinent ISO',
    headline: 'THE GREAT LAKES ADVANTAGE',
    subheadline: 'Abundant freshwater cooling, competitive power rates, and a growing hyperscaler footprint in West Michigan.',
    tier: 'emerging',
    fiberBrief: 'West Michigan\'s hyperscaler footprint is still young relative to its power and cooling advantages, and regional carrier density reflects that — fiber options are workable but not deep, with most long-haul routes running through larger Midwest hubs rather than terminating locally. Buyers should scope laterals with a regional carrier early and treat construction lead time as a first-order planning input rather than an afterthought.',
  },
  arizona: {
    name: 'Arizona', abbr: 'AZ', country: 'US',
    iso: 'WECC', isoFull: 'Western Electricity Coordinating Council',
    headline: 'PHOENIX: THE WESTERN EXPANSION HUB',
    subheadline: 'Low land costs, tax incentives, and APS/SRP utility infrastructure driving rapid Western US expansion.',
    tier: 'emerging',
    fiberBrief: 'Phoenix has built out a genuine carrier-neutral colocation base over the past decade, and long-haul routes connecting it to Los Angeles and Dallas give it reasonable transport diversity for a Western secondary market. Even so, the pace of new campus announcements is outrunning regional fiber buildout in outlying areas, so sites outside the core Phoenix metro should plan for longer construction timelines on laterals.',
  },
  ohio: {
    name: 'Ohio', abbr: 'OH', country: 'US',
    iso: 'PJM', isoFull: 'PJM Interconnection',
    headline: 'THE MIDWEST INFRASTRUCTURE CORRIDOR',
    subheadline: 'Columbus and central Ohio emerging as the next major data center cluster. Strong PJM grid access.',
    tier: 'emerging',
    fiberBrief: 'Columbus is one of the clearest 2026 deal-activity leaders in the country, but its regional fiber density has not kept pace with the capital flowing in — metro dark fiber remains concentrated in Northern Virginia, Silicon Valley, Chicago, and Dallas, not central Ohio. That gap means buyers here face a thinner carrier bench and should expect fiber cable lead times of 20 weeks to a year to shape site-selection and construction schedules directly.',
  },
  illinois: {
    name: 'Illinois', abbr: 'IL', country: 'US',
    iso: 'PJM', isoFull: 'PJM Interconnection',
    headline: 'CHICAGO: THE NETWORK CROSSROADS',
    subheadline: 'Chicago is one of the densest network peering hubs in North America. Critical for latency-sensitive deployments.',
    tier: 'primary',
    fiberBrief: 'Chicago is one of the four markets with the deepest concentration of metro dark fiber in North America, and its carrier-hotel and peering infrastructure make it a true crossroads for long-haul routes running east-west and north-south. That density gives buyers unusually strong route-diversity options and a large supplier bench — Chicago is typically the easiest of the secondary-adjacent Midwest markets to source competitively.',
  },
  oregon: {
    name: 'Oregon', abbr: 'OR', country: 'US',
    iso: 'WECC', isoFull: 'Western Electricity Coordinating Council',
    headline: 'COLUMBIA RIVER HYDRO POWER',
    subheadline: 'Affordable hydro power and a long history of hyperscaler investment along the Columbia River corridor.',
    tier: 'primary',
    fiberBrief: 'The Columbia River corridor has a long operating history with hyperscale tenants, which has built out a genuinely mature regional carrier base along with the power infrastructure. That maturity gives Oregon sites an easier path to carrier diversity than most emerging markets, though buyers moving away from the established corridor toward newer sites should still confirm serviceability rather than assume corridor-wide density.',
  },
  washington: {
    name: 'Washington', abbr: 'WA', country: 'US',
    iso: 'WECC', isoFull: 'Western Electricity Coordinating Council',
    headline: 'THE PACIFIC NORTHWEST POWER CORRIDOR',
    subheadline: 'BPA hydro power, Microsoft\'s home market, and a dense fiber spine along I-90 and I-5.',
    tier: 'primary',
    fiberBrief: 'The I-90 and I-5 fiber spine gives the Seattle metro genuine carrier density, but the real story in 2026 is Central Washington emerging as a tertiary wave market alongside Iowa and Kansas City — new capacity is landing well outside the traditional corridor. Sites in Central Washington should expect materially thinner regional fiber options than Seattle and plan laterals with the assumption that construction, not just carrier selection, is on the critical path.',
  },
  ontario: {
    name: 'Ontario', abbr: 'ON', country: 'CA',
    iso: 'IESO', isoFull: 'Independent Electricity System Operator',
    headline: 'CANADA\'S DATA CENTER GATEWAY',
    subheadline: 'Toronto and the Golden Horseshoe are Canada\'s leading digital infrastructure markets with strong grid access.',
    tier: 'primary',
    fiberBrief: 'Toronto is Canada\'s clearest analog to a primary US fiber market — carrier-neutral colocation, a deep peering ecosystem, and long-haul routes connecting to both the US Midwest and Quebec give the Golden Horseshoe genuine route diversity. Buyers here typically face the most competitive supplier bench of any Canadian market, though cross-border transport terms still need to be scoped carefully alongside domestic options.',
  },
  quebec: {
    name: 'Quebec', abbr: 'QC', country: 'CA',
    iso: 'HQ', isoFull: 'Hydro-Québec',
    headline: 'LOW-CARBON HYDRO POWER AT SCALE',
    subheadline: 'Hydro-Québec offers some of the cheapest and cleanest power in North America. New large-DC rate (~13¢/kWh) launches H2 2026 — re-opening the door for AI infrastructure.',
    tier: 'emerging',
    fiberBrief: 'Montreal is anchoring one of the largest announced AI infrastructure commitments in Canada — Bell\'s 500 MW AI Fabric project — which is pulling new long-haul and metro fiber investment into the corridor ahead of demand. That means the carrier landscape is shifting quickly: buyers evaluating Montreal-area sites now should expect the supplier bench to look meaningfully different — and denser — within the next 12-24 months as that build-out matures.',
  },
  alberta: {
    name: 'Alberta', abbr: 'AB', country: 'CA',
    iso: 'AESO', isoFull: 'Alberta Electric System Operator',
    headline: 'BEHIND-THE-METER GAS + DEREGULATED MARKET',
    subheadline: 'The only Canadian market where you can credibly co-locate generation with load. 30+ AI DC projects in the AESO queue. Calgary metro is the gravity center.',
    tier: 'emerging',
    fiberBrief: 'Alberta is the frontier of Canadian AI data-center development, with Calgary as the gravity center and the Wonder Valley project signaling the scale of what\'s coming. Fiber infrastructure is still catching up to the 30+ AI DC projects in the AESO interconnection queue — this is a market where connectivity should be scoped alongside power and land from day one, not treated as a later-stage checklist item, given how far ahead of regional fiber build-out the project queue currently runs.',
  },
  'british-columbia': {
    name: 'British Columbia', abbr: 'BC', country: 'CA',
    iso: 'BCH', isoFull: 'BC Hydro',
    headline: 'CONSTRAINED, BUT SITE C IS FRESH MW',
    subheadline: 'BC limits new DC interconnections in 2026 to 300 MW for AI and 100 MW general — but Site C just came online and First Nations partnerships are unlocking the bulk of viable opportunities.',
    tier: 'developing',
    fiberBrief: 'With new DC interconnections capped in 2026, BC\'s connectivity story is tightly coupled to where the limited available capacity actually lands — largely through First Nations partnership sites unlocked alongside Site C. Regional fiber options should be evaluated site-by-site rather than assumed at a provincial level, since the constrained interconnection landscape means viable locations are the exception, not the rule.',
  },
  saskatchewan: {
    name: 'Saskatchewan', abbr: 'SK', country: 'CA',
    iso: 'SaskPower', isoFull: 'SaskPower',
    headline: 'TELECOM HUB + EMERGING AI CAMPUSES',
    subheadline: 'Regina and Saskatoon host provincial telecom DCs; Bell\'s 300 MW Saskatchewan AI campus and George Gordon FN partnership signal the next wave.',
    tier: 'developing',
    fiberBrief: 'Regina and Saskatoon carry the province\'s existing telecom DC infrastructure, but Bell\'s 300 MW AI campus and the George Gordon First Nation partnership represent a genuinely new tier of connectivity demand for the province. Regional fiber capacity built for telecom-scale workloads will need real augmentation to serve AI-scale campuses — buyers should treat this as a build-ahead market rather than one with existing spare dark-fiber capacity.',
  },
  manitoba: {
    name: 'Manitoba', abbr: 'MB', country: 'CA',
    iso: 'Manitoba Hydro', isoFull: 'Manitoba Hydro',
    headline: 'WINNIPEG CONVERSION PLAY',
    subheadline: 'Bell\'s Winnipeg food-plant-to-AI conversion and Cerebras\' announced Manitoba campus put Winnipeg on the sovereign compute map.',
    tier: 'developing',
    fiberBrief: 'Winnipeg\'s emergence as a sovereign-compute site — via Bell\'s conversion project and the announced Cerebras campus — is a conversion story more than an organic build-out, which means fiber connectivity is being retrofitted to a facility that wasn\'t originally designed for AI-scale bandwidth. Buyers should confirm actual carrier serviceability and route diversity at the specific site rather than assuming Winnipeg\'s telecom-era infrastructure is sufficient as-is.',
  },
  'nova-scotia': {
    name: 'Nova Scotia', abbr: 'NS', country: 'CA',
    iso: 'NS Power', isoFull: 'Nova Scotia Power',
    headline: 'ATLANTIC CONNECTIVITY',
    subheadline: 'Halifax anchors Atlantic telecom and colocation — smaller scale but strategic for east-coast latency.',
    tier: 'developing',
    fiberBrief: 'Halifax\'s role as an Atlantic telecom and colocation anchor gives it useful subsea and east-coast latency positioning, but the market is small-scale relative to central Canada. Regional fiber options are workable for the telecom and enterprise colocation loads the market actually serves today; larger AI-scale deployments would need a dedicated serviceability check before assuming that infrastructure scales up cleanly.',
  },
  'new-brunswick': {
    name: 'New Brunswick', abbr: 'NB', country: 'CA',
    iso: 'NB Power', isoFull: 'NB Power',
    headline: 'MONCTON / SAINT JOHN CORRIDOR',
    subheadline: 'Equinix SJ1 and Bell Moncton provide regional peering and enterprise colocation.',
    tier: 'developing',
    fiberBrief: 'The Moncton/Saint John corridor benefits from Equinix SJ1 and Bell Moncton\'s existing peering and colocation infrastructure, giving the province a credible regional fiber base for enterprise-scale workloads. That infrastructure was built for regional peering, not hyperscale AI capacity, so larger deployments should confirm route diversity and available strand capacity rather than assume headroom.',
  },
  newfoundland: {
    name: 'Newfoundland and Labrador', abbr: 'NL', country: 'CA',
    iso: 'NL Hydro', isoFull: 'Newfoundland and Labrador Hydro',
    headline: 'ST. JOHN\'S TELECOM NODE',
    subheadline: 'Limited colo footprint; primarily telecom and enterprise DC capacity.',
    tier: 'developing',
    fiberBrief: 'St. John\'s functions primarily as a telecom node with limited colocation footprint, so regional fiber options are built around carrier and enterprise DC needs rather than hyperscale capacity. Any larger deployment here should start with a direct serviceability check rather than assuming density comparable to a mainland secondary market.',
  },
  'prince-edward-island': {
    name: 'Prince Edward Island', abbr: 'PE', country: 'CA',
    iso: 'Maritime Electric', isoFull: 'Maritime Electric',
    headline: 'ISLAND TELECOM DC',
    subheadline: 'Single provincial telecom hub — niche edge use cases only.',
    tier: 'developing',
    fiberBrief: 'PEI\'s single provincial telecom hub structure means fiber options are limited by design — this is an edge-use-case market, not a candidate for large-scale interconnection or dark-fiber sourcing. Buyers evaluating PEI should scope for niche, latency-specific use cases and confirm the single-hub topology meets resilience requirements before committing.',
  },
  'northwest-territories': {
    name: 'Northwest Territories', abbr: 'NT', country: 'CA',
    iso: 'NTPC', isoFull: 'Northwest Territories Power Corporation',
    headline: 'ARCTIC EDGE TELECOM',
    subheadline: 'Yellowknife Northwestel hub — cooling advantage, limited MW.',
    tier: 'developing',
    fiberBrief: 'Yellowknife\'s Northwestel hub offers a real cooling advantage for edge deployments, but fiber connectivity into the territory is limited and long-haul routes are correspondingly scarce. This is a market where lateral construction and route diversity should be treated as the primary constraint, ahead of power, given how thin the existing telecom backbone is relative to southern Canadian markets.',
  },
  yukon: {
    name: 'Yukon', abbr: 'YT', country: 'CA',
    iso: 'Yukon Energy', isoFull: 'Yukon Energy',
    headline: 'NORTHERN TELECOM',
    subheadline: 'No major colo/hyperscale footprint tracked yet.',
    tier: 'developing',
    fiberBrief: 'With no major colocation or hyperscale footprint tracked yet, Yukon\'s fiber infrastructure remains built for basic regional telecom needs rather than data-center-scale connectivity. Any serious evaluation here should start with a first-principles serviceability and route survey rather than assuming any existing dark-fiber inventory.',
  },
  nunavut: {
    name: 'Nunavut', abbr: 'NU', country: 'CA',
    iso: 'Qulliq Energy', isoFull: 'Qulliq Energy Corporation',
    headline: 'NO MAJOR DC INVENTORY',
    subheadline: 'Honest zero — monitor for Arctic edge / sovereign compute pilots.',
    tier: 'developing',
    fiberBrief: 'Nunavut has no tracked data-center fiber inventory today, and terrestrial long-haul options are genuinely scarce given the territory\'s geography. Any future Arctic-edge or sovereign-compute pilot here would need a dedicated connectivity feasibility study from scratch — there is no existing carrier bench to source against.',
  },
  queretaro: {
    name: 'Querétaro', abbr: 'QRO', country: 'MX',
    iso: 'CENACE', isoFull: 'Centro Nacional de Control de Energía',
    headline: 'MEXICO\'S SILICON VALLEY',
    subheadline: 'Nearshore manufacturing, strong fiber spine, and a growing hyperscaler presence driven by nearshoring demand.',
    tier: 'emerging',
    fiberBrief: 'Querétaro\'s existing fiber spine — built up alongside its nearshore manufacturing base — gives it a genuine head start over most emerging Latin American markets, with reasonable route diversity toward Mexico City and the US border. Growing hyperscaler interest is now testing the limits of that legacy infrastructure, so buyers should confirm current carrier capacity rather than assume the spine was sized for data-center-scale bandwidth from the start.',
  },
  utah: {
    name: 'Utah', abbr: 'UT', country: 'US',
    iso: 'WECC', isoFull: 'Western Electricity Coordinating Council',
    headline: 'SALT LAKE CITY: THE MOUNTAIN WEST LEADER',
    subheadline: 'Salt Lake City is a 2026 deal-activity leader — land, power, and permitting economics are pulling hyperscale investment into the Wasatch Front.',
    tier: 'emerging',
    fiberBrief: 'Salt Lake City is one of 2026\'s top deal-activity markets, but carrier density has not caught up to demand — metro dark fiber remains concentrated in Northern Virginia, Silicon Valley, Chicago, and Dallas, not the Mountain West. Buyers here should expect thinner regional fiber options and longer lateral distances than legacy hubs. With cable lead times running 20 weeks to a year, early engagement with regional and national carriers is critical to keep a Salt Lake City build on schedule.',
  },
  nevada: {
    name: 'Nevada', abbr: 'NV', country: 'US',
    iso: 'WECC', isoFull: 'Western Electricity Coordinating Council',
    headline: 'RENO: THE HIGH-DESERT HUB',
    subheadline: 'Reno is a 2026 deal-activity leader, building on its existing Tahoe Reno Industrial Center hyperscale base and low-cost power access.',
    tier: 'emerging',
    fiberBrief: 'Reno is a 2026 deal-activity leader on the strength of the Tahoe Reno Industrial Center and its proximity to Northern California power and fiber routes, but it sits outside the traditional dark-fiber core of Northern Virginia, Silicon Valley, Chicago, and Dallas. Expect a thinner regional carrier bench than legacy hubs and plan laterals early — fiber cable lead times of 20 weeks to a year make route planning a schedule-critical task, not an afterthought.',
  },
  indiana: {
    name: 'Indiana', abbr: 'IN', country: 'US',
    iso: 'MISO', isoFull: 'Midcontinent ISO',
    headline: 'INDIANAPOLIS: THE CROSSROADS BUILDOUT',
    subheadline: 'Indianapolis is a 2026 deal-activity leader, leveraging its central-US logistics position and MISO grid access for hyperscale expansion.',
    tier: 'emerging',
    fiberBrief: 'Indianapolis is a 2026 deal-activity leader, drawing on its central-US crossroads position for logistics and network transit — but like the other secondary markets driving this cycle, its metro dark-fiber density is thinner than the established cores of Northern Virginia, Silicon Valley, Chicago, and Dallas. Carrier-neutral sourcing matters more here, since no single national network blankets the market the way it does in Chicago. Plan for 20-week-to-one-year fiber cable lead times when scoping laterals into new Indianapolis sites.',
  },
}

// ── Static params ─────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  return Object.keys(MARKETS).map((state) => ({ state }))
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }): Promise<Metadata> {
  const { state } = await params
  const market = MARKETS[state]
  if (!market) return {}
  return {
    title: `${market.name} Data Center Market | Konative`,
    description: `Data center availability intelligence for ${market.name}. Projects, power pipeline, network infrastructure, and market activity — updated automatically.`,
    alternates: { canonical: `/markets/${state}` },
    openGraph: {
      title: `${market.name} Data Center Market Intelligence`,
      description: market.subheadline,
    },
  }
}

// ── Data fetchers ─────────────────────────────────────────────────────────────

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const sanity = createSanity({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  // dataCenterProject documents are not readable by an anonymous/public
  // query (confirmed: unauthenticated queries return 0 for this type even
  // though 1,670+ real documents exist) — a token is required.
  token: process.env.SANITY_API_TOKEN,
})

async function getMarketData(abbr: string, name: string, country: string) {
  const [projects, facilities, network, power, news] = await Promise.allSettled([
    // DC projects from Sanity
    sanity.fetch(`*[_type == "dataCenterProject" && country == $country && (provinceCode == $abbr || state == $name || state == $abbr)] | order(capacityMw desc) {
      _id, name, operator, city, state, provinceCode, status, capacityMw, source, blockReason
    }[0...50]`, { abbr, name, country }),

    // IM3 facilities
    supabase.from('dc_facilities').select('id,name,operator,city,state,status,capacity_mw,facility_type')
      .ilike('state', `%${abbr}%`).limit(50),

    // PeeringDB network nodes
    supabase.from('network_facilities').select('pdb_id,name,org_name,city,state,net_count,ix_count')
      .ilike('state', `%${abbr}%`).limit(30),

    // EIA planned generation
    supabase.from('generation_pipeline').select('plant_id,plant_name,utility_name,county,technology,capacity_mw,planned_year')
      .eq('state', abbr).gte('planned_year', new Date().getFullYear())
      .order('capacity_mw', { ascending: false }).limit(20),

    // Recent news from Sanity
    sanity.fetch(`*[_type == "article" && ($abbr in states || $name in states || $abbr in body[].children[].text || $name in body[].children[].text)] | order(publishedAt desc) {
      _id, title, publishedAt, sourceUrl, source
    }[0...5]`, { abbr, name }).catch(() => []),
  ])

  return {
    projects: projects.status === 'fulfilled' ? (projects.value as unknown[]) ?? [] : [],
    facilities: facilities.status === 'fulfilled' ? (facilities.value.data ?? []) : [],
    network: network.status === 'fulfilled' ? (network.value.data ?? []) : [],
    power: power.status === 'fulfilled' ? (power.value.data ?? []) : [],
    news: news.status === 'fulfilled' ? (news.value as unknown[]) ?? [] : [],
  }
}

// ── Types ─────────────────────────────────────────────────────────────────────

type Project = { _id: string; name: string; operator?: string; city?: string; state?: string; status: string; capacityMw?: number; source: string }
type Facility = { id: number; name: string; operator?: string; city?: string; state?: string; status?: string; capacity_mw?: number; facility_type?: string }
type NetworkNode = { pdb_id: number; name: string; org_name?: string; city?: string; state?: string; net_count: number; ix_count: number }
type PowerPlant = { plant_id: string; plant_name: string; utility_name?: string; county?: string; technology?: string; capacity_mw?: number; planned_year?: number }
type NewsItem = { _id: string; title: string; publishedAt?: string; sourceUrl?: string; source?: string }

// ── Status helpers ────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  operational: '#22d3ee', construction: '#C8001F', announced: '#a78bfa',
  stalled: '#f59e0b', blocked: '#ef4444', paused: '#fb923c', canceled: '#64748b',
}
const TIER_LABELS = { primary: 'PRIMARY MARKET', emerging: 'EMERGING MARKET', developing: 'DEVELOPING MARKET' }
const TIER_COLORS = { primary: '#C8001F', emerging: '#a78bfa', developing: '#4ade80' }

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function MarketPage({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params
  const market = MARKETS[state]
  if (!market) notFound()

  const data = await getMarketData(market.abbr, market.name, market.country)

  const totalMw = (data.projects as Project[]).reduce((s, p) => s + (p.capacityMw ?? 0), 0)
    + (data.power as PowerPlant[]).reduce((s, p) => s + (p.capacity_mw ?? 0), 0)
  const operationalCount = (data.projects as Project[]).filter(p => p.status === 'operational').length
  const constructionCount = (data.projects as Project[]).filter(p => p.status === 'construction').length
  const announcedCount = (data.projects as Project[]).filter(p => p.status === 'announced').length

  return (
    <div style={{ background: '#08142D', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>

      {/* Hero */}
      <div style={{ paddingTop: 96, paddingBottom: 48, paddingLeft: 48, paddingRight: 48, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <Link href="/map" style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.35)', textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              ← Map
            </Link>
            <span style={{ color: 'rgba(255,255,255,0.15)' }}>/</span>
            <Link href="/markets" style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.35)', textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Markets
            </Link>
            <span style={{ color: 'rgba(255,255,255,0.15)' }}>/</span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#C8001F', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {market.name}
            </span>
          </div>

          <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: 'Inter, sans-serif', fontSize: 9, fontWeight: 600,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: TIER_COLORS[market.tier],
              border: `1px solid ${TIER_COLORS[market.tier]}`,
              padding: '3px 8px',
            }}>
              {TIER_LABELS[market.tier]}
            </span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              {market.iso} · {market.country === 'US' ? 'United States' : market.country === 'CA' ? 'Canada' : 'Mexico'}
            </span>
          </div>

          <h1 style={{
            fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800,
            fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 0.93,
            textTransform: 'uppercase', color: '#fff', margin: '0 0 16px',
          }}>
            {market.name}<br />
            <span style={{ color: '#C8001F' }}>{market.headline}</span>
          </h1>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, lineHeight: 1.6, color: 'rgba(255,255,255,0.45)', maxWidth: 580, margin: 0 }}>
            {market.subheadline}
          </p>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 48px' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', display: 'flex', flexWrap: 'wrap' }}>
          {[
            { label: 'DC Projects', value: data.projects.length },
            { label: 'Operational', value: operationalCount, color: STATUS_COLORS.operational },
            { label: 'Under Construction', value: constructionCount, color: STATUS_COLORS.construction },
            { label: 'Announced', value: announcedCount, color: STATUS_COLORS.announced },
            { label: 'IM3 Facilities', value: data.facilities.length },
            { label: 'Network Nodes', value: data.network.length },
            { label: 'Planned Gen (MW)', value: totalMw > 0 ? `${(totalMw / 1000).toFixed(1)}+ GW` : '—' },
          ].map(stat => (
            <div key={stat.label} style={{
              padding: '20px 24px', borderRight: '1px solid rgba(255,255,255,0.07)',
              minWidth: 120,
            }}>
              <div style={{ fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700, fontSize: 28, color: stat.color ?? '#fff', lineHeight: 1 }}>
                {stat.value}
              </div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '48px 48px 80px', display: 'grid', gridTemplateColumns: '1fr 360px', gap: 48, alignItems: 'start' }}>

        {/* Left col */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>

          {/* DC Projects */}
          <Section title="DC Projects" count={data.projects.length} source="OSM · Wikidata · News">
            {data.projects.length === 0 ? (
              <EmptyState msg="No projects indexed for this market yet." />
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    {['Name', 'Operator', 'City', 'Status', 'MW'].map(h => (
                      <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontFamily: 'Inter, sans-serif', fontSize: 9, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(data.projects as Project[]).slice(0, 15).map(p => (
                    <tr key={p._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={tdStyle}><span style={{ color: '#fff', fontWeight: 500 }}>{p.name}</span></td>
                      <td style={tdStyle}>{p.operator ?? '—'}</td>
                      <td style={tdStyle}>{p.city ?? '—'}</td>
                      <td style={tdStyle}>
                        <span style={{ color: STATUS_COLORS[p.status] ?? '#fff', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{p.status}</span>
                      </td>
                      <td style={tdStyle}>{p.capacityMw ? `${p.capacityMw} MW` : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Section>

          {/* Planned Power */}
          {data.power.length > 0 && (
            <Section title="Planned Generation Pipeline" count={data.power.length} source="EIA-860M">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    {['Plant', 'Technology', 'County', 'MW', 'Est. Year'].map(h => (
                      <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontFamily: 'Inter, sans-serif', fontSize: 9, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(data.power as PowerPlant[]).map(p => (
                    <tr key={p.plant_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={tdStyle}><span style={{ color: '#fff', fontWeight: 500 }}>{p.plant_name}</span></td>
                      <td style={tdStyle}>{p.technology ?? '—'}</td>
                      <td style={tdStyle}>{p.county ?? '—'}</td>
                      <td style={tdStyle}><span style={{ color: '#eab308', fontWeight: 600 }}>{p.capacity_mw ? `${p.capacity_mw} MW` : '—'}</span></td>
                      <td style={tdStyle}>{p.planned_year ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Section>
          )}

          {/* Network */}
          {data.network.length > 0 && (
            <Section title="Network & Colocation" count={data.network.length} source="PeeringDB">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 8 }}>
                {(data.network as NetworkNode[]).map(n => (
                  <div key={n.pdb_id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', padding: '12px 14px' }}>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{n.name}</div>
                    {n.org_name && <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>{n.org_name}</div>}
                    <div style={{ display: 'flex', gap: 12 }}>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: '#a855f7' }}>{n.net_count} networks</span>
                      {n.ix_count > 0 && <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{n.ix_count} IXPs</span>}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* Right sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Grid info */}
          <SideCard title="Grid & Power">
            <Row label="ISO / RTO" value={market.iso} />
            <Row label="Full Name" value={market.isoFull} />
            <Row label="Power Layer" value={data.power.length > 0 ? `${data.power.length} planned plants` : 'EIA data pending'} />
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <Link href="/map" style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: '#C8001F', textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                View on Map →
              </Link>
            </div>
          </SideCard>

          {/* IM3 facilities */}
          {data.facilities.length > 0 && (
            <SideCard title={`IM3 Verified Facilities (${data.facilities.length})`}>
              {(data.facilities as Facility[]).slice(0, 8).map(f => (
                <div key={f.id} style={{ paddingBottom: 8, marginBottom: 8, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#fff', fontWeight: 500 }}>{f.name}</div>
                  {f.operator && <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{f.operator}</div>}
                  {f.city && <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>{f.city}</div>}
                </div>
              ))}
            </SideCard>
          )}

          {/* Recent news */}
          {data.news.length > 0 && (
            <SideCard title="Recent News">
              {(data.news as NewsItem[]).map(n => (
                <div key={n._id} style={{ paddingBottom: 10, marginBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <a href={n.sourceUrl ?? '#'} target="_blank" rel="noopener noreferrer"
                    style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.75)', textDecoration: 'none', lineHeight: 1.4, display: 'block' }}>
                    {n.title}
                  </a>
                  {n.publishedAt && (
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 3 }}>
                      {new Date(n.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  )}
                </div>
              ))}
            </SideCard>
          )}

          {/* CTA */}
          <div style={{ background: 'rgba(224,123,57,0.1)', border: '1px solid rgba(224,123,57,0.3)', padding: '20px 20px' }}>
            <div style={{ fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700, fontSize: 18, textTransform: 'uppercase', color: '#fff', marginBottom: 8 }}>
              Building in {market.name}?
            </div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, margin: '0 0 14px' }}>
              We source the network into facilities in this market — laterals, waves, transit, and cross-connects — across 100+ suppliers, at no cost to you.
            </p>
            <Link href="/contact?projectType=data_center" style={{
              display: 'inline-block', padding: '8px 16px',
              background: '#C8001F', color: '#fff',
              fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 10,
              textTransform: 'uppercase', letterSpacing: '0.1em', textDecoration: 'none',
            }}>
              Start a Sourcing Request →
            </Link>
          </div>
        </div>
      </div>

      {/* Connectivity Procurement */}
      {(() => {
        const brief = market.fiberBrief ??
          `Carrier density in ${market.name} varies block-by-block, and provider coverage claims routinely overstate real serviceability. Before committing to a site, validate which carriers can actually reach the parcel, how far the lateral runs, and what construction timelines look like — we scope that across 100+ suppliers, including the regional fiber providers the national maps miss.`
        const faq = [
          {
            q: `Who provides data center connectivity in ${market.name}?`,
            a: `${brief} Konative is a vendor-neutral brokerage: we make national and regional carriers compete for laterals, wavelengths, dedicated internet, and transport into ${market.name} facilities, at no cost to the buyer.`,
          },
          {
            q: `How long does fiber construction take in ${market.name}?`,
            a: `Fiber cable lead times currently run 20 weeks to a year, and lateral construction typically needs 1–3 months of design, 3–6 months of permitting, and 3–12 months of build depending on distance and terrain. In ${market.name}, start connectivity scoping at site selection — not at commissioning.`,
          },
          {
            q: `How do I get carrier-neutral quotes in ${market.name}?`,
            a: `Bring us the site (or coordinates) and requirements. We run the market across 100+ suppliers through our distribution partnership, return apples-to-apples quotes with construction and timeline detail, and stay on the account for its life. The suppliers pay us — the service costs you nothing.`,
          },
        ]
        return (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '64px 48px' }}>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'FAQPage',
                  mainEntity: faq.map((f) => ({
                    '@type': 'Question',
                    name: f.q,
                    acceptedAnswer: { '@type': 'Answer', text: f.a },
                  })),
                }),
              }}
            />
            <div style={{ maxWidth: 1320, margin: '0 auto' }}>
              <p style={{
                display: 'flex', alignItems: 'center', gap: 12,
                fontFamily: 'Inter, sans-serif', fontWeight: 600,
                fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase',
                color: '#C8001F', marginBottom: 20,
              }}>
                <span style={{ display: 'block', width: 36, height: 1, background: '#C8001F' }} />
                Connectivity Procurement
              </p>
              <h2 style={{
                fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800,
                fontSize: 'clamp(30px, 3.6vw, 48px)', lineHeight: 0.95,
                textTransform: 'uppercase', color: '#fff', margin: '0 0 20px',
              }}>
                Getting fiber to a site in {market.name}.
              </h2>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.55)', maxWidth: 760, margin: '0 0 32px' }}>
                {brief}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 1, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.07)', marginBottom: 32 }}>
                {[
                  { v: '20 wks – 1 yr', l: 'Fiber cable lead times, mid-2026' },
                  { v: '$18 vs $8 /ft', l: 'Underground vs aerial construction medians (FBA 2025)' },
                  { v: '100+', l: 'Suppliers quoted, national + regional' },
                ].map((s) => (
                  <div key={s.l} style={{ background: '#08142D', padding: '20px 20px' }}>
                    <div style={{ fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800, fontSize: 30, color: '#C8001F', lineHeight: 1 }}>{s.v}</div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 6, lineHeight: 1.4 }}>{s.l}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
                <Link href="/tools/lateral-estimator" style={{
                  fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 11,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  background: '#C8001F', color: '#fff', padding: '13px 26px', textDecoration: 'none',
                }}>
                  Estimate a lateral in this market →
                </Link>
                <Link href="/data-center-connectivity" style={{
                  fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 11,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: '#fff', border: '1px solid rgba(255,255,255,0.25)', padding: '12px 26px', textDecoration: 'none',
                }}>
                  Data Center Connectivity →
                </Link>
                <a href="https://cal.com/jeramey-james/15min" style={{
                  fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 11,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.6)', textDecoration: 'none',
                }}>
                  Book 15 minutes →
                </a>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

const tdStyle: React.CSSProperties = {
  padding: '10px 12px',
  fontFamily: 'Inter, sans-serif',
  fontSize: 12,
  color: 'rgba(255,255,255,0.55)',
  verticalAlign: 'top',
}

function Section({ title, count, source, children }: { title: string; count: number; source: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: 12 }}>
        <h2 style={{ fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700, fontSize: 20, textTransform: 'uppercase', color: '#fff', margin: 0 }}>{title}</h2>
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>({count})</span>
        <span style={{ marginLeft: 'auto', fontFamily: 'Inter, sans-serif', fontSize: 9, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{source}</span>
      </div>
      {children}
    </div>
  )
}

function SideCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', padding: '16px 18px' }}>
      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 9, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>
        {title}
      </div>
      {children}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{label}</span>
      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#fff', fontWeight: 500, textAlign: 'right' }}>{value}</span>
    </div>
  )
}

function EmptyState({ msg }: { msg: string }) {
  return (
    <div style={{ padding: '24px 0', fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>{msg}</div>
  )
}
