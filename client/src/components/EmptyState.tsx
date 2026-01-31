import { FileText, Upload, CreditCard, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface EmptyStateProps {
  onUpload: () => void;
  needsPayment?: boolean;
}

export function EmptyState({ onUpload, needsPayment = false }: EmptyStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <FileText className="h-8 w-8 text-primary" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">Ready to Evaluate Your Business Plan</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Upload your business plan document and our AI will analyze it against bank debt financing criteria, 
        providing you with detailed scores and recommendations.
      </p>
      
      {needsPayment ? (
        <div className="mt-6 space-y-3">
          <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
            Choose a plan to start evaluating business plans
          </p>
          <Link href="/pricing">
            <Button data-testid="button-get-plan">
              <CreditCard className="mr-2 h-4 w-4" />
              View Plans
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      ) : (
        <Button className="mt-6" onClick={onUpload} data-testid="button-upload-first">
          <Upload className="mr-2 h-4 w-4" />
          Upload Business Plan
        </Button>
      )}

      <div className="mt-8 grid grid-cols-3 gap-6 text-center max-w-lg">
        <div>
          <p className="text-2xl font-bold text-primary">PDF</p>
          <p className="text-xs text-muted-foreground">Documents</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-primary">DOCX</p>
          <p className="text-xs text-muted-foreground">Word Files</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-primary">TXT</p>
          <p className="text-xs text-muted-foreground">Text Files</p>
        </div>
      </div>
    </div>
  );
}
