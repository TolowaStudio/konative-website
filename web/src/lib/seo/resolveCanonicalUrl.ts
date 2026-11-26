export const KONATIVE_SITE_ORIGIN = "https://konative.com";

export function resolveCanonicalUrl(
  path: string,
  metadataBase: URL = new URL(KONATIVE_SITE_ORIGIN),
): string {
  return new URL(path, metadataBase).href;
}