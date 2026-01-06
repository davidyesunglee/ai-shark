import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { FileText, Plus, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface HeaderProps {
  onNewAssessment?: () => void;
}

export function Header({ onNewAssessment }: HeaderProps) {
  const { user, logout, isLoggingOut } = useAuth();

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
        {user && (
          <span className="text-sm text-muted-foreground hidden sm:inline" data-testid="text-user-name">
            {user.firstName || user.email || "User"}
          </span>
        )}
        {onNewAssessment && (
          <Button onClick={onNewAssessment} data-testid="button-new-assessment">
            <Plus className="mr-1 h-4 w-4" />
            New Assessment
          </Button>
        )}
        <ThemeToggle />
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => logout()} 
          disabled={isLoggingOut}
          data-testid="button-logout"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
