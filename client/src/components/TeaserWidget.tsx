import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileUpload } from "@/components/FileUpload";
import { TrustBadges } from "@/components/TrustBadges";
import { AnalysisProgress } from "@/components/AnalysisProgress";
import { ScoreRing } from "@/components/ScoreRing";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ArrowRight, Lock, RotateCcw, ShieldAlert } from "lucide-react";
import { Link } from "wouter";
import { trackClick } from "@/lib/useSEO";

interface TeaserResult {
  overallScore: number;
  lenderReadinessGrade: string;
  summary: string;
  topWeaknesses: string[];
}

export function TeaserWidget() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<TeaserResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const analyze = async (file: File) => {
    if (!emailValid) {
      setError("Enter your email above to see your score — that's all we need.");
      return;
    }
    setError(null);
    setIsAnalyzing(true);
    trackClick("teaser_upload");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("email", email.trim());
      const res = await fetch("/api/teaser", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || "Something went wrong. Please try again.");
        return;
      }
      setResult(data as TeaserResult);
    } catch (err) {
      setError("Could not reach the server. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  if (result) {
    const grade = result.lenderReadinessGrade;
    return (
      <Card className="max-w-2xl mx-auto" data-testid="card-teaser-result">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <ScoreRing score={result.overallScore} size="lg" />
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <span className="text-sm text-muted-foreground">Lender Readiness Grade</span>
                <Badge className="text-base px-3 py-0.5" data-testid="badge-teaser-grade">
                  {grade}
                </Badge>
              </div>
              <p className="text-lg font-medium" data-testid="text-teaser-summary">
                {result.summary}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="h-5 w-5 text-primary" aria-hidden="true" />
              <h3 className="font-semibold">Top things holding your plan back</h3>
            </div>
            <ul className="space-y-3">
              {result.topWeaknesses.slice(0, 3).map((w, i) => (
                <li key={i} data-testid={`text-teaser-weakness-${i}`}>
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <AlertCircle className="h-4 w-4 mt-1 shrink-0 text-primary" aria-hidden="true" />
                    <span>{w}</span>
                  </div>
                  <div className="ml-6 mt-1.5 flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-2">
                    <Lock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                    <span className="select-none text-sm text-muted-foreground blur-[5px]" aria-hidden="true">
                      Specific steps to fix this before you apply for the loan
                    </span>
                    <span className="sr-only">How to fix this is included in the full report.</span>
                    <span className="ml-auto shrink-0 text-xs font-medium text-primary">Unlock to see the fix</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 rounded-lg border bg-muted/40 p-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-2 text-muted-foreground">
              <Lock className="h-4 w-4" aria-hidden="true" />
              <span className="text-sm font-medium">Unlock the full report</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3 max-w-md mx-auto">
              Get the complete 10-criteria breakdown, SWOT, market analysis, 6 financial ratios,
              specific recommendations, and a downloadable PDF.
            </p>
            <p className="text-sm mb-4 max-w-md mx-auto" data-testid="text-teaser-pricing">
              <span className="font-semibold text-foreground">Just $13.99</span>
              <span className="text-muted-foreground"> for a one-time report, or </span>
              <span className="font-semibold text-foreground">$6.99/mo</span>
              <span className="text-muted-foreground"> for 2 evaluations every month — a fraction of what a loan consultant charges.</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="gap-2 w-full sm:w-auto"
                  data-testid="button-teaser-unlock"
                  onClick={() => trackClick("teaser_unlock_full_report")}
                >
                  Get My Full Report
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 w-full sm:w-auto"
                onClick={reset}
                data-testid="button-teaser-try-another"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Try another plan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto" data-testid="card-teaser-upload">
      <CardContent className="p-6 md:p-8">
        <div className="mb-4">
          <label htmlFor="teaser-email" className="mb-1.5 block text-sm font-medium">
            Your email <span className="text-muted-foreground font-normal">(required to see your score)</span>
          </label>
          <input
            id="teaser-email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isAnalyzing}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
            data-testid="input-teaser-email"
          />
        </div>
        <FileUpload onUpload={analyze} isUploading={isAnalyzing} />
        {isAnalyzing && <AnalysisProgress />}
        {error && (
          <div
            className="mt-4 flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
            role="alert"
            data-testid="text-teaser-error"
          >
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Free preview — no account or credit card needed. Your file is analyzed, not stored.
          We'll follow up by email with your score and tips; unsubscribe anytime.
        </p>
        <div className="mt-4">
          <TrustBadges />
        </div>
      </CardContent>
    </Card>
  );
}
