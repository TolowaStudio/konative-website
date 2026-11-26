export type NavLink = { label: string; url: string };
export type NavItem = NavLink | { label: string; children: NavLink[] };

/** Header primary nav — keep in sync with `Header.tsx`. */
export const headerNavItems: NavItem[] = [
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
      { label: "Lateral Estimator", url: "/tools/lateral-estimator" },
    ],
  },
  { label: "News", url: "/news" },
  { label: "About", url: "/about" },
];

export function collectHeaderNavHrefs(): string[] {
  const hrefs: string[] = [];
  for (const item of headerNavItems) {
    if ("url" in item) {
      hrefs.push(item.url);
    } else {
      for (const child of item.children) {
        hrefs.push(child.url);
      }
    }
  }
  return hrefs;
}

/** Footer "Intelligence" column — keep in sync with `Footer.tsx`. */
export const footerIntelligenceLinks: [string, string][] = [
  ["Intelligence Hub", "/intelligence"],
  ["News Archive", "/news"],
  ["Tribal DC Tracker", "/tribal/projects"],
  ["Market Coverage", "/markets"],
  ["TBCP 3 / NEGP Awardees", "/tribal/grants"],
  ["Voice-to-Scope", "/tribal/scope"],
  ["TBCP Awards", "/tribal/awards"],
  ["Connectivity Map", "/map"],
  ["Stalled Projects", "/governors"],
];

export function collectFooterIntelligenceHrefs(): string[] {
  return footerIntelligenceLinks.map(([, href]) => href);
}