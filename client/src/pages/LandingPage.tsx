import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TrendingUp, Shield, Clock, Users, Award, ArrowRight, Zap, FileText, Landmark, Scale, Target, BarChart3, CircleDollarSign, ShieldAlert, Trophy } from "lucide-react";
import { Link } from "wouter";
import { AdPlacement } from "@/components/AdPlacement";
import { TeaserWidget } from "@/components/TeaserWidget";
import logoImage from "@/assets/shark-mark.svg";
import mascotImage from "@/assets/shark-mascot.png";
import HowItWorksExplainer from "@/components/HowItWorksExplainer";
import { useSEO, trackClick } from "@/lib/useSEO";

export default function LandingPage() {
  useSEO({
    title: "AI Shark — AI Business Plan Assessment for Bank Loans & SBA Financing",
    description: "Score your business plan against the 10 criteria banks use for loan approval. Get a Lender Readiness Grade (A–F), SWOT, market analysis, and 6 financial ratios in minutes — from $13.99.",
    canonical: "/",
  });
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
            <img
              src={mascotImage}
              alt="AI Shark mascot reading a business plan"
              className="h-40 w-40 mx-auto mb-4 object-contain"
              data-testid="img-hero-mascot"
            />
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
              <a href="#free-preview">
                <Button size="lg" className="gap-2" data-testid="button-get-started" onClick={() => trackClick("hero_get_started")}>
                  Get Your Free Score
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </a>
              <Link href="/pricing">
                <Button size="lg" variant="outline" data-testid="button-view-pricing" onClick={() => trackClick("hero_view_pricing")}>
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>

          <div id="free-preview" className="scroll-mt-24 max-w-4xl mx-auto mb-4">
            <div className="text-center mb-6">
              <Badge variant="secondary" className="mb-3">
                <Zap className="h-3 w-3 mr-1" aria-hidden="true" />
                Free instant preview
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold mb-2" data-testid="text-teaser-title">
                Score your plan free — right now
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Upload your business plan and get your overall score, Lender Readiness Grade, and top
                weaknesses in under a minute. No account required.
              </p>
            </div>
            <TeaserWidget />
            <p className="text-center text-sm text-muted-foreground mt-4">
              Curious what the full report looks like?{" "}
              <Link href="/sample" className="font-medium text-primary underline underline-offset-2 hover:text-primary/80" data-testid="link-sample-teaser" onClick={() => trackClick("teaser_view_sample")}>
                View a sample report
              </Link>
            </p>
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
            
            <HowItWorksExplainer />
          </div>
        </section>

        <section className="container mx-auto px-4 py-16" aria-labelledby="evaluation-criteria-title">
          <h2 id="evaluation-criteria-title" className="text-3xl font-bold text-center mb-4">The 10 Criteria We Evaluate</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Your plan is scored against the same 10 factors banks weigh for debt financing
          </p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Shield, title: "Creditworthiness & Credit History", desc: "Credit history, borrowing track record, and repayment reliability." },
              { icon: TrendingUp, title: "Cash Flow & Debt Service Coverage", desc: "Whether your cash flow comfortably covers loan payments (DSCR)." },
              { icon: Landmark, title: "Collateral & Asset Base", desc: "Assets available to secure the loan and reduce lender risk." },
              { icon: Scale, title: "Debt-to-Equity & Capital Structure", desc: "How your existing debt and owner investment balance out." },
              { icon: Target, title: "Market Viability & Demand", desc: "Real demand, market size, and growth potential for your offering." },
              { icon: Users, title: "Management Team & Experience", desc: "Leadership track record and the team's ability to execute." },
              { icon: BarChart3, title: "Financial Projections & Assumptions", desc: "How realistic and well-supported your forecasts are." },
              { icon: CircleDollarSign, title: "Revenue Model & Profitability", desc: "How you make money and your path to sustained profit." },
              { icon: ShieldAlert, title: "Industry & Regulatory Risk", desc: "Industry headwinds and regulatory factors lenders weigh." },
              { icon: Trophy, title: "Competitive Position & Differentiation", desc: "What sets you apart and protects you from competitors." },
            ].map((c, i) => {
              const Icon = c.icon;
              return (
                <Card key={i} data-testid={`card-criteria-${i}`}>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold" aria-hidden="true">
                        {i + 1}
                      </div>
                      <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-lg">{c.title}</CardTitle>
                    <CardDescription>{c.desc}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="bg-muted/50 py-16" aria-labelledby="testimonials-title">
          <div className="container mx-auto px-4">
            <h2 id="testimonials-title" className="text-3xl font-bold text-center mb-4">Built to Think Like a Lender</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              AI Shark reviews your plan the way a bank would — so you can fix the gaps that matter before you apply.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto" role="list">
              {[
                {
                  icon: Landmark,
                  title: "Real bank criteria",
                  body: "Scored against the same 10 debt-financing factors lenders actually weigh.",
                },
                {
                  icon: Clock,
                  title: "Results in minutes",
                  body: "Upload your plan and get a full breakdown in under a minute — no account needed to start.",
                },
                {
                  icon: Shield,
                  title: "Private & secure",
                  body: "Your plan is stored securely and never shared with third parties.",
                },
                {
                  icon: CircleDollarSign,
                  title: "A fraction of a consultant",
                  body: "The depth of a paid review, starting at just $13.99 per report.",
                },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <Card key={i} role="listitem" data-testid={`card-trust-${i}`} className="text-center">
                    <CardHeader>
                      <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                      </div>
                      <p className="font-semibold text-sm mb-1" data-testid={`text-trust-title-${i}`}>{item.title}</p>
                      <p className="text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>

            <div className="max-w-5xl mx-auto mt-14">
              <h3 className="text-xl font-bold text-center mb-2">What AI Shark Catches</h3>
              <p className="text-center text-sm text-muted-foreground mb-8 max-w-2xl mx-auto">
                Illustrative examples of the kinds of issues the analysis flags in a business plan.
              </p>
              <div className="grid sm:grid-cols-3 gap-6" role="list">
                {[
                  {
                    icon: BarChart3,
                    label: "Cash Flow",
                    body: "A debt-service coverage ratio below 1.25× — a common lender concern.",
                  },
                  {
                    icon: Scale,
                    label: "Capital Structure",
                    body: "A debt-to-equity ratio that signals the business is over-leveraged.",
                  },
                  {
                    icon: Target,
                    label: "Projections",
                    body: "Revenue forecasts with assumptions that lack supporting evidence.",
                  },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} role="listitem" className="flex gap-3 text-left" data-testid={`example-finding-${i}`}>
                      <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm mb-1">{item.label}</p>
                        <p className="text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="text-center mt-10">
              <Link href="/sample">
                <Button variant="outline" size="lg" className="gap-2" data-testid="button-view-sample" onClick={() => trackClick("testimonials_view_sample")}>
                  <FileText className="h-4 w-4" aria-hidden="true" />
                  See a Full Sample Report
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16" aria-labelledby="faq-title">
          <h2 id="faq-title" className="text-3xl font-bold text-center mb-4">Frequently Asked Questions</h2>
          <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
            Everything you need to know before you get your score.
          </p>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {[
                {
                  q: "How does AI Shark assess my business plan?",
                  a: "AI Shark uses Gemini AI to analyze your business plan across 10 criteria that commercial bank loan officers use: creditworthiness, cash flow, collateral, debt-to-equity, market viability, management team, financial projections, revenue model, industry risk, and competitive position. You receive an overall score (0–100), a lender readiness grade (A–F), SWOT analysis, market analysis, six key financial ratios, strengths, weaknesses, and actionable recommendations.",
                },
                {
                  q: "What file types can I upload?",
                  a: "You can upload PDF, DOCX, or TXT files up to 10 MB. Most banks and SBA lenders prefer PDF format for business plans.",
                },
                {
                  q: "How much does AI Shark cost?",
                  a: "A one-time assessment costs $13.99. A monthly subscription costs $6.99 per month and includes two business plan evaluations per month. Both options give you full access to the lender readiness grade, SWOT analysis, financial ratios, and PDF export.",
                },
                {
                  q: "What is a lender readiness grade?",
                  a: "The Lender Readiness Grade is a letter grade (A through F) that summarizes how prepared your business plan is for bank debt financing. Grade A indicates an exceptional candidate where bank approval is highly likely, while Grade F indicates significant gaps that would prevent debt financing approval.",
                },
                {
                  q: "Will using AI Shark guarantee a bank loan approval?",
                  a: "No. AI Shark provides analytical perspectives on your business plan for informational purposes only. The assessment does not imply any expectation of positive or negative outcomes from banking institutions and is not a guarantee of funding. Always consult with qualified financial professionals before making funding decisions.",
                },
              ].map((item, i) => (
                <AccordionItem key={i} value={`faq-${i}`} data-testid={`faq-item-${i}`}>
                  <AccordionTrigger className="text-left" data-testid={`faq-question-${i}`}>{item.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed" data-testid={`faq-answer-${i}`}>
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="bg-primary text-primary-foreground py-16" aria-labelledby="cta-title">
          <div className="container mx-auto px-4 text-center">
            <h2 id="cta-title" className="text-3xl font-bold mb-4">Ready to Know Your Score?</h2>
            <p className="text-xl opacity-90 mb-3 max-w-2xl mx-auto">
              Join businesses using AI Shark to improve their financing outcomes.
            </p>
            <p className="opacity-90 mb-8 max-w-2xl mx-auto" data-testid="text-cta-pricing">
              Full reports from just <span className="font-semibold">$13.99</span> — or <span className="font-semibold">$6.99/mo</span> for 2 evaluations every month.
            </p>
            <Link href="/signup">
              <Button size="lg" variant="outline" className="gap-2 bg-background/10 backdrop-blur border-primary-foreground/20 text-primary-foreground hover:bg-background/20" data-testid="button-cta-bottom" onClick={() => trackClick("bottom_cta_get_started")}>
                Get Started
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur p-3 pr-20 md:hidden" data-testid="sticky-cta-mobile">
        <a href="#free-preview" className="block">
          <Button size="lg" className="w-full gap-2" data-testid="button-sticky-get-started" onClick={() => trackClick("sticky_get_started")}>
            Get Your Free Score
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </a>
      </div>

      <footer className="border-t" role="contentinfo">
        <div className="container mx-auto px-4 pt-8 pb-28 md:pb-8">
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
                <Link href="/guides">
                  <span className="hover:text-foreground transition-colors cursor-pointer" data-testid="link-footer-guides">Guides</span>
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
              <strong>Disclaimer:</strong> AI Shark provides analytical perspectives on business plan documentation and data for informational purposes only. Results do not imply any expectation of positive or negative outcomes from banking or financial institutions. Our assessments are not to be construed as a decision to fund or not fund any business. Always consult with qualified financial professionals before making funding decisions. For questions or assistance, contact us at{" "}<a href="mailto:info@aishark.org" className="underline hover:text-foreground" data-testid="link-contact-email">info@aishark.org</a>.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
