"use client";

// Live countdown to the shared TBCP Round 3 and NEGP application deadline.
// Renders a static fallback before hydration; renders a "closed" message once both
// deadlines pass so the page never shows a stale clock.

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

const APPLICATION_DEADLINE_MS = new Date("2026-11-17T23:59:00-05:00").getTime();

const DISPLAY = '"Barlow Condensed", sans-serif';
const BODY = "Inter, sans-serif";
const RED = "#C8001F";

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
const deadlineListStyle: CSSProperties = {
  fontFamily: BODY,
  fontSize: 14,
  lineHeight: 1.7,
  color: "rgba(255,255,255,0.72)",
  marginBottom: 18,
  maxWidth: 560,
};
const boxRowStyle: CSSProperties = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap",
};
const boxStyle: CSSProperties = {
  minWidth: 104,
  padding: "18px 20px 14px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.14)",
  borderTop: `3px solid ${RED}`,
  textAlign: "center",
};
const numStyle: CSSProperties = {
  fontFamily: DISPLAY,
  fontWeight: 800,
  fontSize: 46,
  lineHeight: 1,
  color: "#fff",
  fontVariantNumeric: "tabular-nums",
};
const unitStyle: CSSProperties = {
  fontFamily: BODY,
  fontWeight: 600,
  fontSize: 10,
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.5)",
  marginTop: 8,
};
const closedStyle: CSSProperties = {
  fontFamily: BODY,
  fontSize: 16,
  lineHeight: 1.7,
  color: "rgba(255,255,255,0.85)",
  maxWidth: 560,
};

function nextOpenDeadline(now: number): { ms: number; label: string } | null {
  if (now < APPLICATION_DEADLINE_MS) {
    return {
      ms: APPLICATION_DEADLINE_MS,
      label: "TBCP Round 3 and NEGP close Nov 17, 2026 · 11:59 p.m. ET",
    };
  }
  return null;
}

const DEADLINE_COPY =
  "TBCP Round 3 (2026-NTIA-TBCP) and NEGP (2026-NTIA-NEGP): November 17, 2026 · 11:59 p.m. ET.";

export default function DeadlineCountdown() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 10_000);
    return () => clearInterval(id);
  }, []);

  const deadlineList = (
    <p style={deadlineListStyle}>
      <strong style={{ color: "rgba(255,255,255,0.9)" }}>Application deadlines:</strong>{" "}
      {DEADLINE_COPY}
    </p>
  );

  // Static fallback before hydration (also what crawlers without JS see).
  if (now === null) {
    return (
      <div style={wrapStyle}>
        <div style={labelStyle}>Application Deadlines</div>
        {deadlineList}
      </div>
    );
  }

  const active = nextOpenDeadline(now);

  if (!active) {
    return (
      <div style={wrapStyle}>
        <div style={labelStyle}>Application Windows</div>
        <p style={closedStyle}>
          TBCP Round 3 and NEGP application windows are closed — awards roll out from Spring
          2027. Talk to us about what&apos;s next.
        </p>
      </div>
    );
  }

  const remaining = active.ms - now;
  const totalMinutes = Math.floor(remaining / 60_000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  const units: Array<{ value: number; unit: string }> = [
    { value: days, unit: "Days" },
    { value: hours, unit: "Hours" },
    { value: minutes, unit: "Minutes" },
  ];

  return (
    <div style={wrapStyle}>
      <div style={labelStyle}>Next Application Deadline</div>
      {deadlineList}
      <div style={{ ...labelStyle, marginTop: 4, marginBottom: 10 }}>{active.label}</div>
      <div style={boxRowStyle}>
        {units.map((u) => (
          <div key={u.unit} style={boxStyle}>
            <div style={numStyle}>{u.value}</div>
            <div style={unitStyle}>{u.unit}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
