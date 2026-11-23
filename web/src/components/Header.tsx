"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLink = { label: string; url: string };
type NavItem = NavLink | { label: string; children: NavLink[] };

const navLinks: NavItem[] = [
  { label: "Data Center", url: "/data-center-connectivity" },
  {
    label: "Tribal & Rural",
    children: [
      { label: "Tribal Connectivity", url: "/tribal" },
      { label: "Tribal DC Tracker", url: "/tribal/projects" },
      { label: "Funding Navigator", url: "/tribal/funding-navigator" },
      { label: "Carrier Check", url: "/tribal/carrier-check" },
      { label: "TBCP Awards", url: "/tribal/awards" },
      { label: "Sovereignty", url: "/tribal/sovereignty" },
      { label: "NTIA / TBCP", url: "/ntia" },
    ],
  },
  { label: "Connectivity", url: "/connectivity" },
  {
    label: "Map & Intelligence",
    children: [
      { label: "Interactive Map", url: "/map" },
      { label: "Market Signals", url: "/governors" },
      { label: "Canada", url: "/canada" },
      { label: "Markets", url: "/markets" },
      { label: "Intelligence", url: "/intelligence" },
      { label: "Dispatch", url: "/dispatch" },
      { label: "Lateral Estimator", url: "/tools/lateral-estimator" },
    ],
  },
  { label: "News", url: "/news" },
  { label: "About", url: "/about" },
];

function isGroup(item: NavItem): item is { label: string; children: NavLink[] } {
  return "children" in item;
}

/**
 * Pages that render a full-bleed dark hero under the header (so the header
 * starts transparent-with-white-text, then switches to white-bg/dark-text on
 * scroll). Keep in sync with actual page designs — `/tribal`, `/land`,
 * `/invest`, `/capacity`, `/assessment`, and `/for*` were removed 2026-07-03:
 * `/tribal` now ships a light hero (was rendering an invisible white-on-white
 * wordmark/nav), and the rest 308-redirect elsewhere per next.config.ts, so
 * their page shells are unreachable and the entries were dead weight.
 */
const DARK_HERO_PAGES = new Set(["/projects", "/canada", "/methodology", "/intelligence/saudi", "/intelligence/first-nations", "/market-intel"]);

function isDarkHeroPath(pathname: string): boolean {
  return DARK_HERO_PAGES.has(pathname);
}

export default function Header() {
  const pathname = usePathname();
  const hasDarkHero = isDarkHeroPath(pathname);

  const [scrolled, setScrolled] = useState(!hasDarkHero);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [ctaHovered, setCtaHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    if (!hasDarkHero) {
      setScrolled(true);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasDarkHero]);

  // <main> normally has padding-top to clear the fixed header. Dark-hero pages
  // render their hero full-bleed behind the transparent header instead, so
  // that padding (and <main>'s opaque white background) must be suppressed —
  // otherwise a 64px white strip shows through exactly where the header's
  // white text sits, making the wordmark and nav invisible until scroll.
  useEffect(() => {
    document.body.classList.toggle("has-dark-hero", hasDarkHero);
    return () => document.body.classList.remove("has-dark-hero");
  }, [hasDarkHero]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { closeMenu(); }, [pathname, closeMenu]);

  // Unscrolled: transparent over dark heroes → white text. Scrolled: white bg → dark text.
  const linkColor = scrolled ? "#111111" : "#ffffff";

  const headerStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: 64,
    zIndex: 1000,
    background: scrolled ? "rgba(255,255,255,0.98)" : "transparent",
    borderBottom: scrolled ? "1px solid #E5E7EB" : "1px solid transparent",
    backdropFilter: scrolled ? "blur(8px)" : "none",
    transition: "background 0.3s, border-color 0.3s, color 0.3s",
  };

  const innerStyle: React.CSSProperties = {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "0 24px",
    display: "flex",
    alignItems: "center",
    height: 64,
    gap: 24,
  };

  const wordmarkStyle: React.CSSProperties = {
    textDecoration: "none",
    display: "flex",
    alignItems: "baseline",
    flexShrink: 0,
  };

  const wordmarkKoStyle: React.CSSProperties = {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontWeight: 800,
    fontSize: 22,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    color: scrolled ? "#374151" : "#ffffff",
    transition: "color 0.3s",
  };

  const wordmarkNativeStyle: React.CSSProperties = {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontWeight: 800,
    fontSize: 22,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    color: "#C8001F",
  };

  const navStyle: React.CSSProperties = {
    display: "flex",
    gap: 16,
    flex: 1,
    justifyContent: "center",
    minWidth: 0,
  };

  const ctaStyle: React.CSSProperties = {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 600,
    fontSize: 11,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    background: ctaHovered ? "#A8001A" : "#C8001F",
    color: "#fff",
    padding: "10px 20px",
    textDecoration: "none",
    flexShrink: 0,
    transition: "background 0.2s",
  };

  const hamburgerStyle: React.CSSProperties = {
    display: isMobile ? "flex" : "none",
    flexDirection: "column",
    justifyContent: "center",
    gap: 5,
    cursor: "pointer",
    padding: "8px 4px",
    marginLeft: "auto",
    background: "none",
    border: "none",
  };

  const barStyle = (n: 0 | 1 | 2): React.CSSProperties => ({
    width: 22,
    height: 2,
    background: scrolled ? "#111111" : "#ffffff",
    borderRadius: 2,
    transition: "transform 0.25s, opacity 0.25s",
    transformOrigin: "center",
    transform: menuOpen
      ? n === 0 ? "translateY(7px) rotate(45deg)"
      : n === 2 ? "translateY(-7px) rotate(-45deg)"
      : "scaleX(0)"
      : "none",
    opacity: menuOpen && n === 1 ? 0 : 1,
  });

  const drawerStyle: React.CSSProperties = {
    position: "fixed",
    top: 64,
    left: 0,
    right: 0,
    background: "rgba(255,255,255,0.98)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid #E5E7EB",
    zIndex: 999,
    display: "flex",
    flexDirection: "column",
    padding: "12px 0 20px",
    transform: menuOpen ? "translateY(0)" : "translateY(-110%)",
    transition: "transform 0.25s ease, visibility 0.25s",
    pointerEvents: menuOpen ? "auto" : "none",
    visibility: menuOpen ? "visible" : "hidden",
  };

  return (
    <>
      <header style={headerStyle}>
        <div style={innerStyle}>
          {/* Wordmark */}
          <Link href="/" style={wordmarkStyle}>
            <span style={wordmarkKoStyle}>KO</span>
            <span style={wordmarkNativeStyle}>NATIVE</span>
          </Link>

          {/* Desktop center nav */}
          {!isMobile && (
            <nav style={navStyle}>
              {navLinks.map((item) => {
                if (isGroup(item)) {
                  const isActiveGroup = item.children.some((c) => c.url === pathname);
                  const isOpen = openGroup === item.label;
                  const groupLabelStyle: React.CSSProperties = {
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 500,
                    fontSize: 11,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: isOpen || isActiveGroup ? "#C8001F" : linkColor,
                    opacity: isOpen || isActiveGroup ? 1 : 0.85,
                    transition: "color 0.3s, opacity 0.2s",
                    cursor: "default",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  };
                  return (
                    <div
                      key={item.label}
                      style={{ position: "relative" }}
                      onMouseEnter={() => setOpenGroup(item.label)}
                      onMouseLeave={() => setOpenGroup(null)}
                    >
                      <span style={groupLabelStyle}>
                        {item.label}
                        <span style={{ fontSize: 8, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
                      </span>
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          paddingTop: 12,
                          opacity: isOpen ? 1 : 0,
                          visibility: isOpen ? "visible" : "hidden",
                          transition: "opacity 0.15s",
                        }}
                      >
                        <div
                          style={{
                            background: "#ffffff",
                            border: "1px solid #E5E7EB",
                            borderRadius: 6,
                            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                            minWidth: 200,
                            padding: "6px 0",
                          }}
                        >
                          {item.children.map((child) => (
                            <Link
                              key={child.url}
                              href={child.url}
                              style={{
                                display: "block",
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 500,
                                fontSize: 12,
                                letterSpacing: "0.04em",
                                textDecoration: "none",
                                color: child.url === pathname ? "#C8001F" : "#111111",
                                padding: "9px 16px",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                const isHovered = hoveredLink === item.url;
                const navLinkStyle: React.CSSProperties = {
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  color: isHovered ? "#C8001F" : linkColor,
                  opacity: isHovered ? 1 : 0.85,
                  transition: "color 0.3s, opacity 0.2s",
                };
                return (
                  <Link
                    key={item.url}
                    href={item.url}
                    style={navLinkStyle}
                    onMouseEnter={() => setHoveredLink(item.url)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Desktop CTA */}
          {!isMobile && (
            <Link
              href="/call"
              style={ctaStyle}
              onMouseEnter={() => setCtaHovered(true)}
              onMouseLeave={() => setCtaHovered(false)}
            >
              Book a call
            </Link>
          )}

          {/* Hamburger */}
          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            style={hamburgerStyle}
          >
            <span style={barStyle(0)} />
            <span style={barStyle(1)} />
            <span style={barStyle(2)} />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <nav style={drawerStyle} aria-hidden={!menuOpen}>
        {navLinks.map((item) =>
          isGroup(item) ? (
            <div key={item.label} style={{ borderBottom: "1px solid #E5E7EB" }}>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#6B7280",
                  padding: "13px 28px 6px",
                }}
              >
                {item.label}
              </div>
              {item.children.map((child) => (
                <Link
                  key={child.url}
                  href={child.url}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 500,
                    fontSize: 13,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    color: "#111111",
                    padding: "10px 28px 10px 40px",
                    display: "block",
                  }}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          ) : (
            <Link
              key={item.url}
              href={item.url}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                fontSize: 13,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                textDecoration: "none",
                color: "#111111",
                padding: "13px 28px",
                borderBottom: "1px solid #E5E7EB",
              }}
            >
              {item.label}
            </Link>
          )
        )}
        <Link
          href="/call"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            fontSize: 11,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            background: "#C8001F",
            color: "#fff",
            padding: "13px 28px",
            textDecoration: "none",
            margin: "12px 28px 0",
            textAlign: "center",
          }}
        >
          Book a call
        </Link>
      </nav>
    </>
  );
}
