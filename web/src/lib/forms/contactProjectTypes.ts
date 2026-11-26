/** Requirement types offered on /contact. `?projectType=<value>` preselects one. */
export const CONTACT_PROJECT_TYPES = [
  { value: "tribal_enterprise", label: "Tribal enterprise connectivity or continuity" },
  { value: "tribal_funded", label: "Tribal or grant-funded project" },
  { value: "data_center", label: "Data-center site connectivity" },
  { value: "dark_fiber_transport", label: "Dark fiber, transport, or wavelengths" },
  { value: "business_connectivity", label: "Enterprise internet, SD-WAN, or voice" },
  { value: "cloud_security", label: "Cloud connectivity, UCaaS/CCaaS, or security" },
  { value: "market_intelligence", label: "Market intelligence or brief request" },
  { value: "partnership", label: "Partnership or referral" },
  { value: "other", label: "Other" },
] as const;

/** Returns a known project type for a query-string value, or "" when absent or unknown. */
export function resolveProjectType(raw: string | null | undefined): string {
  const v = (raw ?? "").trim();
  return CONTACT_PROJECT_TYPES.some((t) => t.value === v) ? v : "";
}
