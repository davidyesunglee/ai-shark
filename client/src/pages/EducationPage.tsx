import { useSEO } from "@/lib/useSEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Shield,
  Scale,
  Target,
  Users,
  LineChart,
  AlertTriangle,
  Sword,
  BarChart2,
  Globe,
  Zap,
  CheckCircle2,
  XCircle,
  Minus,
  GraduationCap,
} from "lucide-react";
import { Link } from "wouter";
import logoImage from "@assets/AI_Shark_logo_1770083549283.png";

const criteria = [
  {
    id: "creditworthiness",
    name: "Creditworthiness & Credit History",
    icon: Shield,
    color: "text-blue-600",
    bg: "bg-blue-500/10",
    description: "Creditworthiness measures the likelihood that a borrower will repay their debts based on their credit history, financial behavior, and overall financial health. Lenders evaluate both personal and business credit scores, payment history, existing debt obligations, and any past bankruptcies or defaults.",
    keyMetrics: [
      "Personal and business credit scores (FICO, Dun & Bradstreet PAYDEX)",
      "Payment history and track record",
      "Existing debt obligations and credit utilization",
      "Length of credit history",
      "Public records (bankruptcies, liens, judgments)"
    ],
    importance: "Banks consider creditworthiness as one of the primary indicators of default risk. A strong credit profile can result in better loan terms, lower interest rates, and higher approval chances. Aim for a FICO score above 680 for business loans.",
    tip: "Request your free credit reports annually and dispute any errors. Pay down existing balances to reduce utilization below 30%.",
    references: [
      { name: "SBA — Understanding Your Credit", url: "https://www.sba.gov/business-guide/manage-your-business/manage-your-finances" },
      { name: "Federal Reserve — Credit Scoring", url: "https://www.federalreserve.gov/creditcards/credit-cards-consumer.htm" },
      { name: "Experian Business Credit", url: "https://www.experian.com/small-business/business-credit-score" }
    ]
  },
  {
    id: "cash_flow",
    name: "Cash Flow & Debt Service Coverage",
    icon: DollarSign,
    color: "text-green-600",
    bg: "bg-green-500/10",
    description: "Cash flow analysis examines the movement of money into and out of a business over time. Lenders focus on the Debt Service Coverage Ratio (DSCR) — the ratio of available cash flow to debt obligations. A DSCR above 1.25x means the business generates 25% more cash than is needed to cover all debt payments, which is the standard minimum for most banks.",
    keyMetrics: [
      "Debt Service Coverage Ratio (DSCR) — target ≥ 1.25x",
      "Operating Cash Flow (OCF)",
      "Free Cash Flow (FCF)",
      "Working Capital (Current Assets minus Current Liabilities)",
      "Cash Flow Seasonality and variability"
    ],
    importance: "Cash flow is often considered more important than profitability by lenders because it shows actual ability to make loan payments. A business can be profitable on paper but still fail due to poor cash flow management. Lenders will stress-test your projections for economic downturns.",
    tip: "Include 12-24 months of projected monthly cash flows in your business plan, showing how DSCR stays above 1.25x even in downside scenarios.",
    references: [
      { name: "Investopedia — Cash Flow Analysis", url: "https://www.investopedia.com/terms/c/cashflowstatement.asp" },
      { name: "SBA — Cash Flow Basics", url: "https://www.sba.gov/blog/how-create-cash-flow-projection" },
      { name: "Corporate Finance Institute — DSCR", url: "https://corporatefinanceinstitute.com/resources/accounting/debt-service-coverage-ratio-dscr/" }
    ]
  },
  {
    id: "collateral",
    name: "Collateral & Asset Base",
    icon: Scale,
    color: "text-purple-600",
    bg: "bg-purple-500/10",
    description: "Collateral refers to assets pledged as security for a loan. If the borrower defaults, the lender can seize and sell these assets to recover their losses. Banks evaluate the type, current market value, and liquidity of available collateral when determining loan amounts and terms. The Loan-to-Value (LTV) ratio compares the loan amount to the collateral value.",
    keyMetrics: [
      "Loan-to-Value (LTV) ratio — banks typically lend 70-80% of asset value",
      "Asset liquidity (how quickly can it be sold?)",
      "Real estate, equipment, inventory, or accounts receivable",
      "Depreciation rate and remaining useful life",
      "Legal encumbrances — existing liens or mortgages on assets"
    ],
    importance: "Strong collateral reduces lender risk and can help secure better loan terms or approval for businesses with less established credit. SBA loans require collateral for loans above $25,000. The more liquid and stable the collateral value, the stronger your position.",
    tip: "Get professional appraisals for key assets before applying. Clearly list all assets with fair market values and any existing liens in your business plan.",
    references: [
      { name: "SBA — Collateral Requirements", url: "https://www.sba.gov/partners/lenders/7a-loan-program/terms-conditions-eligibility" },
      { name: "Federal Reserve — Asset-Based Lending", url: "https://www.federalreserve.gov/supervisionreg/srletters/sr1317.htm" },
      { name: "Investopedia — Collateral", url: "https://www.investopedia.com/terms/c/collateral.asp" }
    ]
  },
  {
    id: "debt_equity",
    name: "Debt-to-Equity & Capital Structure",
    icon: TrendingUp,
    color: "text-orange-600",
    bg: "bg-orange-500/10",
    description: "The debt-to-equity (D/E) ratio compares total liabilities to shareholder equity, showing how much of the business is financed by debt versus owner investment. Lenders use this to assess financial leverage. A high D/E ratio signals that the business is heavily reliant on debt financing, which increases risk for lenders — especially if revenue declines.",
    keyMetrics: [
      "Total Debt / Total Equity ratio (most banks prefer below 2:1)",
      "Owner equity contribution (ideally 20-30% of total capital)",
      "Interest Coverage Ratio (EBIT / Interest Expense) — target ≥ 3x",
      "Long-term vs. short-term debt breakdown",
      "Working capital ratio (Current Assets / Current Liabilities)"
    ],
    importance: "A lower D/E ratio indicates less risk for lenders. Most banks prefer ratios below 2:1, though acceptable levels vary by industry. Highly leveraged businesses may struggle to obtain additional financing. Owner skin-in-the-game (equity contribution) is a key trust signal.",
    tip: "Show your personal investment in the business clearly. Lenders want to see that owners have real financial stake in the company's success.",
    references: [
      { name: "Investopedia — Debt-to-Equity Ratio", url: "https://www.investopedia.com/terms/d/debtequityratio.asp" },
      { name: "Corporate Finance Institute — D/E Ratio", url: "https://corporatefinanceinstitute.com/resources/accounting/debt-to-equity-ratio/" },
      { name: "Harvard Business Review — Capital Structure", url: "https://hbr.org/topic/subject/capital-structure" }
    ]
  },
  {
    id: "market_viability",
    name: "Market Viability & Demand",
    icon: Target,
    color: "text-cyan-600",
    bg: "bg-cyan-500/10",
    description: "Market viability assesses whether the business operates in a sustainable, growing market with real customer demand. Lenders evaluate industry trends, the size of the addressable market, competitive positioning, and evidence of actual customer demand. They want confidence that revenue projections are achievable based on market realities.",
    keyMetrics: [
      "Total Addressable Market (TAM) — the full market opportunity",
      "Serviceable Addressable Market (SAM) — the segment you can reach",
      "Serviceable Obtainable Market (SOM) — your realistic capture",
      "Market growth rate (CAGR) — above 5% is generally favorable",
      "Evidence of customer demand (letters of intent, pre-orders, contracts)"
    ],
    importance: "A viable market ensures the business can generate sufficient revenue to repay loans. Lenders are cautious about businesses in declining industries or those without sustainable competitive advantages. Market data citations from credible sources strengthen your case significantly.",
    tip: "Use government data (Census Bureau, BLS), industry reports (IBISWorld, Statista), or trade associations to support your market size claims. Anecdotes are not enough — cite third-party sources.",
    references: [
      { name: "SBA — Market Research Guide", url: "https://www.sba.gov/business-guide/plan-your-business/market-research-competitive-analysis" },
      { name: "Harvard Business Review — Market Analysis", url: "https://hbr.org/topic/subject/market-research" },
      { name: "Investopedia — TAM SAM SOM", url: "https://www.investopedia.com/terms/t/total-addressable-market-tam.asp" }
    ]
  },
  {
    id: "management",
    name: "Management Team & Experience",
    icon: Users,
    color: "text-indigo-600",
    bg: "bg-indigo-500/10",
    description: "The management team evaluation assesses the experience, expertise, and track record of the business leadership. Lenders want confidence that the team can execute the business plan and navigate challenges. They look for relevant industry experience, prior business successes, and depth of the team beyond the founder.",
    keyMetrics: [
      "Years of relevant industry experience",
      "Prior business ownership or executive leadership",
      "Educational credentials and professional certifications",
      "Key person risk (over-dependence on one individual)",
      "Board of directors or advisory board strength"
    ],
    importance: "A strong management team is often the deciding factor between approved and declined loan applications. Experienced leadership with relevant industry expertise significantly reduces perceived risk for lenders. Key person insurance may be required for sole founders.",
    tip: "Include detailed bios for all key leaders, emphasizing directly relevant experience. If you have gaps, bring on advisors or board members with the missing expertise.",
    references: [
      { name: "SBA — Building Your Team", url: "https://www.sba.gov/business-guide/launch-your-business/hire-manage-employees" },
      { name: "Harvard Business Review — Leadership", url: "https://hbr.org/topic/subject/leadership" },
      { name: "Investopedia — Management Quality", url: "https://www.investopedia.com/terms/m/management.asp" }
    ]
  },
  {
    id: "financial_projections",
    name: "Financial Projections & Assumptions",
    icon: LineChart,
    color: "text-emerald-600",
    bg: "bg-emerald-500/10",
    description: "Financial projections are forward-looking estimates of revenue, expenses, and profitability — typically covering 3 to 5 years. Banks scrutinize the underlying assumptions to determine if the projections are realistic. Overly optimistic projections with no supporting evidence are a major red flag.",
    keyMetrics: [
      "3-5 year Profit & Loss (P&L) statement",
      "Monthly cash flow projections for Year 1-2",
      "Break-even analysis (revenue needed to cover all costs)",
      "Revenue assumptions (growth rate, pricing, unit economics)",
      "Expense assumptions (cost of goods sold, SG&A, payroll)"
    ],
    importance: "Well-constructed financial projections demonstrate business acumen and give lenders confidence in management's planning abilities. The assumptions behind the numbers must be clearly stated and defensible. Projections should show a path to positive cash flow within a timeframe that aligns with the loan repayment schedule.",
    tip: "Present three scenarios: base case (most likely), conservative case (10-20% lower revenue), and upside case. Show the DSCR remains above 1.0x even in the conservative scenario.",
    references: [
      { name: "SBA — Financial Projections Template", url: "https://www.sba.gov/business-guide/plan-your-business/write-your-business-plan" },
      { name: "Investopedia — Financial Modeling", url: "https://www.investopedia.com/terms/f/financialmodeling.asp" },
      { name: "SCORE — Financial Projection Templates", url: "https://www.score.org/resource/financial-projections-template" }
    ]
  },
  {
    id: "revenue_model",
    name: "Revenue Model & Profitability",
    icon: DollarSign,
    color: "text-teal-600",
    bg: "bg-teal-500/10",
    description: "The revenue model describes how the business generates income — from which products/services, at what price points, and through which channels. Lenders evaluate whether the pricing strategy is sustainable, profit margins are adequate, and whether the business has multiple or diverse revenue streams to reduce concentration risk.",
    keyMetrics: [
      "Gross Profit Margin (Revenue minus COGS / Revenue) — target varies by industry",
      "Net Profit Margin (Net Income / Revenue)",
      "Customer Lifetime Value (LTV) vs. Customer Acquisition Cost (CAC)",
      "Revenue concentration (no single customer > 25-30% of revenue)",
      "Recurring vs. one-time revenue ratio"
    ],
    importance: "A clear, scalable revenue model with healthy margins gives lenders confidence in repayment ability. Recurring revenue (subscriptions, contracts) is valued more highly than one-time transactional revenue. Revenue concentration risk (dependence on a small number of customers) is a serious concern.",
    tip: "If your top 3 customers represent more than 50% of revenue, develop a customer diversification plan. Recurring revenue should be highlighted prominently — it de-risks the business significantly.",
    references: [
      { name: "Investopedia — Revenue Models", url: "https://www.investopedia.com/terms/r/revenuemodel.asp" },
      { name: "Harvard Business Review — Pricing Strategy", url: "https://hbr.org/topic/subject/pricing" },
      { name: "Corporate Finance Institute — Gross Margin", url: "https://corporatefinanceinstitute.com/resources/accounting/gross-margin/" }
    ]
  },
  {
    id: "industry_risk",
    name: "Industry & Regulatory Risk",
    icon: AlertTriangle,
    color: "text-amber-600",
    bg: "bg-amber-500/10",
    description: "Industry risk assesses the broader external environment in which the business operates. Every industry has inherent risks — cyclicality, regulatory changes, technological disruption, or commodity price sensitivity. Lenders apply industry-specific risk premiums based on the volatility and regulatory burden of the sector.",
    keyMetrics: [
      "Industry growth rate and outlook (declining vs. growing)",
      "Regulatory environment (licensing, FDA, EPA, FTC requirements)",
      "Sensitivity to economic cycles (recession resistance)",
      "Technological disruption risk",
      "Seasonality and its impact on cash flow"
    ],
    importance: "Some industries face inherent headwinds that make bank financing more difficult regardless of business quality — restaurants, retail, cannabis, and highly leveraged industries often face higher scrutiny. Demonstrating awareness of industry-specific risks and mitigation strategies significantly improves lender confidence.",
    tip: "Address industry risks proactively in your plan. Don't ignore negatives — lenders respect founders who identify challenges and explain how they will manage them. Include contingency plans for key risks.",
    references: [
      { name: "IBISWorld — Industry Risk Ratings", url: "https://www.ibisworld.com/us/list-of-industries/" },
      { name: "Federal Reserve — Sectoral Risk Analysis", url: "https://www.federalreserve.gov/releases/z1/" },
      { name: "SBA — Industry Research", url: "https://www.sba.gov/business-guide/plan-your-business/market-research-competitive-analysis" }
    ]
  },
  {
    id: "competitive_position",
    name: "Competitive Position & Differentiation",
    icon: Sword,
    color: "text-rose-600",
    bg: "bg-rose-500/10",
    description: "Competitive position describes where the business stands in its market relative to competitors — and why customers choose this business over alternatives. Lenders evaluate competitive advantages, barriers to entry, and whether the business's market position is sustainable over the loan repayment period.",
    keyMetrics: [
      "Unique value proposition (what makes you different?)",
      "Barriers to entry (patents, licenses, brand, network effects, switching costs)",
      "Market share vs. key competitors",
      "Competitive pricing position (premium, parity, or discount)",
      "Customer retention rate and Net Promoter Score (NPS)"
    ],
    importance: "Businesses with strong, defensible competitive advantages are far more likely to sustain revenue and repay debt. Lenders are wary of businesses in commodity markets with no differentiation or low switching costs. A clearly articulated moat — a sustainable competitive advantage — dramatically strengthens any lending application.",
    tip: "Identify your top 3 competitors and explicitly state why your business wins against each one. Patents, exclusive contracts, proprietary technology, or significant brand equity all serve as credible moats.",
    references: [
      { name: "Harvard Business Review — Competitive Advantage", url: "https://hbr.org/topic/subject/competitive-strategy" },
      { name: "Investopedia — Competitive Moat", url: "https://www.investopedia.com/terms/e/economicmoat.asp" },
      { name: "Porter's Five Forces — MindTools", url: "https://www.mindtools.com/pages/article/newTMC_08.htm" }
    ]
  }
];

const swotItems = [
  {
    quadrant: "Strengths",
    icon: TrendingUp,
    color: "text-green-700 dark:text-green-400",
    border: "border-green-200 dark:border-green-800",
    bg: "bg-green-50 dark:bg-green-950/30",
    description: "Internal positive attributes that the business controls and that give it an advantage over competitors.",
    examples: [
      "Proprietary technology or patents",
      "Strong brand recognition or loyalty",
      "Experienced and well-credentialed management team",
      "Low-cost production or operational efficiency",
      "Exclusive distribution agreements or contracts"
    ],
    bankRelevance: "Strengths directly reduce lending risk. A patent or exclusive contract, for example, protects future revenue streams — which are needed to repay the loan."
  },
  {
    quadrant: "Weaknesses",
    icon: TrendingDown,
    color: "text-red-700 dark:text-red-400",
    border: "border-red-200 dark:border-red-800",
    bg: "bg-red-50 dark:bg-red-950/30",
    description: "Internal negative factors that put the business at a disadvantage relative to competitors. These are within the business's control to address.",
    examples: [
      "Limited operating history (startup risk)",
      "High customer concentration risk",
      "Key person dependency on founder",
      "Thin profit margins vs. industry average",
      "Gaps in management team experience"
    ],
    bankRelevance: "Lenders will identify weaknesses whether or not you include them. Proactively acknowledging weaknesses and presenting mitigation plans builds credibility. Ignoring obvious weaknesses signals poor judgment."
  },
  {
    quadrant: "Opportunities",
    icon: Zap,
    color: "text-blue-700 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    description: "External conditions or trends that the business can take advantage of to grow revenue, expand market share, or improve profitability.",
    examples: [
      "Growing market segment or emerging demographic",
      "Regulatory change creating new market demand",
      "Competitor exit or weakness creating market gap",
      "Technology enabling lower-cost delivery of services",
      "Geographic expansion potential"
    ],
    bankRelevance: "Documented opportunities support the growth trajectory of your financial projections. Lenders look for evidence that revenue growth is tied to real external trends, not just optimism."
  },
  {
    quadrant: "Threats",
    icon: AlertTriangle,
    color: "text-yellow-700 dark:text-yellow-400",
    border: "border-yellow-200 dark:border-yellow-800",
    bg: "bg-yellow-50 dark:bg-yellow-950/30",
    description: "External factors outside the business's direct control that could negatively impact operations, revenue, or profitability.",
    examples: [
      "New competitor entering the market",
      "Regulatory or legal changes affecting the industry",
      "Economic recession or rising interest rates",
      "Commodity price or supply chain volatility",
      "Technology disruption making current model obsolete"
    ],
    bankRelevance: "Banks stress-test businesses against threats. Showing that you've identified threats and have contingency plans demonstrates strategic maturity — a key signal that management can protect loan repayment even in adverse conditions."
  }
];

const financialRatios = [
  {
    name: "Debt Service Coverage Ratio (DSCR)",
    formula: "Net Operating Income ÷ Total Debt Service",
    target: "≥ 1.25x",
    targetColor: "text-green-600",
    description: "The DSCR measures how many times over a business can cover its total debt payments (principal + interest) from its net operating income. It is the single most important ratio for bank loan approval.",
    interpretation: [
      { range: "≥ 1.5x", label: "Excellent", color: "bg-green-100 text-green-800" },
      { range: "1.25x – 1.49x", label: "Good (Bank Minimum)", color: "bg-blue-100 text-blue-800" },
      { range: "1.0x – 1.24x", label: "Marginal — additional collateral required", color: "bg-yellow-100 text-yellow-800" },
      { range: "< 1.0x", label: "Insufficient — loan not serviceable", color: "bg-red-100 text-red-800" }
    ],
    references: [{ name: "Corporate Finance Institute — DSCR", url: "https://corporatefinanceinstitute.com/resources/accounting/debt-service-coverage-ratio-dscr/" }]
  },
  {
    name: "Current Ratio",
    formula: "Current Assets ÷ Current Liabilities",
    target: "≥ 1.5x",
    targetColor: "text-green-600",
    description: "Measures short-term liquidity — the ability of the business to pay obligations due within 12 months using assets that will convert to cash within 12 months. A ratio below 1.0 means current liabilities exceed current assets, a serious warning sign.",
    interpretation: [
      { range: "≥ 2.0x", label: "Excellent liquidity", color: "bg-green-100 text-green-800" },
      { range: "1.5x – 1.99x", label: "Good liquidity", color: "bg-blue-100 text-blue-800" },
      { range: "1.0x – 1.49x", label: "Adequate — monitor closely", color: "bg-yellow-100 text-yellow-800" },
      { range: "< 1.0x", label: "Liquidity risk — potential default", color: "bg-red-100 text-red-800" }
    ],
    references: [{ name: "Investopedia — Current Ratio", url: "https://www.investopedia.com/terms/c/currentratio.asp" }]
  },
  {
    name: "Gross Profit Margin",
    formula: "(Revenue − Cost of Goods Sold) ÷ Revenue × 100",
    target: "Varies by industry",
    targetColor: "text-blue-600",
    description: "Gross profit margin shows how much money remains after paying direct production costs, before overhead and operating expenses. Higher margins indicate pricing power and operational efficiency.",
    interpretation: [
      { range: "> 60%", label: "Software / Services — excellent", color: "bg-green-100 text-green-800" },
      { range: "30% – 60%", label: "Typical for most businesses", color: "bg-blue-100 text-blue-800" },
      { range: "10% – 30%", label: "Retail / Distribution norm", color: "bg-yellow-100 text-yellow-800" },
      { range: "< 10%", label: "Very thin — execution risk", color: "bg-red-100 text-red-800" }
    ],
    references: [{ name: "Corporate Finance Institute — Gross Margin", url: "https://corporatefinanceinstitute.com/resources/accounting/gross-margin/" }]
  },
  {
    name: "Debt-to-Equity Ratio",
    formula: "Total Liabilities ÷ Total Shareholders' Equity",
    target: "< 2.0x",
    targetColor: "text-green-600",
    description: "Measures financial leverage — how much of the business is financed by debt versus owner equity. Higher leverage means more risk for lenders because debt obligations are fixed regardless of revenue.",
    interpretation: [
      { range: "< 1.0x", label: "Conservative — low leverage", color: "bg-green-100 text-green-800" },
      { range: "1.0x – 2.0x", label: "Moderate — generally acceptable", color: "bg-blue-100 text-blue-800" },
      { range: "2.0x – 3.0x", label: "Elevated — additional scrutiny", color: "bg-yellow-100 text-yellow-800" },
      { range: "> 3.0x", label: "High leverage — significant risk", color: "bg-red-100 text-red-800" }
    ],
    references: [{ name: "Investopedia — D/E Ratio", url: "https://www.investopedia.com/terms/d/debtequityratio.asp" }]
  },
  {
    name: "Break-Even Timeline",
    formula: "Fixed Costs ÷ (Price per Unit − Variable Cost per Unit)",
    target: "Within loan term",
    targetColor: "text-blue-600",
    description: "Break-even analysis identifies the sales volume or revenue level at which total costs equal total revenue — the point where the business stops losing money. Lenders want break-even to occur well within the loan repayment period.",
    interpretation: [
      { range: "< 12 months", label: "Excellent — rapid break-even", color: "bg-green-100 text-green-800" },
      { range: "12 – 24 months", label: "Good — reasonable runway", color: "bg-blue-100 text-blue-800" },
      { range: "24 – 36 months", label: "Acceptable — requires strong collateral", color: "bg-yellow-100 text-yellow-800" },
      { range: "> 36 months", label: "Concerning — high startup risk", color: "bg-red-100 text-red-800" }
    ],
    references: [{ name: "Investopedia — Break-Even Analysis", url: "https://www.investopedia.com/terms/b/breakevenanalysis.asp" }]
  },
  {
    name: "Owner Equity Contribution",
    formula: "Owner Investment ÷ Total Project Cost × 100",
    target: "≥ 20%",
    targetColor: "text-green-600",
    description: "The percentage of total project or startup costs funded by the business owner's own money (equity). Lenders require owners to have real financial stake — 'skin in the game' — as a sign of commitment and risk alignment.",
    interpretation: [
      { range: "≥ 30%", label: "Strong commitment — lower lender risk", color: "bg-green-100 text-green-800" },
      { range: "20% – 29%", label: "Good — meets standard minimums", color: "bg-blue-100 text-blue-800" },
      { range: "10% – 19%", label: "Marginal — may require additional collateral", color: "bg-yellow-100 text-yellow-800" },
      { range: "< 10%", label: "Insufficient — typically not financeable", color: "bg-red-100 text-red-800" }
    ],
    references: [{ name: "SBA — Equity Requirements", url: "https://www.sba.gov/partners/lenders/7a-loan-program/terms-conditions-eligibility" }]
  }
];

const lenderGrades = [
  { grade: "A", score: "85–100", label: "Excellent", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", description: "Exceptional candidate. All major lending criteria are met or exceeded. Strong credit, solid cash flow, ample collateral, experienced management, and a clear market position. Bank approval is highly likely.", borderColor: "border-green-400" },
  { grade: "B+", score: "80–84", label: "Very Good", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200", description: "Strong candidate with only minor gaps. Approval is likely with standard documentation. Small improvements (such as additional collateral or refined projections) can elevate to Grade A.", borderColor: "border-emerald-400" },
  { grade: "B", score: "75–79", label: "Good", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", description: "Good candidate meeting most bank lending criteria. Some areas need additional documentation or explanation. SBA loan programs may be appropriate if conventional lending falls short.", borderColor: "border-blue-400" },
  { grade: "B-", score: "70–74", label: "Above Average", color: "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200", description: "Above-average candidate with notable strengths but also meaningful gaps that lenders will scrutinize. Focused improvements in the weakest 2-3 areas could move this plan into Grade B territory.", borderColor: "border-sky-400" },
  { grade: "C+", score: "65–69", label: "Average", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", description: "Average candidate. Approval is possible but requires substantial documentation, additional collateral, or a co-signer. Review all flagged weaknesses carefully before applying.", borderColor: "border-yellow-400" },
  { grade: "C", score: "55–64", label: "Below Average", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200", description: "Below average. Conventional bank lending will be difficult. Consider SBA Microloan, CDFI lenders, or credit unions. Significant plan revisions are needed before applying.", borderColor: "border-orange-400" },
  { grade: "C-", score: "50–54", label: "Needs Work", color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200", description: "The plan needs substantial work before it will be taken seriously by lenders. Focus on the two or three lowest-scoring criteria and rebuild from there. Consider consulting a SCORE mentor.", borderColor: "border-amber-400" },
  { grade: "D", score: "35–49", label: "Not Ready", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", description: "Not ready for bank debt financing. Multiple material deficiencies exist. Alternative funding paths (bootstrapping, equity investors, grants) may be more appropriate at this stage.", borderColor: "border-red-400" },
  { grade: "F", score: "0–34", label: "Significant Gaps", color: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200", description: "Significant fundamental gaps exist. The business concept or plan as presented is not viable for debt financing. Consider a complete rewrite with professional guidance before resubmitting.", borderColor: "border-rose-400" }
];

const marketItems = [
  {
    title: "Target Market",
    icon: Target,
    description: "Your target market is the specific group of customers most likely to buy your product or service. A well-defined target market narrows your focus, improves marketing efficiency, and gives lenders confidence that you understand who you are selling to and why they will buy.",
    components: [
      "Demographics: age, gender, income, education, location",
      "Psychographics: values, interests, lifestyle, buying behavior",
      "Firmographics (B2B): company size, industry, revenue, geography",
      "Customer pain points your product solves",
      "Evidence of demand: surveys, pilot customers, waitlists"
    ],
    tip: "Never say 'our market is everyone.' Lenders know that unfocused targeting wastes resources and slows growth. Define a specific primary customer persona with supporting evidence."
  },
  {
    title: "Market Size (TAM / SAM / SOM)",
    icon: Globe,
    description: "Market size is quantified using three concentric circles: TAM (Total Addressable Market), SAM (Serviceable Addressable Market), and SOM (Serviceable Obtainable Market). This framework shows the full opportunity while being realistic about what the business can actually capture.",
    components: [
      "TAM — the total global market for your product/service category",
      "SAM — the portion of TAM your business can realistically reach (geography, product fit)",
      "SOM — your realistic market capture over 3-5 years (5-10% of SAM is credible for most startups)",
      "Data sources: IBISWorld, Statista, Census Bureau, trade associations",
      "Bottom-up calculation: unit economics × target customer count"
    ],
    tip: "Use a bottom-up market sizing approach: estimate the number of customers in your defined target market × average revenue per customer. This is more credible to lenders than citing a large TAM and claiming a small percentage."
  },
  {
    title: "Competitive Position",
    icon: Sword,
    description: "Your competitive position describes where your business stands relative to competitors — and more importantly, why customers choose you. Lenders evaluate whether competitive advantages are real, defensible, and sustainable over the 5-10 year loan repayment horizon.",
    components: [
      "Direct competitors (same product/service, same market)",
      "Indirect competitors (different product solving same problem)",
      "Competitive advantages: price, quality, speed, convenience, brand, relationships",
      "Barriers to entry protecting your position",
      "Porter's Five Forces analysis for industry structure"
    ],
    tip: "Create a competitive matrix comparing your business vs. top 3 competitors across 5-6 key attributes. Visual comparisons are persuasive and demonstrate market knowledge."
  },
  {
    title: "Growth Potential",
    icon: TrendingUp,
    description: "Growth potential assesses how much the business can realistically expand over the loan repayment period. Lenders want to see that the business will grow into its debt obligations, with improving cash flow and profitability over time — not just flat or declining performance.",
    components: [
      "Year-over-year revenue growth rate (historical or projected)",
      "Expansion opportunities: new geographies, product lines, customer segments",
      "Scalability of the business model (revenue growth outpaces cost growth)",
      "Key growth drivers and assumptions behind projections",
      "Milestones that de-risk the growth plan (signed contracts, partnerships, regulatory approvals)"
    ],
    tip: "Tie growth projections to specific, concrete events — a new product launch, a signed distribution deal, or entering a new market. Unsubstantiated 'hockey stick' projections are immediately distrusted by lenders."
  }
];

export default function EducationPage() {
  useSEO({
    title: "Education — Bank Loan & SBA Financing Guide for Business Plans | AI Shark",
    description: "Learn the 10 lender criteria, key financial ratios (DSCR, current ratio, D/E), SWOT analysis, and how to write a bank-ready business plan. Free educational resource from AI Shark.",
    canonical: "/education",
  });
  return (
    <div className="min-h-screen bg-background">
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <header className="border-b" role="banner">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <img src={logoImage} alt="AI Shark Logo" className="h-8 w-auto" data-testid="img-logo" />
              <span className="font-semibold text-lg" data-testid="text-app-title">AI Shark</span>
            </div>
          </Link>
          <nav aria-label="Main navigation">
            <Link href="/">
              <Button variant="ghost" data-testid="button-back-home">
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                Back
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main id="main-content" className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <GraduationCap className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-4" data-testid="text-education-title">
              Business Plan Education Center
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Everything you need to understand how banks evaluate business plans for debt financing — including the criteria, analytical frameworks, financial ratios, and scoring system AI Shark uses to assess your plan.
            </p>
          </div>

          <Tabs defaultValue="criteria" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8 h-auto gap-1" aria-label="Education topics">
              <TabsTrigger value="criteria" className="text-xs sm:text-sm" data-testid="tab-criteria">
                10 Criteria
              </TabsTrigger>
              <TabsTrigger value="swot" className="text-xs sm:text-sm" data-testid="tab-swot">
                SWOT Analysis
              </TabsTrigger>
              <TabsTrigger value="market" className="text-xs sm:text-sm" data-testid="tab-market">
                Market Analysis
              </TabsTrigger>
              <TabsTrigger value="ratios" className="text-xs sm:text-sm" data-testid="tab-ratios">
                Financial Ratios
              </TabsTrigger>
              <TabsTrigger value="grades" className="text-xs sm:text-sm" data-testid="tab-grades">
                Lender Grades
              </TabsTrigger>
            </TabsList>

            {/* ── Tab 1: 10 Criteria ───────────────────────────────────── */}
            <TabsContent value="criteria" className="space-y-6">
              <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-4 border mb-2" role="note">
                AI Shark evaluates your business plan across <strong>10 dimensions</strong> used by commercial bank loan officers. Each criterion is scored 0–100 and contributes to the Overall Score and Lender Grade.
              </div>
              {criteria.map((criterion) => (
                <Card key={criterion.id} data-testid={`card-criterion-${criterion.id}`}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-md ${criterion.bg}`}>
                        <criterion.icon className={`h-5 w-5 ${criterion.color}`} aria-hidden="true" />
                      </div>
                      <CardTitle className="text-base">{criterion.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div>
                      <h4 className="font-medium mb-2 text-sm">What It Is</h4>
                      <p className="text-muted-foreground text-sm">{criterion.description}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-sm">Key Metrics Lenders Review</h4>
                      <ul className="space-y-1">
                        {criterion.keyMetrics.map((metric, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" aria-hidden="true" />
                            {metric}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-sm">Why It Matters to Lenders</h4>
                      <p className="text-muted-foreground text-sm">{criterion.importance}</p>
                    </div>
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                      <p className="text-sm font-medium text-primary mb-1">Pro Tip</p>
                      <p className="text-sm text-muted-foreground">{criterion.tip}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-sm">References</h4>
                      <div className="flex flex-wrap gap-3">
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
                            <ExternalLink className="h-3 w-3" aria-hidden="true" />
                          </a>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* ── Tab 2: SWOT Analysis ─────────────────────────────────── */}
            <TabsContent value="swot" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>What Is SWOT Analysis?</CardTitle>
                  <CardDescription>
                    A structured framework for evaluating the internal and external factors affecting a business
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    SWOT stands for <strong>Strengths, Weaknesses, Opportunities, and Threats</strong>. It is a universally recognized strategic planning tool developed at Stanford Research Institute in the 1960s. Today it is required by virtually every bank, investor, and SBA lender as part of a complete business plan.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    The SWOT framework is divided into two axes:
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="font-medium mb-1">Internal Factors (within your control)</p>
                      <p className="text-muted-foreground">Strengths and Weaknesses describe the current state of your business — what you do well and what you do poorly.</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="font-medium mb-1">External Factors (outside your control)</p>
                      <p className="text-muted-foreground">Opportunities and Threats describe the environment your business operates in — trends and conditions you must navigate.</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    AI Shark's assessment generates a SWOT analysis directly from your business plan content, identifying the specific factors that are most relevant to lender decision-making.
                  </p>
                </CardContent>
              </Card>

              <div className="grid gap-6 sm:grid-cols-2">
                {swotItems.map((item) => (
                  <Card key={item.quadrant} className={`border-2 ${item.border}`} data-testid={`card-swot-${item.quadrant.toLowerCase()}`}>
                    <CardHeader className={`rounded-t-lg ${item.bg} pb-3`}>
                      <div className="flex items-center gap-2">
                        <item.icon className={`h-5 w-5 ${item.color}`} aria-hidden="true" />
                        <CardTitle className={`text-base ${item.color}`}>{item.quadrant}</CardTitle>
                      </div>
                      <CardDescription className="text-sm">{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Common Examples</h4>
                        <ul className="space-y-1">
                          {item.examples.map((ex, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-muted-foreground" aria-hidden="true" />
                              {ex}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                        <p className="text-xs font-medium text-primary mb-1">Why Lenders Care</p>
                        <p className="text-xs text-muted-foreground">{item.bankRelevance}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">How to Write a Strong SWOT for a Loan Application</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p><strong className="text-foreground">Be honest.</strong> Lenders will conduct their own due diligence. If your SWOT ignores obvious weaknesses, it signals overconfidence or dishonesty — both are red flags.</p>
                  <p><strong className="text-foreground">Be specific.</strong> Vague statements ("we have a great team") are worthless. Specific claims with evidence ("our CEO has 15 years in pharmaceutical distribution and managed $40M in annual sales at Company X") are credible.</p>
                  <p><strong className="text-foreground">Connect SWOT to your plan.</strong> Show how strengths support your strategy, how weaknesses are being mitigated, how opportunities are being captured, and how threats are being managed.</p>
                  <p><strong className="text-foreground">Tie to financials.</strong> Your SWOT should reinforce the assumptions in your financial projections. If a key opportunity is a new regulation creating demand, show how that demand appears in your revenue forecasts.</p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Tab 3: Market Analysis ───────────────────────────────── */}
            <TabsContent value="market" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Why Market Analysis Matters to Lenders</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-3">
                  <p>
                    Banks lend money expecting it to be repaid from the business's future cash flows. Those cash flows depend entirely on <strong>whether real customers will pay real money</strong> for what the business sells. Market analysis is how you prove that demand exists.
                  </p>
                  <p>
                    AI Shark evaluates four components of market analysis: the target market definition, market size estimates (TAM/SAM/SOM), competitive positioning, and growth potential. Each is assessed for specificity, credibility of sources, and alignment with financial projections.
                  </p>
                </CardContent>
              </Card>

              <div className="grid gap-6 sm:grid-cols-2">
                {marketItems.map((item) => (
                  <Card key={item.title} data-testid={`card-market-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                          <item.icon className="h-4 w-4 text-primary" aria-hidden="true" />
                        </div>
                        <CardTitle className="text-base">{item.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      <div>
                        <h4 className="font-medium text-sm mb-2">Key Components</h4>
                        <ul className="space-y-1.5">
                          {item.components.map((comp, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-primary" aria-hidden="true" />
                              {comp}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                        <p className="text-xs font-medium text-primary mb-1">Lender Tip</p>
                        <p className="text-xs text-muted-foreground">{item.tip}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Credible Market Data Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {[
                      { name: "U.S. Census Bureau", url: "https://www.census.gov/", desc: "Demographics, business patterns, industry data" },
                      { name: "Bureau of Labor Statistics", url: "https://www.bls.gov/", desc: "Employment, industry trends, wage data" },
                      { name: "IBISWorld", url: "https://www.ibisworld.com/", desc: "Industry revenue, market size, outlook reports" },
                      { name: "Statista", url: "https://www.statista.com/", desc: "Market statistics and consumer insights" },
                      { name: "SBA Market Research Guide", url: "https://www.sba.gov/business-guide/plan-your-business/market-research-competitive-analysis", desc: "Free resources for small business market research" },
                      { name: "Trade Associations", url: "https://www.uschamberfoundation.org/", desc: "Industry-specific data from trade groups" }
                    ].map((source, i) => (
                      <a
                        key={i}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                        data-testid={`link-market-source-${i}`}
                      >
                        <ExternalLink className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                        <div>
                          <p className="text-sm font-medium">{source.name}</p>
                          <p className="text-xs text-muted-foreground">{source.desc}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Tab 4: Financial Ratios ──────────────────────────────── */}
            <TabsContent value="ratios" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Key Financial Ratios in Bank Lending</CardTitle>
                  <CardDescription>
                    The six ratios AI Shark evaluates from your business plan
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-3">
                  <p>
                    Financial ratios translate raw numbers in your financial statements into standardized measures that lenders use to compare businesses across industries and sizes. AI Shark extracts or estimates six key ratios from your business plan and assesses each against lending benchmarks.
                  </p>
                  <p>
                    If a ratio cannot be calculated from the data provided in your plan, AI Shark will flag it as "Not Available" — which itself signals to the lender that important data is missing.
                  </p>
                </CardContent>
              </Card>

              {financialRatios.map((ratio, i) => (
                <Card key={i} data-testid={`card-ratio-${ratio.name.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <CardTitle className="text-base">{ratio.name}</CardTitle>
                      <Badge variant="outline" className={`shrink-0 font-mono text-xs ${ratio.targetColor}`}>
                        Target: {ratio.target}
                      </Badge>
                    </div>
                    <CardDescription className="font-mono text-xs bg-muted/50 px-3 py-1.5 rounded-md border">
                      {ratio.formula}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{ratio.description}</p>
                    <div>
                      <h4 className="font-medium text-sm mb-2">How to Interpret It</h4>
                      <div className="space-y-2" role="list" aria-label={`${ratio.name} interpretation ranges`}>
                        {ratio.interpretation.map((row, j) => (
                          <div key={j} className="flex items-center gap-3" role="listitem">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-md whitespace-nowrap ${row.color}`}>
                              {row.range}
                            </span>
                            <span className="text-sm text-muted-foreground">{row.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {ratio.references.map((ref, j) => (
                        <a
                          key={j}
                          href={ref.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                          data-testid={`link-ratio-${i}-ref-${j}`}
                        >
                          {ref.name}
                          <ExternalLink className="h-3 w-3" aria-hidden="true" />
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">What Happens If Ratios Are Missing?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>AI Shark will mark any ratio it cannot calculate as <span className="font-medium text-foreground">"Not Available."</span> This is important for two reasons:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <span><strong>Missing ratios reduce your score</strong> — incomplete financial data is itself a weakness in the eyes of lenders. A complete business plan includes all six ratios.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <span><strong>You can resubmit</strong> — if AI Shark flags ratios as missing, add the relevant financial statements or projections and re-analyze your plan. Your score will improve.</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Tab 5: Lender Grades ─────────────────────────────────── */}
            <TabsContent value="grades" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Understanding the AI Shark Lender Grade</CardTitle>
                  <CardDescription>
                    A letter grade summarizing overall bank debt financing readiness
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-3">
                  <p>
                    In addition to the numeric score (0–100), AI Shark assigns a <strong>Lender Readiness Grade</strong> from A to F. This grade maps your overall score to a letter equivalent that mirrors how academic grades communicate performance levels — making the assessment immediately intuitive.
                  </p>
                  <p>
                    The grade is calculated from the weighted overall score, which combines all 10 assessment criteria. Each criterion contributes equally to the overall score. The grade is not just cosmetic — it reflects the actual probability of approval based on typical commercial bank lending standards.
                  </p>
                </CardContent>
              </Card>

              <div className="space-y-3" role="list" aria-label="Lender grade scale">
                {lenderGrades.map((g) => (
                  <Card key={g.grade} className={`border-l-4 ${g.borderColor}`} role="listitem" data-testid={`card-grade-${g.grade.replace('+', 'plus').replace('-', 'minus')}`}>
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 w-16 h-14 rounded-lg flex flex-col items-center justify-center ${g.color}`}>
                          <span className="text-2xl font-black leading-none">{g.grade}</span>
                          <span className="text-xs font-medium mt-0.5">{g.score}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{g.label}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{g.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">How to Improve Your Grade</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  <p>The fastest way to improve your Lender Grade is to focus on the criteria where you scored lowest. Each 10-point improvement in a single criterion raises your overall score by 1 point.</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      { action: "Add detailed financial projections", impact: "+5 to +15 points on Financial Projections criterion" },
                      { action: "Include DSCR calculation", impact: "+5 to +10 points on Cash Flow criterion" },
                      { action: "Provide market size data with sources", impact: "+5 to +10 points on Market Viability criterion" },
                      { action: "List collateral with appraised values", impact: "+5 to +10 points on Collateral criterion" },
                      { action: "Add management team bios with credentials", impact: "+5 to +10 points on Management criterion" },
                      { action: "Address competitive position explicitly", impact: "+5 to +10 points on Competitive Position criterion" }
                    ].map((item, i) => (
                      <div key={i} className="bg-muted/50 rounded-lg p-3 border">
                        <p className="font-medium text-foreground text-sm">{item.action}</p>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">{item.impact}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-2">
                    <p className="text-sm font-medium text-primary mb-1">Free Professional Help</p>
                    <p className="text-sm">
                      <a href="https://www.score.org" target="_blank" rel="noopener noreferrer" className="underline font-medium">SCORE</a> provides free mentoring from experienced business professionals who can help you improve your business plan. The SBA also offers free{" "}
                      <a href="https://www.sba.gov/local-assistance/resource-partners/small-business-development-centers-sbdc" target="_blank" rel="noopener noreferrer" className="underline font-medium">Small Business Development Centers (SBDCs)</a>{" "}
                      in every state.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="border-t mt-12" role="contentinfo">
        <div className="container mx-auto px-4 py-6">
          <p className="text-xs text-muted-foreground text-center max-w-4xl mx-auto" data-testid="text-disclaimer">
            <strong>Disclaimer:</strong> AI Shark provides analytical perspectives on business plan documentation and data for informational purposes only. Results do not imply any expectation of positive or negative outcomes from banking or financial institutions. Our assessments are not to be construed as a decision to fund or not fund any business. Always consult with qualified financial professionals before making funding decisions. For questions or assistance, contact us at{" "}
            <a href="mailto:info@aishark.org" className="underline hover:text-foreground" data-testid="link-contact-email">info@aishark.org</a>.
          </p>
        </div>
      </footer>
    </div>
  );
}
