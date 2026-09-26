import { ReportSummary } from "../ReportSummary";

// todo: remove mock functionality
const mockData = {
  strengths: [
    "Strong management team with 15+ years combined experience",
    "Clear revenue growth trajectory over past 3 years",
    "Established customer base with high retention rates",
    "Well-defined market positioning and competitive advantage",
  ],
  weaknesses: [
    "Limited collateral assets for secured lending",
    "High customer concentration risk (top 3 clients = 60% revenue)",
    "Thin operating margins compared to industry average",
  ],
  recommendations: [
    "Consider diversifying customer base to reduce concentration risk before applying for larger loan amounts",
    "Build additional collateral through asset acquisition or third-party guarantees",
    "Implement cost reduction strategies to improve operating margins by at least 3-5%",
    "Prepare detailed cash flow projections showing seasonal patterns and mitigation strategies",
  ],
};

export default function ReportSummaryExample() {
  return (
    <div className="w-full max-w-4xl">
      <ReportSummary {...mockData} />
    </div>
  );
}
