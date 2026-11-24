import type { Metadata } from "next";
import { SITE_URL } from "@/components/seo/JsonLd";
import { siteOpenGraphImage } from "@/lib/seo/siteOpenGraph";

export const metadata: Metadata = {
  title: "Contact | Konative Connectivity Brokerage",
  description:
    "Contact Konative for vendor-neutral connectivity sourcing — domestic and international. Share addresses, timing, and requirements; we return supplier options and comparable terms.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Konative",
    description:
      "Vendor-neutral connectivity brokerage — domestic and international. Share your requirements; we source the market.",
    url: `${SITE_URL}/contact`,
    images: [siteOpenGraphImage()],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}