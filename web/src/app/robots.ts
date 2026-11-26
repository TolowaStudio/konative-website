import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/studio/',
          '/cms/',
          '/dashboard/',
          '/dispatch/',
        ],
      },
    ],
    sitemap: 'https://konative.com/sitemap.xml',
    host: 'https://konative.com',
  }
}
