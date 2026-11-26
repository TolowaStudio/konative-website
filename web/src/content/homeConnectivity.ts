/**
 * Connectivity-brokerage homepage content.
 *
 * Single source of truth for the rebranded homepage copy. The home page server
 * component fetches a `homeConnectivity` singleton from Sanity (editable in
 * Studio) and falls back to this object when the document is absent — so the
 * site renders the correct brokerage messaging even before Sanity is seeded.
 * This same object is used to seed the Sanity document.
 */

export type Tone = "white" | "rust" | "dim";

export interface HeadlineLine {
  text: string;
  tone: Tone;
}

export interface CtaLink {
  label: string;
  href: string;
}

export interface HeroStat {
  value: string;
  label: string;
  /** Render value in rust accent */
  rust?: boolean;
  /** Highlight tile (rust border) — used for the final emphasis stat */
  highlight?: boolean;
}

export interface PortfolioItem {
  name: string;
  blurb: string;
}

export interface WedgeCard {
  num: string;
  eyebrow: string;
  /** May contain "\n" for a manual line break */
  title: string;
  desc: string;
  cta: string;
  href: string;
  primary?: boolean;
}

export interface Capability {
  num: string;
  title: string;
  body: string;
}

export interface HomeConnectivityContent {
  heroEyebrow: string;
  heroHeadline: HeadlineLine[];
  heroSubhead: string;
  heroPrimaryCta: CtaLink;
  heroSecondaryCtas: CtaLink[];
  heroStats: HeroStat[];

  portfolioEyebrow: string;
  portfolioHeadingTop: string;
  portfolioHeadingBottom: string;
  portfolioIntro: string;
  portfolioItems: PortfolioItem[];

  wedgeEyebrow: string;
  wedgeHeadingTop: string;
  wedgeHeadingBottom: string;
  wedges: WedgeCard[];

  howEyebrow: string;
  howHeadingTop: string;
  howHeadingBottom: string;
  howIntro: string;
  capabilities: Capability[];
}

export const HOME_CONNECTIVITY_DEFAULT: HomeConnectivityContent = {
  heroEyebrow: "Connectivity Brokerage · Avant Partner",
  heroHeadline: [
    { text: "NEARBY FIBER IS NOT", tone: "white" },
    { text: "DELIVERABLE", tone: "rust" },
    { text: "FIBER.", tone: "white" },
  ],
  heroSubhead:
    "Konative maps which carriers can actually reach your mid-build data-center site — laterals, waves, DIA, diversity — before the schedule slips. Native-owned, vendor-neutral AVANT sub-agent for Tribal enterprises and the data-center buildout. Suppliers pay us; you get the whole market.",
  heroPrimaryCta: { label: "Get a One-Page Site Brief →", href: "/contact?projectType=data_center#request" },
  heroSecondaryCtas: [
    { label: "Tribal Enterprise →", href: "/tribal" },
    { label: "Data Center Connectivity →", href: "/data-center-connectivity" },
  ],
  heroStats: [
    { value: "100+", label: "Supplier Portfolio · via Avant", rust: true },
    { value: "$0", label: "Cost to You — Suppliers Pay Us" },
    { value: "SITE", label: "Deliverability Briefs — Not Carrier Maps" },
    { value: "1 POINT", label: "Of Contact, for the Life of the Account", highlight: true },
  ],

  portfolioEyebrow: "What We Broker",
  portfolioHeadingTop: "ONE BROKER.",
  portfolioHeadingBottom: "EVERY NETWORK.",
  portfolioIntro:
    "We're carrier-neutral. Through Avant's supplier portfolio we source and manage the full connectivity stack — then stay in the account for its life. You get the whole market and one point of contact, not ten carrier reps.",
  portfolioItems: [
    { name: "Dedicated Internet & Broadband", blurb: "DIA, fiber, and broadband across every market — sourced competitively, not single-carrier." },
    { name: "Lit & Dark Fiber", blurb: "Long-haul and metro fiber, IRUs, and dark fiber for high-capacity, private routes." },
    { name: "Wavelengths & Transport", blurb: "10G/100G/400G waves and Ethernet transport between sites, data centers, and clouds." },
    { name: "SD-WAN & Managed Networks", blurb: "Software-defined WAN and managed network services across multi-site footprints." },
    { name: "UCaaS & CCaaS", blurb: "Cloud voice, collaboration, and contact-center platforms — and POTS replacement." },
    { name: "Cloud On-Ramps & Direct Connect", blurb: "Private, low-latency connectivity into AWS, Azure, Google Cloud, and Oracle." },
    { name: "Data Center Interconnect & Colo", blurb: "Cross-connects, DCI, and colocation between facilities, carrier hotels, and clouds." },
    { name: "Wireless WAN, FWA & Mobility", blurb: "Fixed wireless, cellular failover, and mobility for rural, Tribal, and edge sites." },
    { name: "Cybersecurity & Managed Services", blurb: "SASE, managed firewall, and security services layered onto the network we source." },
  ],

  wedgeEyebrow: "Where We Lean In",
  wedgeHeadingTop: "ONE DESK.",
  wedgeHeadingBottom: "TWO ROOMS.",
  wedges: [
    {
      num: "01",
      eyebrow: "For Data Centers Under Construction",
      title: "Nearby ≠\ndeliverable.",
      desc:
        "Prove which carriers can actually deliver multi-path connectivity to a named mid-build site — laterals, waves, DIA, DCI, diversity — without betting the schedule on a single carrier’s map. One-page site briefs, published benchmarks, free lateral estimator.",
      cta: "Get a One-Page Site Brief →",
      href: "/data-center-connectivity",
      primary: true,
    },
    {
      num: "02",
      eyebrow: "For Tribal Gaming & Enterprise",
      title: "Keep uptime.\nMake carriers compete.",
      desc:
        "Native-owned, vendor-neutral brokerage for casinos, multi-site ops, health, and government. Renewal continuity and failover without rip-and-replace. Written sovereignty commitment. Suppliers pay us; you own the contracts.",
      cta: "Tribal Continuity →",
      href: "/tribal",
      primary: false,
    },
    {
      num: "03",
      eyebrow: "Free Trust Resource — Not Brokerage",
      title: "TBCP / NEGP\nnavigator.",
      desc:
        "$790M Tribal broadband applications are due Sept 17, 2026. Free eligibility navigator — grant help is separate from Konative commission work. When you have a named enterprise site with a commercial connectivity question, use the continuity snapshot.",
      cta: "Open Navigator →",
      href: "/tribal/funding-navigator",
      primary: false,
    },
  ],

  howEyebrow: "What We Source",
  howHeadingTop: "THE FULL",
  howHeadingBottom: "CONNECTIVITY STACK.",
  howIntro:
    "We broker every layer of the connectivity stack through Avant's 100+ supplier portfolio — from last-mile internet to long-haul dark fiber to cloud on-ramps and security. One brokerage, every network type, no carrier bias.",
  capabilities: [
    { num: "01 — Internet", title: "Internet & Broadband", body: "Dedicated internet access, fiber broadband, and fixed wireless — sourced across every carrier and regional provider for your market." },
    { num: "02 — Fiber", title: "Lit & Dark Fiber", body: "Long-haul and metro fiber, IRUs, and dark fiber strands for private, high-capacity routes between sites, facilities, and markets." },
    { num: "03 — Transport", title: "Transport & Wavelengths", body: "10G / 100G / 400G waves and Ethernet transport for data-center-to-data-center, site-to-site, and carrier interconnection." },
    { num: "04 — Cloud", title: "Cloud Connectivity", body: "Private cloud on-ramps and direct connections into AWS, Azure, Google Cloud, and Oracle — low-latency and off the public internet." },
    { num: "05 — Voice", title: "Voice & UCaaS", body: "Cloud voice, unified communications, contact-center platforms, and POTS replacement — sourced from the carrier-neutral market." },
    { num: "06 — Security", title: "Security & SASE", body: "SASE, managed firewall, SD-WAN with integrated security, and managed security services layered onto the network we source." },
    { num: "07 — Mobility", title: "Wireless & Mobility", body: "Fixed wireless access, cellular failover, and enterprise mobility for rural, Tribal, and edge sites with limited fiber options." },
    { num: "08 — Colo", title: "Colocation", body: "Carrier-neutral colocation sourcing — power, space, cross-connects, and managed colo across major and secondary markets." },
    { num: "09 — DCI", title: "Data Center Interconnection", body: "Cross-connects, DCI circuits, and neutral exchange access between facilities, carrier hotels, and cloud campuses." },
  ],
};
