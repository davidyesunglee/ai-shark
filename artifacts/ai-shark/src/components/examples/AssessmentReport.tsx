import { AssessmentReport, type FullAssessment } from "../AssessmentReport";

// todo: remove mock functionality
const mockAssessment: FullAssessment = {
  id: "1",
  businessName: "TechStart Solutions LLC",
  fileName: "techstart_business_plan_2024.pdf",
  uploadDate: "December 15, 2025",
  status: "complete",
  overallScore: 74,
  executiveSummary:
    "TechStart Solutions presents a moderately strong case for bank debt financing. The company demonstrates solid revenue growth and experienced management. However, concerns around collateral coverage and customer concentration may require additional mitigation strategies. Overall, this business plan shows promise but would benefit from addressing key risk factors before pursuing significant debt financing.",
  criteria: [
    {
      id: "creditworthiness",
      name: "Creditworthiness",
      score: 82,
      analysis: "Strong credit profile with established business history.",
      keyFindings: ["5+ years in operation", "No major delinquencies"],
    },
    {
      id: "cash_flow",
      name: "Cash Flow Analysis",
      score: 68,
      analysis: "Adequate coverage with seasonal variations.",
      keyFindings: ["DSCR of 1.4x", "Seasonal fluctuations of 20%"],
    },
    {
      id: "collateral",
      name: "Collateral Assessment",
      score: 55,
      analysis: "Limited hard assets for secured lending.",
      keyFindings: ["Primary assets are IP and equipment", "May need third-party guarantees"],
    },
    {
      id: "debt_equity",
      name: "Debt-to-Equity Ratio",
      score: 78,
      analysis: "Conservative leverage with room for additional debt.",
      keyFindings: ["Current D/E ratio of 0.8", "Industry average is 1.2"],
    },
    {
      id: "market_viability",
      name: "Market Viability",
      score: 85,
      analysis: "Strong market position with growth opportunities.",
      keyFindings: ["Growing market segment", "Clear competitive advantages"],
    },
    {
      id: "management",
      name: "Management Team",
      score: 80,
      analysis: "Experienced leadership with relevant industry background.",
      keyFindings: ["15+ years combined experience", "Previous successful ventures"],
    },
  ],
  strengths: [
    "Strong management team with proven track record",
    "Growing revenue over past 3 years",
    "Conservative debt levels",
    "Clear market opportunity",
  ],
  weaknesses: [
    "Limited collateral assets",
    "High customer concentration",
    "Thin operating margins",
  ],
  recommendations: [
    "Diversify customer base before seeking larger loans",
    "Build collateral through asset acquisition",
    "Improve operating margins by 3-5%",
    "Prepare detailed seasonal cash flow projections",
  ],
};

export default function AssessmentReportExample() {
  return (
    <div className="w-full max-w-5xl p-6">
      <AssessmentReport
        assessment={mockAssessment}
        onBack={() => console.log("Back clicked")}
      />
    </div>
  );
}
