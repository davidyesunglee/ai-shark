import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, BookOpen } from "lucide-react";
import { useSEO, useJsonLd, trackClick } from "@/lib/useSEO";
import { guides } from "@shared/guides";
import logoImage from "@/assets/shark-mark.svg";

export default function GuidesPage() {
  useSEO({
    title: "Business Loan & Bank Financing Guides | AI Shark",
    description:
      "Free, practical guides on getting your business plan approved for bank financing — DSCR, credit scores, collateral, debt-to-equity, and more.",
    canonical: "/guides",
  });

  useJsonLd([
    {
      id: "itemlist",
      data: {
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: guides.map((g, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: g.h1,
          url: `https://aishark.org/guides/${g.slug}`,
        })),
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
            <Link href="/education">
              <Button variant="ghost" data-testid="button-education">Learn</Button>
            </Link>
            <Link href="/signup">
              <Button data-testid="button-header-signup">Get Free Score</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main id="main-content" className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm text-muted-foreground mb-4">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Bank Financing Guides
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight" data-testid="text-guides-title">
              Guides to Getting Your Business Plan Funded
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">
              Plain-language guides on the exact criteria banks use to approve business loans. Read up,
              then check your own plan with a free instant score.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {guides.map((g) => (
              <Link key={g.slug} href={`/guides/${g.slug}`}>
                <Card
                  className="h-full hover-elevate cursor-pointer"
                  data-testid={`card-guide-${g.slug}`}
                  onClick={() => trackClick(`guide_card_${g.slug}`)}
                >
                  <CardContent className="pt-6 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="secondary">{g.category}</Badge>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                        {g.readTime}
                      </span>
                    </div>
                    <h2 className="text-lg font-semibold leading-snug">{g.h1}</h2>
                    <p className="mt-2 text-sm text-muted-foreground flex-1">{g.metaDescription}</p>
                    <span className="mt-4 inline-flex items-center text-sm font-medium text-primary">
                      Read guide
                      <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mt-12 rounded-xl border bg-primary/5 p-8 text-center">
            <h2 className="text-2xl font-semibold">Ready to check your own plan?</h2>
            <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
              Get a free headline score against the same criteria these guides cover — no account needed.
            </p>
            <Link href="/#free-preview">
              <Button size="lg" className="mt-5" data-testid="button-guides-cta" onClick={() => trackClick("guides_index_cta")}>
                Get Your Free Score
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t mt-12" role="contentinfo">
        <div className="container mx-auto px-4 py-6">
          <p className="text-xs text-muted-foreground text-center max-w-4xl mx-auto" data-testid="text-disclaimer">
            <strong>Disclaimer:</strong> AI Shark provides analytical perspectives on business plan
            documentation and data for informational purposes only. Always consult with qualified
            financial professionals before making funding decisions. For questions, contact{" "}
            <a href="mailto:info@aishark.org" className="underline hover:text-foreground">info@aishark.org</a>.
          </p>
        </div>
      </footer>
    </div>
  );
}
