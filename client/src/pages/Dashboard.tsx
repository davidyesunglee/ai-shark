import { useState } from "react";
import { Header } from "@/components/Header";
import { StatsCard } from "@/components/StatsCard";
import { AssessmentCard, type Assessment } from "@/components/AssessmentCard";
import { EmptyState } from "@/components/EmptyState";
import { UploadDialog } from "@/components/UploadDialog";
import { AssessmentReport, type FullAssessment } from "@/components/AssessmentReport";
import { useToast } from "@/hooks/use-toast";
import { FileText, TrendingUp, CheckCircle, Clock } from "lucide-react";

// todo: remove mock functionality
const mockAssessments: Assessment[] = [
  {
    id: "1",
    businessName: "TechStart Solutions LLC",
    fileName: "techstart_business_plan_2024.pdf",
    uploadDate: "Dec 15, 2025",
    status: "complete",
    overallScore: 74,
  },
  {
    id: "2",
    businessName: "Green Energy Ventures",
    fileName: "green_energy_bp.docx",
    uploadDate: "Dec 14, 2025",
    status: "complete",
    overallScore: 88,
  },
  {
    id: "3",
    businessName: "Urban Logistics Co",
    fileName: "urban_logistics_plan.pdf",
    uploadDate: "Dec 13, 2025",
    status: "needs_review",
    overallScore: 52,
  },
  {
    id: "4",
    businessName: "HealthTech Innovations",
    fileName: "healthtech_proposal.pdf",
    uploadDate: "Dec 12, 2025",
    status: "analyzing",
    overallScore: null,
  },
];

// todo: remove mock functionality
const mockFullAssessment: FullAssessment = {
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
      analysis: "Strong credit profile with established business history and positive payment patterns. The company has maintained good standing with existing creditors and demonstrates responsible financial management.",
      keyFindings: ["5+ years in operation", "No significant delinquencies", "Strong personal guarantor credit scores"],
    },
    {
      id: "cash_flow",
      name: "Cash Flow Analysis",
      score: 68,
      analysis: "Adequate cash flow coverage with some seasonal variations that may impact consistency. The debt service coverage ratio meets minimum requirements but leaves limited buffer for unexpected expenses.",
      keyFindings: ["DSCR of 1.4x", "Seasonal fluctuations of 20%", "Growing accounts receivable"],
    },
    {
      id: "collateral",
      name: "Collateral Assessment",
      score: 55,
      analysis: "Limited hard assets available for secured lending. Primary company value is in intellectual property and human capital, which are difficult to collateralize for traditional bank loans.",
      keyFindings: ["Primary assets are IP and equipment", "May need third-party guarantees", "Real estate could enhance collateral position"],
    },
    {
      id: "debt_equity",
      name: "Debt-to-Equity Ratio",
      score: 78,
      analysis: "Conservative leverage with room for additional debt capacity. Current debt structure is manageable and leaves headroom for growth financing.",
      keyFindings: ["Current D/E ratio of 0.8", "Industry average is 1.2", "Strong equity base from retained earnings"],
    },
    {
      id: "market_viability",
      name: "Market Viability",
      score: 85,
      analysis: "Strong market position with clear growth opportunities. The target market is expanding and the company has established competitive advantages.",
      keyFindings: ["Growing market segment of 15% annually", "Clear competitive advantages in technology", "Diversified revenue streams"],
    },
    {
      id: "management",
      name: "Management Team",
      score: 80,
      analysis: "Experienced leadership team with relevant industry background and track record of successful execution.",
      keyFindings: ["15+ years combined experience", "Previous successful ventures", "Strong advisory board"],
    },
  ],
  strengths: [
    "Strong management team with proven track record in the industry",
    "Consistent revenue growth of 25% over past 3 years",
    "Conservative debt levels with room for additional leverage",
    "Clear market opportunity with established competitive moat",
  ],
  weaknesses: [
    "Limited tangible collateral assets for secured lending",
    "High customer concentration risk (top 3 clients = 60% revenue)",
    "Thin operating margins compared to industry benchmarks",
  ],
  recommendations: [
    "Diversify customer base to reduce concentration risk before applying for larger loan amounts",
    "Build additional collateral through strategic asset acquisition or arrange third-party guarantees",
    "Implement cost optimization strategies to improve operating margins by at least 3-5%",
    "Prepare detailed cash flow projections showing seasonal patterns and mitigation strategies",
  ],
};

export default function Dashboard() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>(mockAssessments);
  const { toast } = useToast();

  const handleUpload = (file: File) => {
    setIsUploading(true);
    // todo: replace with actual API call
    setTimeout(() => {
      const newAssessment: Assessment = {
        id: String(Date.now()),
        businessName: file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " "),
        fileName: file.name,
        uploadDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        status: "analyzing",
        overallScore: null,
      };
      setAssessments([newAssessment, ...assessments]);
      setIsUploading(false);
      setUploadOpen(false);
      toast({
        title: "Business plan uploaded",
        description: "Your document is being analyzed. This may take a few moments.",
      });
    }, 1500);
  };

  const handleDelete = (id: string) => {
    setAssessments(assessments.filter((a) => a.id !== id));
    toast({
      title: "Assessment deleted",
      description: "The assessment has been removed.",
    });
  };

  const completedCount = assessments.filter((a) => a.status === "complete").length;
  const avgScore = assessments
    .filter((a) => a.overallScore !== null)
    .reduce((sum, a, _, arr) => sum + (a.overallScore || 0) / arr.length, 0);

  if (viewingId) {
    // todo: fetch actual assessment data
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-6xl px-6 py-8">
          <AssessmentReport assessment={mockFullAssessment} onBack={() => setViewingId(null)} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onNewAssessment={() => setUploadOpen(true)} />
      
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard 
              title="Total Assessments" 
              value={assessments.length} 
              icon={FileText}
            />
            <StatsCard 
              title="Completed" 
              value={completedCount} 
              icon={CheckCircle}
            />
            <StatsCard 
              title="In Progress" 
              value={assessments.filter((a) => a.status === "analyzing").length} 
              icon={Clock}
            />
            <StatsCard 
              title="Average Score" 
              value={avgScore > 0 ? avgScore.toFixed(1) : "-"} 
              icon={TrendingUp}
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Recent Assessments</h2>
            
            {assessments.length === 0 ? (
              <EmptyState onUpload={() => setUploadOpen(true)} />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {assessments.map((assessment) => (
                  <AssessmentCard
                    key={assessment.id}
                    assessment={assessment}
                    onView={setViewingId}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <UploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onUpload={handleUpload}
        isUploading={isUploading}
      />
    </div>
  );
}
