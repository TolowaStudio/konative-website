import type { Metadata } from 'next'
import GovernorMapClient from './GovernorMapClient'

export const metadata: Metadata = {
  title: 'Market Signals — Stalled Data Center Projects & Tribal Brief | Konative',
  description: 'A Konative market-signal brief for stalled data center projects, governors, and Tribal / First Nations data-center context across North America.',
}

export default function GovernorsPage() {
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
        </div>
        <div className="signals-stat-grid" aria-label="Current signal layers">
          <span><strong>36</strong> stalled project records</span>
          <span><strong>4</strong> governor focus states</span>
          <span><strong>US + CA</strong> Tribal / First Nations context</span>
        </div>
      </section>
      <section className="signals-map-shell">
        <GovernorMapClient />
      </section>
    </main>
  )
}
