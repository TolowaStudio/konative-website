import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/components/seo/JsonLd";
import { siteOpenGraphImage } from "@/lib/seo/siteOpenGraph";

export const metadata: Metadata = {
  title: "Terms of Use | Konative",
  description:
    "Terms of use for konative.com — informational content, brokerage positioning, and limitations of liability.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms of Use | Konative",
    url: `${SITE_URL}/terms`,
    images: [siteOpenGraphImage()],
  },
};

const BODY = "Inter, sans-serif";
const MUTED = "#6B7280";
const TEXT = "#111111";

export default function TermsPage() {
  return (
    <main style={{ background: "#fff", color: TEXT, padding: "96px 0 128px", fontFamily: BODY }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 32px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED, marginBottom: 12 }}>
          Legal
        </p>
        <h1 style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: 48, fontWeight: 800, marginBottom: 24 }}>
          Terms of use
        </h1>
        <p style={{ fontSize: 15, lineHeight: 1.75, color: MUTED, marginBottom: 32 }}>
          Effective November 23, 2026 · Konative is a trade name of Tolowa Pacific LLC.
        </p>

        <Section title="Informational content">
          Market maps, indices, news archives, and program summaries on this site are for general information only. They are
          not legal, financial, or investment advice. Confirm eligibility, pricing, and serviceability with suppliers and
          your advisors before acting.
        </Section>
        <Section title="Brokerage relationship">
          Konative is a vendor-neutral connectivity broker. Carriers and suppliers contract directly with buyers. Konative is
          compensated by suppliers when a buyer selects a quoted service, unless otherwise disclosed in writing.
        </Section>
        <Section title="No grant-writing">
          Konative does not write grant applications for fees and does not administer federal award programs. Free navigators
          and education on this site are separate from commercial brokerage.
        </Section>
        <Section title="Acceptable use">
          Do not attempt to access non-public admin areas (/cms, /studio, /dashboard), scrape the site in ways that impair
          service, or misrepresent affiliation with Konative or Tolowa Pacific LLC.
        </Section>
        <Section title="Limitation of liability">
          To the fullest extent permitted by law, Tolowa Pacific LLC and Konative are not liable for indirect or consequential
          damages arising from use of this website or reliance on its content.
        </Section>
        <Section title="Contact">
          Questions about these terms:{" "}
          <Link href="/contact" style={{ color: "#C8001F" }}>
            konative.com/contact
          </Link>
          .
        </Section>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: 26, fontWeight: 700, marginBottom: 12 }}>
        {title}
      </h2>
      <p style={{ fontSize: 15, lineHeight: 1.75, color: MUTED, margin: 0 }}>{children}</p>
    </section>
  );
}