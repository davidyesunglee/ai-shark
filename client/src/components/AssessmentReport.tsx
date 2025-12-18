import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "./ScoreRing";
import { StatusBadge, type AssessmentStatus } from "./StatusBadge";
import { CriteriaBreakdown, type CriterionScore } from "./CriteriaBreakdown";
import { ReportSummary } from "./ReportSummary";
import { ArrowLeft, FileText, Calendar, Download } from "lucide-react";

export interface FullAssessment {
  id: string;
  businessName: string;
  fileName: string;
  uploadDate: string;
  status: AssessmentStatus;
  overallScore: number;
  executiveSummary: string;
  criteria: CriterionScore[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

interface AssessmentReportProps {
  assessment: FullAssessment;
  onBack: () => void;
}

export function AssessmentReport({ assessment, onBack }: AssessmentReportProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} data-testid="button-back">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">{assessment.businessName}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              {assessment.fileName}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {assessment.uploadDate}
            </span>
          </div>
        </div>
        <StatusBadge status={assessment.status} />
        <Button variant="outline" data-testid="button-export">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Overall Score</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <ScoreRing score={assessment.overallScore} size="lg" />
            <p className="text-center text-sm text-muted-foreground">
              {assessment.overallScore >= 75
                ? "Strong candidate for bank debt financing"
                : assessment.overallScore >= 50
                ? "May qualify with additional documentation"
                : "Significant improvements needed"}
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Executive Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {assessment.executiveSummary}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Detailed Criteria Analysis</h2>
        <CriteriaBreakdown criteria={assessment.criteria} />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Assessment Summary</h2>
        <ReportSummary
          strengths={assessment.strengths}
          weaknesses={assessment.weaknesses}
          recommendations={assessment.recommendations}
        />
      </div>
    </div>
  );
}
