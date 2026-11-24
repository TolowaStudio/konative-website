import type { CSSProperties } from "react";

const defaultStyle: CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.45)",
};

export function AsOfLabel({ label, style }: { label: string; style?: CSSProperties }) {
  return <p style={{ ...defaultStyle, margin: "12px 0 0", ...style }}>Dataset as of {label}</p>;
}