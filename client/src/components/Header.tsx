import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Plus, LogOut, CreditCard } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import logoImage from "@assets/AI_Shark_logo_1770083549283.png";

interface HeaderProps {
  onNewAssessment?: () => void;
}

export function Header({ onNewAssessment }: HeaderProps) {
  const { user, logout, isLoggingOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between gap-4 border-b bg-background px-6" role="banner">
      <Link href="/">
        <div className="flex items-center gap-3 cursor-pointer">
          <img src={logoImage} alt="AI Shark Logo" className="h-9 w-auto" data-testid="img-logo" />
          <div>
            <h1 className="text-lg font-semibold">AI Shark</h1>
            <p className="text-xs text-muted-foreground">Bank Debt Financing Criteria</p>
          </div>
        </div>
      </Link>
      <nav aria-label="Dashboard navigation">
        <div className="flex items-center gap-2">
          {user && (
            <span className="text-sm text-muted-foreground hidden sm:inline" data-testid="text-user-name">
              {user.firstName || user.email || "User"}
            </span>
          )}
          <Link href="/pricing">
            <Button variant="ghost" data-testid="link-pricing">
              <CreditCard className="mr-1 h-4 w-4" aria-hidden="true" />
              Pricing
            </Button>
          </Link>
          {onNewAssessment && (
            <Button onClick={onNewAssessment} data-testid="button-new-assessment">
              <Plus className="mr-1 h-4 w-4" aria-hidden="true" />
              New Assessment
            </Button>
          )}
          <ThemeToggle />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => logout()} 
            disabled={isLoggingOut}
            aria-label="Log out"
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </nav>
    </header>
  );
}
