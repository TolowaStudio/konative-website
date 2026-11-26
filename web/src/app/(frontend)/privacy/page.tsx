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
const P = { fontSize: 15, lineHeight: 1.75, color: MUTED, marginBottom: 24 } as const;
const H = { fontSize: 20, fontWeight: 700, marginBottom: 8, color: TEXT } as const;

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
        <p style={P}>Effective November 26, 2026. Konative is a trade name of Tolowa Pacific LLC (&ldquo;Konative&rdquo;, &ldquo;we&rdquo;).</p>
        <h2 style={H}>What we collect</h2>
        <p style={P}>
          Contact and intake forms: the details you type (name, organization, email, project notes). Konative Dispatch signup: your email
          address (and name if given), the time you signed up, which form you used, and the exact consent wording you were shown. We also
          keep basic technical data (such as pages visited and referral source) to run the site.
        </p>
        <h2 style={H}>How we use it</h2>
        <p style={P}>
          To answer inquiries and, if you subscribed, to email you the Konative Dispatch. Signup uses double opt-in: you are subscribed only
          after you click the confirmation link we email you. We do not sell your personal information.
        </p>
        <h2 style={H}>Unsubscribing and suppression</h2>
        <p style={P}>
          Every Dispatch email carries an unsubscribe link and our postal address. When you unsubscribe or ask us to stop, we keep your
          address on a suppression list so we do not email you again.
        </p>
        <h2 style={H}>Who processes it</h2>
        <p style={P}>
          Service providers who host or process data for us: website hosting, our content system, our newsletter system (Ghost), our CRM,
          and transactional email. They may use it only to provide those services.
        </p>
        <h2 style={H}>Your choices</h2>
        <p style={P}>
          You can ask to access, correct or delete your information, or withdraw consent, at any time by emailing the address below.
          Residents of Washington, California and Canada have additional rights under applicable law, and we honor them.
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