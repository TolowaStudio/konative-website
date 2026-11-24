import { getD1 } from "@/lib/db/client";

export interface TbcpAwardRow {
  id: string;
  state: string | null;
  award_amount_usd: number | null;
  nofo_round: string | null;
  slug: string;
  grantee_name: string;
  tribe_name: string | null;
  project_type?: string | null;
  project_description?: string | null;
  lat: number | null;
  lng: number | null;
  raw_properties?: string | Record<string, unknown> | null;
}

export async function queryTbcpAwards(
  select = "state, award_amount_usd, nofo_round",
): Promise<TbcpAwardRow[] | null> {
  const db = await getD1();
  try {
    const { results } = await db
      .prepare(`SELECT id, slug, grantee_name, tribe_name, ${select} FROM tbcp_awards`)
      .all<TbcpAwardRow>();
    return results ?? [];
  } catch {
    return null;
  }
}

export async function queryTbcpAwardBySlug(
  slug: string,
): Promise<TbcpAwardRow | null> {
  const db = await getD1();
  try {
    return await db
      .prepare(
        `SELECT * FROM tbcp_awards WHERE slug = ? LIMIT 1`,
      )
      .bind(slug)
      .first<TbcpAwardRow>();
  } catch {
    return null;
  }
}

export async function queryTbcpAwardsList(limit = 1000): Promise<TbcpAwardRow[] | null> {
  const db = await getD1();
  try {
    const { results } = await db
      .prepare(
        `SELECT id, slug, grantee_name, award_amount_usd, nofo_round, project_type, lat, lng, raw_properties
         FROM tbcp_awards
         ORDER BY award_amount_usd DESC
         LIMIT ?`,
      )
      .bind(limit)
      .all<TbcpAwardRow>();
    return results ?? [];
  } catch {
    return null;
  }
}

export async function queryTbcpAwardsDatasetMeta(): Promise<{ updatedAt?: string } | null> {
  const db = await getD1();
  try {
    const row = await db
      .prepare(`SELECT max(updated_at) AS updatedAt FROM tbcp_awards`)
      .first<{ updatedAt: string | null }>();
    if (!row?.updatedAt) return null;
    return { updatedAt: row.updatedAt };
  } catch {
    return null;
  }
}

export async function queryTbcpSlugs(): Promise<string[]> {
  const db = await getD1();
  try {
    const { results } = await db
      .prepare(`SELECT slug FROM tbcp_awards ORDER BY slug`)
      .all<{ slug: string }>();
    return (results ?? []).map((r) => r.slug);
  } catch {
    return [];
  }
}
