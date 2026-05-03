import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useSEO } from "@/lib/useSEO";
import logoImage from "@assets/AI_Shark_logo_1770083549283.png";

export default function SignupPage() {
  useSEO({
    title: "Sign Up — Create Your AI Shark Account",
    description: "Create a free AI Shark account to assess your business plan against bank lending criteria. Get started in 60 seconds.",
    canonical: "/signup",
  });
  const [, setLocation] = useLocation();
  const { signup, isSigningUp } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters.",
        variant: "destructive",
      });
      return;
    }

    if (!agreedToTerms) {
      toast({
        title: "Terms of Use required",
        description: "Please agree to the Terms of Use and Privacy Policy to create an account.",
        variant: "destructive",
      });
      return;
    }

    try {
      await signup({ email, password, firstName, lastName });
      toast({
        title: "Account created",
        description: "Please check your email to verify your account.",
      });
      setLocation("/register");
    } catch (error: any) {
      console.error("Signup error:", error);
      let message = "Signup failed. Please try again.";
      if (error.message?.includes("400")) {
        message = "Email already registered. Please sign in instead.";
      } else if (error.message?.includes("Failed to fetch") || error.message?.includes("NetworkError")) {
        message = "Network error. Please check your connection and try again.";
      } else if (error.message) {
        try {
          const parsed = JSON.parse(error.message.split(": ").slice(1).join(": "));
          if (parsed.message) message = parsed.message;
        } catch {
        }
      }
      toast({
        title: "Signup failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <header className="border-b" role="banner">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <img src={logoImage} alt="AI Shark Logo" className="h-8 w-auto" data-testid="img-logo" />
              <span className="font-semibold text-lg" data-testid="text-app-title">AI Shark</span>
            </div>
          </Link>
          <nav aria-label="Main navigation">
            <div className="flex items-center gap-2">
              <Link href="/about">
                <Button variant="ghost" data-testid="link-about">About</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" data-testid="link-login">Sign In</Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main id="main-content" className="flex-1 flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl" data-testid="text-signup-title">Create Account</CardTitle>
            <CardDescription data-testid="text-signup-description">
              Sign up to start evaluating your business plans
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4" aria-label="Create account form">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    autoComplete="given-name"
                    data-testid="input-first-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    autoComplete="family-name"
                    data-testid="input-last-name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  aria-required="true"
                  data-testid="input-email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  aria-required="true"
                  aria-describedby="password-hint"
                  data-testid="input-password"
                />
                <p id="password-hint" className="text-xs text-muted-foreground">Must be at least 8 characters</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  aria-required="true"
                  data-testid="input-confirm-password"
                />
              </div>
              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                  aria-required="true"
                  data-testid="checkbox-terms"
                />
                <label htmlFor="terms" className="text-sm text-muted-foreground leading-tight cursor-pointer">
                  I agree to the{" "}
                  <Link href="/terms">
                    <span className="text-primary hover:underline">Terms of Use</span>
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy">
                    <span className="text-primary hover:underline">Privacy Policy</span>
                  </Link>
                </label>
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSigningUp || !agreedToTerms}
                data-testid="button-signup"
              >
                {isSigningUp ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login">
                <span className="text-primary hover:underline cursor-pointer" data-testid="link-login-inline">
                  Sign in
                </span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
