import { z } from "zod";

// Client payload. `consent` must be literally true: no pre-ticked / implied opt-in.
export const newsletterSchema = z.object({
  email: z.string().trim().toLowerCase().email("Valid email required"),
  name: z.string().optional(),
  source: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  consent: z.literal(true, { error: "Please tick the box to subscribe." }),
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;

// Stored record = payload minus the raw flag, plus the server-stamped consent record.
export const newsletterRecordSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  source: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  consentGiven: z.literal(true),
  consentWording: z.string().min(1),
  consentVersion: z.string().min(1),
  consentAt: z.string().min(1),
  consentFormId: z.string().min(1),
  optInMethod: z.literal("double_opt_in"),
  optInStatus: z.literal("pending_confirmation"),
});
