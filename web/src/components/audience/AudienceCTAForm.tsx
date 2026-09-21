"use client";
import { useState } from "react";

const ORANGE = "#C8001F";
const BODY_FONT = "Inter, sans-serif";
const BORDER = "rgba(255,255,255,0.15)";

type Status = "idle" | "submitting" | "success" | "error";

export function AudienceCTAForm({
  audienceSlug,
  submitLabel,
}: {
  audienceSlug: string;
  submitLabel: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          organization,
          message: message || undefined,
          audience: audienceSlug,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(typeof data?.error === "string" ? data.error : "Submission failed.");
        return;
      }
      setStatus("success");
      window.dispatchEvent(new CustomEvent("tolowa:analytics", { detail: { event: "contact_submitted", properties: { audience: audienceSlug } } }));
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <p style={{ fontFamily: BODY_FONT, fontSize: 15, color: "#fff" }}>
        Thanks. We&apos;ll be in touch within one business day.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} data-audience={audienceSlug} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Field label="Name" id="cta-name" value={name} onChange={setName} required />
      <Field label="Email" id="cta-email" type="email" value={email} onChange={setEmail} required />
      <Field label="Organization" id="cta-org" value={organization} onChange={setOrganization} required />
      <Field label="Message (optional)" id="cta-message" value={message} onChange={setMessage} multiline />
      <button
        type="submit"
        disabled={status === "submitting"}
        style={{
          alignSelf: "flex-start",
          marginTop: 8,
          padding: "14px 24px",
          background: ORANGE,
          color: "#fff",
          fontFamily: BODY_FONT,
          fontWeight: 600,
          fontSize: 13,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          border: "none",
          cursor: status === "submitting" ? "wait" : "pointer",
          opacity: status === "submitting" ? 0.6 : 1,
        }}
      >
        {status === "submitting" ? "Submitting…" : `${submitLabel} →`}
      </button>
      {status === "error" && (
        <p style={{ fontFamily: BODY_FONT, fontSize: 13, color: "#f87171", margin: 0 }}>{errorMsg}</p>
      )}
    </form>
  );
}

function Field({
  label,
  id,
  value,
  onChange,
  type = "text",
  required = false,
  multiline = false,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  multiline?: boolean;
}) {
  const baseInputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${BORDER}`,
    color: "#fff",
    fontFamily: BODY_FONT,
    fontSize: 14,
    padding: "10px 12px",
    width: "100%",
  };
  return (
    <label htmlFor={id} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontFamily: BODY_FONT, fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>
        {label}{required ? " *" : ""}
      </span>
      {multiline ? (
        <textarea id={id} value={value} onChange={e => onChange(e.target.value)} rows={4} style={baseInputStyle} />
      ) : (
        <input id={id} type={type} value={value} onChange={e => onChange(e.target.value)} required={required} style={baseInputStyle} />
      )}
    </label>
  );
}
