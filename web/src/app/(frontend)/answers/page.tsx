import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, faqSchema, SITE_URL } from "@/components/seo/JsonLd";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Connectivity Broker & Tribal Data Center FAQ | Konative Answers",
  description:
    "What does a connectivity broker do? How Konative sources connectivity from 100+ vendors at no cost. Tribal data center development, sovereignty-preserving deals, and federal funding programs.",
  alternates: { canonical: "/answers" },
  openGraph: {
    title: "Connectivity Broker & Tribal Data Center FAQ | Konative Answers",
    description:
      "Vendor-neutral connectivity brokerage for tribes, enterprises, and rural markets. Fiber, internet, colocation, interconnection, and data center connectivity sourced from 100+ suppliers.",
    url: `${SITE_URL}/answers`,
  },
};

const NAVY = "#08142D";
const ORANGE = "#E07B39";
const BORDER = "rgba(255,255,255,0.07)";
const TEXT_DIM = "rgba(255,255,255,0.55)";
const TEXT_FAINT = "rgba(255,255,255,0.35)";
const DISPLAY_FONT = '"Barlow Condensed", sans-serif';
const BODY_FONT = "Inter, sans-serif";

type FAQItem = {
  question: string;
  answer: string;
  category: string;
};

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "What does a connectivity broker actually do?",
    answer:
      "A connectivity broker is a vendor-neutral intermediary that sources internet, fiber transport, SD-WAN, colocation, interconnection, cross-connects, and cloud on-ramps from carriers and infrastructure providers on behalf of buyers. The broker evaluates connectivity requirements, negotiates terms with multiple carriers, and delivers services at competitive rates without marking up pricing. The buyer pays nothing for this brokerage service — Konative earns commission only when a service is provisioned. For tribal nations, rural enterprises, and data center operators, a connectivity broker eliminates the burden of direct carrier negotiations, shortens time-to-service, and ensures access to options the buyer would not discover alone.",
    category: "Connectivity Brokerage",
  },
  {
    question: "How is Konative different from going directly to a carrier?",
    answer:
      "When you contact a carrier directly, you are subject to the carrier's service area, capacity, and pricing. Konative connects you to 100+ carriers, suppliers, and infrastructure providers across North America, expanding your options dramatically. Most importantly, Konative acts as your advocate, not the carrier's. We negotiate on your behalf, source competitive quotes, manage implementation logistics, and handle troubleshooting. There is zero cost to you for this service — Konative is paid only when a service is provisioned. Direct carrier relationships are valuable, but they leave you exposed to single-provider constraints and pricing power. Konative layers on choice, competition, and dedicated advocacy.",
    category: "Connectivity Brokerage",
  },
  {
    question: "What is an Avant sub-agent and why does it matter?",
    answer:
      "Konative is an Avant sub-agent, which means we operate as a vendor-neutral specialist within the broader Avant connectivity and infrastructure ecosystem. As a sub-agent, Konative brings deep expertise in tribal, rural, and data-center-specific connectivity challenges, negotiates with a comprehensive supplier network, and ensures buyers are not locked into any single vendor platform or carrier. Avant's broader network and underwriting capability provide backing for complex deployments across multiple jurisdictions and suppliers. The sub-agent model aligns our interests with yours: we succeed only when you get the right connectivity at the right price, not when we lock you into a specific provider.",
    category: "Connectivity Brokerage",
  },
  {
    question: "What connectivity services do you broker?",
    answer:
      "Konative brokers a comprehensive range of connectivity and colocation services: internet connectivity (broadband and dark fiber), transport (MPLS, Ethernet, wavelengths), SD-WAN and managed services, colocation and rack space, cross-connects and direct port access, cloud on-ramps (AWS, Azure, GCP direct connect), interconnection services, and last-mile fiber installation. We source these services from carriers, regional providers, edge colocation facilities, and technology platforms across the US and Canada. For tribal and rural markets, we specialize in identifying non-traditional suppliers and infrastructure assets that mainstream brokers overlook.",
    category: "Connectivity Brokerage",
  },
  {
    question: "Do you serve tribal nations and rural enterprises?",
    answer:
      "Yes. Tribal and rural enterprise connectivity is Konative's primary focus. We work with tribal nations to navigate connectivity challenges specific to trust lands, including working with the NTIA Tribal Broadband Connectivity Program, USDA ReConnect, and tribal fiber assets. We help rural enterprises access internet, transport, and colocation services in regions where carrier choice is limited. We understand tribal sovereignty, federal program requirements, and the economic constraints of rural markets in ways mainstream brokers do not. For tribal nations, our connectivity brokerage work supports data center development, tribal enterprise internet access, and broadband infrastructure deployment.",
    category: "Connectivity Brokerage",
  },
  {
    question: "How do I get started?",
    answer:
      "Book a 15-minute call at /call. We'll discuss your connectivity or infrastructure challenge, confirm whether brokerage makes sense for your situation, and outline next steps. There's no cost to the consultation and no obligation. If we proceed, we'll conduct a requirements assessment, query our supplier network, and deliver a competitive proposal. Once you approve terms, we manage the entire provisioning and implementation process.",
    category: "Connectivity Brokerage",
  },
  {
    question: "How can a tribal nation monetize its land for data center development?",
    answer:
      "A tribal nation can monetize its land for data center development through several proven structures: ground leases, joint ventures, or full development agreements with infrastructure operators. The most common entry point is a ground lease, where the tribe retains land ownership while a developer builds and operates a facility, generating long-term lease revenue. Joint ventures allow the tribe to participate in operating profits and build internal capacity. Full development agreements position the tribe as the primary developer with third-party contractors. Key prerequisites include confirming adequate power access (ideally 20 MW or more), evaluating fiber connectivity, and assessing zoning or land-use frameworks on trust land. Tribal nations with proximity to Tier 1 markets, renewable energy resources, or federal fiber infrastructure have a structural advantage. Konative specializes in evaluating these variables and matching tribal land assets to the right capital partners, developers, and deal structures to ensure the tribe retains sovereignty while capturing maximum economic value.",
    category: "Data Center Development",
  },
  {
    question: "What is a tribal data center broker?",
    answer:
      "A tribal data center broker is a specialized intermediary that connects tribal nations and Indigenous Development Corporations with the capital, developers, technology operators, and federal programs needed to build and operate data center facilities. Unlike traditional commercial real estate brokers, a tribal data center broker understands the intersection of tribal sovereignty, trust land restrictions, federal procurement rules, and infrastructure finance. The broker conducts site feasibility assessments, structures deals that preserve tribal ownership rights, and sources colocation tenants or hyperscaler commitments that make a project financeable. They also navigate the unique legal frameworks governing business activity on reservation land, including BIA approval processes and tribal business entity structures. Konative is the premier tribal data center brokerage in North America, operating as a vendor-neutral, AI-native firm that represents the tribe's interests exclusively rather than those of any developer, operator, or technology vendor.",
    category: "Data Center Development",
  },
  {
    question: "Is tribal land actually viable for data centers?",
    answer:
      "Yes, tribal land is genuinely viable for data center development, and in many cases it offers structural advantages that private land cannot match. Several tribal nations have already developed or are actively developing hyperscale and edge data center campuses. Key viability factors include power availability, fiber access, climate, land area, and proximity to demand centers. Many tribal nations hold large contiguous land parcels in regions with low land costs, cool climates ideal for free-air cooling, and access to renewable energy from tribal wind or solar assets. Sovereignty also creates opportunities: tribes can establish favorable tax environments, streamline permitting, and structure business entities that accelerate project timelines compared to state-regulated developments. Challenges do exist, including BIA trust land approval processes and limited existing fiber infrastructure in some regions, but these are solvable with the right advisory support. Konative conducts Project Readiness Reviews to quantify viability and identify the fastest path to a financeable project for any tribal site.",
    category: "Data Center Development",
  },
  {
    question: "What is a Project Readiness Review for a tribal data center?",
    answer:
      "A Project Readiness Review is a structured technical and commercial assessment that determines whether a tribal nation's land and power assets can support a data center development and identifies what must be in place before capital can be raised. The review typically covers six domains: power capacity and interconnection readiness, fiber and network access, land status and BIA approval requirements, tribal business entity structure, environmental baseline, and market demand within the service radius. The output is a written assessment that identifies gaps, assigns a readiness tier, and provides a prioritized action plan. A Project Readiness Review is the standard first step in any serious data center development process because capital partners and developers will not engage without it. It also serves as a defensible document when applying for federal grants or DOE loan programs. Konative delivers Project Readiness Reviews as a core service, designed specifically for tribal contexts where land status, sovereignty, and federal program eligibility add complexity not addressed by standard commercial feasibility studies.",
    category: "Data Center Development",
  },
  {
    question: "How long does it take to develop a data center on tribal land?",
    answer:
      "Developing a data center on tribal land typically takes three to seven years from initial feasibility to full operations, depending on project scale and site readiness. The timeline breaks into four phases: site readiness and approvals (six to eighteen months), capital raise and deal structuring (six to twelve months), construction (twelve to thirty-six months depending on size), and commissioning and tenant onboarding (three to six months). Trust land projects requiring BIA approval can add six to twelve months to the approval phase compared to fee land. Power interconnection is frequently the longest lead item: a new substation or transmission upgrade can add one to three years independent of other work. Projects with existing power infrastructure and fiber access move substantially faster. Tribal nations can compress timelines by completing a Project Readiness Review early, establishing a tribal business entity in advance, and pre-qualifying for federal funding programs. Konative helps tribes sequence these workstreams to run in parallel rather than serially, which is the most effective way to reduce total development time.",
    category: "Data Center Development",
  },
  {
    question: "What federal programs support tribal data center development?",
    answer:
      "Multiple federal programs can fund or finance tribal data center development, spanning grants, loans, and tax incentives. The NTIA Tribal Broadband Connectivity Program funds network infrastructure that underpins data center connectivity. The USDA ReConnect Program provides grants and loans for rural broadband infrastructure with a tribal eligibility preference. The DOE Loan Programs Office, specifically the Title XVII and Tribal Energy Loan Guarantee programs, can finance energy and infrastructure projects at scale. The Economic Development Administration funds infrastructure and technology projects with a tribal set-aside. The BIA Tribal Energy Development Organization program supports tribes in developing energy and related infrastructure. The IRA and CHIPS Act created new manufacturing and clean energy investment incentives applicable to data center power systems. Each program has distinct eligibility rules, matching requirements, and use restrictions. Konative maps applicable programs to each tribe's specific project profile as part of its advisory process.",
    category: "Federal Funding",
  },
  {
    question: "What is the NTIA Tribal Broadband Connectivity Program?",
    answer:
      "The NTIA Tribal Broadband Connectivity Program (TBCP) is a federal grant program that provides funding specifically to tribal governments and tribal colleges to deploy broadband infrastructure on tribal lands. Authorized under the Consolidated Appropriations Act of 2021 and significantly expanded by the Infrastructure Investment and Jobs Act of 2021, the program has made over three billion dollars available across multiple funding rounds. Eligible uses include construction of middle-mile and last-mile fiber, fixed wireless infrastructure, satellite connectivity, and community anchor institution connectivity. While TBCP does not fund data center construction directly, it funds the network infrastructure that makes a data center viable: fiber backhaul, network operations centers, and community connectivity that creates local demand. Tribal nations that secure TBCP funding create a stronger foundation for data center investment because network infrastructure is often the key missing input that prevents a site from being financeable. Konative assists tribal applicants in framing TBCP applications to maximize infrastructure assets that support downstream data center development.",
    category: "Federal Funding",
  },
  {
    question: "Can a tribal IDC access DOE Loan Programs Office financing?",
    answer:
      "Yes, a tribal Indigenous Development Corporation can access DOE Loan Programs Office financing through several programs, most directly the Tribal Energy Loan Guarantee Program (TELGP). TELGP provides loan guarantees for energy development projects on tribal lands, including power infrastructure, renewable generation, and energy-intensive facilities such as data centers. The Title XVII Innovative Clean Energy Loan Guarantee Program is available for projects that deploy commercial clean energy technology, including energy-efficient data center infrastructure powered by renewables. Eligible borrowers include tribal governments, tribal business entities, and tribally chartered corporations. DOE LPO financing is typically appropriate for projects above twenty million dollars in capital cost. The application process requires a detailed technical and financial package, including an independent engineer's report, offtake agreements or revenue projections, and environmental review. The advantage of LPO financing is the ability to access low-cost federal capital for infrastructure that commercial lenders may not yet support at scale in tribal markets. Konative prepares tribal projects for LPO applications by structuring the financial and technical documentation to meet program requirements.",
    category: "Federal Funding",
  },
  {
    question: "What is the difference between tribal broadband grants and data center development funding?",
    answer:
      "Tribal broadband grants and data center development funding address different infrastructure layers and come from different federal sources. Broadband grants, such as NTIA TBCP and USDA ReConnect, fund the construction of network infrastructure: fiber, wireless towers, internet exchange points, and middle-mile connectivity. They are designed to close the digital divide and are measured by new connections and bandwidth delivered. Data center development funding, by contrast, finances physical facilities: buildings, power systems, cooling infrastructure, and compute equipment. This funding comes from DOE LPO loan guarantees, EDA economic development grants, BIA infrastructure programs, and private capital markets. The two funding streams are complementary: broadband grants establish the connectivity layer that makes a data center commercially viable, while data center funding builds the facility that runs on that connectivity. Many successful tribal data center projects sequence broadband grants first, then leverage the resulting infrastructure as an asset when raising data center development capital. Konative helps tribes develop a multi-program funding strategy that sequences these sources correctly.",
    category: "Federal Funding",
  },
  {
    question: "What is a tribal IDC and why does it matter for data center deals?",
    answer:
      "A tribal Indigenous Development Corporation (IDC) is a business entity created under tribal law or federal statute that is wholly or substantially owned by a tribal government and established to conduct economic development activities on behalf of the tribe. IDCs matter profoundly for data center deals because they are the legal vehicle through which a tribe can enter commercial contracts, hold assets, receive revenues, and access federal contracting preferences without requiring the tribal government itself to be a direct party to every transaction. In data center deals, the IDC typically serves as the lessor, joint venture partner, or project developer, allowing the tribe to participate commercially while preserving governmental immunity where appropriate. IDCs can also qualify for SBA Tribal 8(a) certification, which opens federal procurement channels and creates a path to anchor tenancy in government-facing data center facilities. Konative structures deals to work within and around IDC frameworks to ensure projects are both commercially viable and legally sound under tribal law.",
    category: "Deal Structure & Sovereignty",
  },
  {
    question: "How does tribal sovereignty affect data center development deals?",
    answer:
      "Tribal sovereignty fundamentally shapes every aspect of a data center development deal, from land title to taxation to dispute resolution. Tribal land held in federal trust cannot be mortgaged or used as collateral under standard commercial loan agreements without BIA approval, which affects how capital partners structure their security interests. Tribal sovereign immunity means that contracts with tribal governments must include explicit immunity waivers or the use of tribal business entities that do not carry governmental immunity for commercial purposes. However, sovereignty also creates advantages: tribes can establish their own regulatory frameworks, set favorable tax rates or tax exemptions, and streamline permitting timelines that would take years in state-regulated jurisdictions. Tribes can also create data privacy and data residency regimes that are attractive to specific enterprise and government tenants. The key is structuring deals to leverage sovereign advantages while providing the legal certainty that capital partners and operators require to invest. Konative's deal structuring practice is built specifically around this tension, producing agreements that satisfy both tribal governance requirements and institutional investor standards.",
    category: "Deal Structure & Sovereignty",
  },
  {
    question: "What is a sovereignty-preserving data center deal structure?",
    answer:
      "A sovereignty-preserving data center deal structure is a transaction framework that allows a tribal nation to develop and benefit from a data center facility without ceding control of its land, governance authority, or long-term economic interests to an outside developer or investor. The structure typically involves a tribal IDC as the primary entity holding the ground lease or fee interest, with a development agreement that gives a private partner construction and operational responsibilities for a defined term. Equity returns flow back to the IDC rather than being permanently assigned to outside investors. Tribal law governs on-reservation activities, and dispute resolution is structured through tribal courts or agreed arbitration rather than state court systems. The tribal nation retains the right of first refusal on facility purchase at the end of any operating agreement. Revenue-sharing provisions are structured to compound tribal benefit over time rather than front-load payments to outside parties. Konative designs sovereignty-preserving structures as the standard in every tribal engagement, not as a special accommodation.",
    category: "Deal Structure & Sovereignty",
  },
  {
    question:
      "What is the difference between a ground lease, JV, and development agreement for a tribal data center?",
    answer:
      "A ground lease, joint venture, and development agreement represent three distinct ways a tribal nation can partner with a private developer for a data center project, each with different risk profiles, revenue structures, and sovereignty implications. A ground lease is the simplest structure: the tribe leases land to a developer for a fixed term, typically fifty to ninety-nine years, and receives rent in return. The developer builds and owns the facility. The tribe's upside is capped at lease payments, but its risk is limited. A joint venture creates a co-ownership structure where the tribe and a private partner each hold equity in the project entity, sharing both profits and capital obligations proportionally. The tribe participates in operating income but also bears project risk. A development agreement is a contract where the tribe, through its IDC, retains ownership and hires a developer to design, build, and operate the facility under a time-limited contract. The tribe captures the most long-term value but also carries the most financial exposure. Konative evaluates each structure against a tribe's capital position, risk tolerance, and long-term economic goals.",
    category: "Deal Structure & Sovereignty",
  },
  {
    question:
      "What should a tribal council review before signing a data center development agreement?",
    answer:
      "Before signing a data center development agreement, a tribal council should review six critical areas: land and title provisions confirming the agreement does not impair trust status or create unauthorized encumbrances; revenue structure confirming when and how the tribe receives payments and under what conditions private partners are paid first; sovereignty and immunity provisions identifying what waivers are granted and whether they are appropriately limited in scope and duration; term and exit rights clarifying how the tribe can terminate the agreement for default or changed circumstances; tribal employment and procurement preferences ensuring local economic benefit is contractually required; and data governance provisions defining who controls data processed in the facility. The council should also confirm that the agreement has been reviewed by legal counsel with specific expertise in federal Indian law, not just commercial real estate law, as standard commercial agreements routinely include provisions that are unenforceable or legally problematic on tribal land. Konative coordinates transaction legal review as part of its advisory process.",
    category: "Deal Structure & Sovereignty",
  },
  {
    question: "What does Konative do?",
    answer:
      "Konative is North America's premier vendor-neutral connectivity and infrastructure brokerage specializing in tribal nations, rural enterprises, and data-intensive operations. We operate in two integrated service lines: (1) Connectivity Brokerage — sourcing internet, fiber, transport, SD-WAN, colocation, cross-connects, and cloud on-ramps from 100+ carriers at no cost to the client; (2) Data Center Development Brokerage — evaluating tribal land and power assets, structuring sovereignty-preserving deals, sourcing capital partners and operators, and navigating federal programs. For both service lines, Konative operates as a vendor-neutral advisor with no equity stakes, no developer affiliations, and no technology bias. Our fee structure aligns exclusively with tribal and client outcomes. We serve tribal nations across the US and Canadian First Nations.",
    category: "Konative Services",
  },
  {
    question: "What is included in a Konative Project Readiness Review?",
    answer:
      "A Konative Project Readiness Review is a comprehensive site and business assessment that covers everything a capital partner or developer needs to evaluate before committing to a tribal data center project. The review includes seven components: power assessment covering existing capacity, interconnection queue position, and path to required megawatts; fiber and network access including existing routes and middle-mile gaps; land and title analysis covering trust vs. fee status and BIA approval requirements; tribal business entity review covering IDC structure and contracting capacity; environmental baseline for preliminary permitting screening; market demand analysis for hyperscaler, federal agency, and regional enterprise demand; and federal program eligibility mapping. The output is a written report with a readiness tier rating and a prioritized action plan designed to be shared directly with capital partners and developers. Konative delivers the review within sixty to ninety days and supports the tribal team in presenting findings to stakeholders including the council, IDC board, and potential capital partners.",
    category: "Konative Services",
  },
  {
    question: "Does Konative take an equity stake in projects?",
    answer:
      "No. Konative operates as a vendor-neutral advisory and brokerage firm, which means its interests are structurally aligned with the client's rather than with any developer, capital partner, or technology vendor. We earn advisory fees and success fees tied to project milestones, creating alignment with client outcomes without the conflicts of interest that come with co-investment. This model ensures we can objectively evaluate multiple partners and recommend the best fit for each client's specific goals.",
    category: "Konative Services",
  },
  {
    question: "How does Konative differ from a traditional broker or developer?",
    answer:
      "Konative differs in four fundamental ways. First, we represent only the client's interests — not developers, carriers, or capital partners. Second, we bring vendor-neutral expertise in federal Indian law, trust land constraints, IDC structuring, connectivity markets, and federal program eligibility that generalist brokers lack. Third, we are AI-native and data-driven, using infrastructure analytics and market intelligence to evaluate sites and connectivity requirements with rigor comparable to Tier 1 data center transactions. Fourth, we take no equity and maintain no technology or provider bias. For Konative, tribal connectivity and infrastructure development is the entire business.",
    category: "Konative Services",
  },
  {
    question: "Does Konative work with Canadian First Nations?",
    answer:
      "Yes, Konative works with Canadian First Nations on data center development and connectivity infrastructure projects. The Canadian market presents significant opportunity for First Nations with large land holdings, access to low-cost renewable hydroelectric and wind power, and proximity to major population centers in British Columbia, Alberta, Ontario, and Quebec. Canadian First Nations operate under the Indian Act and modern treaty frameworks, which create a distinct legal and regulatory environment from US tribal law, but share the same core tension between land sovereignty, commercial development, and the need for business entity structures that interface with capital markets. Konative applies its Project Readiness Review methodology to First Nations sites, incorporating Canadian federal program eligibility including Indigenous Services Canada, the Strategic Infrastructure Fund, and the CRTC's Broadband Fund. Konative also works with First Nations Development Corporations and self-governing nations operating under modern treaty agreements.",
    category: "Canada / First Nations",
  },
  {
    question: "What programs support Indigenous data center development in Canada?",
    answer:
      "Several Canadian federal programs support Indigenous data center and connectivity infrastructure development. Indigenous Services Canada provides capital funding for on-reserve infrastructure through the First Nations Infrastructure Fund, which covers community buildings, connectivity, and energy systems. The CRTC Broadband Fund allocates funding for last-mile and backbone connectivity in underserved areas with Indigenous eligibility preferences. The Canada Infrastructure Bank has a dedicated Indigenous Infrastructure program that provides low-cost financing for projects above twenty-five million dollars, including energy, broadband, and community infrastructure. Natural Resources Canada's Indigenous Off-Diesel Initiative funds renewable energy projects on Indigenous lands that can supply data center power. The Strategic Innovation Fund and Regional Development Agencies provide economic development grants applicable to Indigenous-owned technology facilities. Provincial programs vary significantly by province, with BC, Ontario, and Quebec offering the most robust Indigenous economic development finance vehicles. Konative maps applicable Canadian federal and provincial programs to each First Nation's specific project.",
    category: "Canada / First Nations",
  },
  {
    question: "What happens after I submit an inquiry to Konative?",
    answer:
      "Every inquiry is reviewed and triaged the moment it comes in — scored on factors like organization, funding context, deal size, and urgency, and routed to either the Tribal desk, the data-center desk, or general advisory. Higher-priority inquiries (a named organization, a specific capacity or timeline, or an active NTIA/TBCP grant window) get faster turnaround than a general information request. A principal or Konative advisor reviews every submission personally — there is no auto-responder standing in for a human. You'll hear back with either a direct answer or a request to schedule a short call, not a form letter.",
    category: "Working With Konative",
  },
  {
    question: "How fast will Konative respond to my inquiry?",
    answer:
      "Response time depends on how the inquiry is triaged, not a flat SLA for everyone. Priority inquiries — a named organization or entity, a business email, a specific capacity/timeline, or an active grant campaign like NTIA TBCP — are routed for a same-business-day response. Inquiries with clear intent but less detail are typically answered within one business day. General or exploratory inquiries are still answered, usually within a few business days. If your situation is time-sensitive — a grant deadline, a capital raise milestone, a contract renewal — say so explicitly in your message; it moves you to a faster lane.",
    category: "Working With Konative",
  },
  {
    question: "What does the first call with Konative actually cover?",
    answer:
      "The first call is a working session, not a sales pitch. For connectivity inquiries, expect questions on site locations, current carriers and contract end dates, bandwidth and resilience requirements, and timeline. For Tribal data center or land inquiries, expect questions on land status (trust vs. fee), power capacity, existing fiber access, and where you are in tribal council or IDC decision-making. For NTIA/TBCP applicants, expect questions on award status, application timeline, and what connectivity is already specified in your proposal. The call ends with a clear next step — either a proposal timeline, a request for additional documentation, or a referral if Konative is not the right fit.",
    category: "Working With Konative",
  },
  {
    question: "What should I have ready before the first call?",
    answer:
      "Come with whatever you already have — Konative will work with partial information and fill gaps together. Useful things to have on hand: current carrier contracts or bills (for connectivity engagements), site address or parcel information (for land/data-center engagements), power capacity figures or interconnection queue status, your grant award letter or application timeline (for TBCP/NTIA-funded projects), and a rough sense of your timeline and any hard deadlines. None of this is required to get started — a first call with no documentation in hand is still a productive use of everyone's time.",
    category: "Working With Konative",
  },
  {
    question: "Does using a broker change the price I pay?",
    answer:
      "No — in the standard connectivity brokerage model, the carrier pays Konative's commission out of its own sales and channel budget, the same budget it would spend on a direct sales rep working the same deal. The list price and negotiated terms you get are the carrier's price, not a marked-up price with a broker fee layered on top. In practice, buyers often do better than going direct, because Konative is comparing your requirement against the whole supplier market rather than one rep's quota-driven quote. There is no scenario in this model where using Konative costs more than approaching a carrier alone.",
    category: "Working With Konative",
  },
  {
    question: "Who do I call if there's a problem after installation — Konative or the carrier?",
    answer:
      "Call Konative first. Even after a service is installed and billing, Konative remains the single point of contact for the life of the account — that includes outages, billing disputes, moves/adds/changes, and renewals. Konative works the escalation with the carrier on your behalf rather than handing you a support ticket number and stepping away. The value of a broker relationship is exactly this: one accountable advisor across every carrier you use, instead of a separate support relationship to manage with each one.",
    category: "Working With Konative",
  },
  {
    question: "Does Konative sign the contract, or do I contract directly with the carrier?",
    answer:
      "In the standard connectivity brokerage model, the buyer contracts directly with the winning carrier — Konative is the intermediary that runs the sourcing process, negotiates terms, and stays involved through the life of the account, but is not itself a party to the service contract. This is the same structure used in insurance and travel brokerage: the broker represents you in the market, but your legal agreement is with the carrier that actually provides the service. If your situation requires a different structure, raise it on the first call — but do not assume Konative holds contractual liability for carrier service delivery unless that has been explicitly confirmed for your engagement.",
    category: "Working With Konative",
  },
];

const CATEGORIES = [
  "Connectivity Brokerage",
  "Data Center Development",
  "Federal Funding",
  "Deal Structure & Sovereignty",
  "Konative Services",
  "Canada / First Nations",
  "Working With Konative",
] as const;

export default function AnswersPage() {
  const grouped = CATEGORIES.map((cat) => ({
    category: cat,
    items: FAQ_ITEMS.filter((f) => f.category === cat),
  }));

  return (
    <>
      <JsonLd data={faqSchema(FAQ_ITEMS)} />

      <div
        style={{
          background: NAVY,
          minHeight: "100vh",
          color: "#fff",
          fontFamily: BODY_FONT,
        }}
      >
        {/* Hero */}
        <section
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            padding: "80px 48px 0",
            borderBottom: `1px solid ${BORDER}`,
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: ORANGE,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Connectivity Brokerage & Tribal Infrastructure
          </div>
          <h1
            style={{
              fontFamily: DISPLAY_FONT,
              fontWeight: 800,
              fontSize: "clamp(36px, 5vw, 64px)",
              lineHeight: 0.95,
              textTransform: "uppercase",
              margin: "0 0 20px",
            }}
          >
            Answers
          </h1>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.65,
              color: TEXT_DIM,
              maxWidth: 680,
              margin: "0 0 48px",
            }}
          >
            What does a connectivity broker do? How Konative sources fiber, internet, colocation, and interconnection from 100+ suppliers at no cost. Tribal data center development, federal funding, and sovereignty-preserving infrastructure deals.
            Applying for NTIA TBCP Round 3 funding? See the <Link href="/ntia" style={{ color: ORANGE, textDecoration: "underline" }}>NTIA Round 3 page</Link> for eligibility, deadlines, and how connectivity fits into a funded proposal.
          </p>

          {/* Category jump links */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              paddingBottom: 40,
            }}
          >
            {CATEGORIES.map((cat) => (
              <a
                key={cat}
                href={`#${cat.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: TEXT_FAINT,
                  textDecoration: "none",
                  border: `1px solid ${BORDER}`,
                  padding: "6px 12px",
                  lineHeight: 1,
                  transition: "color 0.15s",
                }}
              >
                {cat}
              </a>
            ))}
          </div>
        </section>

        {/* FAQ sections */}
        <section style={{ maxWidth: 1080, margin: "0 auto", padding: "64px 48px 96px" }}>
          {grouped.map(({ category, items }) => (
            <div
              key={category}
              id={category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
              style={{ marginBottom: 72 }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: ORANGE,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                {category}
              </div>
              <div
                style={{
                  height: 1,
                  background: BORDER,
                  marginBottom: 40,
                }}
              />

              <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
                {items.map((faq, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 40 }}>
                    <div>
                      <h2
                        style={{
                          fontFamily: DISPLAY_FONT,
                          fontWeight: 700,
                          fontSize: 20,
                          lineHeight: 1.2,
                          margin: 0,
                          color: "#fff",
                          textTransform: "uppercase",
                        }}
                      >
                        {faq.question}
                      </h2>
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: 15,
                          lineHeight: 1.75,
                          color: TEXT_DIM,
                          margin: 0,
                        }}
                      >
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* CTA band */}
          <div
            style={{
              borderTop: `1px solid ${BORDER}`,
              paddingTop: 56,
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 40,
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: DISPLAY_FONT,
                  fontWeight: 800,
                  fontSize: "clamp(28px, 3vw, 44px)",
                  lineHeight: 1,
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                Have a question not listed here?
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: TEXT_DIM, margin: 0, maxWidth: 520 }}>
                Book a 15-minute call and we will answer it directly. No pitch deck, no obligation.
              </p>
            </div>
            <Link
              href="/call"
              style={{
                display: "inline-block",
                background: ORANGE,
                color: "#fff",
                fontFamily: DISPLAY_FONT,
                fontWeight: 700,
                fontSize: 16,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                textDecoration: "none",
                padding: "14px 28px",
                whiteSpace: "nowrap",
              }}
            >
              Book a 15-Min Call →
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
