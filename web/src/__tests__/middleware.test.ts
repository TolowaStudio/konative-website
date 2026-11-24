import { randomUUID } from "node:crypto";
import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { config, middleware } from "@/middleware";

describe("admin middleware (TS-4169)", () => {
  let prevToken: string | undefined;
  let prevNodeEnv: string | undefined;
  let adminToken: string;

  beforeEach(() => {
    prevToken = process.env.ADMIN_ACCESS_TOKEN;
    prevNodeEnv = process.env.NODE_ENV;
    adminToken = randomUUID();
    delete process.env.ADMIN_ACCESS_TOKEN;
    process.env.NODE_ENV = "production";
  });

  afterEach(() => {
    if (prevToken === undefined) delete process.env.ADMIN_ACCESS_TOKEN;
    else process.env.ADMIN_ACCESS_TOKEN = prevToken;
    if (prevNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = prevNodeEnv;
  });

  it("matcher locks /cms, /studio, and /dashboard", () => {
    expect(config.matcher).toEqual(
      expect.arrayContaining(["/cms/:path*", "/studio/:path*", "/dashboard/:path*"]),
    );
  });

  it("returns 503 for admin paths when ADMIN_ACCESS_TOKEN is unset", () => {
    for (const pathname of ["/cms", "/studio", "/dashboard"] as const) {
      expect(middleware(new NextRequest(`https://konative.com${pathname}`)).status).toBe(503);
    }
  });

  it("allows admin paths in development when ADMIN_ACCESS_TOKEN is unset", () => {
    process.env.NODE_ENV = "development";
    expect(middleware(new NextRequest("https://konative.com/studio")).status).toBe(200);
  });

  it("returns 401 when token is set but credentials are missing", () => {
    process.env.ADMIN_ACCESS_TOKEN = adminToken;
    expect(middleware(new NextRequest("https://konative.com/studio")).status).toBe(401);
  });

  it("allows access when Bearer token matches", () => {
    process.env.ADMIN_ACCESS_TOKEN = adminToken;
    const response = middleware(
      new NextRequest("https://konative.com/cms", {
        headers: { authorization: `Bearer ${adminToken}` },
      }),
    );
    expect(response.status).toBe(200);
  });
});