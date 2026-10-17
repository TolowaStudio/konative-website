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
      <label htmlFor="contact-company-website">Company website</label>
      <input
        type="text"
        id="contact-company-website"
        name={CONTACT_HONEYPOT_FIELD}
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );
}
