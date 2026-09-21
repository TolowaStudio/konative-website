import React from "react";
import type { Viewport } from "next";

import ConditionalFooter from "../../components/ConditionalFooter";
import Header from "../../components/Header";
import PostHogAnalytics from "../../components/PostHogAnalytics";
import {
  JsonLd,
  organizationSchema,
  websiteSchema,
} from "@/components/seo/JsonLd";

import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata = {
  title: "Konative | Internet & Network Connectivity Brokerage",
  description:
    "Nearby fiber is not deliverable fiber. Konative is a Native-owned, vendor-neutral connectivity brokerage — an AVANT partner — for data centers under construction and Tribal enterprises. Site-specific briefs. Suppliers pay us.",
  metadataBase: new URL("https://konative.com"),
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    siteName: "Konative",
    type: "website" as const,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image" as const,
    site: "@konative",
  },
  // Google Search Console verification — set GOOGLE_SITE_VERIFICATION on the
  // Cloudflare Worker (production) to emit the meta tag without redeploying code.
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Barlow Condensed — Display & Headlines | Inter — Body */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        {/* Site-wide structured data — see web/src/components/seo/JsonLd.tsx */}
        <JsonLd data={[organizationSchema, websiteSchema]} />
      </head>
      <body>
        <PostHogAnalytics />
        <Header />
        <main className="site-main">{children}</main>
        <ConditionalFooter />
      </body>
    </html>
  );
}
