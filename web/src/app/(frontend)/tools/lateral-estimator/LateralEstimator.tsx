"use client";

// Fiber Lateral Cost & Timeline Estimator — client-side calculator.
//
// Server-renders the full form (works without JS on initial paint); results
// compute on input via useState/useMemo, no network round-trip. All math is
// derived from published Fiber Broadband Association 2025 Deployment Cost
// Report medians ($18/ft underground, $8/ft aerial) — see the methodology
// note rendered alongside the result. No invented precision: output is
// always a range, never a single number.

import { bookingUrl } from "@/lib/booking";
import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";

const RED = "#C8001F";
const DISPLAY = '"Barlow Condensed", sans-serif';
const BODY = "Inter, sans-serif";
const TEXT = "#111111";
const MUTED = "#6B7280";
const DIVIDER = "#E5E7EB";

const FEET_PER_MILE = 5280;

// Published FBA 2025 Deployment Cost Report medians.
const UNDERGROUND_PER_FT = 18;
const AERIAL_PER_FT = 8;
const MIXED_PER_FT = (UNDERGROUND_PER_FT + AERIAL_PER_FT) / 2; // 50/50 blend

const RANGE_SPREAD = 0.35; // +/- 35% — terrain, permitting, make-ready variance
const DUAL_DIVERSE_MULTIPLIER = 1.8;

type ConstructionType = "underground" | "aerial" | "mixed";
type Terrain = "standard" | "rocky-urban" | "rural-easy";
type Diversity = "single" | "dual";
type DistanceUnit = "miles" | "feet";

const TERRAIN_FACTORS: Record<Terrain, { label: string; multiplier: number; note: string }> = {
  standard: { label: "Standard", multiplier: 1, note: "Typical mix of road crossings and open ROW." },
  "rocky-urban": {
    label: "Rocky or urban-dense",
    multiplier: 1.4,
    note: "Rock boring, dense utility conflicts, or urban permitting overhead: +40%.",
  },
  "rural-easy": {
    label: "Rural-easy",
    multiplier: 0.8,
    note: "Open rural ROW, minimal crossings, straightforward access: -20%.",
  },
};

const CONSTRUCTION_LABELS: Record<ConstructionType, string> = {
  underground: "Underground",
  aerial: "Aerial",
  mixed: "Mixed (50/50)",
};

function perFootRate(type: ConstructionType): number {
  if (type === "underground") return UNDERGROUND_PER_FT;
  if (type === "aerial") return AERIAL_PER_FT;
  return MIXED_PER_FT;
}

function formatUSD(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function timelineBand(feet: number): { design: string; permits: string; construction: string; total: string } {
  const miles = feet / FEET_PER_MILE;
  if (miles < 1) {
    return {
      design: "1–2 months",
      permits: "3–6 months",
      construction: "3–5 months",
      total: "7–13 months",
    };
  }
  if (miles <= 5) {
    return {
      design: "2–3 months",
      permits: "3–6 months",
      construction: "5–9 months",
      total: "10–18 months",
    };
  }
  return {
    design: "2–3 months",
    permits: "4–6 months",
    construction: "8–12 months",
    total: "14–21 months",
  };
}

// --- Shared styles ---

const fieldLabelStyle: CSSProperties = {
  fontFamily: BODY,
  fontWeight: 600,
  fontSize: 11,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: TEXT,
  marginBottom: 10,
  display: "block",
};
const inputStyle: CSSProperties = {
  fontFamily: BODY,
  fontSize: 15,
  color: TEXT,
  background: "#fff",
  border: `1px solid ${DIVIDER}`,
  borderRadius: 2,
  padding: "12px 14px",
  width: "100%",
  boxSizing: "border-box",
};
const selectStyle: CSSProperties = { ...inputStyle, appearance: "auto" };
const toggleWrapStyle: CSSProperties = {
  display: "inline-flex",
  border: `1px solid ${DIVIDER}`,
  borderRadius: 2,
  overflow: "hidden",
};
const fieldWrapStyle: CSSProperties = { marginBottom: 28 };
const helpTextStyle: CSSProperties = {
  fontFamily: BODY,
  fontSize: 12.5,
  lineHeight: 1.6,
  color: MUTED,
  marginTop: 8,
  marginBottom: 0,
};

function toggleBtnStyle(active: boolean): CSSProperties {
  return {
    fontFamily: BODY,
    fontWeight: 600,
    fontSize: 12,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    padding: "10px 18px",
    border: "none",
    cursor: "pointer",
    background: active ? RED : "#fff",
    color: active ? "#fff" : TEXT,
  };
}

export default function LateralEstimator() {
  const [distanceValue, setDistanceValue] = useState<string>("2");
  const [distanceUnit, setDistanceUnit] = useState<DistanceUnit>("miles");
  const [constructionType, setConstructionType] = useState<ConstructionType>("mixed");
  const [terrain, setTerrain] = useState<Terrain>("standard");
  const [diversity, setDiversity] = useState<Diversity>("single");

  const result = useMemo(() => {
    const raw = parseFloat(distanceValue);
    const valid = Number.isFinite(raw) && raw > 0;
    const feet = valid ? (distanceUnit === "miles" ? raw * FEET_PER_MILE : raw) : 0;
    const miles = feet / FEET_PER_MILE;

    const baseRate = perFootRate(constructionType);
    const terrainMultiplier = TERRAIN_FACTORS[terrain].multiplier;
    const diversityMultiplier = diversity === "dual" ? DUAL_DIVERSE_MULTIPLIER : 1;

    const effectiveRate = baseRate * terrainMultiplier * diversityMultiplier;
    const midpoint = effectiveRate * feet;
    const low = midpoint * (1 - RANGE_SPREAD);
    const high = midpoint * (1 + RANGE_SPREAD);

    const perMileMid = effectiveRate * FEET_PER_MILE;
    const perMileLow = perMileMid * (1 - RANGE_SPREAD);
    const perMileHigh = perMileMid * (1 + RANGE_SPREAD);

    const timeline = timelineBand(feet);

    return { valid, feet, miles, low, high, midpoint, perMileLow, perMileHigh, timeline };
  }, [distanceValue, distanceUnit, constructionType, terrain, diversity]);

  return (
    <div>
      {/* Inputs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "0 40px",
          marginBottom: 8,
        }}
      >
        <div style={fieldWrapStyle}>
          <label style={fieldLabelStyle} htmlFor="lateral-distance">
            Lateral distance
          </label>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              id="lateral-distance"
              type="number"
              min={0}
              step="any"
              inputMode="decimal"
              value={distanceValue}
              onChange={(e) => setDistanceValue(e.target.value)}
              style={{ ...inputStyle, flex: 1 }}
            />
            <div style={toggleWrapStyle}>
              <button
                type="button"
                onClick={() => setDistanceUnit("miles")}
                style={toggleBtnStyle(distanceUnit === "miles")}
                aria-pressed={distanceUnit === "miles"}
              >
                Miles
              </button>
              <button
                type="button"
                onClick={() => setDistanceUnit("feet")}
                style={toggleBtnStyle(distanceUnit === "feet")}
                aria-pressed={distanceUnit === "feet"}
              >
                Feet
              </button>
            </div>
          </div>
          <p style={helpTextStyle}>Straight-line or route distance from the backbone/POP to the site.</p>
        </div>

        <div style={fieldWrapStyle}>
          <label style={fieldLabelStyle} htmlFor="construction-type">
            Construction type
          </label>
          <select
            id="construction-type"
            value={constructionType}
            onChange={(e) => setConstructionType(e.target.value as ConstructionType)}
            style={selectStyle}
          >
            {(Object.keys(CONSTRUCTION_LABELS) as ConstructionType[]).map((key) => (
              <option key={key} value={key}>
                {CONSTRUCTION_LABELS[key]}
              </option>
            ))}
          </select>
          <p style={helpTextStyle}>
            Underground median $18/ft, aerial median $8/ft (FBA 2025 Deployment Cost Report). Mixed blends the two.
          </p>
        </div>

        <div style={fieldWrapStyle}>
          <label style={fieldLabelStyle} htmlFor="terrain-factor">
            Terrain factor
          </label>
          <select
            id="terrain-factor"
            value={terrain}
            onChange={(e) => setTerrain(e.target.value as Terrain)}
            style={selectStyle}
          >
            {(Object.keys(TERRAIN_FACTORS) as Terrain[]).map((key) => (
              <option key={key} value={key}>
                {TERRAIN_FACTORS[key].label}
              </option>
            ))}
          </select>
          <p style={helpTextStyle}>{TERRAIN_FACTORS[terrain].note}</p>
        </div>

        <div style={fieldWrapStyle}>
          <label style={fieldLabelStyle} htmlFor="diversity">
            Diversity
          </label>
          <select
            id="diversity"
            value={diversity}
            onChange={(e) => setDiversity(e.target.value as Diversity)}
            style={selectStyle}
          >
            <option value="single">Single entry</option>
            <option value="dual">Dual diverse entries</option>
          </select>
          <p style={helpTextStyle}>
            Dual diverse entries (separate physical paths/vaults) run roughly 1.8x a single entry — two builds, not
            one.
          </p>
        </div>
      </div>

      {/* Result */}
      <div
        id="estimator-summary"
        style={{
          background: "#0A0F1E",
          border: `1px solid ${DIVIDER}`,
          borderTop: `3px solid ${RED}`,
          padding: "36px 32px",
          marginTop: 16,
          marginBottom: 32,
        }}
      >
        {!result.valid ? (
          <p style={{ fontFamily: BODY, fontSize: 15, color: "rgba(255,255,255,0.6)", margin: 0 }}>
            Enter a lateral distance above to see an estimated cost and timeline range.
          </p>
        ) : (
          <>
            <div
              style={{
                fontFamily: BODY,
                fontWeight: 600,
                fontSize: 10,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "#FF526B",
                marginBottom: 14,
              }}
            >
              Estimated Construction Cost
            </div>
            <div
              style={{
                fontFamily: DISPLAY,
                fontWeight: 800,
                fontSize: "clamp(32px, 4vw, 52px)",
                lineHeight: 1,
                color: "#fff",
                marginBottom: 10,
              }}
            >
              {formatUSD(result.low)} – {formatUSD(result.high)}
            </div>
            <p style={{ fontFamily: BODY, fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.6)", marginBottom: 24 }}>
              For {distanceValue} {distanceUnit === "miles" ? "mile(s)" : "feet"} of {CONSTRUCTION_LABELS[constructionType].toLowerCase()} construction ({result.miles.toFixed(2)} mi equivalent). That is roughly{" "}
              <strong style={{ color: "#fff" }}>
                {formatUSD(result.perMileLow)} – {formatUSD(result.perMileHigh)}
              </strong>{" "}
              per mile at this configuration.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: 16,
                borderTop: "1px solid rgba(255,255,255,0.12)",
                paddingTop: 24,
              }}
            >
              {[
                { label: "Design", value: result.timeline.design },
                { label: "Permitting", value: result.timeline.permits },
                { label: "Construction", value: result.timeline.construction },
                { label: "Total range", value: result.timeline.total },
              ].map((t) => (
                <div key={t.label}>
                  <div
                    style={{
                      fontFamily: BODY,
                      fontWeight: 600,
                      fontSize: 10,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.5)",
                      marginBottom: 6,
                    }}
                  >
                    {t.label}
                  </div>
                  <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 20, color: "#fff" }}>{t.value}</div>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: BODY, fontSize: 12.5, lineHeight: 1.6, color: "rgba(255,255,255,0.45)", marginTop: 20, marginBottom: 0 }}>
              Permitting runs longer than the range above on federal or tribal land — add months, not weeks, for
              NEPA/Section 106 review and tribal right-of-way consent processes.
            </p>
          </>
        )}
      </div>

      <p style={{ fontFamily: BODY, fontSize: 13, lineHeight: 1.7, color: MUTED, maxWidth: 760, marginBottom: 0 }}>
        Why a range, not a number: terrain, permitting timelines, and make-ready work routinely swing a lateral's
        real cost by more than 35% in either direction. Any tool — including this one — that hands you a single
        number is hiding that variance, not eliminating it.
      </p>

      <div style={{ marginTop: 28, display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
        <a
          href={bookingUrl("tools-lateral-estimator-lateralestimator")}
          style={{
            fontFamily: BODY,
            fontWeight: 600,
            fontSize: 12,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            background: RED,
            color: "#fff",
            padding: "16px 32px",
            textDecoration: "none",
            borderRadius: 2,
            display: "inline-block",
          }}
        >
          Get a real route quote →
        </a>
        <Link
          href="/data-center-connectivity"
          style={{
            fontFamily: BODY,
            fontWeight: 600,
            fontSize: 12,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: RED,
            textDecoration: "none",
            borderBottom: `1px solid ${RED}`,
            paddingBottom: 2,
          }}
        >
          Data-center connectivity brokerage →
        </Link>
        <Link
          href="/map"
          style={{
            fontFamily: BODY,
            fontWeight: 600,
            fontSize: 12,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: RED,
            textDecoration: "none",
            borderBottom: `1px solid ${RED}`,
            paddingBottom: 2,
          }}
        >
          Check your site on the map →
        </Link>
      </div>
    </div>
  );
}
