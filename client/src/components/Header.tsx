import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { FileText, Plus } from "lucide-react";

interface HeaderProps {
  onNewAssessment?: () => void;
}

export function Header({ onNewAssessment }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between gap-4 border-b bg-background px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
          <FileText className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-semibold">Business Plan Assessor</h1>
          <p className="text-xs text-muted-foreground">Bank Debt Financing Criteria</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {onNewAssessment && (
          <Button onClick={onNewAssessment} data-testid="button-new-assessment">
            <Plus className="mr-1 h-4 w-4" />
            New Assessment
          </Button>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}
