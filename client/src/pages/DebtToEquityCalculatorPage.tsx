import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Scale } from "lucide-react";
import { useSEO, useJsonLd, trackClick } from "@/lib/useSEO";
import logoImage from "@/assets/shark-mark.svg";

function parseNum(v: string): number {
  // Preserve a leading minus so negative equity is detected, not silently flipped positive.
  const cleaned = v.trim().replace(/[^0-9.\-]/g, "");
  const sign = cleaned.startsWith("-") ? -1 : 1;
  const n = parseFloat(cleaned.replace(/-/g, ""));
  return Number.isFinite(n) ? sign * n : 0;
}

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function DebtToEquityCalculatorPage() {
  useSEO({
    title: "Free Debt-to-Equity Ratio Calculator for Business Loans | AI Shark",
    description:
      "Calculate your business's debt-to-equity ratio and see how banks read it. Free instant results with the 2:1 lender benchmark and the maximum debt you can add before leverage becomes a problem.",
    canonical: "/debt-to-equity-calculator",
  });

  useJsonLd([
    {
      id: "dte-calculator-app",
      data: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Debt-to-Equity Ratio Calculator",
        url: "https://aishark.org/debt-to-equity-calculator",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        description:
          "Free debt-to-equity ratio calculator for business borrowers, with the leverage benchmarks banks use in underwriting.",
      },
    },
  ]);

  const [liabilities, setLiabilities] = useState("200000");
  const [equity, setEquity] = useState("150000");
  const [newDebt, setNewDebt] = useState("0");

  const results = useMemo(() => {
    const totalLiabilities = parseNum(liabilities);
    const ownerEquity = parseNum(equity);
    const proposed = parseNum(newDebt);

    const current = ownerEquity > 0 ? totalLiabilities / ownerEquity : null;
    const afterLoan = ownerEquity > 0 ? (totalLiabilities + proposed) / ownerEquity : null;
    // Max total debt at a 2:1 ratio (the level most banks prefer to stay under), minus existing.
    const maxAdditional = Math.max(0, ownerEquity * 2 - totalLiabilities);

    return { current, afterLoan, maxAdditional, hasEquity: ownerEquity > 0 };
  }, [liabilities, equity, newDebt]);

  const ratio = results.afterLoan;
  const status =
    ratio === null
      ? null
      : ratio <= 1
        ? { label: "Conservative", color: "text-green-600 dark:text-green-500", note: "Low leverage. Banks read this as a well-capitalized business with room to borrow." }
        : ratio <= 2
          ? { label: "Acceptable", color: "text-primary", note: "Within the range most banks accept, though the higher you sit in it, the more your cash flow needs to carry the file." }
          : ratio <= 3
            ? { label: "Elevated", color: "text-amber-600 dark:text-amber-500", note: "Above the 2:1 most banks prefer, though capital-intensive industries get more room. Expect questions about equity — a larger owner injection helps." }
            : { label: "Highly leveraged", color: "text-destructive", note: "Most banks will hesitate at this level. Consider injecting equity, paying down debt, or reducing the loan request." };

  const gaugePct = ratio === null ? 0 : Math.max(0, Math.min(100, (ratio / 4) * 100));

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
            <Link href="/calculator">
              <Button variant="ghost" data-testid="button-dscr-calc">DSCR Calculator</Button>
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
              <Scale className="h-4 w-4" aria-hidden="true" />
              Free Loan Tool
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight" data-testid="text-dte-title">
              Debt-to-Equity Calculator: How Leveraged Is Your Business?
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">
              Banks compare what you owe to what you own. Most prefer to see{" "}
              <strong>2:1 or lower</strong> — enter your balance sheet numbers to see where you stand.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your numbers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="liabilities">Total liabilities ($)</Label>
                  <Input id="liabilities" inputMode="decimal" value={liabilities} onChange={(e) => setLiabilities(e.target.value)} data-testid="input-liabilities" />
                  <p className="text-xs text-muted-foreground">Everything the business owes: loans, credit lines, payables, leases.</p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="equity">Owner's equity ($)</Label>
                  <Input id="equity" inputMode="decimal" value={equity} onChange={(e) => setEquity(e.target.value)} data-testid="input-equity" />
                  <p className="text-xs text-muted-foreground">Total assets minus total liabilities — the bottom of your balance sheet.</p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="newdebt">New loan you're considering ($)</Label>
                  <Input id="newdebt" inputMode="decimal" value={newDebt} onChange={(e) => setNewDebt(e.target.value)} data-testid="input-new-debt" />
                  <p className="text-xs text-muted-foreground">Optional — see how the loan changes your ratio.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-sm text-muted-foreground">
                      Debt-to-equity ratio{parseNum(newDebt) > 0 ? " (after loan)" : ""}
                    </span>
                    <span className={`text-3xl font-bold tabular-nums ${status?.color ?? ""}`} data-testid="text-dte-value">
                      {ratio === null ? "—" : `${ratio.toFixed(2)}:1`}
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-muted overflow-hidden" aria-hidden="true">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${gaugePct}%` }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1" aria-hidden="true">
                    <span>0:1</span>
                    <span className="font-medium">2:1 bank preference</span>
                    <span>4:1+</span>
                  </div>
                </div>

                {!results.hasEquity && (
                  <p className="text-sm text-destructive" data-testid="text-negative-equity">
                    Owner's equity must be greater than zero to compute the ratio. Zero or negative
                    equity is itself a red flag lenders will ask about.
                  </p>
                )}

                {status && (
                  <p className="text-sm" data-testid="text-dte-status">
                    <span className={`font-semibold ${status.color}`}>{status.label}.</span>{" "}
                    <span className="text-muted-foreground">{status.note}</span>
                  </p>
                )}

                <div className="rounded-lg border divide-y text-sm">
                  <div className="flex justify-between p-3">
                    <span className="text-muted-foreground">Current ratio (before loan)</span>
                    <span className="font-medium tabular-nums" data-testid="text-current-ratio">
                      {results.current === null ? "—" : `${results.current.toFixed(2)}:1`}
                    </span>
                  </div>
                  <div className="flex justify-between p-3">
                    <span className="text-muted-foreground">Max new debt at 2:1</span>
                    <span className="font-medium tabular-nums" data-testid="text-max-debt">
                      {results.hasEquity ? fmt(results.maxAdditional) : "—"}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  Estimates only — bank thresholds vary by industry. Learn more in our{" "}
                  <Link href="/guides/debt-to-equity-ratio-business-loan">
                    <span className="underline cursor-pointer hover:text-foreground">debt-to-equity ratio guide</span>
                  </Link>.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 rounded-xl border bg-primary/5 p-8 text-center">
            <h2 className="text-2xl font-semibold">Leverage is just 1 of 10 criteria banks check</h2>
            <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
              Upload your business plan and get a free instant score across all the criteria lenders
              actually use — no account needed.
            </p>
            <Link href="/#free-preview">
              <Button size="lg" className="mt-5" data-testid="button-dte-cta" onClick={() => trackClick("dte_calculator_cta")}>
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
            <strong>Disclaimer:</strong> This calculator provides estimates for informational purposes
            only and does not constitute financial advice or a lending decision. Always consult with
            qualified financial professionals before making funding decisions. For questions, contact{" "}
            <a href="mailto:info@aishark.org" className="underline hover:text-foreground">info@aishark.org</a>.
          </p>
        </div>
      </footer>
    </div>
  );
}
