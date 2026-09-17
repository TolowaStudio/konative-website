import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

type Row = { id: string; impressions: number; clicks: number };

const rows = new Map<string, Row>();
let insertShouldFail = false;

function makeQuery(table: string) {
  const state: { selectField?: string; filters: Record<string, unknown>; updatePayload?: Record<string, number> } = {
    filters: {},
  };

  const api = {
    select(field: string) {
      state.selectField = field;
      return api;
    },
    insert(_payload: unknown) {
      return Promise.resolve(insertShouldFail ? { error: { message: "insert failed" } } : { error: null });
    },
    update(payload: Record<string, number>) {
      state.updatePayload = payload;
      return api;
    },
    eq(key: string, value: unknown) {
      state.filters[key] = value;
      return api;
    },
    async single() {
      const row = rows.get(state.filters.id as string);
      if (!row) return { data: null, error: { message: "not found" } };
      const field = state.selectField as keyof Row;
      return { data: { [field]: row[field] }, error: null };
    },
    then(resolve: (v: unknown) => unknown) {
      // Terminal for update().eq(id).eq(field, expected).select('id')
      const id = state.filters.id as string;
      const row = rows.get(id);
      if (!row || !state.updatePayload) return resolve({ data: [], error: null });

      const [[field, expected]] = Object.entries(state.filters).filter(([k]) => k !== "id");
      const current = row[field as keyof Row] as number;
      if (current !== expected) {
        return resolve({ data: [], error: null }); // CAS miss — simulates concurrent writer
      }
      Object.assign(row, state.updatePayload);
      return resolve({ data: [{ id }], error: null });
    },
  };
  return { table, ...api };
}

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: (table: string) => makeQuery(table),
  },
}));

const { POST } = await import("../route");

function req(body: unknown) {
  return new NextRequest("https://konative.com/api/v1/analytics/track", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

describe("POST /api/v1/analytics/track", () => {
  beforeEach(() => {
    rows.clear();
    insertShouldFail = false;
    rows.set("placement-1", { id: "placement-1", impressions: 0, clicks: 0 });
  });

  it("returns 400 on missing required fields", async () => {
    const res = await POST(req({ event_type: "sponsor_impression" }));
    expect(res.status).toBe(400);
  });

  it("returns 500 when the analytics_events insert fails, instead of a silent 204", async () => {
    insertShouldFail = true;
    const res = await POST(
      req({ event_type: "page_view", entity_type: "page", entity_id: "home" }),
    );
    expect(res.status).toBe(500);
  });

  it("increments the sponsorship counter and returns 204 on success", async () => {
    const res = await POST(
      req({ event_type: "sponsor_impression", entity_type: "sponsorship_placement", entity_id: "placement-1" }),
    );
    expect(res.status).toBe(204);
    expect(rows.get("placement-1")!.impressions).toBe(1);
  });

  it("serializes concurrent increments via compare-and-swap instead of losing updates", async () => {
    const results = await Promise.all(
      Array.from({ length: 20 }, () =>
        POST(req({ event_type: "sponsor_impression", entity_type: "sponsorship_placement", entity_id: "placement-1" })),
      ),
    );
    expect(results.every(r => r.status === 204)).toBe(true);
    expect(rows.get("placement-1")!.impressions).toBe(20);
  });
});
