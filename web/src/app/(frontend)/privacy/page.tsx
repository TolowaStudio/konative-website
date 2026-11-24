import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/components/seo/JsonLd";
import { siteOpenGraphImage } from "@/lib/seo/siteOpenGraph";

export const metadata: Metadata = {
  title: "Privacy Policy | Konative",
  description:
    "How Konative (Tolowa Pacific LLC) handles information submitted through konative.com contact and intake flows.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy | Konative",
    url: `${SITE_URL}/privacy`,
    images: [siteOpenGraphImage()],
  },
};

const BODY = "Inter, sans-serif";
const MUTED = "#6B7280";
const TEXT = "#111111";

export default function PrivacyPage() {
  return (
    <main style={{ background: "#fff", color: TEXT, padding: "96px 0 128px", fontFamily: BODY }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 32px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED, marginBottom: 12 }}>
          Legal
        </p>
        <h1 style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: 48, fontWeight: 800, marginBottom: 24 }}>
          Privacy policy
        </h1>
        <p style={{ fontSize: 15, lineHeight: 1.75, color: MUTED, marginBottom: 24 }}>
          This is a short placeholder page. A full privacy policy may be published here later.
        </p>
        <p style={{ fontSize: 15, lineHeight: 1.75, color: MUTED, margin: 0 }}>
          For questions, use{" "}
          <Link href="/contact" style={{ color: "#C8001F" }}>
            konative.com/contact
          </Link>{" "}
          or email{" "}
          <a href="mailto:deals@konative.com" style={{ color: "#C8001F" }}>
            deals@konative.com
          </a>
          .
        </p>
      </div>
    </main>
  );
}