import type { Metadata } from 'next'

import { AsOfLabel } from '@/components/AsOfLabel'
import { buildMarketSignalsHeroView } from '@/lib/publicStatSurfaces'
import { fetchMarketSignalsStats } from '@/lib/marketSignalsStats'

import GovernorMapClient from './GovernorMapClient'

export const metadata: Metadata = {
  title: 'Market Signals — Stalled Data Center Projects & Tribal Brief | Konative',
  description: 'A Konative market-signal brief for stalled data center projects, governors, and Tribal / First Nations data-center context across North America.',
}

export const revalidate = 3600

export default async function GovernorsPage() {
  const stats = await fetchMarketSignalsStats()
  const hero = buildMarketSignalsHeroView(stats)

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
          {hero.showStalledAsOf && hero.stalledAsOfLabel ? (
            <AsOfLabel label={hero.stalledAsOfLabel} />
          ) : null}
        </div>
        <div className="signals-stat-grid" aria-label="Current signal layers">
          {hero.showStalledCount && hero.stalledCount != null ? (
            <span><strong>{hero.stalledCount}</strong> stalled project records</span>
          ) : (
            <span>{hero.stalledHiddenMessage}</span>
          )}
          {hero.showGovernorCount && hero.governorCount != null ? (
            <span><strong>{hero.governorCount}</strong> governors with DC policy notes</span>
          ) : (
            <span>{hero.governorFallbackMessage}</span>
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
