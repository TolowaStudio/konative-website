import { describe, expect, it } from "vitest";

import { inferNewsTopicsFromText, isNewsDeskEligible, isOffTopicNewsItem } from "../newsTopicFilter";

describe("newsTopicFilter", () => {
  it("rejects off-topic commercial real estate headlines", () => {
    expect(
      isOffTopicNewsItem({
        title: "Commercial Observer: Pickleball operator signs Chelsea lease",
        summary: "Office survey shows rising vacancy.",
      }),
    ).toBe(true);
    expect(
      isNewsDeskEligible({
        title: "Taco restaurant signs 5,000 SF lease in Midtown",
        summary: "Retail footprint expansion.",
      }),
    ).toBe(false);
  });

  it("rejects Permian oil headlines without infrastructure context", () => {
    expect(
      isNewsDeskEligible({
        title: "Permian basin oil output climbs on shale drilling",
        summary: "Crude prices rise as rigs return.",
      }),
    ).toBe(false);
  });

  it("accepts federal funding and policy headlines", () => {
    expect(
      isNewsDeskEligible({
        title: "White House releases federal AI policy framework",
        summary: "New grant guidance covers data-center infrastructure planning.",
      }),
    ).toBe(true);
  });

  it("accepts data-center and tribal connectivity stories", () => {
    expect(
      isNewsDeskEligible({
        title: "Tribal nation advances 40 MW data center interconnection",
        summary: "NTIA TBCP fiber backbone supports the campus queue position.",
        topics: ["tribal-broadband"],
      }),
    ).toBe(true);
    expect(
      isNewsDeskEligible({
        title: "Hyperscaler expands Calgary colocation campus",
        summary: "AESO queue shows new MW request for AI infrastructure.",
      }),
    ).toBe(true);
  });

  it("infers topics from headline text when source topics are generic", () => {
    const topics = inferNewsTopicsFromText(
      {
        title: "FERC approves grid interconnection for utility-scale data center",
        summary: "Regulators advance permitting for 120 MW campus.",
      },
      ["construction"],
    );
    expect(topics).toContain("power");
    expect(topics).toContain("permitting");
  });
});