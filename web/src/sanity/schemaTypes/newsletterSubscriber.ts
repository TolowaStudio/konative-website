import { defineField, defineType } from "sanity";

export const newsletterSubscriber = defineType({
  name: "newsletterSubscriber",
  title: "Newsletter Subscriber",
  type: "document",
  fields: [
    defineField({ name: "email", type: "string", validation: r => r.required().email() }),
    defineField({ name: "name", type: "string" }),
    defineField({ name: "source", type: "string" }),
    defineField({ name: "status", type: "string", options: { list: ["active", "unsubscribed"] }, initialValue: "active" }),
    defineField({ name: "utmSource", type: "string" }),
    defineField({ name: "utmMedium", type: "string" }),
    defineField({ name: "subscribedAt", type: "datetime" }),
    // Express-consent record (G5): when, which form, and the exact wording shown.
    defineField({ name: "consentGiven", type: "boolean", readOnly: true }),
    defineField({ name: "consentAt", type: "datetime", readOnly: true }),
    defineField({ name: "consentFormId", type: "string", readOnly: true }),
    defineField({ name: "consentWording", type: "text", readOnly: true }),
    defineField({ name: "consentVersion", type: "string", readOnly: true }),
    defineField({ name: "optInMethod", type: "string", readOnly: true }),
    defineField({
      name: "optInStatus",
      type: "string",
      options: { list: ["pending_confirmation", "confirmed"] },
      readOnly: true,
    }),
  ],
  preview: {
    select: { email: "email", source: "source", status: "status" },
    prepare({ email, source, status }: Record<string, string>) {
      return { title: email || "Unknown", subtitle: `${source || ""} · ${status || "active"}` };
    },
  },
});
