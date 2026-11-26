import type { Metadata } from "next";
import { SITE_URL } from "@/components/seo/JsonLd";
import { siteOpenGraphImage } from "@/lib/seo/siteOpenGraph";

export const metadata: Metadata = {
  title: "Privacy Policy | Konative",
  description:
    "What Konative (Tolowa Pacific LLC) collects, who processes it, how consent and unsubscribe work, and your rights in the US, Canada and Mexico.",
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
const PRIVACY_EMAIL = "deals@konative.com";

type Section = { title: string; paragraphs?: string[]; items?: [string, string][] };

// Every statement here describes what the code and operations do today. When a form,
// vendor or tracker changes, change this page (and LAST_UPDATED) in the same PR.
const LAST_UPDATED = "November 26, 2026";

const SECTIONS: Section[] = [
  {
    title: "Who we are",
    paragraphs: [
      "Konative is a trade name of Tolowa Pacific LLC, a United States company. Tolowa Pacific LLC is responsible for the personal information described on this page. It covers konative.com, our forms, our newsletter, call booking and our business email.",
      `Privacy contact: ${PRIVACY_EMAIL}. Our mailing address is included in our commercial email and is available on request.`,
    ],
  },
  {
    title: "What we collect",
    items: [
      ["Inquiry and intake forms", "Name, email, organization and, where you provide them, phone number, role, service addresses, project or site details, funding program and your message."],
      ["Newsletter signup", "Your email address, name if given, where on the site you signed up, and when."],
      ["Call booking", "Name, email, time zone, the time you pick and, where you provide them, organization, phone number and notes."],
      ["Email and business contact", "Messages you send us, and business contact details we receive from introductions, referrals, events or public sources."],
      ["Site use", "Pages viewed, clicks on a few key links, referring page, and browser and device information, as described under Analytics and cookies."],
      ["Technical data", "IP address and request logs, used to run and protect the site, including limiting abusive form submissions."],
    ],
  },
  {
    title: "Why we use it",
    paragraphs: [
      "To answer your inquiry, scope and quote connectivity or site work, hold a call you booked, send the newsletter you asked for, follow up on an existing business relationship or introduction, understand which pages are useful, keep the site secure, and meet legal obligations.",
      "We do not sell personal information, and we do not share it for cross-context behavioral or targeted advertising.",
    ],
  },
  {
    title: "Who processes it for us",
    paragraphs: ["These service providers handle personal information on our behalf:"],
    items: [
      ["Ghost", "Newsletter subscriber list, delivery and unsubscribe (our Ghost site is hosted on Railway)."],
      ["Resend", "Delivery of form notifications and confirmation email."],
      ["Mailgun", "Delivery of newsletter and other email, and records of bounces and unsubscribes."],
      ["Twenty", "Our customer relationship system (CRM), including do-not-contact markers (hosted on Railway)."],
      ["n8n", "Workflow automation that passes inquiries and bookings to the CRM (hosted on Railway)."],
      ["Cal.com", "Call scheduling. The booking calendar is loaded from Cal.com, which also applies its own privacy policy."],
      ["PostHog (analytics)", "Website analytics, hosted in the United States."],
      ["Sanity", "Storage of form and newsletter submissions."],
      ["Google", "Website hosting and logs (Google Cloud), and web fonts, which your browser requests from Google."],
    ],
  },
  {
    title: "Other sharing",
    paragraphs: [
      "When your request calls for a quote or an introduction, we share the details needed for it with the relevant suppliers or partners. We may also disclose information when the law requires it, to protect rights and safety, or as part of a sale or reorganization of the business.",
    ],
  },
  {
    title: "Analytics and cookies",
    paragraphs: [
      "We use PostHog to count page views and a few link clicks. It stores a random identifier in a cookie and in your browser's local storage. We have session recording, heatmaps and automatic capture of what you type turned off, we do not build individual visitor profiles, query strings are removed from page addresses, and your browser's Do Not Track setting is respected.",
      "You can block or delete cookies and local storage in your browser. Embedded services such as the Cal.com calendar may set their own cookies when used.",
    ],
  },
  {
    title: "Consent",
    paragraphs: [
      "Entering your email in a newsletter form and subscribing is your express consent to receive that newsletter from Konative. Sending an inquiry or booking a call asks us to contact you about it; it does not by itself subscribe you to the newsletter.",
      "Other business email goes to people who have a business relationship with us, were introduced to us, or where the law otherwise allows it. You can withdraw consent at any time. Withdrawing it does not affect what was done before.",
    ],
  },
  {
    title: "Unsubscribe",
    paragraphs: [
      `Use the unsubscribe link in any newsletter, reply "unsubscribe" to any message from us, or email ${PRIVACY_EMAIL}. It is free, and we act on it within 10 business days at the latest. We keep a minimal do-not-contact record so that we do not write to you again.`,
    ],
  },
  {
    title: "Retention, security and where data is kept",
    paragraphs: [
      "We keep personal information for as long as needed for the purposes above and for legal and record-keeping duties, then delete it or make it anonymous. We use reasonable technical and organizational safeguards, though no system is completely secure.",
      "We and our providers process information in the United States and may process it in other countries. If you are in Canada, Mexico or elsewhere, your information is transferred outside your country and is subject to the laws where it is processed, including lawful access by authorities there.",
    ],
  },
  {
    title: "Your rights: everyone",
    paragraphs: [
      `You can ask what we hold about you, ask us to correct or delete it, or object to a use of it. Email ${PRIVACY_EMAIL}. We will confirm your identity before acting, answer within the time the law requires, and not treat you worse for asking.`,
    ],
  },
  {
    title: "United States",
    paragraphs: [
      "Depending on your state (for example California, Colorado, Virginia or Washington), you may have rights to access, correct, delete and receive a copy of your personal information, to appeal a refusal, and to use an authorized agent. To appeal, reply to our decision with the word \"appeal\". Our commercial email follows the CAN-SPAM Act and applicable state law, including Washington's Commercial Electronic Mail Act.",
    ],
  },
  {
    title: "Canada (PIPEDA and CASL)",
    paragraphs: [
      "We handle personal information of people in Canada in line with the Personal Information Protection and Electronic Documents Act (PIPEDA) and applicable provincial law. You may access and correct your information and withdraw consent, subject to legal limits.",
      "Commercial electronic messages follow Canada's Anti-Spam Legislation (CASL): we send them with express consent or where CASL allows implied consent or an exemption, identify ourselves, and include a way to unsubscribe.",
      "If we cannot resolve a concern, you may complain to the Office of the Privacy Commissioner of Canada (priv.gc.ca) or your provincial privacy regulator.",
    ],
  },
  {
    title: "Mexico",
    paragraphs: [
      "For people in Mexico, Tolowa Pacific LLC is the controller (responsable) under the Federal Law on Protection of Personal Data Held by Private Parties (LFPDPPP). Answering inquiries, bookings and business you request are the primary purposes. The newsletter, business follow-up and analytics are secondary purposes, which you may refuse without affecting the primary ones.",
      `You may exercise your ARCO rights (access, rectification, cancellation and opposition), revoke consent, or limit the use or disclosure of your data by emailing ${PRIVACY_EMAIL} with your name, a way to reply, proof of identity, and what you are asking for. We respond within 20 business days and carry out an accepted request within 15 business days after that, unless the law allows an extension.`,
      "You may also take a complaint to the competent Mexican data protection authority, the Secretaría Anticorrupción y Buen Gobierno.",
    ],
  },
  {
    title: "Children and changes",
    paragraphs: [
      "This site is for business users and is not directed to children under 18, and we do not knowingly collect their information.",
      "We will post changes on this page and update the date above. Where a change is material and the law requires it, we will ask for your consent again.",
    ],
  },
];

const paragraphStyle = { fontSize: 15, lineHeight: 1.75, color: MUTED, margin: "0 0 16px" } as const;

export default function PrivacyPage() {
  return (
    <main style={{ background: "#fff", color: TEXT, padding: "96px 0 128px", fontFamily: BODY }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 32px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED, marginBottom: 12 }}>
          Legal
        </p>
        <h1 style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: 48, fontWeight: 800, marginBottom: 12 }}>
          Privacy policy
        </h1>
        <p style={paragraphStyle}>Last updated: {LAST_UPDATED}</p>
        {SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: 26, fontWeight: 700, margin: "40px 0 12px" }}>
              {section.title}
            </h2>
            {section.paragraphs?.map((text) => (
              <p key={text} style={paragraphStyle}>
                {text}
              </p>
            ))}
            {section.items && (
              <ul style={{ ...paragraphStyle, paddingLeft: 20, listStyle: "disc" }}>
                {section.items.map(([label, text]) => (
                  <li key={label} style={{ marginBottom: 8 }}>
                    <strong style={{ color: TEXT }}>{label}:</strong> {text}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}
