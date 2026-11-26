import type { Metadata } from 'next'
import { MARKETS } from './[state]/page'
import MarketsClient from './MarketsClient'

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Data Center Markets | Konative',
  description: 'Data center availability intelligence across 12 North American markets. Power pipeline, network infrastructure, and project tracking for Virginia, Texas, Georgia, and more.',
  alternates: { canonical: '/markets' },
}

export default function MarketsIndexPage() {
  return <MarketsClient markets={MARKETS} />
}
