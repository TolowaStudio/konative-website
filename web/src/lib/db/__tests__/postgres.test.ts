import { describe, expect, it } from "vitest";
import { resolvePgSslFromConnectionString } from "../postgres";

describe("resolvePgSslFromConnectionString", () => {
  it("enables relaxed TLS for sslmode=require (Supabase pooler)", () => {
    expect(
      resolvePgSslFromConnectionString(
        "postgres://user:secret@aws-1-us-west-1.pooler.supabase.com:6543/postgres?sslmode=require",
      ),
    ).toEqual({ rejectUnauthorized: false });
  });

  it("enables relaxed TLS for ssl=true", () => {
    expect(
      resolvePgSslFromConnectionString("postgres://user:secret@host:5432/db?ssl=true"),
    ).toEqual({ rejectUnauthorized: false });
  });

  it("returns undefined when SSL is not required", () => {
    expect(
      resolvePgSslFromConnectionString("postgres://user:secret@localhost:5432/db"),
    ).toBeUndefined();
    expect(
      resolvePgSslFromConnectionString("postgres://user:secret@localhost:5432/db?sslmode=disable"),
    ).toBeUndefined();
  });
});
