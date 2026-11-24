import type { Metadata } from 'next'

import { AsOfLabel } from '@/components/AsOfLabel'
import { resolveFreshStat } from '@/lib/contentFreshness'
import { fetchMarketSignalsStats } from '@/lib/marketSignalsStats'

import GovernorMapClient from './GovernorMapClient'

export const metadata: Metadata = {
  title: 'Market Signals — Stalled Data Center Projects & Tribal Brief | Konative',
  description: 'A Konative market-signal brief for stalled data center projects, governors, and Tribal / First Nations data-center context across North America.',
}

export const revalidate = 3600

export default async function GovernorsPage() {
  const stats = await fetchMarketSignalsStats()
  const stalledStat = resolveFreshStat(stats?.stalled, stats?.updatedAt)
  const governorStat = resolveFreshStat(stats?.focusGovernors, stats?.updatedAt)

  return (
    <main className="signals-page">
      <section className="signals-hero">
        <div>
          <p className="signals-eyebrow">Market signals · governors · stalled projects</p>
          <h1>Where infrastructure plans stall, procurement risk shows up.</h1>
          <p>
            This working map tracks stalled data-center projects, state-level context, and Tribal / First
            Nations project signals. It is a research surface for connectivity strategy, not a finished
            public-policy product.
          </p>
          {stalledStat.kind === 'live' ? <AsOfLabel label={stalledStat.asOfLabel} /> : null}
        </div>
        <div className="signals-stat-grid" aria-label="Current signal layers">
          {stalledStat.kind === 'live' ? (
            <span><strong>{stalledStat.value}</strong> stalled project records</span>
          ) : (
            <span>Stalled project counts temporarily hidden — dataset refresh pending</span>
          )}
          {governorStat.kind === 'live' ? (
            <span><strong>{governorStat.value}</strong> governors with DC policy notes</span>
          ) : (
            <span>Governor context layer</span>
          )}
          <span><strong>US + CA</strong> Tribal / First Nations context</span>
        </div>
      </section>
      <section className="signals-map-shell">
        <GovernorMapClient />
      </section>
    </main>
  )
}
