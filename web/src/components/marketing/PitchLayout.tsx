import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

export type Tone = "white" | "rust" | "dim";

const RED = "#C8001F";
const RED_HOVER = "#A8001A";
const RED_TINT = "#FFF0F2";
const STEEL = "#374151";
const TEXT = "#111111";
const MUTED = "#6B7280";
const DIVIDER = "#E5E7EB";
const SURFACE = "#F9FAFB";
const DARK = "#0A0F1E";
const DISPLAY = '"Barlow Condensed", sans-serif';
const BODY = "Inter, sans-serif";

const toneColor = (tone: Tone, onImage: boolean): string => {
  if (tone === "rust") return RED;
  if (tone === "dim") return onImage ? "rgba(255,255,255,0.5)" : "rgba(17,17,17,0.32)";
  return onImage ? "#fff" : TEXT;
};

export interface HeroImage {
  src: string;
  alt: string;
  credit?: { name: string; url: string };
}

export interface PitchLayoutProps {
  eyebrow: string;
  titleLines: { text: string; tone: Tone }[];
  subhead: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  children?: ReactNode;
  ctaHeadlineTop: string;
  ctaHeadlineBottom: string;
  ctaSub: string;
  heroImage?: HeroImage;
}

/** Shared server-rendered layout for connectivity wedge/landing pages. */
export default function PitchLayout({
  eyebrow,
  titleLines,
  subhead,
  primaryCta = { label: "Get a Connectivity Quote →", href: "/contact" },
  secondaryCta,
  children,
  ctaHeadlineTop,
  ctaHeadlineBottom,
  ctaSub,
  heroImage,
}: PitchLayoutProps) {
  const onImage = Boolean(heroImage);
  return (
    <div style={{ background: "#fff", color: TEXT }}>
      {/* Hero */}
      <section style={{ position: "relative", background: onImage ? DARK : "#fff", padding: "160px 0 96px", overflow: "hidden", borderBottom: `1px solid ${onImage ? "rgba(255,255,255,0.08)" : DIVIDER}` }}>
        {heroImage ? (
          <>
            <Image
              src={heroImage.src}
              alt={heroImage.alt}
              fill
              priority
              sizes="100vw"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
            {/* Left-only scrim that goes fully transparent past the halfway
                mark — legible copy on the left, photo clearly visible on the
                right half. A full-cover overlay (any alpha) crushed the photo
                to black; a left-weighted scrim reaching 0 is the fix (verified
                live). */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(90deg, rgba(10,15,30,0.8) 0%, rgba(10,15,30,0.45) 30%, rgba(10,15,30,0) 50%, rgba(10,15,30,0) 100%)",
              }}
            />
          </>
        ) : (
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(to right, rgba(55,65,81,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(55,65,81,0.05) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />
        )}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 48px" }}>
          <div style={{
            position: "relative",
            display: "flex", alignItems: "center", gap: 12,
            fontFamily: BODY, fontWeight: 600,
            fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase",
            color: onImage ? "#FF526B" : RED, marginBottom: 32,
          }}>
            <span style={{ display: "block", width: 36, height: 2, background: RED }} />
            {eyebrow}
          </div>
          <h1 style={{
            position: "relative",
            fontFamily: DISPLAY, fontWeight: 800,
            fontSize: "clamp(48px, 6.5vw, 92px)", lineHeight: 1.02,
            textTransform: "uppercase", letterSpacing: "0.01em", color: onImage ? "#fff" : TEXT,
            marginBottom: 36, maxWidth: 900,
          }}>
            {titleLines.map((line, i) => (
              <span key={i} style={{ color: toneColor(line.tone, onImage), display: "block" }}>{line.text}</span>
            ))}
          </h1>
          <p style={{
            position: "relative",
            fontFamily: BODY, fontSize: 17, lineHeight: 1.7,
            color: onImage ? "rgba(255,255,255,0.72)" : MUTED, maxWidth: 660, marginBottom: 40,
          }}>
            {subhead}
          </p>
          <div style={{ position: "relative", display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
            <Link href={primaryCta.href} style={{
              fontFamily: BODY, fontWeight: 600,
              fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase",
              background: RED, color: "#fff", padding: "18px 40px", textDecoration: "none",
              borderRadius: 2,
            }}>
              {primaryCta.label}
            </Link>
            {secondaryCta && (
              <Link href={secondaryCta.href} style={{
                fontFamily: BODY, fontWeight: 600,
                fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase",
                background: onImage ? "rgba(255,255,255,0.08)" : "#fff", color: onImage ? "#fff" : STEEL,
                padding: "17px 32px", border: `1px solid ${onImage ? "rgba(255,255,255,0.35)" : DIVIDER}`, textDecoration: "none",
                borderRadius: 2,
              }}>
                {secondaryCta.label}
              </Link>
            )}
          </div>
        </div>
        {heroImage?.credit && (
          <a
            href={`${heroImage.credit.url}?utm_source=konative&utm_medium=referral`}
            target="_blank"
            rel="noopener noreferrer nofollow"
            style={{
              position: "absolute",
              right: 16,
              bottom: 12,
              zIndex: 2,
              fontFamily: BODY,
              fontSize: 10,
              letterSpacing: "0.04em",
              color: "rgba(255,255,255,0.55)",
              textDecoration: "none",
            }}
          >
            Photo: {heroImage.credit.name} / Unsplash
          </a>
        )}
      </section>

      {children}

      {/* CTA band */}
      <section style={{ background: DARK, padding: "90px 0", borderTop: `1px solid ${DIVIDER}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 48px", textAlign: "center" }}>
          <h2 style={{
            fontFamily: DISPLAY, fontWeight: 800,
            fontSize: "clamp(40px, 5vw, 68px)", lineHeight: 0.92,
            textTransform: "uppercase", color: "#fff", marginBottom: 20,
          }}>
            {ctaHeadlineTop}<br /><span style={{ color: RED }}>{ctaHeadlineBottom}</span>
          </h2>
          <p style={{
            fontFamily: BODY, fontSize: 16, lineHeight: 1.7,
            color: "rgba(255,255,255,0.5)", maxWidth: 560, margin: "0 auto 36px",
          }}>
            {ctaSub}
          </p>
          <Link href="/contact" style={{
            fontFamily: BODY, fontWeight: 600,
            fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase",
            background: RED, color: "#fff", padding: "18px 44px", textDecoration: "none",
            borderRadius: 2,
          }}>
            Get a Connectivity Quote →
          </Link>
        </div>
      </section>
    </div>
  );
}

/** Simple labelled content section used inside PitchLayout children. */
export function PitchSection({
  eyebrow,
  heading,
  children,
  background = "#fff",
}: {
  eyebrow?: string;
  heading?: string;
  children: ReactNode;
  background?: string;
}) {
  const isDark = background !== "#fff" && background !== "white" && background !== "#F9FAFB";
  return (
    <section style={{ background, padding: "90px 0", borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : DIVIDER}` }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 48px" }}>
        {eyebrow && (
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            fontFamily: BODY, fontWeight: 600,
            fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase",
            color: RED, marginBottom: 18,
          }}>
            <span style={{ display: "block", width: 28, height: 2, background: RED }} />
            {eyebrow}
          </div>
        )}
        {heading && (
          <h2 style={{
            fontFamily: DISPLAY, fontWeight: 800,
            fontSize: "clamp(34px, 4vw, 56px)", lineHeight: 0.95,
            textTransform: "uppercase", color: isDark ? "#fff" : TEXT, marginBottom: 40,
          }}>
            {heading}
          </h2>
        )}
        {children}
      </div>
    </section>
  );
}
