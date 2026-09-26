import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScoreRing } from "./ScoreRing";
import { StatusBadge, type AssessmentStatus } from "./StatusBadge";
import { CriteriaBreakdown, type CriterionScore } from "./CriteriaBreakdown";
import { ReportSummary } from "./ReportSummary";
import { SatisfactionSurvey } from "./SatisfactionSurvey";
import {
  ArrowLeft,
  FileText,
  Calendar,
  Download,
  TrendingUp,
  TrendingDown,
  Zap,
  AlertCircle,
  Target,
  Globe,
  BarChart2,
  CheckCircle2,
  XCircle,
  Minus,
} from "lucide-react";

export interface SwotAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface MarketAnalysis {
  targetMarket: string;
  marketSize: string;
  competitivePosition: string;
  growthPotential: string;
}

export interface FinancialRatio {
  name: string;
  value: string;
  assessment: string;
}

export interface FullAssessment {
  id: string;
  businessName: string;
  fileName: string;
  uploadDate: string;
  status: AssessmentStatus;
  overallScore: number;
  lenderReadinessGrade?: string;
  executiveSummary: string;
  criteria: CriterionScore[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  swot?: SwotAnalysis;
  marketAnalysis?: MarketAnalysis;
  financialRatios?: FinancialRatio[];
}

interface AssessmentReportProps {
  assessment: FullAssessment;
  onBack: () => void;
  publicMode?: boolean;
  revisionAction?: "pending" | "pricing" | "upload";
  onRevise?: () => void;
}

function gradeColor(grade?: string): string {
  if (!grade) return "bg-muted text-muted-foreground";
  if (grade === "A") return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
  if (grade.startsWith("B")) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
  if (grade.startsWith("C")) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
  return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
}

function ratioIcon(assessment: string) {
  if (assessment === "Good") return <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" aria-hidden="true" />;
  if (assessment === "Acceptable") return <Minus className="h-4 w-4 text-yellow-500 flex-shrink-0" aria-hidden="true" />;
  if (assessment === "Concerning") return <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" aria-hidden="true" />;
  return <Minus className="h-4 w-4 text-muted-foreground flex-shrink-0" aria-hidden="true" />;
}

function handleExportPDF(assessment: FullAssessment) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const gradeLabel = assessment.lenderReadinessGrade ? `Documentation review grade: ${assessment.lenderReadinessGrade}` : "";
  const score = assessment.overallScore;
  const scoreLabel = score >= 85 ? "Excellent" : score >= 75 ? "Strong" : score >= 65 ? "Good" : score >= 50 ? "Moderate" : "Needs Improvement";

  const criteriaHtml = (assessment.criteria || []).map(c => `
    <div class="criterion">
      <div class="criterion-header">
        <span class="criterion-name">${c.name}</span>
        <span class="criterion-score score-${c.score >= 75 ? 'good' : c.score >= 50 ? 'ok' : 'poor'}">${c.score}/100</span>
      </div>
      <p>${c.analysis}</p>
      ${c.keyFindings.length ? `<ul>${c.keyFindings.map(f => `<li>${f}</li>`).join("")}</ul>` : ""}
    </div>
  `).join("");

  const swotHtml = assessment.swot ? `
    <div class="section">
      <h2>SWOT Analysis</h2>
      <div class="swot-grid">
        <div class="swot-box swot-s"><h3>Strengths</h3><ul>${assessment.swot.strengths.map(s => `<li>${s}</li>`).join("")}</ul></div>
        <div class="swot-box swot-w"><h3>Weaknesses</h3><ul>${assessment.swot.weaknesses.map(s => `<li>${s}</li>`).join("")}</ul></div>
        <div class="swot-box swot-o"><h3>Opportunities</h3><ul>${assessment.swot.opportunities.map(s => `<li>${s}</li>`).join("")}</ul></div>
        <div class="swot-box swot-t"><h3>Threats</h3><ul>${assessment.swot.threats.map(s => `<li>${s}</li>`).join("")}</ul></div>
      </div>
    </div>
  ` : "";

  const marketHtml = assessment.marketAnalysis ? `
    <div class="section">
      <h2>Market Analysis</h2>
      <table class="ratio-table">
        <tr><td><strong>Target Market</strong></td><td>${assessment.marketAnalysis.targetMarket}</td></tr>
        <tr><td><strong>Market Size</strong></td><td>${assessment.marketAnalysis.marketSize}</td></tr>
        <tr><td><strong>Competitive Position</strong></td><td>${assessment.marketAnalysis.competitivePosition}</td></tr>
        <tr><td><strong>Growth Potential</strong></td><td>${assessment.marketAnalysis.growthPotential}</td></tr>
      </table>
    </div>
  ` : "";

  const ratiosHtml = assessment.financialRatios && assessment.financialRatios.length ? `
    <div class="section">
      <h2>Key Financial Ratios</h2>
      <table class="ratio-table">
        <thead><tr><th>Ratio</th><th>Value</th><th>Assessment</th></tr></thead>
        <tbody>${assessment.financialRatios.map(r => `<tr><td>${r.name}</td><td>${r.value}</td><td>${r.assessment}</td></tr>`).join("")}</tbody>
      </table>
    </div>
  ` : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AI Shark Assessment - ${assessment.businessName}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a2e; background: #fff; padding: 32px; font-size: 13px; line-height: 1.6; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #0f3460; padding-bottom: 16px; margin-bottom: 24px; }
    .logo { font-size: 22px; font-weight: 800; color: #0846AA; }
    .logo span { color: #0846AA; }
    .meta { text-align: right; color: #555; font-size: 12px; }
    .score-banner { background: linear-gradient(135deg, #0f3460 0%, #16213e 100%); color: #fff; border-radius: 10px; padding: 20px 24px; margin-bottom: 24px; display: flex; gap: 32px; align-items: center; }
    .score-num { font-size: 52px; font-weight: 900; line-height: 1; }
    .score-details h1 { font-size: 20px; margin-bottom: 4px; }
    .grade-badge { display: inline-block; background: rgba(255,255,255,0.2); border-radius: 6px; padding: 2px 12px; font-size: 16px; font-weight: 700; margin-top: 4px; }
    .score-label { font-size: 13px; opacity: 0.8; margin-top: 4px; }
    .section { margin-bottom: 28px; }
    h2 { font-size: 16px; color: #0f3460; border-left: 4px solid #e94560; padding-left: 10px; margin-bottom: 14px; margin-top: 4px; }
    h3 { font-size: 13px; font-weight: 600; margin-bottom: 8px; }
    p { color: #444; margin-bottom: 8px; }
    ul { padding-left: 18px; color: #444; }
    ul li { margin-bottom: 4px; }
    .criterion { border: 1px solid #e0e0e0; border-radius: 8px; padding: 12px 16px; margin-bottom: 10px; }
    .criterion-header { display: flex; justify-content: space-between; margin-bottom: 6px; }
    .criterion-name { font-weight: 600; font-size: 13px; }
    .criterion-score { font-weight: 700; font-size: 13px; }
    .score-good { color: #16a34a; }
    .score-ok { color: #ca8a04; }
    .score-poor { color: #dc2626; }
    .swot-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .swot-box { border-radius: 8px; padding: 12px 14px; }
    .swot-s { background: #f0fdf4; border: 1px solid #86efac; }
    .swot-w { background: #fef2f2; border: 1px solid #fca5a5; }
    .swot-o { background: #eff6ff; border: 1px solid #93c5fd; }
    .swot-t { background: #fffbeb; border: 1px solid #fcd34d; }
    .swot-s h3 { color: #15803d; }
    .swot-w h3 { color: #b91c1c; }
    .swot-o h3 { color: #1d4ed8; }
    .swot-t h3 { color: #b45309; }
    .ratio-table { width: 100%; border-collapse: collapse; }
    .ratio-table th { background: #0f3460; color: #fff; padding: 8px 12px; text-align: left; font-size: 12px; }
    .ratio-table td { padding: 7px 12px; border-bottom: 1px solid #eee; font-size: 12px; }
    .ratio-table tr:hover td { background: #f9fafb; }
    .disclaimer { font-size: 11px; color: #888; border-top: 1px solid #e0e0e0; padding-top: 12px; margin-top: 24px; }
    @media print { body { padding: 16px; } .score-banner { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">AI <span>Shark</span> <span style="font-size:12px;font-weight:400;color:#555;">aishark.org</span></div>
    <div class="meta">
      <div><strong>Business Plan Assessment</strong></div>
      <div>${assessment.businessName}</div>
      <div>File: ${assessment.fileName}</div>
      <div>Date: ${assessment.uploadDate}</div>
      <div>Generated: ${new Date().toLocaleDateString()}</div>
    </div>
  </div>

  <div class="score-banner">
    <div class="score-num">${assessment.overallScore}</div>
    <div class="score-details">
      <h1>${assessment.businessName}</h1>
      ${gradeLabel ? `<div class="grade-badge">${gradeLabel}</div>` : ""}
      <div class="score-label">${scoreLabel} — business plan documentation review score, not approval, a lending decision, or verification of creditworthiness</div>
    </div>
  </div>

  <div class="section">
    <h2>Executive Summary</h2>
    <p>${assessment.executiveSummary}</p>
  </div>

  ${ratiosHtml}
  ${marketHtml}
  ${swotHtml}

  <div class="section">
    <h2>Detailed Criteria Analysis (10 Dimensions)</h2>
    ${criteriaHtml}
  </div>

  <div class="section">
    <h2>Key Strengths</h2>
    <ul>${(assessment.strengths || []).map(s => `<li>${s}</li>`).join("")}</ul>
  </div>

  <div class="section">
    <h2>Key Weaknesses</h2>
    <ul>${(assessment.weaknesses || []).map(s => `<li>${s}</li>`).join("")}</ul>
  </div>

  <div class="section">
    <h2>Recommendations</h2>
    <ul>${(assessment.recommendations || []).map(s => `<li>${s}</li>`).join("")}</ul>
  </div>

  <div class="disclaimer">
    <strong>Disclaimer:</strong> This assessment provides an analytical perspective on your business plan documentation for informational purposes only. Results do not imply any expectation of positive or negative outcomes from banking or financial institutions. This report is not to be construed as a decision to fund or not fund any business. Always consult with qualified financial professionals before making funding decisions. | AI Shark — <a href="mailto:info@aishark.org">info@aishark.org</a>
  </div>
</body>
</html>`;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => printWindow.print(), 500);
}

export function AssessmentReport({ assessment, onBack, publicMode = false, revisionAction, onRevise }: AssessmentReportProps) {
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
        <Button
          variant="outline"
          data-testid="button-export"
          onClick={() => handleExportPDF(assessment)}
          aria-label="Export assessment as PDF"
        >
          <Download className="mr-2 h-4 w-4" aria-hidden="true" />
          Export PDF
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Documentation Review Score</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <ScoreRing score={assessment.overallScore} size="lg" />
            {assessment.lenderReadinessGrade && (
              <div
                className={`rounded-lg px-4 py-1.5 text-sm font-bold ${gradeColor(assessment.lenderReadinessGrade)}`}
                aria-label={`Documentation review grade: ${assessment.lenderReadinessGrade}`}
                data-testid="text-lender-grade"
              >
                Review Grade: {assessment.lenderReadinessGrade}
              </div>
            )}
            <p className="text-center text-sm text-muted-foreground">
              {assessment.overallScore >= 85
                ? "Strong documentation in this review"
                : assessment.overallScore >= 75
                ? "Mostly strong documentation with areas to review"
                : assessment.overallScore >= 65
                ? "Some documentation gaps to address"
                : assessment.overallScore >= 50
                ? "Additional documentation may help"
                : "Significant documentation gaps to address"}
            </p>
            <p className="text-center text-xs text-muted-foreground">This is not approval, a lending decision, or verified creditworthiness.</p>
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

      {assessment.financialRatios && assessment.financialRatios.length > 0 && (
        <section aria-labelledby="ratios-heading">
          <h2 id="ratios-heading" className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-primary" aria-hidden="true" />
            Key Financial Ratios
          </h2>
          <Card>
            <CardContent className="pt-5">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" role="list" aria-label="Financial ratios">
                {assessment.financialRatios.map((ratio, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-lg border bg-muted/30 p-3"
                    role="listitem"
                    data-testid={`ratio-item-${i}`}
                  >
                    {ratioIcon(ratio.assessment)}
                    <div className="min-w-0">
                      <p className="text-xs font-medium leading-tight">{ratio.name}</p>
                      <p className="text-sm font-semibold mt-0.5">{ratio.value}</p>
                      <p className={`text-xs mt-0.5 ${
                        ratio.assessment === "Good" ? "text-green-600 dark:text-green-400" :
                        ratio.assessment === "Concerning" ? "text-red-600 dark:text-red-400" :
                        ratio.assessment === "Acceptable" ? "text-yellow-600 dark:text-yellow-400" :
                        "text-muted-foreground"
                      }`}>{ratio.assessment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {assessment.marketAnalysis && (
        <section aria-labelledby="market-heading">
          <h2 id="market-heading" className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" aria-hidden="true" />
            Market Analysis
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" aria-hidden="true" />
                  Target Market
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{assessment.marketAnalysis.targetMarket}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <BarChart2 className="h-4 w-4 text-primary" aria-hidden="true" />
                  Market Size
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{assessment.marketAnalysis.marketSize}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" aria-hidden="true" />
                  Competitive Position
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{assessment.marketAnalysis.competitivePosition}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" aria-hidden="true" />
                  Growth Potential
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{assessment.marketAnalysis.growthPotential}</p>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {assessment.swot && (
        <section aria-labelledby="swot-heading">
          <h2 id="swot-heading" className="text-xl font-semibold mb-4">SWOT Analysis</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="border-green-200 dark:border-green-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-700 dark:text-green-400 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" aria-hidden="true" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5" aria-label="SWOT Strengths">
                  {assessment.swot.strengths.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-red-200 dark:border-red-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-red-700 dark:text-red-400 flex items-center gap-2">
                  <TrendingDown className="h-4 w-4" aria-hidden="true" />
                  Weaknesses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5" aria-label="SWOT Weaknesses">
                  {assessment.swot.weaknesses.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-500" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-400 flex items-center gap-2">
                  <Zap className="h-4 w-4" aria-hidden="true" />
                  Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5" aria-label="SWOT Opportunities">
                  {assessment.swot.opportunities.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 dark:border-yellow-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-400 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                  Threats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5" aria-label="SWOT Threats">
                  {assessment.swot.threats.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-yellow-500" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      <section aria-labelledby="criteria-heading">
        <h2 id="criteria-heading" className="text-xl font-semibold mb-4">
          Detailed Criteria Analysis
          <span className="ml-2 text-sm font-normal text-muted-foreground">({assessment.criteria?.length || 0} dimensions)</span>
        </h2>
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

      {!publicMode && onRevise && revisionAction && (
        <section className="rounded-xl border bg-card p-5 sm:p-6" aria-labelledby="revision-heading">
          <h2 id="revision-heading" className="text-lg font-semibold">Revise and review your plan</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Use these recommendations to update your document before submitting a revised file for a separate evaluation.
          </p>
          {assessment.recommendations.length > 0 ? (
            <ol className="mt-4 list-decimal pl-5 space-y-2 text-sm">
              {assessment.recommendations.map((recommendation, index) => (
                <li key={index}>{recommendation}</li>
              ))}
            </ol>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              No specific recommendations are available for this report. Review the criteria and weaknesses above before revising.
            </p>
          )}
          <p className="mt-4 text-xs text-muted-foreground">
            A revised upload creates a new assessment and uses one evaluation credit. Previous reports remain in your dashboard unless you delete them.
          </p>
          <Button className="mt-4" onClick={onRevise} disabled={revisionAction === "pending"} data-testid="button-revise-plan">
            {revisionAction === "pending" ? "Checking evaluation credits..." : revisionAction === "pricing" ? "View plans to evaluate revision" : "Upload revised plan"}
          </Button>
        </section>
      )}

      {!publicMode && (
        <div className="mt-6">
          <SatisfactionSurvey assessmentId={assessment.id} />
        </div>
      )}

      <div className="mt-8 pt-6 border-t">
        <p className="text-xs text-muted-foreground text-center" data-testid="text-disclaimer">
          <strong>Disclaimer:</strong> This assessment provides an analytical perspective on your business plan documentation for informational purposes only. Results do not imply any expectation of positive or negative outcomes from banking or financial institutions. This report is not to be construed as a decision to fund or not fund any business. Always consult with qualified financial professionals before making funding decisions. | <a href="mailto:info@aishark.org" className="underline hover:text-foreground">info@aishark.org</a>
        </p>
      </div>
    </div>
  );
}
