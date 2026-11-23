import type { Metadata } from "next";
import HomePage from "./HomePage";
import { SITE_URL } from "@/components/seo/JsonLd";
import { siteOpenGraphImage } from "@/lib/seo/siteOpenGraph";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Konative | Internet & Network Connectivity Brokerage",
  description:
    "Vendor-neutral connectivity brokerage for tribal enterprises, data centers, and infrastructure buyers — domestic and international, any market. Native-owned AVANT partner. Suppliers pay us.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Konative | Internet & Network Connectivity Brokerage",
    description:
      "Vendor-neutral connectivity brokerage — domestic and international, any market. Native-owned. Suppliers pay us.",
    url: SITE_URL,
    images: [siteOpenGraphImage()],
  },
};

export default function Page() {
  return <HomePage />;
}
