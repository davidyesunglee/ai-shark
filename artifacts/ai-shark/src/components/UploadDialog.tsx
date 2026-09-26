import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreditCard, Check, ArrowRight, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { FileUpload } from "./FileUpload";

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (file: File) => void;
  isUploading?: boolean;
  needsPayment?: boolean;
  tier?: string;
  processingPayment?: boolean;
}

export function UploadDialog({
  open,
  onOpenChange,
  onUpload,
  isUploading,
  needsPayment = false,
  tier,
  processingPayment = false,
}: UploadDialogProps) {
  const [, setLocation] = useLocation();

  const outOfSubscriptionCredits = needsPayment && tier === "subscription";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {processingPayment ? (
          <>
            <DialogHeader>
              <DialogTitle>Finalizing your purchase</DialogTitle>
              <DialogDescription>
                We're confirming your payment and adding your evaluation credits. This usually takes just a few seconds.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center gap-3 py-8 text-center" role="status" aria-live="polite" data-testid="status-processing-payment">
              <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
              <p className="text-sm text-muted-foreground">Getting your account ready...</p>
            </div>
          </>
        ) : needsPayment ? (
          <>
            <DialogHeader>
              <DialogTitle>
                {outOfSubscriptionCredits
                  ? "You've used all your credits this month"
                  : "Unlock business plan evaluations"}
              </DialogTitle>
              <DialogDescription>
                {outOfSubscriptionCredits
                  ? "Your subscription is active, but this month's evaluations are used up. Add a one-time evaluation to keep going."
                  : "Choose a plan to get a full AI-powered assessment with scores, SWOT, financial ratios, and a downloadable report."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2">
              <div className="rounded-lg border p-4" data-testid="upsell-subscription">
                <div className="flex items-baseline justify-between">
                  <span className="font-semibold">Monthly Subscription</span>
                  <span className="text-lg font-bold">$6.99<span className="text-sm font-normal text-muted-foreground">/mo</span></span>
                </div>
                <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-green-500" aria-hidden="true" />
                  2 evaluations every month
                </p>
              </div>

              <div className="rounded-lg border p-4" data-testid="upsell-one-time">
                <div className="flex items-baseline justify-between">
                  <span className="font-semibold">One-Time Evaluation</span>
                  <span className="text-lg font-bold">$13.99</span>
                </div>
                <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-green-500" aria-hidden="true" />
                  1 full evaluation, no subscription
                </p>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={() => {
                onOpenChange(false);
                setLocation("/pricing");
              }}
              data-testid="button-dialog-view-plans"
            >
              <CreditCard className="mr-2 h-4 w-4" aria-hidden="true" />
              View Plans
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Upload Business Plan</DialogTitle>
              <DialogDescription>
                Upload a business plan document (PDF, DOCX, or TXT, max 10MB) to receive an AI-powered assessment based on bank debt financing criteria. This uses 1 evaluation credit.
              </DialogDescription>
            </DialogHeader>
            <FileUpload onUpload={onUpload} isUploading={isUploading} />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
