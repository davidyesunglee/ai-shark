import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Plus, LogOut, CreditCard } from "lucide-react";
import { useUser, useClerk } from "@clerk/react";
import { Link } from "wouter";
import logoImage from "@/assets/shark-mark.svg";

interface HeaderProps {
  onNewAssessment?: () => void;
}

export function Header({ onNewAssessment }: HeaderProps) {
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between gap-2 border-b bg-background px-3 sm:px-6" role="banner">
      <Link href="/">
        <div className="flex items-center gap-3 cursor-pointer">
          <img src={logoImage} alt="AI Shark Logo" className="h-9 w-auto" data-testid="img-logo" />
           <div className="hidden md:block">
            <h1 className="text-lg font-semibold">AI Shark</h1>
            <p className="text-xs text-muted-foreground">Bank Debt Financing Criteria</p>
          </div>
        </div>
      </Link>
      <nav aria-label="Dashboard navigation">
        <div className="flex items-center gap-1 sm:gap-2">
          {user && (
            <span className="text-sm text-muted-foreground hidden sm:inline" data-testid="text-user-name">
              {user.firstName || user.primaryEmailAddress?.emailAddress || "User"}
            </span>
          )}
          <Button variant="ghost" className="px-2 sm:px-3" asChild data-testid="link-pricing">
             <Link href="/pricing" aria-label="Pricing">
              <CreditCard className="mr-1 h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Pricing</span>
            </Link>
          </Button>
          {onNewAssessment && (
             <Button onClick={onNewAssessment} aria-label="New assessment" data-testid="button-new-assessment">
              <Plus className="sm:mr-1 h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">New Assessment</span>
            </Button>
          )}
          <ThemeToggle />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => signOut({ redirectUrl: import.meta.env.BASE_URL })}
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
