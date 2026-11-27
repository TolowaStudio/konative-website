import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  organization: z.string().min(1, "Organization is required"),
  phone: z.string().optional(),
  serviceAddresses: z.string().optional(),
  bandwidth: z.string().optional(),
  readyForService: z.string().optional(),
  fundingProgram: z.string().optional(),
  role: z.string().optional(),
  projectType: z.string().optional(),
  projectStage: z.string().optional(),
  message: z.string().optional(),
  referralSource: z.string().optional(),
  audience: z.string().optional(),
  context: z.string().optional(),
  campaign: z.string().optional(),
  segment: z.string().optional(),
  awardSlug: z.string().optional(),
  lane: z.string().optional(),
  source: z.string().optional(),
  approvalStatus: z.string().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_term: z.string().optional(),
  utm_content: z.string().optional(),
  scopeTool: z.string().optional(),
  scopeMarkdown: z.string().optional(),
  scopeAnswers: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        prompt: z.string(),
        value: z.string(),
      }),
    )
    .optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
