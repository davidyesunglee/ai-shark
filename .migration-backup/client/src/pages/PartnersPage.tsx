import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Handshake, ClipboardCheck, Clock, FileText, Users } from "lucide-react";
import { useSEO, useJsonLd, trackClick } from "@/lib/useSEO";
import logoImage from "@/assets/shark-mark.svg";

const audiences = [
  {
    icon: Users,
    title: "SCORE Mentors & SBDC Advisors",
    body: "Give every client an objective, bank-style readiness score before their lender meeting. Spend your sessions fixing weaknesses instead of finding them.",
  },
  {
    icon: FileText,
    title: "CPAs & Accountants",
    body: "When a client asks 'can I get this loan?', hand them an answer grounded in the same ratios the bank will run — DSCR, leverage, liquidity — pulled from their own plan.",
  },
  {
    icon: ClipboardCheck,
    title: "Fractional CFOs & Consultants",
    body: "Use the assessment as a deliverable: a scored, criteria-by-criteria report you can review with the client and re-run after each improvement.",
  },
];

const benefits = [
  {
    icon: Clock,
    title: "Save session time",
    body: "The 10-criteria score surfaces the weak points in minutes, so your first meeting starts at the fix, not the diagnosis.",
  },
  {
    icon: ClipboardCheck,
    title: "Bank-aligned criteria",
    body: "The assessment scores the same factors lenders underwrite — cash flow coverage, collateral, credit readiness, equity, and realistic projections.",
  },
  {
    icon: Handshake,
    title: "Free for your clients to start",
    body: "Clients get an instant free score with no account required, so there's no cost barrier to your recommendation.",
  },
];

export default function PartnersPage() {
  useSEO({
    title: "Partner with AI Shark — For SCORE Mentors, SBDCs, CPAs & CFOs | AI Shark",
    description:
      "Advise small business owners on funding? Give your clients an instant, bank-style business plan score. Partner with AI Shark: free client assessments, co-branded options, and referral partnerships.",
    canonical: "/partners",
  });

  useJsonLd([
    {
      id: "partners-breadcrumbs",
      data: {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://aishark.org/" },
          { "@type": "ListItem", position: 2, name: "Partners", item: "https://aishark.org/partners" },
        ],
      },
    },
  ]);

  return (
    <div className="min-h-screen bg-background">
      <a href="#main-content" className="skip-to-content">Skip to main content</a>
      <header className="border-b" role="banner">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <img src={logoImage} alt="AI Shark Logo" className="h-8 w-auto" data-testid="img-logo" />
              <span className="font-semibold text-lg" data-testid="text-app-title">AI Shark</span>
            </div>
          </Link>
          <nav aria-label="Main navigation" className="flex items-center gap-2">
            <Link href="/sample">
              <Button variant="ghost" data-testid="button-sample">Sample Report</Button>
            </Link>
            <a href="mailto:info@aishark.org?subject=Partnership%20Inquiry">
              <Button data-testid="button-header-partner">Become a Partner</Button>
            </a>
          </nav>
        </div>
      </header>

      <main id="main-content" className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm text-muted-foreground mb-4">
              <Handshake className="h-4 w-4" aria-hidden="true" />
              For Advisors
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight" data-testid="text-partners-title">
              You Advise Them. We Score Them Like a Bank Would.
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">
              AI Shark gives the business owners you advise an instant, objective assessment of
              their business plan against the 10 criteria lenders actually use — so your guidance
              lands on a foundation of hard numbers.
            </p>
          </div>

          <h2 className="text-2xl font-semibold text-center mb-6">Built for the people founders trust</h2>
          <div className="grid gap-6 md:grid-cols-3 mb-14">
            {audiences.map((a) => (
              <Card key={a.title}>
                <CardContent className="pt-6">
                  <a.icon className="h-8 w-8 text-primary mb-3" aria-hidden="true" />
                  <h3 className="font-semibold mb-2">{a.title}</h3>
                  <p className="text-sm text-muted-foreground">{a.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <h2 className="text-2xl font-semibold text-center mb-6">Why advisors use AI Shark</h2>
          <div className="grid gap-6 md:grid-cols-3 mb-14">
            {benefits.map((b) => (
              <Card key={b.title}>
                <CardContent className="pt-6">
                  <b.icon className="h-8 w-8 text-primary mb-3" aria-hidden="true" />
                  <h3 className="font-semibold mb-2">{b.title}</h3>
                  <p className="text-sm text-muted-foreground">{b.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="rounded-xl border p-8 mb-14">
            <h2 className="text-2xl font-semibold mb-4">How a partnership works</h2>
            <ol className="space-y-3 list-decimal list-inside text-muted-foreground">
              <li>
                <span className="text-foreground font-medium">Try it yourself first.</span>{" "}
                Run a plan through the free assessment and review the{" "}
                <Link href="/sample"><span className="underline cursor-pointer hover:text-foreground">sample report</span></Link>{" "}
                so you know exactly what your clients will see.
              </li>
              <li>
                <span className="text-foreground font-medium">Refer clients your way.</span>{" "}
                Share the free score with clients before lender meetings — no account or payment
                required for the initial assessment.
              </li>
              <li>
                <span className="text-foreground font-medium">Talk to us about going deeper.</span>{" "}
                We work with select advisors on referral arrangements and co-branded experiences
                for their client base.
              </li>
            </ol>
          </div>

          <div className="rounded-xl border bg-primary/5 p-8 text-center">
            <h2 className="text-2xl font-semibold">Let's talk partnership</h2>
            <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
              Tell us about your practice and the clients you serve. We'll follow up within two
              business days.
            </p>
            <a href="mailto:info@aishark.org?subject=Partnership%20Inquiry">
              <Button size="lg" className="mt-5" data-testid="button-partners-cta" onClick={() => trackClick("partners_cta")}>
                Contact Us About Partnering
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </a>
          </div>
        </div>
      </main>

      <footer className="border-t mt-12" role="contentinfo">
        <div className="container mx-auto px-4 py-6">
          <p className="text-xs text-muted-foreground text-center max-w-4xl mx-auto">
            AI Shark provides automated business plan assessments for informational purposes and does
            not guarantee funding outcomes. For questions, contact{" "}
            <a href="mailto:info@aishark.org" className="underline hover:text-foreground">info@aishark.org</a>.
          </p>
        </div>
      </footer>
    </div>
  );
}
