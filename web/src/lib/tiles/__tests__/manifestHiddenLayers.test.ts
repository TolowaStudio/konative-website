import { describe, expect, it } from "vitest";
import type { LayerManifest } from "@/types/map-layers";
import bcer from "../../../../public/tiles/v1/manifest-bcer.json";
import env from "../../../../public/tiles/v1/manifest-env.json";
import indigenous from "../../../../public/tiles/v1/manifest-indigenous.json";
import osm from "../../../../public/tiles/v1/manifest-osm.json";
import p0 from "../../../../public/tiles/v1/manifest-p0.json";
import politics from "../../../../public/tiles/v1/manifest-politics.json";
import social from "../../../../public/tiles/v1/manifest-social.json";
import vi from "../../../../public/tiles/v1/manifest-vi.json";
import { MAP_HIDDEN_LAYER_IDS } from "../constants";
import { mergeLayerManifests } from "../layerManifest";

const SHIPPED_MANIFESTS = [
  bcer,
  env,
  indigenous,
  osm,
  p0,
  politics,
  social,
  vi,
] as unknown as LayerManifest[];

describe("hidden layers in shipped manifests", () => {
  it("drops all seven MAP_HIDDEN_LAYER_IDS present in real manifest JSON", () => {
    for (const hiddenId of MAP_HIDDEN_LAYER_IDS) {
      const inSource = SHIPPED_MANIFESTS.some((m) =>
        m.layers?.some((layer) => layer.id === hiddenId),
      );
      expect(inSource).toBe(true);
    }

    const merged = mergeLayerManifests(SHIPPED_MANIFESTS);
    const publicIds = new Set(merged.layers.map((layer) => layer.id));
    for (const hiddenId of MAP_HIDDEN_LAYER_IDS) {
      expect(publicIds.has(hiddenId)).toBe(false);
    }
  });
});