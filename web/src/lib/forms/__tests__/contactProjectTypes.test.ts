import { describe, expect, it } from "vitest";
import { CONTACT_PROJECT_TYPES, resolveProjectType } from "../contactProjectTypes";

describe("contact projectType preselect", () => {
  it("includes tribal_enterprise", () => {
    expect(CONTACT_PROJECT_TYPES.map((t) => t.value)).toContain("tribal_enterprise");
  });
  it("honors known values and ignores unknown ones", () => {
    expect(resolveProjectType("tribal_enterprise")).toBe("tribal_enterprise");
    expect(resolveProjectType("data_center")).toBe("data_center");
    expect(resolveProjectType("<script>")).toBe("");
    expect(resolveProjectType(null)).toBe("");
  });
});
