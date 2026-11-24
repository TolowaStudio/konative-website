import { createClient } from "@sanity/client";

export type MarketSignalsStats = {
  stalled: number;
  focusGovernors: number;
  updatedAt?: string;
};

function getSanityClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!projectId) return null;
  return createClient({
    projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: "2024-01-01",
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
  });
}

export async function fetchMarketSignalsStats(): Promise<MarketSignalsStats | null> {
  const sanity = getSanityClient();
  if (!sanity) return null;
  try {
    return await sanity.fetch<MarketSignalsStats>(`{
      "stalled": count(*[_type == "dataCenterProject" && status in ["stalled","canceled","paused","blocked"]]),
      "focusGovernors": count(*[_type == "governor" && defined(dcPolicyNotes)]),
      "updatedAt": max(*[_type == "dataCenterProject"]._updatedAt)
    }`);
  } catch {
    return null;
  }
}