import type { MetadataRoute } from 'next'
import { DISPATCH_PUBLICLY_VISIBLE } from '@/lib/dispatchVisibility'
import { MARKETS } from './(frontend)/markets/[state]/page'

// Sitemap regenerates hourly so newly-published Ghost posts (Konative Dispatch
// issues and blog posts) appear without a redeploy. See STRATEGY.md B1.
export const revalidate = 3600

const BASE = 'https://konative.com'

const AUDIENCE_SLUGS = ['tribes'] as const

interface GhostPostSitemapItem {
  slug: string
  updated_at: string | null
  primary_tag?: { slug?: string } | null
}

async function fetchGhostPosts(): Promise<GhostPostSitemapItem[]> {
  const url =
    process.env.GHOST_URL?.trim() ||
    process.env.NEXT_PUBLIC_GHOST_URL?.trim() ||
    ''
  const key =
    process.env.GHOST_CONTENT_API_KEY?.trim() ||
    process.env.NEXT_PUBLIC_GHOST_CONTENT_API_KEY?.trim() ||
    ''
  if (!url || !key) return []
  try {
    const res = await fetch(
      `${url.replace(/\/$/, '')}/ghost/api/content/posts/?key=${encodeURIComponent(
        key,
      )}&limit=500&fields=slug,updated_at&include=primary_tag&filter=${encodeURIComponent(
        'status:published',
      )}`,
      { next: { revalidate: 3600 } },
    )
    if (!res.ok) return []
    const data = (await res.json()) as { posts?: GhostPostSitemapItem[] }
    return data.posts ?? []
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // --- static, high-priority pages (connectivity-first) ----------------------
  // Canonical pages only — redirected routes (e.g., /powered-land, /land/*, /capacity/*,
  // /invest, /deals, /for/tribes, /assessment, /readiness-audit) must NOT appear in sitemap.
  const staticRoutes: MetadataRoute.Sitemap = [
    // Connectivity-first core pages
    { url: BASE,                          lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/connectivity`,       lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/about`,              lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/data-center-connectivity`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/tribal`,             lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/tribal/funding-navigator`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/tribal/sovereignty`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/tribal/carrier-check`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/tools/lateral-estimator`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/tribal/grants`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/tribal/scope`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/tribal/index`,       lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/tribal/projects`,    lastModified: now, changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${BASE}/tribal/awards`,      lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/call`,               lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/contact`,            lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/map`,                lastModified: now, changeFrequency: 'daily',   priority: 0.7 },
    { url: `${BASE}/governors`,          lastModified: now, changeFrequency: 'monthly', priority: 0.7 },

    // Secondary intelligence and dispatch
    { url: `${BASE}/news`,               lastModified: now, changeFrequency: 'daily',   priority: 0.7 },
    { url: `${BASE}/intelligence`,       lastModified: now, changeFrequency: 'weekly',  priority: 0.6 },
    { url: `${BASE}/answers`,            lastModified: now, changeFrequency: 'monthly', priority: 0.6 },

    // Tertiary/supporting pages
    { url: `${BASE}/markets`,            lastModified: now, changeFrequency: 'weekly',  priority: 0.6 },
  ]

  // --- per-state market pages ----------------------------------------------
  const marketRoutes: MetadataRoute.Sitemap = Object.keys(MARKETS).map(slug => ({
    url: `${BASE}/markets/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // --- per-audience landing pages ------------------------------------------
  // NOTE: /for/tribes redirects to /tribal; /for/* redirects to /connectivity.
  // Do NOT include these in canonical sitemap.
  const audienceRoutes: MetadataRoute.Sitemap = []

  // --- intelligence sub-pages (if any canonical deep-links exist) ---------------
  const intelligenceRoutes: MetadataRoute.Sitemap = []

  const dispatchRoutes: MetadataRoute.Sitemap = []
  if (DISPATCH_PUBLICLY_VISIBLE) {
    const ghostPosts = await fetchGhostPosts()
    for (const p of ghostPosts) {
      if (!p.slug || p.primary_tag?.slug !== 'konative-dispatch') continue
      const lm = p.updated_at ? new Date(p.updated_at) : now
      dispatchRoutes.push({
        url: `${BASE}/dispatch/${p.slug}`,
        lastModified: lm,
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      })
    }
    dispatchRoutes.unshift({
      url: `${BASE}/dispatch`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.5,
    })
  }

  return [
    ...staticRoutes,
    ...marketRoutes,
    ...intelligenceRoutes,
    ...dispatchRoutes,
  ]
}
