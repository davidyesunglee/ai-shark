import { useLocation, Link } from "wouter";
import { AssessmentReport, type FullAssessment } from "@/components/AssessmentReport";
import { useSEO } from "@/lib/useSEO";
import { useUser } from "@clerk/react";
import { ArrowRight, Info, CircleSlash } from "lucide-react";
import { MarketingHeader, MarketingFooter, Reveal } from "@/components/marketing/MarketingChrome";

// Fictional business. Criteria names match the ten used by the live assessment prompt.
const SAMPLE_ASSESSMENT: FullAssessment = {
  id: "sample-report",
  businessName: "Riverside Coffee Roasters (fictional)",
  fileName: "riverside-coffee-business-plan-sample.pdf",
  uploadDate: "Illustrative example",
  status: "complete",
  overallScore: 72,
  lenderReadinessGrade: "B",
  executiveSummary:
    "This fictional plan describes opening a second cafe location and expanding a wholesale roasting operation. As written, the documentation covers the business model, management team and use of funds well. It is thinner on cash-flow detail, collateral documentation and risk mitigation. Adding a month-by-month cash-flow projection, documented equipment values and a fuller risk section would make the plan more complete for a lender conversation. This assessment reflects the documents only; it is not a credit review or a prediction of any lending decision.",
  criteria: [
    {
      id: "1",
      name: "Creditworthiness & Credit History",
      score: 64,
      analysis:
        "The plan states the owners have repaid a prior equipment loan but provides no supporting detail. A lender will review credit directly; the plan could briefly summarize existing obligations and repayment history.",
      keyFindings: [
        "Prior equipment loan mentioned without terms or payoff date",
        "Existing business obligations not listed in one place",
        "No credit information reviewed — outside the scope of this assessment",
      ],
    },
    {
      id: "2",
      name: "Cash Flow & Debt Service Coverage",
      score: 63,
      analysis:
        "The plan's own figures imply a DSCR of about 1.28x. That is stated but not stress-tested, and there is no monthly cash-flow projection for the first 18 months.",
      keyFindings: [
        "Plan-stated DSCR of about 1.28x (many lenders look for 1.20x–1.25x or higher)",
        "No slower-ramp scenario for the new location",
        "Missing month-by-month cash-flow projection",
      ],
    },
    {
      id: "3",
      name: "Collateral & Asset Base",
      score: 60,
      analysis:
        "Roasting equipment and buildout are listed as potential collateral, but appraised values and any existing liens are not documented.",
      keyFindings: [
        "Equipment listed as collateral",
        "No appraisals or invoices attached",
        "Existing liens not disclosed",
      ],
    },
    {
      id: "4",
      name: "Debt-to-Equity & Capital Structure",
      score: 66,
      analysis:
        "The plan shows a 15% owner equity injection and a post-loan debt-to-equity of about 2.4x. Many lenders prefer a larger injection for expansion projects.",
      keyFindings: [
        "15% owner equity contribution stated",
        "Post-loan debt-to-equity about 2.4x per plan figures",
        "Source of the equity injection not documented",
      ],
    },
    {
      id: "5",
      name: "Market Viability & Demand",
      score: 77,
      analysis:
        "The plan describes a growing neighborhood with limited specialty competition, but market figures are stated without citing where they came from.",
      keyFindings: [
        "Target area and customer profile clearly described",
        "Market size figures given without a stated source",
        "Wholesale demand described anecdotally",
      ],
    },
    {
      id: "6",
      name: "Management Team & Experience",
      score: 84,
      analysis:
        "The plan describes owners with a combined 12 years in specialty coffee, a clear org chart and a hiring plan for the new location.",
      keyFindings: [
        "Relevant industry experience described",
        "Defined roles for the new location",
        "Internal promotion plan reduces ramp-up risk",
      ],
    },
    {
      id: "7",
      name: "Financial Projections & Assumptions",
      score: 68,
      analysis:
        "Revenue projections reference the existing location's history, but the break-even timeline for the new site looks optimistic and key assumptions are not listed.",
      keyFindings: [
        "Projections reference historical sales",
        "Assumptions not listed in a single table",
        "Break-even timeline may be optimistic",
      ],
    },
    {
      id: "8",
      name: "Revenue Model & Profitability",
      score: 81,
      analysis:
        "The plan describes two complementary revenue streams — retail cafe sales and wholesale roasting — and states the existing location has been profitable since its second year.",
      keyFindings: [
        "Diversified retail and wholesale revenue",
        "Stated profitability at existing location",
        "Wholesale pricing terms not included",
      ],
    },
    {
      id: "9",
      name: "Industry & Regulatory Risk",
      score: 65,
      analysis:
        "Key risks are named, but mitigation is thin — particularly for green-coffee price swings, labor availability and supplier disruption. Permitting for the new site is not addressed.",
      keyFindings: [
        "Commodity price risk named without a mitigation plan",
        "No backup plan for key-supplier disruption",
        "Permitting and buildout timeline not discussed",
      ],
    },
    {
      id: "10",
      name: "Competitive Position & Differentiation",
      score: 76,
      analysis:
        "The plan explains its differentiation through local brand recognition and direct-trade sourcing, and names the nearest specialty competitor.",
      keyFindings: [
        "Clear premium positioning",
        "Direct-trade sourcing described as a differentiator",
        "Response to a possible chain entrant not addressed",
      ],
    },
  ],
  strengths: [
    "Clear description of an existing, profitable location",
    "Experienced ownership team with defined expansion roles",
    "Diversified revenue across retail and wholesale",
    "Itemized use of loan proceeds with a 10% contingency",
  ],
  weaknesses: [
    "No month-by-month cash-flow projection",
    "Plan-stated DSCR of about 1.28x is not stress-tested",
    "Collateral values and liens not documented",
    "Owner equity injection of 15% with no stated source",
  ],
  recommendations: [
    "Add an 18-month monthly cash-flow projection for the new location, including a slower-ramp case",
    "Document the source of the owner equity injection and consider whether a larger contribution is possible",
    "Attach equipment invoices or appraisals and disclose any existing liens",
    "List key projection assumptions in one table and explain each",
    "Expand the risk section with specific mitigation for commodity costs, labor and supplier disruption",
    "Cite sources for market size figures, and include any signed letters of intent from wholesale customers",
  ],
  swot: {
    strengths: ["Recognized local brand (as described)", "Profitable existing location (as stated)", "Direct-trade sourcing supports premium pricing"],
    weaknesses: ["Thin, untested debt-service cushion", "Incomplete cash-flow documentation", "Modest owner equity contribution"],
    opportunities: ["Growing target neighborhood", "Restaurant demand for local wholesale roasting", "Room for catering and subscription revenue"],
    threats: ["Volatile green-coffee prices", "Tight local labor market", "Possible entry of a national chain"],
  },
  marketAnalysis: {
    targetMarket:
      "As described in the plan: specialty coffee customers and local restaurants in a growing suburban corridor.",
    marketSize:
      "The plan states an $18M local specialty coffee market and a $4M wholesale segment. No source is cited; a lender may ask for one.",
    competitivePosition:
      "Premium positioning based on brand loyalty and direct-trade sourcing, with one named specialty competitor nearby.",
    growthPotential:
      "The plan projects revenue roughly doubling in three years. This depends on assumptions that are not fully documented.",
  },
  financialRatios: [
    { name: "Debt Service Coverage Ratio (DSCR)", value: "1.28x (plan-stated)", assessment: "Acceptable" },
    { name: "Current Ratio", value: "1.6 (plan-stated)", assessment: "Good" },
    { name: "Debt-to-Equity", value: "2.4x (plan-stated)", assessment: "Acceptable" },
    { name: "Gross Margin", value: "62% (plan-stated)", assessment: "Good" },
    { name: "Net Profit Margin", value: "9% (plan-stated)", assessment: "Acceptable" },
    { name: "Owner Equity Contribution", value: "15% (plan-stated)", assessment: "Concerning" },
  ],
};

export default function SamplePage() {
  const [, setLocation] = useLocation();
  const { user } = useUser();

  useSEO({
    title: "Sample Business Plan Review (Fictional) | AI Shark",
    description:
      "An illustrative AI Shark documentation assessment for a fictional business: overall score, readiness grade, 10 debt-financing considerations, SWOT and ratios. Not a credit check or approval prediction.",
    canonical: "/sample",
  });

  const previewHref = `${import.meta.env.BASE_URL}#free-preview`;

  return (
    <div className="mk min-h-[100dvh]">
      <a href="#main-content" className="skip-to-content">Skip to main content</a>
      <MarketingHeader signedIn={!!user} />

      <main id="main-content">
        <section className="mx-auto max-w-6xl px-4 pb-8 pt-12 md:pt-16">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <div>
              <p className="mk-chip mk-rise" data-testid="text-sample-banner">
                <span className="h-2 w-2 rounded-full bg-[hsl(var(--mk-coral))]" aria-hidden="true" />
                Fictional business · Illustrative example
              </p>
              <h1 className="mk-display mk-rise mt-5 text-4xl font-semibold leading-tight sm:text-5xl" style={{ animationDelay: "80ms" }}>
                What a full report looks like
              </h1>
              <p className="mk-ink-soft mk-rise mt-4 max-w-xl text-lg leading-relaxed" style={{ animationDelay: "160ms" }}>
                Riverside Coffee Roasters is made up. We wrote a sample plan for it and show the kind of documentation assessment AI Shark produces. Your report will reflect your own plan.
              </p>
            </div>
            <Reveal className="mk-card p-5">
              <p className="flex items-center gap-2 font-semibold"><Info className="h-4 w-4 mk-blue" aria-hidden="true" />How to read the scores</p>
              <ul className="mk-ink-soft mt-3 space-y-2 text-sm">
                <li className="flex gap-2"><CircleSlash className="mt-0.5 h-4 w-4 shrink-0 mk-coral" aria-hidden="true" />Not a credit check — no credit data is used.</li>
                <li className="flex gap-2"><CircleSlash className="mt-0.5 h-4 w-4 shrink-0 mk-coral" aria-hidden="true" />Not verified underwriting — figures are taken from the plan as written.</li>
                <li className="flex gap-2"><CircleSlash className="mt-0.5 h-4 w-4 shrink-0 mk-coral" aria-hidden="true" />Not a prediction of approval, terms or outcome.</li>
              </ul>
            </Reveal>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-12" aria-label="Sample report">
          <div className="mk-card overflow-hidden bg-background p-4 sm:p-6">
            <AssessmentReport assessment={SAMPLE_ASSESSMENT} onBack={() => setLocation("/")} publicMode />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20">
          <Reveal className="mk-deep relative overflow-hidden rounded-[22px] p-8 sm:p-12">
            <div className="grid items-center gap-8 md:grid-cols-[1.5fr_1fr]">
              <div>
                <h2 className="mk-display text-3xl font-semibold sm:text-4xl">See how your own plan reads.</h2>
                <p className="mt-3 opacity-80">
                  Start with the free preview — score, grade and top three gaps, no account needed. Get the full report only if you want the detail.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                {user ? (
                  <Link href="/dashboard" className="mk-btn mk-btn-coral" data-testid="button-sample-cta">
                    Go to dashboard <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                ) : (
                  <a href={previewHref} className="mk-btn mk-btn-coral" data-testid="button-sample-cta">
                    Try the free preview <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                )}
                <Link href="/pricing" className="mk-btn border border-white/25 text-[hsl(42_38%_94%)] hover:bg-white/10" data-testid="button-sample-pricing">
                  View pricing
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
