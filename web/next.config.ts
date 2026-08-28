import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const webDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  output: "standalone",
  /** Cloud Run only — keep Node pg out of the OpenNext Worker bundle (TOL-321). */
  serverExternalPackages: ["pg", "pg-cloudflare"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/powered-land", destination: "/data-center-connectivity", permanent: true },
      { source: "/readiness-audit", destination: "/contact?projectType=data_center", permanent: true },
      { source: "/land/:path*", destination: "/data-center-connectivity", permanent: true },
      { source: "/capacity/:path*", destination: "/data-center-connectivity", permanent: true },
      { source: "/invest", destination: "/intelligence", permanent: true },
      { source: "/deals", destination: "/intelligence", permanent: true },
      { source: "/assessment", destination: "/contact", permanent: true },
      { source: "/tribal/grants", destination: "/tribal/funding-navigator", permanent: true },
      { source: "/tribal/grant", destination: "/tribal/funding-navigator", permanent: true },
      { source: "/for", destination: "/", permanent: true },
      { source: "/for/tribes", destination: "/tribal", permanent: true },
      { source: "/for/:path*", destination: "/connectivity", permanent: true },
      // /admin has no page route — redirect to Sanity Studio to prevent catch-all 500.
      { source: "/admin", destination: "/studio", permanent: false },
      { source: "/admin/:path*", destination: "/studio", permanent: false },
    ];
  },
  allowedDevOrigins: ["127.0.0.1"],
  /** Scope tracing to the app dir so OpenNext finds standalone at .next/standalone/.next (Cloudflare/OpenNext target). */
  outputFileTracingRoot: webDir,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
