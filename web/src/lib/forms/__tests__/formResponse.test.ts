import { describe, it, expect } from "vitest";
import { submitFormResponse } from "@/lib/forms/formResponse";

describe("submitFormResponse", () => {
  it("returns success payload", async () => {
    const res = submitFormResponse({ ok: true, id: "doc-1" });
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ success: true, id: "doc-1" });
  });

  it("returns validation errors as 400", async () => {
    const res = submitFormResponse({
      ok: false,
      errors: [{ path: "email", message: "Invalid email" }],
    });
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toMatchObject({
      error: "Validation failed",
      errors: [{ path: "email", message: "Invalid email" }],
    });
  });

  it("returns stage and id for CRM failures", async () => {
    const res = submitFormResponse({
      ok: false,
      stage: "crm",
      id: "doc-99",
      message: "Failed to route inquiry. Please try again.",
    });
    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({
      error: "Failed to route inquiry. Please try again.",
      stage: "crm",
      id: "doc-99",
    });
  });

  it("returns stage for notify failures without id when absent", async () => {
    const res = submitFormResponse({
      ok: false,
      stage: "notify",
      message: "Failed to send notification. Please try again.",
    });
    await expect(res.json()).resolves.toEqual({
      error: "Failed to send notification. Please try again.",
      stage: "notify",
    });
  });
});
