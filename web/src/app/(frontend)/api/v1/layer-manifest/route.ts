import { NextResponse } from "next/server";
import type { LayerManifest } from "@/types/map-layers";
import { mergeLayerManifests } from "@/lib/tiles/layerManifest";

import bcer from "../../../../../../public/tiles/v1/manifest-bcer.json";
import env from "../../../../../../public/tiles/v1/manifest-env.json";
import indigenous from "../../../../../../public/tiles/v1/manifest-indigenous.json";
import osm from "../../../../../../public/tiles/v1/manifest-osm.json";
import p0 from "../../../../../../public/tiles/v1/manifest-p0.json";
import politics from "../../../../../../public/tiles/v1/manifest-politics.json";
import social from "../../../../../../public/tiles/v1/manifest-social.json";
import vi from "../../../../../../public/tiles/v1/manifest-vi.json";

const MANIFESTS = [
  bcer,
  env,
  indigenous,
  osm,
  p0,
  politics,
  social,
  vi,
] as unknown as LayerManifest[];

export async function GET() {
  const merged = mergeLayerManifests(MANIFESTS);
  return NextResponse.json(merged);
}