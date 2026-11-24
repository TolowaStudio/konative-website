/**
 * Konative Dispatch archive is paused until publishing cadence resumes (TS-4181).
 * Routes redirect; nav/sitemap omit /dispatch; issue pages remain in repo/CMS.
 */
export const DISPATCH_PUBLICLY_VISIBLE = false;

export const DISPATCH_REDIRECTS = [
  { source: "/dispatch", destination: "/data-center-connectivity", permanent: true },
  { source: "/dispatch/:path*", destination: "/data-center-connectivity", permanent: true },
] as const;

export function hrefIsDispatchPublicPath(href: string): boolean {
  return href === "/dispatch" || href.startsWith("/dispatch/");
}