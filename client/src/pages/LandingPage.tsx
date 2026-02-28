import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Shield, CheckCircle, Clock, Users, Award, ArrowRight, Zap, FileText } from "lucide-react";
import { Link } from "wouter";
import { AdPlacement } from "@/components/AdPlacement";
import logoImage from "@assets/AI_Shark_logo_1770083549283.png";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50" role="banner">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={logoImage} alt="AI Shark Logo" className="h-10 w-auto" data-testid="img-logo" />
            <span className="font-semibold text-lg hidden sm:inline" data-testid="text-app-title">AI Shark</span>
          </div>
          <nav aria-label="Main navigation">
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
          </nav>
        </div>
      </header>

      <main id="main-content">
        <section className="container mx-auto px-4 py-20" aria-labelledby="hero-title">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <Zap className="h-3 w-3 mr-1" aria-hidden="true" />
              AI-Powered Analysis
            </Badge>
            <h1 id="hero-title" className="text-4xl md:text-5xl font-bold tracking-tight mb-6" data-testid="text-hero-title">
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
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" data-testid="button-view-pricing">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-center text-muted-foreground mb-16" role="list" aria-label="Key benefits">
            <div className="flex items-center gap-2" role="listitem">
              <Clock className="h-5 w-5 text-primary" aria-hidden="true" />
              <span>Results in minutes</span>
            </div>
            <div className="flex items-center gap-2" role="listitem">
              <Shield className="h-5 w-5 text-primary" aria-hidden="true" />
              <span>Bank-grade criteria</span>
            </div>
            <div className="flex items-center gap-2" role="listitem">
              <Award className="h-5 w-5 text-primary" aria-hidden="true" />
              <span>Actionable insights</span>
            </div>
          </div>
        </section>

        <section className="bg-muted/50 py-16" aria-labelledby="how-it-works-title">
          <div className="container mx-auto px-4">
            <h2 id="how-it-works-title" className="text-3xl font-bold text-center mb-4">How It Works</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Three simple steps to understand your business plan's financing potential
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto" role="list">
              <div className="text-center" role="listitem">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4" aria-hidden="true">
                  1
                </div>
                <h3 className="font-semibold text-lg mb-2">Upload Your Plan</h3>
                <p className="text-muted-foreground">
                  Upload your business plan in PDF, DOCX, or TXT format. We support files up to 10MB.
                </p>
              </div>
              
              <div className="text-center" role="listitem">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4" aria-hidden="true">
                  2
                </div>
                <h3 className="font-semibold text-lg mb-2">AI Analysis</h3>
                <p className="text-muted-foreground">
                  Our AI evaluates your plan against 8 key bank financing criteria used by lenders.
                </p>
              </div>
              
              <div className="text-center" role="listitem">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4" aria-hidden="true">
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

        <section className="container mx-auto px-4 py-16" aria-labelledby="evaluation-criteria-title">
          <h2 id="evaluation-criteria-title" className="text-3xl font-bold text-center mb-4">What We Evaluate</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Comprehensive analysis across the criteria banks actually use
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-primary mb-2" aria-hidden="true" />
                <CardTitle>Financial Viability</CardTitle>
                <CardDescription>
                  Cash flow projections, revenue models, and financial sustainability analysis.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-2" aria-hidden="true" />
                <CardTitle>Creditworthiness</CardTitle>
                <CardDescription>
                  Debt capacity, collateral assessment, and repayment capability evaluation.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CheckCircle className="h-10 w-10 text-primary mb-2" aria-hidden="true" />
                <CardTitle>Market Position</CardTitle>
                <CardDescription>
                  Industry analysis, competitive landscape, and market opportunity assessment.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-2" aria-hidden="true" />
                <CardTitle>Management Team</CardTitle>
                <CardDescription>
                  Leadership experience, expertise, and team capability evaluation.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Award className="h-10 w-10 text-primary mb-2" aria-hidden="true" />
                <CardTitle>Business Model</CardTitle>
                <CardDescription>
                  Revenue strategy, scalability, and long-term growth potential.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <FileText className="h-10 w-10 text-primary mb-2" aria-hidden="true" />
                <CardTitle>Plan Quality</CardTitle>
                <CardDescription>
                  Completeness, clarity, and professional presentation of your plan.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        <section className="bg-primary text-primary-foreground py-16" aria-labelledby="cta-title">
          <div className="container mx-auto px-4 text-center">
            <h2 id="cta-title" className="text-3xl font-bold mb-4">Ready to Know Your Score?</h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join businesses using AI Shark to improve their financing outcomes.
            </p>
            <Link href="/signup">
              <Button size="lg" variant="outline" className="gap-2 bg-background/10 backdrop-blur border-primary-foreground/20 text-primary-foreground hover:bg-background/20" data-testid="button-cta-bottom">
                Get Started
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t" role="contentinfo">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center mb-6">
            <AdPlacement slot="footer" className="hidden md:flex" />
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <img src={logoImage} alt="AI Shark Logo" className="h-8 w-auto" data-testid="img-footer-logo" />
              <span className="font-semibold">AI Shark</span>
            </div>
            <nav aria-label="Footer navigation">
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
                <Link href="/contact">
                  <span className="hover:text-foreground transition-colors cursor-pointer" data-testid="link-footer-contact">Contact</span>
                </Link>
              </div>
            </nav>
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
