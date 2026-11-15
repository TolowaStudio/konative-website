// Program status for TBCP Round 3 and NEGP.
// Both application windows closed 2026-11-17 at 11:59 p.m. ET, so the former live
// countdown is now a static "closed" panel. Static on purpose: crawlers and readers
// without JavaScript see the same post-deadline copy as everyone else.

import type { CSSProperties } from "react";

const BODY = "Inter, sans-serif";

const wrapStyle: CSSProperties = {
  position: "relative",
  margin: "8px 0 40px",
};
const labelStyle: CSSProperties = {
  fontFamily: BODY,
  fontWeight: 600,
  fontSize: 10,
  letterSpacing: "0.24em",
  textTransform: "uppercase",
  color: "#FF526B",
  marginBottom: 14,
};
const closedStyle: CSSProperties = {
  fontFamily: BODY,
  fontSize: 16,
  lineHeight: 1.7,
  color: "rgba(255,255,255,0.85)",
  maxWidth: 560,
  margin: 0,
};

export default function DeadlineCountdown() {
  return (
    <div style={wrapStyle}>
      <div style={labelStyle}>Program Status</div>
      <p style={closedStyle}>
        TBCP Round 3 (2026-NTIA-TBCP) and NEGP (2026-NTIA-NEGP) closed November 17, 2026 at
        11:59 p.m. ET. NTIA expects to make awards on a rolling basis beginning Spring 2027.
      </p>
    </div>
  );
}
