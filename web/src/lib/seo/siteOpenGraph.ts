/** Canonical social preview asset — served at https://konative.com/og-image.png */
export const SITE_OG_IMAGE_PATH = "/og-image.png";

export const SITE_OG_IMAGE_WIDTH = 1200;
export const SITE_OG_IMAGE_HEIGHT = 630;

export function siteOpenGraphImage() {
  return {
    url: SITE_OG_IMAGE_PATH,
    width: SITE_OG_IMAGE_WIDTH,
    height: SITE_OG_IMAGE_HEIGHT,
    alt: "Konative — vendor-neutral connectivity brokerage",
  } as const;
}