import { CONTACT_HONEYPOT_FIELD } from "@/lib/forms/contactAntiSpam";

/** Visually hidden field; bots that fill it are dropped server-side. */
export function ContactHoneypot() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "-10000px",
        top: "auto",
        width: 1,
        height: 1,
        overflow: "hidden",
      }}
    >
      <label htmlFor="contact-mesh-ledger-slot">Mesh ledger slot</label>
      <input
        type="text"
        id="contact-mesh-ledger-slot"
        name={CONTACT_HONEYPOT_FIELD}
        tabIndex={-1}
        autoComplete="new-password"
      />
    </div>
  );
}
