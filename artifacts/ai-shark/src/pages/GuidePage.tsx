import { Link, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Clock, CheckCircle2, FileText } from "lucide-react";
import { useSEO, useJsonLd, trackClick } from "@/lib/useSEO";
import { getGuide, guides } from "@shared/guides";
import logoImage from "@/assets/shark-mark.svg";
import NotFound from "@/pages/not-found";

export default function GuidePage() {
  const [, params] = useRoute("/guides/:slug");
  const guide = params?.slug ? getGuide(params.slug) : undefined;

  const canonical = guide ? `/guides/${guide.slug}` : "/guides";
  const url = `https://aishark.org${canonical}`;

  useSEO({
    title: guide?.title ?? "Guide Not Found | AI Shark",
    description: guide?.metaDescription,
    canonical,
    noindex: !guide,
  });

  useJsonLd(
    guide
      ? [
          {
            id: "article",
            data: {
              "@context": "https://schema.org",
              "@type": "Article",
              headline: guide.h1,
              description: guide.metaDescription,
              author: { "@type": "Organization", name: "AI Shark" },
              publisher: {
                "@type": "Organization",
                name: "AI Shark",
                logo: { "@type": "ImageObject", url: "https://aishark.org/favicon.png" },
              },
              mainEntityOfPage: { "@type": "WebPage", "@id": url },
            },
          },
          {
            id: "faq",
            data: {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: guide.faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          },
          {
            id: "breadcrumb",
            data: {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Guides", item: "https://aishark.org/guides" },
                { "@type": "ListItem", position: 2, name: guide.h1, item: url },
              ],
            },
          },
        ]
      : [],
  );

  if (!guide) {
    return <NotFound />;
  }

  const sameCategory = guides.filter((g) => g.slug !== guide.slug && g.category === guide.category);
  const otherCategory = guides.filter((g) => g.slug !== guide.slug && g.category !== guide.category);
  const related = [...sameCategory, ...otherCategory].slice(0, 3);

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
              <Button variant="ghost" data-testid="button-all-guides">All Guides</Button>
            </Link>
            <Link href="/sign-up">
              <Button data-testid="button-header-signup">Get Free Score</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main id="main-content" className="container mx-auto px-4 py-12">
        <article className="max-w-3xl mx-auto">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
            <Link href="/guides" className="hover:text-foreground">Guides</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="text-foreground">{guide.category}</span>
          </nav>

          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge variant="secondary">{guide.category}</Badge>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" aria-hidden="true" />
                {guide.readTime}
              </span>
              <span className="text-sm text-muted-foreground">Updated {guide.updated}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight" data-testid="text-guide-title">
              {guide.h1}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground" data-testid="text-guide-intro">
              {guide.intro}
            </p>
          </div>

          <div className="my-8 rounded-xl border bg-primary/5 p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <p className="text-sm font-medium">
              Want to see how your plan scores on this? Get a free instant score — no account needed.
            </p>
            <Link href="/#free-preview">
              <Button className="whitespace-nowrap" data-testid="button-guide-cta-top" onClick={() => trackClick(`guide_cta_top_${guide.slug}`)}>
                Get Your Free Score
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>

          <div className="space-y-10">
            {guide.sections.map((section, i) => (
              <section key={i} aria-labelledby={`section-${i}`}>
                <h2 id={`section-${i}`} className="text-2xl font-semibold mb-3">{section.heading}</h2>
                {section.paragraphs?.map((p, j) => (
                  <p key={j} className="text-base leading-relaxed text-muted-foreground mb-3">{p}</p>
                ))}
                {section.bullets && (
                  <ul className="space-y-2 mt-3">
                    {section.bullets.map((b, j) => (
                      <li key={j} className="flex items-start gap-2 text-muted-foreground">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <section aria-labelledby="faq-heading" className="mt-12">
            <h2 id="faq-heading" className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {guide.faqs.map((f, i) => (
                <Card key={i} data-testid={`card-faq-${i}`}>
                  <CardContent className="pt-5">
                    <h3 className="font-semibold mb-1">{f.q}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{f.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <div className="mt-12 rounded-xl border bg-primary/5 p-8 text-center">
            <h2 className="text-2xl font-semibold">See where your plan stands</h2>
            <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
              AI Shark scores your business plan against the exact criteria lenders use — free headline
              score in under a minute.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link href="/#free-preview">
                <Button size="lg" data-testid="button-guide-cta-bottom" onClick={() => trackClick(`guide_cta_bottom_${guide.slug}`)}>
                  Get Your Free Score
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
              <Link href="/sample">
                <Button size="lg" variant="outline" data-testid="button-guide-sample">
                  <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
                  View a Sample Report
                </Button>
              </Link>
            </div>
          </div>

          <section aria-labelledby="related-heading" className="mt-14">
            <h2 id="related-heading" className="text-xl font-semibold mb-4">Related Guides</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {related.map((g) => (
                <Link key={g.slug} href={`/guides/${g.slug}`}>
                  <Card className="h-full hover-elevate cursor-pointer" data-testid={`card-related-${g.slug}`}>
                    <CardContent className="pt-5">
                      <Badge variant="secondary" className="mb-2">{g.category}</Badge>
                      <h3 className="font-semibold text-sm leading-snug">{g.h1}</h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        </article>
      </main>

      <footer className="border-t mt-12" role="contentinfo">
        <div className="container mx-auto px-4 py-6">
          <p className="text-xs text-muted-foreground text-center max-w-4xl mx-auto" data-testid="text-disclaimer">
            <strong>Disclaimer:</strong> AI Shark provides analytical perspectives on business plan
            documentation and data for informational purposes only. Results do not imply any expectation
            of positive or negative outcomes from banking or financial institutions. Our assessments are
            not to be construed as a decision to fund or not fund any business. Always consult with
            qualified financial professionals before making funding decisions. For questions, contact{" "}
            <a href="mailto:info@aishark.org" className="underline hover:text-foreground">info@aishark.org</a>.
          </p>
        </div>
      </footer>
    </div>
  );
}
