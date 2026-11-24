import {
  pmtilesErrorBannerLayerIds,
} from "@/lib/tiles/pmtilesLayerProbe";
import { PMTILES_ERROR_BANNER_HEADING } from "@/lib/tiles/pmtilesProbe";

/** Visible overlay failure banner (used on /map when PMTiles HEAD probe fails). */
export function PmtilesInfraErrorBanner({
  errors,
}: {
  errors: Record<string, string>;
}) {
  const layerIds = pmtilesErrorBannerLayerIds(errors);
  if (layerIds.length === 0) return null;

  return (
    <div
      data-testid="pmtiles-infra-error-banner"
      style={{
        position: "absolute",
        zIndex: 10,
        top: 72,
        left: 16,
        maxWidth: 360,
        background: "rgba(255,255,255,0.97)",
        border: "1px solid rgba(220,38,38,0.35)",
        padding: "12px 16px",
        backdropFilter: "blur(8px)",
        fontFamily: "Inter, sans-serif",
        fontSize: 11,
        color: "#0C2046",
        boxShadow: "0 8px 24px rgba(17,24,39,0.12)",
      }}
    >
      <div
        style={{
          fontSize: 9,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#dc2626",
          marginBottom: 8,
        }}
      >
        {PMTILES_ERROR_BANNER_HEADING}
      </div>
      <ul
        style={{
          margin: 0,
          paddingLeft: 16,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {layerIds.map((id) => (
          <li key={id}>
            <strong>{id}</strong>: {errors[id]}
          </li>
        ))}
      </ul>
    </div>
  );
}