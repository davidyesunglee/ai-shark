import { CriteriaBreakdown, type CriterionScore } from "../CriteriaBreakdown";

// todo: remove mock functionality
const mockCriteria: CriterionScore[] = [
  {
    id: "creditworthiness",
    name: "Creditworthiness",
    score: 82,
    analysis: "Strong credit profile with established business history and positive payment patterns.",
    keyFindings: [
      "5+ years of business operations",
      "No significant delinquencies",
      "Strong personal guarantor credit",
    ],
  },
  {
    id: "cash_flow",
    name: "Cash Flow Analysis",
    score: 68,
    analysis: "Adequate cash flow coverage with some seasonal variations that may impact consistency.",
    keyFindings: [
      "Debt service coverage ratio of 1.4x",
      "Seasonal revenue fluctuations of 20%",
      "Growing accounts receivable",
    ],
  },
];

export default function CriteriaBreakdownExample() {
  return (
    <div className="w-full max-w-2xl">
      <CriteriaBreakdown criteria={mockCriteria} />
    </div>
  );
}
