import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, TrendingUp, Shield, CheckCircle } from "lucide-react";
import { Link } from "wouter";

export default function LandingPage() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg" data-testid="text-app-title">AI Shark</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/about">
              <Button variant="ghost" data-testid="link-about">
                About
              </Button>
            </Link>
            <Link href="/education">
              <Button variant="ghost" data-testid="link-education">
                Education
              </Button>
            </Link>
            <Button onClick={handleLogin} data-testid="button-login-header">
              Sign In
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4" data-testid="text-hero-title">
            AI-Powered Business Plan Assessment
          </h1>
          <p className="text-xl text-muted-foreground mb-8" data-testid="text-hero-description">
            Get instant, comprehensive analysis of your business plan against bank debt financing criteria. 
            Understand your strengths, weaknesses, and get actionable recommendations.
          </p>
          <Button size="lg" onClick={handleLogin} data-testid="button-get-started">
            Get Started
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Comprehensive Scoring</CardTitle>
              <CardDescription>
                Receive detailed scores across key criteria including creditworthiness, cash flow, and market viability.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Bank-Ready Analysis</CardTitle>
              <CardDescription>
                Evaluation based on actual bank debt financing criteria to help you prepare for loan applications.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CheckCircle className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Actionable Insights</CardTitle>
              <CardDescription>
                Get specific recommendations to improve your business plan and increase your chances of approval.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>

      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>Powered by AI for accurate, fast business plan analysis.</p>
        </div>
      </footer>
    </div>
  );
}
