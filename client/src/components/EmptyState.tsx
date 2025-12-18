import { FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onUpload: () => void;
}

export function EmptyState({ onUpload }: EmptyStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <FileText className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">No assessments yet</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Upload your first business plan to receive a detailed assessment based on bank debt financing criteria.
      </p>
      <Button className="mt-6" onClick={onUpload} data-testid="button-upload-first">
        <Upload className="mr-2 h-4 w-4" />
        Upload Business Plan
      </Button>
    </div>
  );
}
