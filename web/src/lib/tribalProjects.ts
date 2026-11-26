import { getSanityReadClient } from "@/sanity/readClient";
import {
  getInterconnectTier,
  INTERCONNECT_TIER_BY_SLUG,
  INTERCONNECT_TIER_LABELS,
  OPPORTUNITY_CLASS_LABELS,
  slugFromTribalProjectId,
  TRIBAL_STATUS_LABELS,
  type InterconnectTier,
  type TribalStatus,
} from "@/lib/tribalProjectConstants";

export type { InterconnectTier, TribalStatus };
export {
  INTERCONNECT_TIER_BY_SLUG,
  INTERCONNECT_TIER_LABELS,
  OPPORTUNITY_CLASS_LABELS,
  TRIBAL_STATUS_LABELS,
  getInterconnectTier,
};

export interface TribalProjectRow {
  id: string;
  slug: string;
  name: string;
  tribe: string;
  city: string;
  state: string;
  country: "US" | "CA";
  tribalStatus: TribalStatus;
  partnerStructure?: string;
  landType?: string;
  opportunityClass?: string;
  capacityMw?: number;
  partner?: string;
  summary: string;
  voteOrDate?: string;
  sources: string[];
  priority: number;
  interconnectTier: InterconnectTier;
}

function slugFromId(id: string): string {
  return slugFromTribalProjectId(id);
}

export type TribalProjectsDatasetMeta = {
  count: number;
  updatedAt?: string;
};

export async function fetchTribalProjectsDatasetMeta(): Promise<TribalProjectsDatasetMeta | null> {
  try {
    const client = getSanityReadClient();
    return await client.fetch<TribalProjectsDatasetMeta>(
      `{
        "count": count(*[_type == "tribalProject" && defined(location)]),
        "updatedAt": max(*[_type == "tribalProject" && defined(location)]._updatedAt)
      }`,
    );
  } catch {
    return null;
  }
}

export async function fetchTribalProjects(): Promise<TribalProjectRow[]> {
  const client = getSanityReadClient();
  const rows = await client.fetch<
    Omit<TribalProjectRow, "slug" | "interconnectTier">[]
  >(
    `*[_type == "tribalProject" && defined(location)] | order(coalesce(priority, 100) asc){
      "id": _id,
      name, tribe, city, state, country,
      tribalStatus, partnerStructure, landType, opportunityClass,
      capacityMw, partner, summary, voteOrDate, sources, priority
    }`,
  );

  return rows.map((row) => {
    const slug = slugFromId(row.id);
    return {
      ...row,
      slug,
      city: row.city ?? "",
      state: row.state ?? "",
      summary: row.summary ?? "",
      sources: row.sources ?? [],
      priority: row.priority ?? 100,
      interconnectTier: getInterconnectTier(slug),
    };
  });
}
