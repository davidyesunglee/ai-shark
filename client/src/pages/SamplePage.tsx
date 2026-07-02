import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AssessmentReport, type FullAssessment } from "@/components/AssessmentReport";
import { useSEO } from "@/lib/useSEO";
import { Sparkles, ArrowRight } from "lucide-react";

const SAMPLE_ASSESSMENT: FullAssessment = {
  id: "sample-report",
  businessName: "Riverside Coffee Roasters",
  fileName: "riverside-coffee-business-plan.pdf",
  uploadDate: "March 12, 2026",
  status: "complete",
  overallScore: 74,
  lenderReadinessGrade: "B",
  executiveSummary:
    "Riverside Coffee Roasters presents a well-structured plan to open a second location and expand its wholesale roasting operation. The business shows three years of consistent revenue growth, healthy gross margins, and an experienced ownership team. Debt-service coverage is adequate but leaves limited cushion, and the plan would be strengthened by more detailed cash-flow projections and a clearer collateral position. Overall, this is a solid candidate for bank debt financing, likely to qualify with modest additional documentation and a slightly larger owner equity contribution.",
  criteria: [
    {
      id: "1",
      name: "Business Model & Viability",
      score: 82,
      analysis:
        "The dual revenue model — retail cafe sales plus wholesale roasting to local restaurants — is proven and diversified. Existing location has been profitable for two years.",
      keyFindings: [
        "Two complementary revenue streams reduce dependence on foot traffic",
        "Existing location profitable since year two",
        "Wholesale contracts provide predictable recurring revenue",
      ],
    },
    {
      id: "2",
      name: "Management & Experience",
      score: 85,
      analysis:
        "Owners have 12 combined years in specialty coffee and prior management experience. A clear org chart and hiring plan support the expansion.",
      keyFindings: [
        "12 years combined industry experience",
        "Defined roles for the new location",
        "Existing staff can be promoted to reduce ramp-up risk",
      ],
    },
    {
      id: "3",
      name: "Financial Projections",
      score: 68,
      analysis:
        "Revenue projections are reasonable and grounded in existing performance, but the plan lacks a month-by-month cash-flow statement for the first 18 months.",
      keyFindings: [
        "Revenue assumptions tied to real historical data",
        "Missing detailed monthly cash-flow projection",
        "Break-even analysis provided but optimistic on ramp speed",
      ],
    },
    {
      id: "4",
      name: "Debt Service Coverage",
      score: 65,
      analysis:
        "Projected DSCR of 1.28x meets typical bank minimums but leaves limited room for slower-than-expected sales at the new location.",
      keyFindings: [
        "Projected DSCR of 1.28x (bank minimum typically 1.20x)",
        "Limited cushion if new location ramps slowly",
        "Existing location cash flow partially offsets risk",
      ],
    },
    {
      id: "5",
      name: "Collateral & Security",
      score: 62,
      analysis:
        "Roasting equipment and buildout provide some collateral, but the plan does not clearly document appraised values or existing liens.",
      keyFindings: [
        "Roasting equipment offers tangible collateral",
        "Appraised values not documented",
        "Owner willing to provide personal guarantee",
      ],
    },
    {
      id: "6",
      name: "Market Opportunity",
      score: 78,
      analysis:
        "The target neighborhood is growing and underserved by specialty coffee. Demand for local wholesale roasting is rising.",
      keyFindings: [
        "Target area population growing 4% annually",
        "Only one comparable specialty competitor nearby",
        "Growing restaurant demand for local roasters",
      ],
    },
    {
      id: "7",
      name: "Competitive Advantage",
      score: 76,
      analysis:
        "Established brand, loyal customer base, and direct-trade sourcing relationships differentiate the business from chains.",
      keyFindings: [
        "Recognized local brand with loyal following",
        "Direct-trade sourcing supports premium pricing",
        "Chains compete on price, not quality",
      ],
    },
    {
      id: "8",
      name: "Use of Funds",
      score: 80,
      analysis:
        "The loan request is clearly itemized across buildout, equipment, and working capital, with sensible contingency.",
      keyFindings: [
        "Clearly itemized use of proceeds",
        "10% contingency included",
        "Working capital line appropriately sized",
      ],
    },
    {
      id: "9",
      name: "Owner Equity & Commitment",
      score: 70,
      analysis:
        "Owners contribute 15% equity. Banks often prefer 20%+ for expansion, so a larger contribution would strengthen the application.",
      keyFindings: [
        "15% owner equity contribution",
        "Banks typically prefer 20%+ for expansion",
        "Owners reinvesting retained earnings",
      ],
    },
    {
      id: "10",
      name: "Risk & Contingency Planning",
      score: 66,
      analysis:
        "The plan acknowledges key risks but offers limited mitigation detail, particularly around rising green-coffee costs and labor availability.",
      keyFindings: [
        "Key risks identified",
        "Limited mitigation detail for input cost volatility",
        "No documented backup for key-supplier disruption",
      ],
    },
  ],
  strengths: [
    "Proven, profitable existing location with two years of positive cash flow",
    "Experienced ownership team with clear expansion roles",
    "Diversified revenue across retail and wholesale channels",
    "Well-itemized use of loan proceeds with contingency",
  ],
  weaknesses: [
    "Missing detailed month-by-month cash-flow projection",
    "Debt-service coverage cushion is thin at 1.28x",
    "Collateral values and liens not fully documented",
    "Owner equity contribution below the 20% banks often prefer",
  ],
  recommendations: [
    "Add an 18-month monthly cash-flow projection for the new location",
    "Increase owner equity contribution toward 20% to strengthen the application",
    "Obtain and document equipment appraisals and any existing liens",
    "Expand the risk section with specific mitigation for green-coffee cost volatility",
    "Provide signed letters of intent for new wholesale accounts to support revenue projections",
  ],
  swot: {
    strengths: [
      "Established, recognized local brand",
      "Two profitable years at the existing location",
      "Direct-trade sourcing supports premium margins",
    ],
    weaknesses: [
      "Thin debt-service coverage cushion",
      "Incomplete cash-flow documentation",
      "Below-preferred owner equity contribution",
    ],
    opportunities: [
      "Underserved, growing target neighborhood",
      "Rising restaurant demand for local wholesale roasting",
      "Room to add catering and subscription revenue",
    ],
    threats: [
      "Volatile green-coffee commodity prices",
      "Tight local labor market",
      "Potential entry of a national chain",
    ],
  },
  marketAnalysis: {
    targetMarket:
      "Specialty coffee drinkers and local restaurants in a growing suburban corridor, ages 25–55 with above-average discretionary spend.",
    marketSize:
      "Estimated $18M local specialty coffee market growing roughly 6% per year, with an addressable wholesale segment of about $4M.",
    competitivePosition:
      "Differentiated premium position anchored by brand loyalty and direct-trade sourcing; limited direct specialty competition nearby.",
    growthPotential:
      "Strong — expansion location plus wholesale growth could roughly double revenue within three years if execution stays on plan.",
  },
  financialRatios: [
    { name: "Debt Service Coverage (DSCR)", value: "1.28x", assessment: "Acceptable" },
    { name: "Gross Margin", value: "62%", assessment: "Good" },
    { name: "Current Ratio", value: "1.6", assessment: "Good" },
    { name: "Debt-to-Equity", value: "2.4x", assessment: "Acceptable" },
    { name: "Net Profit Margin", value: "9%", assessment: "Acceptable" },
    { name: "Owner Equity Contribution", value: "15%", assessment: "Concerning" },
  ],
};

export default function SamplePage() {
  const [, setLocation] = useLocation();

  useSEO({
    title: "Sample Business Plan Assessment Report | AI Shark",
    description:
      "See a real example of an AI Shark business plan assessment — overall score, lender readiness grade, 10-dimension breakdown, SWOT, market analysis, and financial ratios.",
    canonical: "/sample",
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-primary/5">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
            <p className="text-sm font-medium" data-testid="text-sample-banner">
              This is a sample report. Yours will be based on your own business plan.
            </p>
          </div>
          <Link href="/signup">
            <Button size="sm" data-testid="button-sample-cta">
              Assess My Plan
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <AssessmentReport assessment={SAMPLE_ASSESSMENT} onBack={() => setLocation("/")} publicMode />

        <div className="mt-10 rounded-xl border bg-primary/5 p-8 text-center">
          <h2 className="text-2xl font-semibold">Ready to see your own score?</h2>
          <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
            Upload your business plan and get a full assessment like this one — with your overall
            score, lender readiness grade, and a clear path to improve.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link href="/signup">
              <Button size="lg" data-testid="button-sample-signup">
                Assess My Plan
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" data-testid="button-sample-pricing">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
