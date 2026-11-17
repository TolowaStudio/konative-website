import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import {
  isD1QueueReady,
  logSupabaseFallbackError,
  noteSupabaseFallback,
  queryInterconnectionQueueRadius,
} from "@/lib/db";
import type { InterconnectionQueueRow, QueueAuthority, QueueRadiusResponse } from "@/types/queue";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const QuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  radius_km: z.coerce.number().min(1).max(500).default(50),
});

interface QueueRadiusRpcRow {
  id: string;
  authority: string;
  project_name: string;
  capacity_mw: number;
  resource_type: string;
  study_phase: string;
  queue_date: string;
  expected_cod: string | null;
  poi_name: string | null;
  poi_lat: number | null;
  poi_lng: number | null;
  source_url: string;
  last_updated: string;
  distance_km: number;
}

function mapRpcRow(row: QueueRadiusRpcRow): InterconnectionQueueRow {
  return {
    id: row.id,
    authority: row.authority as QueueAuthority,
    projectName: row.project_name,
    capacityMw: Number(row.capacity_mw ?? 0),
    resourceType: row.resource_type as InterconnectionQueueRow["resourceType"],
    studyPhase: row.study_phase as InterconnectionQueueRow["studyPhase"],
    queueDate: row.queue_date,
    expectedCod: row.expected_cod,
    poiName: row.poi_name,
    poiLat: row.poi_lat,
    poiLng: row.poi_lng,
    sourceUrl: row.source_url,
    lastUpdated: row.last_updated,
  };
}

function computeMedianYearsToCod(rows: InterconnectionQueueRow[]): number | null {
  const now = new Date();
  const values = rows
    .filter((row) => row.expectedCod)
    .map((row) => {
      const cod = new Date(row.expectedCod as string);
      if (Number.isNaN(cod.valueOf())) return null;
      return Math.max((cod.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 365.25), 0);
    })
    .filter((value): value is number => value !== null)
    .sort((a, b) => a - b);

  if (!values.length) return null;
  const mid = Math.floor(values.length / 2);
  const median =
    values.length % 2 === 0 ? (values[mid - 1] + values[mid]) / 2 : values[mid];
  return Number(median.toFixed(2));
}

function buildResponse(
  centerLat: number,
  centerLng: number,
  radiusKm: number,
  rows: InterconnectionQueueRow[]
): QueueRadiusResponse {
  const countByAuthority: QueueRadiusResponse["countByAuthority"] = {};
  let totalMw = 0;

  for (const row of rows) {
    totalMw += row.capacityMw;
    countByAuthority[row.authority] = (countByAuthority[row.authority] ?? 0) + 1;
  }

  return {
    centerLat,
    centerLng,
    radiusKm,
    totalMw: Number(totalMw.toFixed(2)),
    countByAuthority,
    medianYearsToCod: computeMedianYearsToCod(rows),
    rows,
  };
}

export async function GET(req: NextRequest) {
  const parsed = QuerySchema.safeParse({
    lat: req.nextUrl.searchParams.get("lat"),
    lng: req.nextUrl.searchParams.get("lng"),
    radius_km: req.nextUrl.searchParams.get("radius_km") ?? "50",
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query parameters", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { lat, lng, radius_km: radiusKm } = parsed.data;

  if (await isD1QueueReady()) {
    const d1Rows = await queryInterconnectionQueueRadius(lat, lng, radiusKm);
    const rows = (d1Rows ?? []).map((row) =>
      mapRpcRow({
        id: row.id,
        authority: row.authority,
        project_name: row.project_name,
        capacity_mw: row.capacity_mw,
        resource_type: row.resource_type,
        study_phase: row.study_phase,
        queue_date: row.queue_date,
        expected_cod: row.expected_cod,
        poi_name: row.poi_name,
        poi_lat: row.poi_lat,
        poi_lng: row.poi_lng,
        source_url: row.source_url,
        last_updated: row.last_updated,
        distance_km: row.distance_km ?? 0,
      }),
    );
    return NextResponse.json(buildResponse(lat, lng, radiusKm, rows));
  }

  noteSupabaseFallback("api/v1/queue", "D1 interconnection_queue is empty");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnon) {
    return NextResponse.json({ error: "Data store not configured" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseAnon, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase.rpc("get_interconnection_queue_radius", {
    p_lat: lat,
    p_lng: lng,
    p_radius_km: radiusKm,
  });

  if (error) {
    logSupabaseFallbackError("api/v1/queue", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = ((data ?? []) as QueueRadiusRpcRow[]).map(mapRpcRow);
  return NextResponse.json(buildResponse(lat, lng, radiusKm, rows));
}
