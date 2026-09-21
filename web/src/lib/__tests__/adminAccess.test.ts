import { describe, it, expect } from "vitest";
import { isAdminProtectedPath, verifyAdminAccess } from "@/lib/adminAccess";

describe("isAdminProtectedPath", () => {
  it("matches /cms, /studio, and /dashboard prefixes", () => {
    expect(isAdminProtectedPath("/cms")).toBe(true);
    expect(isAdminProtectedPath("/cms/tools")).toBe(true);
    expect(isAdminProtectedPath("/studio")).toBe(true);
    expect(isAdminProtectedPath("/studio/structure")).toBe(true);
    expect(isAdminProtectedPath("/dashboard")).toBe(true);
    expect(isAdminProtectedPath("/contact")).toBe(false);
    expect(isAdminProtectedPath("/api/contact")).toBe(false);
  });
});

describe("verifyAdminAccess", () => {
  const token = "test-admin-token";

  it("accepts Bearer token", () => {
    expect(verifyAdminAccess(`Bearer ${token}`, token)).toBe("ok");
  });

  it("accepts Basic auth with admin user", () => {
    const basic = `Basic ${btoa(`admin:${token}`)}`;
    expect(verifyAdminAccess(basic, token)).toBe("ok");
  });

  it("rejects missing or wrong credentials when token is configured", () => {
    expect(verifyAdminAccess(null, token)).toBe("unauthorized");
    expect(verifyAdminAccess("Bearer wrong", token)).toBe("unauthorized");
  });

  it("returns disabled when token is unset outside development", () => {
    const prev = process.env.NODE_ENV;
    Object.assign(process.env, { NODE_ENV: "production" });
    expect(verifyAdminAccess(null, undefined)).toBe("disabled");
    Object.assign(process.env, { NODE_ENV: prev });
  });
});
