import { NextRequest, NextResponse } from 'next/server'
import {
  isD1SponsorshipReady,
  noteSupabaseFallback,
  querySponsorshipPlacements,
} from '@/lib/db'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const fromDate = params.get('from_date') ?? undefined
  const toDate = params.get('to_date') ?? undefined
  const sponsorName = params.get('sponsor_name') ?? undefined

  const d1Rows = await querySponsorshipPlacements({ fromDate, toDate, sponsorName })
  if (d1Rows && d1Rows.length > 0) {
    const placements = d1Rows.map((p) => ({
      ...p,
      is_active: Boolean(p.is_active),
      ctr:
        (p.impressions ?? 0) > 0
          ? (((p.clicks ?? 0) / (p.impressions ?? 1)) * 100).toFixed(2) + '%'
          : '0%',
    }))
    return NextResponse.json({ placements })
  }

  // D1 has the table populated: an empty filtered result is the answer, not a miss.
  if (d1Rows && (await isD1SponsorshipReady())) {
    return NextResponse.json({ placements: [] })
  }
  noteSupabaseFallback('api/v1/analytics/sponsors')

  let query = supabase
    .from('sponsorship_placements')
    .select('id, sponsor_name, placement_type, start_date, end_date, impressions, clicks, is_active')
    .order('start_date', { ascending: false })

  if (sponsorName) query = query.ilike('sponsor_name', `%${sponsorName}%`)
  if (fromDate) query = query.gte('start_date', fromDate)
  if (toDate) query = query.lte('end_date', toDate)

  const { data, error } = await query

  if (error) {
    console.error('Sponsor analytics error:', error)
    return NextResponse.json({ placements: [] }, { status: 500 })
  }

  const placements = (data || []).map((p) => ({
    ...p,
    ctr: p.impressions > 0 ? ((p.clicks / p.impressions) * 100).toFixed(2) + '%' : '0%',
  }))

  return NextResponse.json({ placements })
}
