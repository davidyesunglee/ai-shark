import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Header } from "@/components/Header";
import { StatsCard } from "@/components/StatsCard";
import { ScoreTrendCard, type ScorePoint } from "@/components/ScoreTrendCard";
import { AssessmentCard, type Assessment } from "@/components/AssessmentCard";
import { EmptyState } from "@/components/EmptyState";
import { UploadDialog } from "@/components/UploadDialog";
import { AssessmentReport, type FullAssessment } from "@/components/AssessmentReport";
import { useToast } from "@/hooks/use-toast";
import { AnalysisProgress } from "@/components/AnalysisProgress";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { FileText, TrendingUp, CheckCircle, Clock, Loader2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface ApiAssessment {
  id: string;
  businessName: string;
  fileName: string;
  uploadDate: string;
  status: "analyzing" | "complete" | "needs_review" | "failed";
  overallScore: number | null;
}

interface ApiFullAssessment extends ApiAssessment {
  executiveSummary: string | null;
  criteria: Array<{
    id: string;
    name: string;
    score: number;
    analysis: string;
    keyFindings: string[];
  }> | null;
  strengths: string[] | null;
  weaknesses: string[] | null;
  recommendations: string[] | null;
}

export default function Dashboard() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [pollingCredits, setPollingCredits] = useState(false);
  const { toast } = useToast();
  const previousStatusRef = useRef<Map<string, string>>(new Map());
  const [, setLocation] = useLocation();

  const { data: registrationStatus, isLoading: isCheckingRegistration } = useQuery<{ isRegistered: boolean }>({
    queryKey: ["/api/registration/status"],
  });

  const { data: billingStatus, isLoading: isBillingLoading } = useQuery<{ tier: string; creditsRemaining: number; hasActiveSubscription: boolean }>({
    queryKey: ["/api/billing/status"],
    enabled: registrationStatus?.isRegistered === true,
    refetchInterval: pollingCredits ? 2000 : false,
  });

  useEffect(() => {
    if (!isCheckingRegistration && registrationStatus && !registrationStatus.isRegistered) {
      setLocation("/register");
    }
  }, [isCheckingRegistration, registrationStatus, setLocation]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("upload") === "1") {
      setUploadOpen(true);
      setPollingCredits(true);
      params.delete("upload");
      const newQuery = params.toString();
      window.history.replaceState(
        {},
        "",
        window.location.pathname + (newQuery ? `?${newQuery}` : "")
      );
    }
  }, []);

  useEffect(() => {
    if (!pollingCredits) return;
    const timer = setTimeout(() => setPollingCredits(false), 20000);
    return () => clearTimeout(timer);
  }, [pollingCredits]);

  useEffect(() => {
    if (
      pollingCredits &&
      billingStatus &&
      billingStatus.tier !== "free" &&
      billingStatus.creditsRemaining > 0
    ) {
      setPollingCredits(false);
    }
  }, [pollingCredits, billingStatus]);

  const { data: assessments = [], isLoading } = useQuery<ApiAssessment[]>({
    queryKey: ["/api/assessments"],
    refetchInterval: 5000,
    enabled: registrationStatus?.isRegistered === true,
  });

  useEffect(() => {
    assessments.forEach((assessment) => {
      const prevStatus = previousStatusRef.current.get(assessment.id);
      if (prevStatus === "analyzing" && assessment.status === "failed") {
        toast({
          title: "Analysis failed",
          description: `Failed to analyze "${assessment.businessName}". Please try uploading again.`,
          variant: "destructive",
        });
      }
      if (prevStatus === "analyzing" && assessment.status === "complete") {
        toast({
          title: "Analysis complete",
          description: `"${assessment.businessName}" has been analyzed successfully.`,
        });
      }
      previousStatusRef.current.set(assessment.id, assessment.status);
    });
  }, [assessments, toast]);

  const { data: fullAssessment, isLoading: isLoadingFull } = useQuery<ApiFullAssessment>({
    queryKey: ["/api/assessments", viewingId],
    queryFn: async () => {
      const response = await fetch(`/api/assessments/${viewingId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch assessment");
      }
      return response.json();
    },
    enabled: !!viewingId,
    staleTime: 0,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data && data.status === "analyzing") {
        return 3000;
      }
      return false;
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000);
      
      try {
        const response = await fetch("/api/assessments/upload", {
          method: "POST",
          body: formData,
          credentials: "include",
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          const error = await response.json();
          if (error.requiresPayment) {
            throw new Error("PAYMENT_REQUIRED:" + (error.message || "Payment required"));
          }
          throw new Error(error.message || "Upload failed");
        }
        return response.json();
      } catch (err: any) {
        clearTimeout(timeoutId);
        if (err.name === "AbortError") {
          throw new Error("Upload timed out. Please try again with a smaller file.");
        }
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assessments"] });
      setUploadOpen(false);
      setIsUploading(false);
      toast({
        title: "Business plan uploaded",
        description: "Your document is being analyzed. This may take a few moments.",
      });
    },
    onError: (error: Error) => {
      setIsUploading(false);
      if (error.message.startsWith("PAYMENT_REQUIRED:")) {
        setUploadOpen(false);
        sessionStorage.setItem("pendingUpload", "1");
        toast({
          title: "You're one step away",
          description: "Choose a plan to unlock your business plan evaluation.",
        });
        setLocation("/pricing");
        return;
      }
      
      let errorMessage = error.message || "Failed to upload the document. Please try again.";
      let errorTitle = "Upload failed";
      
      if (error.message === "Failed to fetch" || error.message.includes("NetworkError")) {
        errorTitle = "Connection Error";
        errorMessage = "Unable to connect to the server. Please check your internet connection and try again.";
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/assessments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assessments"] });
      toast({
        title: "Assessment deleted",
        description: "The assessment has been removed.",
      });
    },
  });

  const handleUpload = (file: File) => {
    setIsUploading(true);
    uploadMutation.mutate(file);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleBack = () => {
    const currentId = viewingId;
    setViewingId(null);
    if (currentId) {
      queryClient.removeQueries({ queryKey: ["/api/assessments", currentId] });
    }
  };

  const handleView = (id: string) => {
    queryClient.removeQueries({ queryKey: ["/api/assessments", id] });
    setViewingId(id);
  };

  const mappedAssessments: Assessment[] = assessments.map((a) => ({
    id: a.id,
    businessName: a.businessName,
    fileName: a.fileName,
    uploadDate: new Date(a.uploadDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    status: a.status,
    overallScore: a.overallScore,
  }));

  const scorePoints: ScorePoint[] = assessments
    .filter((a) => a.status === "complete" && a.overallScore !== null)
    .sort((a, b) => new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime())
    .map((a) => ({
      date: new Date(a.uploadDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      score: a.overallScore as number,
      businessName: a.businessName,
    }));

  const completedCount = assessments.filter((a) => a.status === "complete").length;
  const avgScore = assessments
    .filter((a) => a.overallScore !== null)
    .reduce((sum, a, _, arr) => sum + (a.overallScore || 0) / arr.length, 0);

  if (isCheckingRegistration) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" role="status" aria-label="Loading">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-hidden="true" />
        <span className="sr-only">Loading dashboard...</span>
      </div>
    );
  }

  if (viewingId) {
    if (isLoadingFull) {
      return (
        <div className="min-h-screen bg-background">
          <Header />
          <main className="mx-auto max-w-6xl px-6 py-8" role="status" aria-label="Loading assessment">
            <div className="space-y-6">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
            <span className="sr-only">Loading assessment report...</span>
          </main>
        </div>
      );
    }

    if (!fullAssessment) {
      return (
        <div className="min-h-screen bg-background">
          <Header />
          <main className="mx-auto max-w-6xl px-6 py-8">
            <div className="text-center">
              <p className="text-muted-foreground" role="alert">Assessment not found</p>
            </div>
          </main>
        </div>
      );
    }

    if (fullAssessment.status === "failed") {
      return (
        <div className="min-h-screen bg-background">
          <Header />
          <main className="mx-auto max-w-6xl px-6 py-8">
            <div className="text-center space-y-4" role="alert">
              <p className="text-lg font-semibold text-destructive">Analysis Failed</p>
              <p className="text-muted-foreground">
                Unable to analyze "{fullAssessment.businessName}". Please try uploading the document again.
              </p>
              <button
                onClick={handleBack}
                className="text-primary underline"
                data-testid="button-back-to-dashboard"
              >
                Back to Dashboard
              </button>
            </div>
          </main>
        </div>
      );
    }

    if (fullAssessment.status === "analyzing") {
      return (
        <div className="min-h-screen bg-background">
          <Header />
          <main className="mx-auto max-w-6xl px-6 py-8">
            <div className="text-center space-y-4" role="status" aria-live="polite">
              <p className="text-lg font-semibold">Analyzing Business Plan</p>
              <p className="text-muted-foreground">
                "{fullAssessment.businessName}" is being analyzed. This may take a minute.
              </p>
              <div className="max-w-md mx-auto text-left">
                <AnalysisProgress />
              </div>
              <button
                onClick={handleBack}
                className="text-primary underline"
                data-testid="button-back-to-dashboard"
              >
                Back to Dashboard
              </button>
            </div>
          </main>
        </div>
      );
    }

    const mappedFull: FullAssessment = {
      id: fullAssessment.id,
      businessName: fullAssessment.businessName,
      fileName: fullAssessment.fileName,
      uploadDate: new Date(fullAssessment.uploadDate).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      status: fullAssessment.status,
      overallScore: fullAssessment.overallScore || 0,
      executiveSummary: fullAssessment.executiveSummary || "Analysis pending...",
      criteria: fullAssessment.criteria || [],
      strengths: fullAssessment.strengths || [],
      weaknesses: fullAssessment.weaknesses || [],
      recommendations: fullAssessment.recommendations || [],
    };

    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-6xl px-6 py-8">
          <AssessmentReport assessment={mappedFull} onBack={handleBack} />
        </main>
      </div>
    );
  }

  const needsPayment = !isBillingLoading && (!billingStatus || billingStatus.tier === "free" || billingStatus.creditsRemaining <= 0);

  return (
    <div className="min-h-screen bg-background">
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <Header onNewAssessment={() => setUploadOpen(true)} />

      <main id="main-content" className="mx-auto max-w-7xl px-6 py-8">
        <div className="space-y-8">
          {needsPayment && (
            <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex flex-wrap items-center justify-between gap-4" role="alert" data-testid="banner-payment-required">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                <div>
                  <p className="font-medium text-amber-800 dark:text-amber-200">
                    {billingStatus?.creditsRemaining === 0 
                      ? "No evaluation credits remaining" 
                      : "Choose a plan to start analyzing business plans"}
                  </p>
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    {billingStatus?.tier === "subscription" 
                      ? "Your subscription is active but you've used all credits this month."
                      : "Subscribe for $6.99/month or purchase a single evaluation for $13.99"}
                  </p>
                </div>
              </div>
              <Button onClick={() => setLocation("/pricing")} data-testid="button-go-to-pricing">
                View Plans
              </Button>
            </div>
          )}

          <section aria-label="Assessment statistics">
            <h2 className="sr-only">Statistics</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Total Assessments"
                value={assessments.length}
                icon={FileText}
              />
              <StatsCard title="Completed" value={completedCount} icon={CheckCircle} />
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
          </section>

          {scorePoints.length >= 2 && (
            <section aria-label="Score trend">
              <ScoreTrendCard points={scorePoints} />
            </section>
          )}

          <section aria-label="Recent assessments">
            <h2 className="text-xl font-semibold mb-4">Recent Assessments</h2>

            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading assessments">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-48 w-full" />
                ))}
                <span className="sr-only">Loading assessments...</span>
              </div>
            ) : mappedAssessments.length === 0 ? (
              <EmptyState onUpload={() => setUploadOpen(true)} needsPayment={needsPayment} />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {mappedAssessments.map((assessment) => (
                  <AssessmentCard
                    key={assessment.id}
                    assessment={assessment}
                    onView={handleView}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <UploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onUpload={handleUpload}
        isUploading={isUploading}
        needsPayment={needsPayment}
        tier={billingStatus?.tier}
        processingPayment={pollingCredits && needsPayment}
      />

      <footer className="border-t mt-12" role="contentinfo">
        <div className="container mx-auto px-4 py-6">
          <p className="text-xs text-muted-foreground text-center max-w-4xl mx-auto" data-testid="text-disclaimer">
            <strong>Disclaimer:</strong> AI Shark provides analytical perspectives on business plan documentation and data for informational purposes only. Results do not imply any expectation of positive or negative outcomes from banking or financial institutions. Our assessments are not to be construed as a decision to fund or not fund any business. Always consult with qualified financial professionals before making funding decisions. For questions or assistance, contact us at{" "}<a href="mailto:info@aishark.org" className="underline hover:text-foreground" data-testid="link-contact-email">info@aishark.org</a>.
          </p>
        </div>
      </footer>
    </div>
  );
}
