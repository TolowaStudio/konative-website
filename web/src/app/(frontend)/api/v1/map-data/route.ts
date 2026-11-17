/**
 * GET /api/v1/map-data
 *
 * Returns all map layers as parallel GeoJSON FeatureCollections:
 *   - projects    : Sanity dataCenterProject (OSM, Wikidata, news extraction)
 *   - facilities  : dc_facilities (IM3 Atlas)
 *   - network     : network_facilities (PeeringDB)
 *   - power       : generation_pipeline (EIA-860M, top 500 by MW)
 *
 * Layers with no data return empty FeatureCollections — the map still renders.
 */

import { NextResponse } from "next/server";
import { createClient as createSanity } from "@sanity/client";
import { createClient as createSupabase } from "@supabase/supabase-js";
import {
  CloudflareBindingUnavailableError,
  DatabaseUnavailableError,
  SupabaseFallbackDisabledError,
  logSupabaseFallbackError,
  readWithSupabaseFallback,
  queryDcFacilitiesMap,
  queryNetworkFacilitiesMap,
  queryGenerationPipelineMap,
} from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const sanity = createSanity({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const supabase = createSupabase(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ── helpers ──────────────────────────────────────────────────────────────────

function point(lng: number, lat: number) {
  return { type: "Point" as const, coordinates: [lng, lat] };
}

function fc(features: GeoJSON.Feature[]) {
  return { type: "FeatureCollection" as const, features };
}

/**
 * Errors that must reach the caller instead of becoming an empty layer: a broken
 * primary store, or the Supabase fallback being switched off while the primary
 * had no rows (KONATIVE_SUPABASE_FALLBACK=off, TOL-324).
 */
function isFatalDataError(error: unknown): boolean {
  return (
    error instanceof CloudflareBindingUnavailableError ||
    error instanceof DatabaseUnavailableError ||
    error instanceof SupabaseFallbackDisabledError
  );
}

// ── fetchers ─────────────────────────────────────────────────────────────────

async function fetchProjects() {
  try {
    const rows = await sanity.fetch(`*[_type == "dataCenterProject" && defined(location) && status in ["operational","construction","announced"]]{
      _id, name, operator, location, city, state, provinceCode, country,
      status, capacityMw, source, sourceUrl,
      announcedDate, expectedOnlineDate, extractionConfidence, verified
    }`);
    const features = rows.map((p: {
      _id: string; name: string; operator?: string;
      location: { lat: number; lng: number };
      city?: string; state?: string; provinceCode?: string; country: string;
      status: string; capacityMw?: number; source: string; sourceUrl?: string;
      announcedDate?: string; expectedOnlineDate?: string;
      extractionConfidence?: number; verified?: boolean;
    }) => ({
      type: "Feature" as const,
      geometry: point(p.location.lng, p.location.lat),
      properties: {
        layer: "projects",
        id: p._id, name: p.name, operator: p.operator,
        city: p.city, state: p.state, provinceCode: p.provinceCode ?? null,
        country: p.country,
        status: p.status, mw: p.capacityMw || 0,
        source: p.source, sourceUrl: p.sourceUrl,
        announcedDate: p.announcedDate ?? null,
        expectedOnlineDate: p.expectedOnlineDate ?? null,
        extractionConfidence: p.extractionConfidence ?? null,
        verified: p.verified ?? false,
      },
    }));
    return { features, total: features.length };
  } catch {
    return { features: [], total: 0 };
  }
}

async function fetchStalledProjects() {
  try {
    const rows = await sanity.fetch(`*[_type == "dataCenterProject" && country == "CA" && defined(location) && status in ["stalled","blocked","paused","canceled"]]{
      _id, name, operator, location, city, state, provinceCode, country,
      status, capacityMw, source, sourceUrl, blockReason, blockReasonDetail,
      expectedOnlineDate, extractionConfidence, verified
    }`);
    const features = rows.map((p: {
      _id: string; name: string; operator?: string;
      location: { lat: number; lng: number };
      city?: string; state?: string; provinceCode?: string; country: string;
      status: string; capacityMw?: number; source: string; sourceUrl?: string;
      blockReason?: string; blockReasonDetail?: string;
      expectedOnlineDate?: string; extractionConfidence?: number; verified?: boolean;
    }) => ({
      type: "Feature" as const,
      geometry: point(p.location.lng, p.location.lat),
      properties: {
        layer: "projects_stalled",
        id: p._id, name: p.name, operator: p.operator,
        city: p.city, state: p.state, provinceCode: p.provinceCode ?? null,
        country: p.country,
        status: p.status, mw: p.capacityMw || 0,
        source: p.source, sourceUrl: p.sourceUrl,
        blockReason: p.blockReason ?? null,
        blockReasonDetail: p.blockReasonDetail ?? null,
        expectedOnlineDate: p.expectedOnlineDate ?? null,
        extractionConfidence: p.extractionConfidence ?? null,
        verified: p.verified ?? false,
      },
    }));
    return { features, total: features.length };
  } catch {
    return { features: [], total: 0 };
  }
}

async function fetchFacilities() {
  try {
    const features = await readWithSupabaseFallback<GeoJSON.Feature[]>(
      "api/v1/map-data:facilities",
      async () => {
        const d1Rows = await queryDcFacilitiesMap(2000);
        if (!d1Rows || d1Rows.length === 0) return null;
        return d1Rows.map((r) => ({
          type: "Feature" as const,
          geometry: point(r.lng, r.lat),
          properties: {
            layer: "facilities",
            id: r.id,
            name: r.name,
            operator: r.operator,
            city: r.city,
            state: r.state,
            country: r.country,
            status: r.status,
            mw: r.capacity_mw || 0,
            facilityType: r.facility_type,
            source: r.source,
            sourceUrl: r.source_url,
          },
        }));
      },
      async () => {
        const { data, error } = await supabase
          .from("dc_facilities_map")
          .select("id,name,operator,city,state,country,status,capacity_mw,facility_type,source,source_url,lng,lat")
          .limit(2000);
        if (error || !data) {
          logSupabaseFallbackError("api/v1/map-data:facilities", error ?? "no data");
          return [];
        }

        return data
          .filter((r) => r.lng != null && r.lat != null)
          .map((r) => ({
            type: "Feature" as const,
            geometry: point(r.lng, r.lat),
            properties: {
              layer: "facilities",
              id: r.id, name: r.name, operator: r.operator,
              city: r.city, state: r.state, country: r.country,
              status: r.status, mw: r.capacity_mw || 0,
              facilityType: r.facility_type, source: r.source,
              sourceUrl: r.source_url,
            },
          }));
      },
    );
    return { features, total: features.length };
  } catch (error) {
    if (isFatalDataError(error)) throw error;
    return { features: [], total: 0 };
  }
}

async function fetchNetwork() {
  try {
    const features = await readWithSupabaseFallback<GeoJSON.Feature[]>(
      "api/v1/map-data:network",
      async () => {
        const d1Rows = await queryNetworkFacilitiesMap();
        if (!d1Rows || d1Rows.length === 0) return null;
        return d1Rows.map((r) => ({
          type: "Feature" as const,
          geometry: point(r.lng, r.lat),
          properties: {
            layer: "network",
            id: r.pdb_id,
            name: r.name,
            org_name: r.org_name,
            city: r.city,
            state: r.state,
            country: r.country,
            net_count: r.net_count,
            ix_count: r.ix_count,
            carrier_count: r.carrier_count,
            status: r.status,
            source: "peeringdb",
          },
        }));
      },
      async () => {
        // Paginate to bypass PostgREST 1000-row default cap
        const PAGE = 1000;
        let all: unknown[] = [];
        for (let offset = 0; ; offset += PAGE) {
          const { data, error } = await supabase
            .from("network_facilities_map")
            .select("pdb_id,name,org_name,city,state,country,net_count,ix_count,carrier_count,status,lng,lat")
            .range(offset, offset + PAGE - 1);
          if (error || !data) {
            logSupabaseFallbackError("api/v1/map-data:network", error ?? "no data");
            break;
          }
          all = all.concat(data);
          if (data.length < PAGE) break;
        }
        const data = all as Array<Record<string, unknown>>;

        return data
          .filter((r) => r.lng != null && r.lat != null)
          .map((r) => ({
            type: "Feature" as const,
            geometry: point(r.lng as number, r.lat as number),
            properties: {
              layer: "network",
              id: r.pdb_id, name: r.name, org_name: r.org_name,
              city: r.city, state: r.state, country: r.country,
              net_count: r.net_count, ix_count: r.ix_count,
              carrier_count: r.carrier_count, status: r.status,
              source: "peeringdb",
            },
          }));
      },
    );
    return { features, total: features.length };
  } catch (error) {
    if (isFatalDataError(error)) throw error;
    return { features: [], total: 0 };
  }
}

async function fetchPower() {
  try {
    const minYear = new Date().getFullYear();
    const features = await readWithSupabaseFallback<GeoJSON.Feature[]>(
      "api/v1/map-data:power",
      async () => {
        const d1Rows = await queryGenerationPipelineMap(minYear, 500);
        if (!d1Rows || d1Rows.length === 0) return null;
        return d1Rows.map((r) => ({
          type: "Feature" as const,
          geometry: point(r.lng, r.lat),
          properties: {
            layer: "power",
            id: r.plant_id,
            name: r.plant_name,
            utilityName: r.utility_name,
            state: r.state,
            county: r.county,
            technology: r.technology,
            mw: r.capacity_mw,
            plannedYear: r.planned_year,
            statusCode: r.status_code,
            ba: r.balancing_authority,
            source: "eia_860m",
          },
        }));
      },
      async () => {
        const { data, error } = await supabase
          .from("generation_pipeline_map")
          .select("plant_id,plant_name,utility_name,state,county,technology,capacity_mw,planned_year,status_code,balancing_authority,lng,lat")
          .not("capacity_mw", "is", null)
          .gte("planned_year", minYear)
          .order("capacity_mw", { ascending: false })
          .limit(500);
        if (error || !data) {
          logSupabaseFallbackError("api/v1/map-data:power", error ?? "no data");
          return [];
        }

        return data
          .filter((r) => r.lng != null && r.lat != null)
          .map((r) => ({
            type: "Feature" as const,
            geometry: point(r.lng, r.lat),
            properties: {
              layer: "power",
              id: r.plant_id, name: r.plant_name,
              utilityName: r.utility_name, state: r.state, county: r.county,
              technology: r.technology, mw: r.capacity_mw,
              plannedYear: r.planned_year, statusCode: r.status_code,
              ba: r.balancing_authority, source: "eia_860m",
            },
          }));
      },
    );
    return { features, total: features.length };
  } catch (error) {
    if (isFatalDataError(error)) throw error;
    return { features: [], total: 0 };
  }
}

// ── handler ───────────────────────────────────────────────────────────────────

export async function GET() {
  const [projects, stalled, facilities, network, power] = await Promise.all([
    fetchProjects(),
    fetchStalledProjects(),
    fetchFacilities(),
    fetchNetwork(),
    fetchPower(),
  ]);

  return NextResponse.json({
    layers: {
      projects: fc(projects.features),
      projects_stalled: fc(stalled.features),
      facilities: fc(facilities.features),
      network: fc(network.features),
      power: fc(power.features),
    },
    counts: {
      projects: projects.total,
      projects_stalled: stalled.total,
      facilities: facilities.total,
      network: network.total,
      power: power.total,
      total: projects.total + stalled.total + facilities.total + network.total + power.total,
    },
  });
}
