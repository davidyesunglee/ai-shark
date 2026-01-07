import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ArrowLeft, ExternalLink, TrendingUp, DollarSign, Shield, Scale, Target, Users } from "lucide-react";
import { Link } from "wouter";

const criteria = [
  {
    id: "creditworthiness",
    name: "Creditworthiness",
    icon: Shield,
    description: "Creditworthiness measures the likelihood that a borrower will repay their debts based on their credit history, financial behavior, and overall financial health. Lenders evaluate both personal and business credit scores, payment history, existing debt obligations, and any past bankruptcies or defaults.",
    keyMetrics: [
      "Personal and business credit scores (FICO, Dun & Bradstreet PAYDEX)",
      "Payment history and track record",
      "Existing debt obligations and utilization",
      "Length of credit history",
      "Public records (bankruptcies, liens, judgments)"
    ],
    importance: "Banks consider creditworthiness as one of the primary indicators of default risk. A strong credit profile can result in better loan terms, lower interest rates, and higher approval chances.",
    references: [
      { name: "SBA - Understanding Your Credit", url: "https://www.sba.gov/business-guide/manage-your-business/manage-your-finances" },
      { name: "Federal Reserve - Credit Scoring", url: "https://www.federalreserve.gov/creditcards/credit-cards-consumer.htm" },
      { name: "Experian Business Credit", url: "https://www.experian.com/small-business/business-credit-score" }
    ]
  },
  {
    id: "cash_flow",
    name: "Cash Flow Analysis",
    icon: DollarSign,
    description: "Cash flow analysis examines the movement of money into and out of a business over time. Lenders want to see that your business generates sufficient cash to cover operating expenses, debt payments, and maintain adequate reserves. Positive, consistent cash flow demonstrates operational efficiency and repayment ability.",
    keyMetrics: [
      "Debt Service Coverage Ratio (DSCR) - ideally 1.25x or higher",
      "Operating Cash Flow",
      "Free Cash Flow",
      "Cash Flow from Operations vs. Financing",
      "Working Capital Cycle"
    ],
    importance: "Cash flow is often considered more important than profitability by lenders because it shows actual ability to make loan payments. A business can be profitable on paper but still fail due to poor cash flow management.",
    references: [
      { name: "Investopedia - Cash Flow Analysis", url: "https://www.investopedia.com/terms/c/cashflowstatement.asp" },
      { name: "SBA - Cash Flow Basics", url: "https://www.sba.gov/blog/how-create-cash-flow-projection" },
      { name: "Corporate Finance Institute - DSCR", url: "https://corporatefinanceinstitute.com/resources/accounting/debt-service-coverage-ratio-dscr/" }
    ]
  },
  {
    id: "collateral",
    name: "Collateral Assessment",
    icon: Scale,
    description: "Collateral refers to assets pledged as security for a loan. If the borrower defaults, the lender can seize and sell these assets to recover their losses. Banks evaluate the type, value, and liquidity of available collateral when determining loan amounts and terms.",
    keyMetrics: [
      "Loan-to-Value (LTV) ratio",
      "Asset liquidity and marketability",
      "Collateral coverage ratio",
      "Depreciation considerations",
      "Legal encumbrances on assets"
    ],
    importance: "Strong collateral reduces lender risk and can help secure better loan terms or approval for businesses with less established credit. Common forms include real estate, equipment, inventory, and accounts receivable.",
    references: [
      { name: "SBA - Collateral Requirements", url: "https://www.sba.gov/partners/lenders/7a-loan-program/terms-conditions-eligibility" },
      { name: "Federal Reserve - Asset-Based Lending", url: "https://www.federalreserve.gov/supervisionreg/srletters/sr1317.htm" },
      { name: "Investopedia - Collateral", url: "https://www.investopedia.com/terms/c/collateral.asp" }
    ]
  },
  {
    id: "debt_equity",
    name: "Debt-to-Equity Ratio",
    icon: TrendingUp,
    description: "The debt-to-equity ratio compares a company's total liabilities to its shareholder equity, indicating how much debt is used to finance operations relative to owner investment. This ratio helps lenders assess financial leverage and risk exposure.",
    keyMetrics: [
      "Total Debt / Total Equity ratio",
      "Long-term Debt to Equity ratio",
      "Interest Coverage Ratio",
      "Leverage multiples",
      "Industry-specific benchmarks"
    ],
    importance: "A lower debt-to-equity ratio typically indicates less risk for lenders. Most banks prefer ratios below 2:1, though acceptable levels vary by industry. Highly leveraged businesses may struggle to obtain additional financing.",
    references: [
      { name: "Investopedia - Debt-to-Equity Ratio", url: "https://www.investopedia.com/terms/d/debtequityratio.asp" },
      { name: "Corporate Finance Institute - D/E Ratio", url: "https://corporatefinanceinstitute.com/resources/accounting/debt-to-equity-ratio/" },
      { name: "Harvard Business Review - Capital Structure", url: "https://hbr.org/topic/subject/capital-structure" }
    ]
  },
  {
    id: "market_viability",
    name: "Market Viability",
    icon: Target,
    description: "Market viability assesses whether the business operates in a sustainable market with growth potential. Lenders evaluate industry trends, competitive positioning, target market size, customer demand, and the business's ability to capture and retain market share.",
    keyMetrics: [
      "Total Addressable Market (TAM)",
      "Market growth rate",
      "Competitive landscape analysis",
      "Customer acquisition costs",
      "Market share potential"
    ],
    importance: "A viable market ensures the business can generate sufficient revenue to repay loans. Lenders are cautious about businesses in declining industries or those with unsustainable competitive advantages.",
    references: [
      { name: "SBA - Market Research", url: "https://www.sba.gov/business-guide/plan-your-business/market-research-competitive-analysis" },
      { name: "Harvard Business Review - Market Analysis", url: "https://hbr.org/topic/subject/market-research" },
      { name: "Investopedia - TAM SAM SOM", url: "https://www.investopedia.com/terms/t/total-addressable-market-tam.asp" }
    ]
  },
  {
    id: "management",
    name: "Management Team",
    icon: Users,
    description: "The management team evaluation assesses the experience, expertise, and track record of the business leadership. Lenders want confidence that the team can execute the business plan successfully and navigate challenges that arise.",
    keyMetrics: [
      "Industry experience (years)",
      "Prior business successes/failures",
      "Educational background and credentials",
      "Key person dependencies",
      "Succession planning"
    ],
    importance: "A strong management team is often the differentiating factor between approved and declined loans. Experienced leadership with relevant industry expertise significantly reduces perceived risk for lenders.",
    references: [
      { name: "SBA - Building Your Team", url: "https://www.sba.gov/business-guide/launch-your-business/hire-manage-employees" },
      { name: "Harvard Business Review - Leadership", url: "https://hbr.org/topic/subject/leadership" },
      { name: "Investopedia - Management Quality", url: "https://www.investopedia.com/terms/m/management.asp" }
    ]
  }
];

export default function EducationPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg" data-testid="text-app-title">AI Shark</span>
          </div>
          <Link href="/">
            <Button variant="ghost" data-testid="button-back-home">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold tracking-tight mb-4" data-testid="text-education-title">
              Business Plan Education
            </h1>
            <p className="text-lg text-muted-foreground">
              Learn about the evaluation criteria and metrics that banks and financial lenders use to assess business plans for debt financing.
            </p>
          </div>

          <div className="space-y-8">
            {criteria.map((criterion) => (
              <Card key={criterion.id} data-testid={`card-criterion-${criterion.id}`}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                      <criterion.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{criterion.name}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-muted-foreground">{criterion.description}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Key Metrics</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {criterion.keyMetrics.map((metric, index) => (
                        <li key={index}>{metric}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Why It Matters</h4>
                    <p className="text-muted-foreground">{criterion.importance}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">References</h4>
                    <div className="flex flex-wrap gap-2">
                      {criterion.references.map((ref, index) => (
                        <a
                          key={index}
                          href={ref.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                          data-testid={`link-reference-${criterion.id}-${index}`}
                        >
                          {ref.name}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-12">
            <CardHeader>
              <CardTitle>Scoring Guide</CardTitle>
              <CardDescription>
                Understanding how AI Shark evaluates your business plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-24 text-center py-2 rounded-md bg-green-500/10 text-green-600 font-medium">
                    75-100
                  </div>
                  <p className="text-muted-foreground">Strong candidate for bank debt financing</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 text-center py-2 rounded-md bg-yellow-500/10 text-yellow-600 font-medium">
                    50-74
                  </div>
                  <p className="text-muted-foreground">May qualify with additional documentation or collateral</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 text-center py-2 rounded-md bg-red-500/10 text-red-600 font-medium">
                    0-49
                  </div>
                  <p className="text-muted-foreground">Significant improvements needed before qualifying</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
