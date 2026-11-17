import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  isD1SponsorshipReady,
  logSupabaseFallbackError,
  noteSupabaseFallback,
  queryActiveSponsorshipPlacement,
} from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const variant = request.nextUrl.searchParams.get("variant");
  if (!variant || !["banner", "card"].includes(variant)) {
    return NextResponse.json({ error: "Invalid variant" }, { status: 400 });
  }

  const d1Row = await queryActiveSponsorshipPlacement(variant);
  if (d1Row) {
    return NextResponse.json({ placement: d1Row });
  }
  // D1 has the table populated: "no active sponsor" is the answer, not a miss.
  if (await isD1SponsorshipReady()) {
    return NextResponse.json({ placement: null });
  }
  noteSupabaseFallback("api/v1/sponsors/placement");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ placement: null });
  }

  const now = new Date().toISOString();
  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabase
    .from("sponsorship_placements")
    .select("id,sponsor_name,logo_url,tagline,cta_url,cta_text,placement_type")
    .eq("is_active", true)
    .lte("start_date", now)
    .gte("end_date", now)
    .eq("placement_type", variant)
    .limit(1);

  if (error) {
    logSupabaseFallbackError("api/v1/sponsors/placement", error);
    return NextResponse.json({ placement: null });
  }

  return NextResponse.json({ placement: data?.[0] ?? null });
}
