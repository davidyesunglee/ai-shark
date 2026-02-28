import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "./ScoreRing";
import { StatusBadge, type AssessmentStatus } from "./StatusBadge";
import { CriteriaBreakdown, type CriterionScore } from "./CriteriaBreakdown";
import { ReportSummary } from "./ReportSummary";
import { SatisfactionSurvey } from "./SatisfactionSurvey";
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
        <Button variant="ghost" size="icon" onClick={onBack} aria-label="Back to dashboard" data-testid="button-back">
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">{assessment.businessName}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <FileText className="h-4 w-4" aria-hidden="true" />
              {assessment.fileName}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              <time>{assessment.uploadDate}</time>
            </span>
          </div>
        </div>
        <StatusBadge status={assessment.status} />
        <Button variant="outline" data-testid="button-export">
          <Download className="mr-2 h-4 w-4" aria-hidden="true" />
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

      <section aria-labelledby="criteria-heading">
        <h2 id="criteria-heading" className="text-xl font-semibold mb-4">Detailed Criteria Analysis</h2>
        <CriteriaBreakdown criteria={assessment.criteria} />
      </section>

      <section aria-labelledby="summary-heading">
        <h2 id="summary-heading" className="text-xl font-semibold mb-4">Assessment Summary</h2>
        <ReportSummary
          strengths={assessment.strengths}
          weaknesses={assessment.weaknesses}
          recommendations={assessment.recommendations}
        />
      </section>

      <div className="mt-6">
        <SatisfactionSurvey assessmentId={assessment.id} />
      </div>

      <div className="mt-8 pt-6 border-t">
        <p className="text-xs text-muted-foreground text-center" data-testid="text-disclaimer">
          <strong>Disclaimer:</strong> This assessment provides an analytical perspective on your business plan documentation for informational purposes only. Results do not imply any expectation of positive or negative outcomes from banking or financial institutions. This report is not to be construed as a decision to fund or not fund any business. Always consult with qualified financial professionals before making funding decisions.
        </p>
      </div>
    </div>
  );
}
