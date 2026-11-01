export function analyticsEnv(): 'prod' | 'preview' {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname
    if (host === 'konative.com' || host === 'www.konative.com') return 'prod'
    if (host.endsWith('.run.app') || host.includes('localhost')) return 'preview'
  }
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production') return 'prod'
  if (process.env.NODE_ENV === 'production') return 'prod'
  return 'preview'
}

export const SITE_SUPER_PROPERTIES = {
  site: 'konative.com',
  venture: 'konative',
} as const
