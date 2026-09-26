import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";
import { useSEO, useJsonLd, trackClick } from "@/lib/useSEO";
import { glossaryTerms } from "@shared/glossary";
import logoImage from "@/assets/shark-mark.svg";

export default function GlossaryPage() {
  useSEO({
    title: "Bank Lending Terms Glossary, in Plain English | AI Shark",
    description:
      "Plain-English definitions of the bank lending terms every business borrower should know — DSCR, collateral, covenants, personal guarantees, SBA programs, and more.",
    canonical: "/glossary",
  });

  useJsonLd([
    {
      id: "glossary-terms",
      data: {
        "@context": "https://schema.org",
        "@type": "DefinedTermSet",
        name: "Bank Lending Terms Glossary",
        url: "https://aishark.org/glossary",
        description:
          "Plain-English definitions of the bank lending terms every business borrower should know.",
        hasDefinedTerm: glossaryTerms.map((t) => ({
          "@type": "DefinedTerm",
          name: t.term,
          description: t.definition,
        })),
      },
    },
    {
      id: "glossary-breadcrumbs",
      data: {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://aishark.org/" },
          { "@type": "ListItem", position: 2, name: "Lending Glossary", item: "https://aishark.org/glossary" },
        ],
      },
    },
  ]);

  // Group terms by first letter for scannable A–Z sections.
  const groups = glossaryTerms.reduce<Record<string, typeof glossaryTerms>>((acc, t) => {
    const letter = t.term[0].toUpperCase();
    (acc[letter] ||= []).push(t);
    return acc;
  }, {});
  const letters = Object.keys(groups).sort();

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
            <Link href="/guides">
              <Button variant="ghost" data-testid="button-guides">Guides</Button>
            </Link>
            <Link href="/signup">
              <Button data-testid="button-header-signup">Get Free Score</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main id="main-content" className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm text-muted-foreground mb-4">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Free Reference
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight" data-testid="text-glossary-title">
              Bank Lending Terms, in Plain English
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">
              The {glossaryTerms.length} terms you'll actually encounter when applying for a business
              loan — defined the way a lender uses them, without the jargon.
            </p>
          </div>

          <nav aria-label="Jump to letter" className="flex flex-wrap justify-center gap-1.5 mb-10">
            {letters.map((l) => (
              <a
                key={l}
                href={`#letter-${l}`}
                className="w-8 h-8 flex items-center justify-center rounded-md border text-sm font-medium hover:bg-muted transition-colors"
                data-testid={`link-letter-${l}`}
              >
                {l}
              </a>
            ))}
          </nav>

          <div className="space-y-10">
            {letters.map((l) => (
              <section key={l} id={`letter-${l}`} aria-labelledby={`heading-${l}`} className="scroll-mt-24">
                <h2 id={`heading-${l}`} className="text-xl font-bold text-primary border-b pb-2 mb-4">
                  {l}
                </h2>
                <dl className="space-y-5">
                  {groups[l].map((t) => (
                    <div key={t.term}>
                      <dt className="font-semibold" data-testid={`term-${t.term.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
                        {t.term}
                      </dt>
                      <dd className="text-muted-foreground mt-0.5">{t.definition}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </div>

          <div className="mt-14 rounded-xl border bg-primary/5 p-8 text-center">
            <h2 className="text-2xl font-semibold">Know the terms. Now pass the test.</h2>
            <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
              Upload your business plan and get a free instant score across the 10 criteria banks
              actually use — including the ratios defined above.
            </p>
            <Link href="/#free-preview">
              <Button size="lg" className="mt-5" data-testid="button-glossary-cta" onClick={() => trackClick("glossary_cta")}>
                Get Your Free Score
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t mt-12" role="contentinfo">
        <div className="container mx-auto px-4 py-6">
          <p className="text-xs text-muted-foreground text-center max-w-4xl mx-auto">
            This glossary is for informational purposes only and does not constitute financial or
            legal advice. For questions, contact{" "}
            <a href="mailto:info@aishark.org" className="underline hover:text-foreground">info@aishark.org</a>.
          </p>
        </div>
      </footer>
    </div>
  );
}
