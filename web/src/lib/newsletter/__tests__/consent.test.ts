import { describe, it, expect, vi, beforeEach } from "vitest";

const mockCreate = vi.fn().mockResolvedValue({ _id: "sub-1" });
vi.mock("@/sanity/writeClient", () => ({
  getSanityWriteClient: () => ({
    create: mockCreate,
    patch: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnThis(),
      commit: vi.fn().mockResolvedValue({}),
    }),
  }),
}));
const pending: Promise<unknown>[] = [];
vi.mock("next/server", async (orig) => ({
  ...(await orig<typeof import("next/server")>()),
  after: (fn: () => unknown) => {
    pending.push(Promise.resolve(fn()));
  },
}));

const mockFetch = vi.fn().mockResolvedValue({ ok: true, text: async () => "" });
vi.stubGlobal("fetch", mockFetch);

const { POST } = await import("@/app/(frontend)/api/newsletter/subscribe/route");
const { CONSENT_WORDING, CONSENT_VERSION, postalAddress } = await import("@/lib/newsletter/consent");

const post = async (r: import("next/server").NextRequest) => {
  const res = await POST(r);
  await Promise.all(pending.splice(0));
  return res;
};

const req = (body: unknown) =>
  new Request("http://localhost/api/newsletter/subscribe", {
    method: "POST",
    body: JSON.stringify(body),
  }) as unknown as import("next/server").NextRequest;

describe("newsletter signup consent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreate.mockResolvedValue({ _id: "sub-1" });
    mockFetch.mockResolvedValue({ ok: true, text: async () => "" });
    process.env.RESEND_API_KEY = "k";
    process.env.RESEND_FROM = "Konative <a@example.com>";
    process.env.RESEND_TO = "o@example.com";
    process.env.GHOST_URL = "https://ghost.example.com";
    process.env.TWENTY_API_URL = "https://twenty.example.com";
    process.env.TWENTY_API_KEY = "tk";
    mockFetch.mockImplementation(async (u: string) =>
      String(u).includes("/graphql")
        ? {
            ok: true,
            json: async () => ({
              data: { people: { edges: [], pageInfo: { hasNextPage: false, endCursor: null } } },
            }),
          }
        : { ok: true, text: async () => "" },
    );
  });

  const ghostCalls = () =>
    mockFetch.mock.calls.filter(([u]) => String(u).startsWith("https://ghost.example.com"));

  it("rejects a signup without consent and stores nothing", async () => {
    const res = await post(req({ email: "a@b.com", source: "blog" }));
    expect(res.status).toBe(400);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("rejects consent:false", async () => {
    const res = await post(req({ email: "a@b.com", consent: false }));
    expect(res.status).toBe(400);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("stores a consent record with time, form and exact wording (server-stamped)", async () => {
    const res = await POST(
      req({ email: "A@B.com ", source: "dispatch_archive", consent: true, consentWording: "forged" }),
    );
    expect(res.status).toBe(200);
    const doc = mockCreate.mock.calls[0][0];
    expect(doc._type).toBe("newsletterSubscriber");
    expect(doc.email).toBe("a@b.com");
    expect(doc.consentGiven).toBe(true);
    expect(doc.consentWording).toBe(CONSENT_WORDING);
    expect(doc.consentVersion).toBe(CONSENT_VERSION);
    expect(doc.consentFormId).toBe("dispatch_archive");
    expect(Number.isNaN(Date.parse(doc.consentAt))).toBe(false);
    expect(doc.optInStatus).toBe("pending_confirmation");
  });

  it("double opt-in: asks Ghost for a confirmation link, never creates a member via Admin API", async () => {
    await post(req({ email: "a@b.com", source: "blog", consent: true }));
    const calls = ghostCalls();
    expect(calls).toHaveLength(1);
    expect(String(calls[0][0])).toContain("/members/api/send-magic-link/");
    expect(JSON.parse(calls[0][1].body).emailType).toBe("signup");
    expect(JSON.parse(calls[0][1].body).newsletters).toEqual([{ name: "Konative Dispatch" }]);
    expect(calls.some(([u]) => String(u).includes("/admin/"))).toBe(false);
  });

  it("G5: a do-not-contact address stores the record but gets no confirmation email", async () => {
    mockFetch.mockImplementation(async (u: string) =>
      String(u).includes("/graphql")
        ? {
            ok: true,
            json: async () => ({
              data: {
                people: {
                  edges: [
                    {
                      node: {
                        emails: { primaryEmail: "gone@b.com", additionalEmails: [] },
                        doNotContact: true,
                      },
                    },
                  ],
                  pageInfo: { hasNextPage: false },
                },
              },
            }),
          }
        : { ok: true, text: async () => "" },
    );
    const res = await post(req({ email: "gone@b.com", source: "blog", consent: true }));
    expect(res.status).toBe(200);
    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(ghostCalls()).toHaveLength(0);
  });

  it("G5: OPTED_OUT outreachStatus suppresses the confirmation email", async () => {
    mockFetch.mockImplementation(async (u: string) =>
      String(u).includes("/graphql")
        ? {
            ok: true,
            json: async () => ({
              data: {
                people: {
                  edges: [
                    {
                      node: {
                        emails: { primaryEmail: "gone@b.com", additionalEmails: [] },
                        doNotContact: false,
                        outreachStatus: "OPTED_OUT",
                      },
                    },
                  ],
                  pageInfo: { hasNextPage: false },
                },
              },
            }),
          }
        : { ok: true, text: async () => "" },
    );
    await post(req({ email: "gone@b.com", source: "blog", consent: true }));
    expect(ghostCalls()).toHaveLength(0);
  });

  it("G5 fail-closed: Twenty unreachable means no confirmation email", async () => {
    mockFetch.mockImplementation(async (u: string) => {
      if (String(u).includes("/graphql")) throw new Error("down");
      return { ok: true, text: async () => "" };
    });
    await post(req({ email: "a@b.com", source: "blog", consent: true }));
    expect(ghostCalls()).toHaveLength(0);
  });

  it("footer postal address falls back to the placeholder", () => {
    delete process.env.NEXT_PUBLIC_POSTAL_ADDRESS;
    expect(postalAddress()).toBe("{{POSTAL_ADDRESS}}");
  });
});
