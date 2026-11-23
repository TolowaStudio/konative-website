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
        <p style={{ fontSize: 15, lineHeight: 1.75, color: MUTED, marginBottom: 32 }}>
          Effective November 23, 2026 · Konative is a trade name of Tolowa Pacific LLC.
        </p>

        <Section title="What we collect">
          When you submit the contact form, book a call, or use intake tools on this site, we collect the information you
          provide — name, organization, email, phone, project details, and similar business contact data.
        </Section>
        <Section title="How we use it">
          We use submissions to respond to your request, run connectivity sourcing, and improve our services. We do not
          sell your personal information. We may share information with carriers and partners only as needed to fulfill a
          sourcing engagement you requested.
        </Section>
        <Section title="Analytics">
          Konative may use privacy-focused analytics (for example PostHog) to understand aggregate site usage. We do not use
          analytics to build cold outreach lists from casual visitors.
        </Section>
        <Section title="Retention & security">
          We retain business correspondence as long as needed for the engagement and applicable law. We use industry-standard
          hosting and access controls; no system is perfectly secure.
        </Section>
        <Section title="Your choices">
          You may request access or correction of information you submitted by contacting us at{" "}
          <Link href="/contact" style={{ color: "#C8001F" }}>
            konative.com/contact
          </Link>
          .
        </Section>
        <Section title="Updates">
          We may update this policy; the effective date above will change when we do.
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