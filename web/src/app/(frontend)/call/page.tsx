import { bookingUrl } from "@/lib/booking";
import type { Metadata } from "next";
import { JsonLd, serviceSchema, SITE_URL } from "@/components/seo/JsonLd";
import { siteOpenGraphImage } from "@/lib/seo/siteOpenGraph";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Book a 15-Minute Discovery Call | Konative",
  description:
    "Book a 15-minute discovery call with the Konative team. We'll confirm project fit and outline next steps. No pitch deck, no obligation.",
  openGraph: {
    title: "Book a 15-Minute Discovery Call | Konative",
    description:
      "Book a 15-minute discovery call with the Konative team. We'll confirm project fit and outline next steps.",
    url: `${SITE_URL}/call`,
    images: [siteOpenGraphImage()],
  },
  alternates: { canonical: "/call" },
};

const NAVY = "#08142D";
const ORANGE = "#E07B39";
const BORDER = "rgba(255,255,255,0.08)";
const TEXT_DIM = "rgba(255,255,255,0.55)";
const TEXT_FAINT = "rgba(255,255,255,0.35)";
const DISPLAY_FONT = '"Barlow Condensed", sans-serif';
const BODY_FONT = "Inter, sans-serif";

// Canonical Cal.com booking link for Jeramey James (Tolowa Studio / Konative).
// The prior `konative/discovery` slug never existed as a real Cal.com event.
// Link target for the "Scheduling powered by Cal.com" text only. The inline embed
// below is configured separately (calLink: "jeramey-james/15min") and is unchanged.
const CAL_BOOKING_LINK = bookingUrl("call");

const WHAT_HAPPENS = [
  {
    n: "1",
    label: "You book",
    body: "Pick any open slot. Cal.com sends a confirmation with a video link.",
  },
  {
    n: "2",
    label: "We confirm fit",
    body: "In 15 minutes we'll tell you honestly whether Konative is the right partner for your project right now.",
  },
  {
    n: "3",
    label: "We outline next steps",
    body: "If there's a fit, we'll describe the path forward — whether that's a Project Readiness Review or a simpler first engagement.",
  },
];

const WHO_SHOULD_BOOK = [
  "Tribal nations or IDCs with active land and power assets",
  "Investors looking for qualified tribal or indigenous deal flow",
  "Landowners wondering whether their parcel qualifies for data center development",
  "Utilities with available capacity seeking data center load growth",
  "Developers and EPCs needing indigenous or rural site pipeline",
  "Advisors and introducers who want to refer a client",
];

export default function CallPage() {
  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: "15-Minute Discovery Call",
          description:
            "A 15-minute introductory call with the Konative team to confirm project fit, outline the engagement path, and answer your most pressing questions about tribal data center development or connectivity brokerage.",
          url: `${SITE_URL}/call`,
          serviceType: "Consultation",
          areaServed: ["United States", "Canada"],
        })}
      />

      <div
        style={{
          background: NAVY,
          minHeight: "100vh",
          color: "#fff",
          fontFamily: BODY_FONT,
        }}
      >
        {/* Hero */}
        <section
          style={{
            padding: "80px 48px 0",
            borderBottom: `1px solid ${BORDER}`,
            maxWidth: 1080,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              fontFamily: BODY_FONT,
              fontSize: 11,
              color: ORANGE,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Start here
          </div>
          <h1
            style={{
              fontFamily: DISPLAY_FONT,
              fontWeight: 800,
              fontSize: "clamp(36px, 5vw, 64px)",
              lineHeight: 0.95,
              textTransform: "uppercase",
              margin: "0 0 20px",
            }}
          >
            Book a 15-minute discovery call
          </h1>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.65,
              color: TEXT_DIM,
              maxWidth: 640,
              margin: "0 0 56px",
            }}
          >
            Fifteen minutes. No pitch deck. We will tell you honestly whether
            Konative is the right partner for your project right now — and what the
            path forward looks like if it is.
          </p>
        </section>

        {/* Main content — Cal embed + sidebar */}
        <section
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            padding: "56px 48px 96px",
            display: "grid",
            gridTemplateColumns: "1fr 360px",
            gap: 64,
            alignItems: "start",
          }}
        >
          {/* Cal.com embed */}
          <div>
            <div
              style={{
                border: `1px solid ${BORDER}`,
                background: "rgba(255,255,255,0.015)",
                padding: "0",
                // Fixed height + internal scroll, not min-height. Cal.com's inline
                // embed auto-resizes its iframe to match measured content height —
                // for this event type that measurement comes back ~2000px (mostly
                // blank iframe past the actual ~650px-tall calendar UI), which reads
                // as a giant empty box once a visitor scrolls into that dead zone.
                // Capping the wrapper's height clips the excess and gives the widget
                // its own scrollbar instead.
                height: 680,
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              {/* Cal.com inline embed — replace data-cal-link with your booking slug */}
              {/* To activate: add the Cal.com embed script to layout.tsx or use @calcom/embed-react */}
              <div
                data-cal-link="jeramey-james/15min"
                data-cal-config='{"layout":"month_view"}'
                style={{ width: "100%", height: "100%", minHeight: 600 }}
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    (function (C, A, L) {
                      let p = function (a, ar) { a.q.push(ar); };
                      let d = C.document;
                      C.Cal = C.Cal || function () {
                        let cal = C.Cal;
                        let ar = arguments;
                        if (!cal.loaded) {
                          cal.ns = {};
                          cal.q = cal.q || [];
                          d.head.appendChild(d.createElement("script")).src = A;
                          cal.loaded = true;
                        }
                        if (ar[0] === L) {
                          const api = function () { p(api, arguments); };
                          const namespace = ar[1];
                          api.q = api.q || [];
                          typeof namespace === "string" ? (cal.ns[namespace] = api) && p(api, ar) : p(cal, ar);
                          return;
                        }
                        p(cal, ar);
                      };
                    })(window, "https://app.cal.com/embed/embed.js", "init");
                    Cal("init", { origin: "https://cal.com" });
                    Cal("inline", {
                      elementOrSelector: "[data-cal-link]",
                      calLink: "jeramey-james/15min",
                      layout: "month_view",
                    });
                    Cal("ui", { styles: { branding: { brandColor: "#E07B39" } }, hideEventTypeDetails: false });
                  `,
                }}
              />
            </div>
            <p
              style={{
                fontSize: 12,
                color: TEXT_FAINT,
                marginTop: 12,
                lineHeight: 1.5,
              }}
            >
              Scheduling powered by{" "}
              <a
                href={CAL_BOOKING_LINK}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: ORANGE, textDecoration: "none" }}
              >
                Cal.com
              </a>
              . Your booking is confirmed instantly. A video link is included automatically.
            </p>
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            {/* What happens */}
            <div>
              <div
                style={{
                  fontSize: 11,
                  color: TEXT_FAINT,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 20,
                }}
              >
                What happens
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {WHAT_HAPPENS.map((step) => (
                  <div
                    key={step.n}
                    style={{
                      display: "flex",
                      gap: 14,
                      alignItems: "flex-start",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: DISPLAY_FONT,
                        fontWeight: 800,
                        fontSize: 22,
                        color: ORANGE,
                        lineHeight: 1,
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    >
                      {step.n}
                    </span>
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#fff",
                          marginBottom: 4,
                        }}
                      >
                        {step.label}
                      </div>
                      <p
                        style={{
                          fontSize: 13,
                          lineHeight: 1.55,
                          color: TEXT_DIM,
                          margin: 0,
                        }}
                      >
                        {step.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Who should book */}
            <div
              style={{
                borderTop: `1px solid ${BORDER}`,
                paddingTop: 32,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: TEXT_FAINT,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                Who this call is for
              </div>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {WHO_SHOULD_BOOK.map((item, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: 13,
                      lineHeight: 1.55,
                      color: TEXT_DIM,
                      display: "flex",
                      gap: 10,
                      alignItems: "flex-start",
                    }}
                  >
                    <span
                      style={{
                        color: ORANGE,
                        flexShrink: 0,
                        fontSize: 16,
                        lineHeight: 1.2,
                      }}
                    >
                      ›
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Fallback contact */}
            <div
              style={{
                borderTop: `1px solid ${BORDER}`,
                paddingTop: 24,
              }}
            >
              <p
                style={{
                  fontSize: 12,
                  lineHeight: 1.6,
                  color: TEXT_FAINT,
                  margin: 0,
                }}
              >
                Prefer email?{" "}
                <a
                  href="/contact"
                  style={{ color: ORANGE, textDecoration: "none" }}
                >
                  Reach us through the contact page.
                </a>{" "}
                We respond within one business day.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
