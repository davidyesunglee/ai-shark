import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, TrendingUp, Shield, CheckCircle, Clock, Users, Award, ArrowRight, Zap } from "lucide-react";
import { Link } from "wouter";
import { AdPlacement } from "@/components/AdPlacement";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg" data-testid="text-app-title">AI Shark</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
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
            <Link href="/pricing">
              <Button variant="ghost" data-testid="link-pricing">
                Pricing
              </Button>
            </Link>
            <Link href="/login">
              <Button data-testid="button-login-header">Sign In</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <Zap className="h-3 w-3 mr-1" />
              AI-Powered Analysis
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6" data-testid="text-hero-title">
              Know Your Business Plan Score
              <span className="text-primary block mt-2">Before the Bank Does</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto" data-testid="text-hero-description">
              Get instant AI analysis of your business plan against real bank debt financing criteria. 
              Discover strengths, fix weaknesses, and increase your approval chances.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/signup">
                <Button size="lg" className="gap-2" data-testid="button-get-started">
                  Get Your Score Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" data-testid="button-view-pricing">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-center text-muted-foreground mb-16">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>Results in minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span>Bank-grade criteria</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              <span>Actionable insights</span>
            </div>
          </div>
        </section>

        <section className="bg-muted/50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Three simple steps to understand your business plan's financing potential
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="font-semibold text-lg mb-2">Upload Your Plan</h3>
                <p className="text-muted-foreground">
                  Upload your business plan in PDF, DOCX, or TXT format. We support files up to 10MB.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="font-semibold text-lg mb-2">AI Analysis</h3>
                <p className="text-muted-foreground">
                  Our AI evaluates your plan against 8 key bank financing criteria used by lenders.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="font-semibold text-lg mb-2">Get Your Report</h3>
                <p className="text-muted-foreground">
                  Receive detailed scores, strengths, weaknesses, and specific recommendations.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-4">What We Evaluate</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Comprehensive analysis across the criteria banks actually use
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Financial Viability</CardTitle>
                <CardDescription>
                  Cash flow projections, revenue models, and financial sustainability analysis.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Creditworthiness</CardTitle>
                <CardDescription>
                  Debt capacity, collateral assessment, and repayment capability evaluation.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CheckCircle className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Market Position</CardTitle>
                <CardDescription>
                  Industry analysis, competitive landscape, and market opportunity assessment.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Management Team</CardTitle>
                <CardDescription>
                  Leadership experience, expertise, and team capability evaluation.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Award className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Business Model</CardTitle>
                <CardDescription>
                  Revenue strategy, scalability, and long-term growth potential.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <FileText className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Plan Quality</CardTitle>
                <CardDescription>
                  Completeness, clarity, and professional presentation of your plan.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Know Your Score?</h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join businesses using AI Shark to improve their financing outcomes.
            </p>
            <Link href="/signup">
              <Button size="lg" variant="outline" className="gap-2 bg-background/10 backdrop-blur border-primary-foreground/20 text-primary-foreground hover:bg-background/20" data-testid="button-cta-bottom">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center mb-6">
            <AdPlacement slot="footer" className="hidden md:flex" />
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-semibold">AI Shark</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm text-muted-foreground">
              <Link href="/about">
                <span className="hover:text-foreground transition-colors cursor-pointer" data-testid="link-footer-about">About</span>
              </Link>
              <Link href="/education">
                <span className="hover:text-foreground transition-colors cursor-pointer" data-testid="link-footer-education">Education</span>
              </Link>
              <Link href="/pricing">
                <span className="hover:text-foreground transition-colors cursor-pointer" data-testid="link-footer-pricing">Pricing</span>
              </Link>
              <Link href="/privacy">
                <span className="hover:text-foreground transition-colors cursor-pointer" data-testid="link-footer-privacy">Privacy Policy</span>
              </Link>
              <Link href="/terms">
                <span className="hover:text-foreground transition-colors cursor-pointer" data-testid="link-footer-terms">Terms of Service</span>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              Powered by AI for accurate, fast analysis.
            </p>
          </div>
          <div className="border-t pt-6">
            <p className="text-xs text-muted-foreground text-center max-w-4xl mx-auto" data-testid="text-disclaimer">
              <strong>Disclaimer:</strong> AI Shark provides analytical perspectives on business plan documentation and data for informational purposes only. Results do not imply any expectation of positive or negative outcomes from banking or financial institutions. Our assessments are not to be construed as a decision to fund or not fund any business. Always consult with qualified financial professionals before making funding decisions.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
