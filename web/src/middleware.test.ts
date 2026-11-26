import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "./middleware";

describe("middleware www redirect", () => {
  it("redirects www.konative.com to apex with 308", () => {
    const req = new NextRequest("https://www.konative.com/map", {
      headers: { host: "www.konative.com" },
    });
    const res = middleware(req);
    expect(res.status).toBe(308);
    expect(res.headers.get("location")).toBe("https://konative.com/map");
  });

  it("passes through apex host", () => {
    const req = new NextRequest("https://konative.com/", {
      headers: { host: "konative.com" },
    });
    const res = middleware(req);
    expect(res.status).toBe(200);
  });
});