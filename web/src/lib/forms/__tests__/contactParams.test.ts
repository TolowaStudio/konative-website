import { describe, it, expect } from "vitest";
import { mergeContactUrlParams } from "../contactParams";
import { extractAttribution } from "../submit";

describe("contact page URL param capture", () => {
  it("carries every utm_* param from /contact?... into the payload that reaches attribution", () => {
    const merged = mergeContactUrlParams(
      { name: "A", email: "a@example.com" },
      "?utm_source=newsletter&utm_medium=email&utm_campaign=k06&utm_term=fiber&utm_content=hero&source=x",
    );
    expect(extractAttribution(merged)).toEqual({
      utm_source: "newsletter",
      utm_medium: "email",
      utm_campaign: "k06",
      utm_term: "fiber",
      utm_content: "hero",
    });
    expect(merged.source).toBe("x");
  });

  it("trims values and never overrides what the visitor typed", () => {
    const merged = mergeContactUrlParams({ utm_source: "typed" }, "?utm_source=url&utm_medium=%20email%20");
    expect(merged.utm_source).toBe("typed");
    expect(merged.utm_medium).toBe("email");
  });
});
