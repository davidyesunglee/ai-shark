import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Calculator } from "lucide-react";
import { useSEO, useJsonLd, trackClick } from "@/lib/useSEO";
import logoImage from "@/assets/shark-mark.svg";

function parseNum(v: string): number {
  const n = parseFloat(v.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function monthlyPayment(principal: number, annualRatePct: number, years: number): number {
  if (principal <= 0 || years <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  return (principal * r) / (1 - Math.pow(1 + r, -n));
}

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function CalculatorPage() {
  useSEO({
    title: "Free DSCR Calculator for Business Loans | AI Shark",
    description:
      "Calculate your Debt Service Coverage Ratio (DSCR) and see if your business can afford a bank loan. Free instant results with the 1.25x bank benchmark and your maximum affordable loan.",
    canonical: "/calculator",
  });

  useJsonLd([
    {
      id: "calculator-app",
      data: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "DSCR Calculator",
        url: "https://aishark.org/calculator",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        description:
          "Free Debt Service Coverage Ratio calculator for business loans, using the 1.25x benchmark most banks require.",
      },
    },
  ]);

  const [noi, setNoi] = useState("150000");
  const [existingDebt, setExistingDebt] = useState("0");
  const [loanAmount, setLoanAmount] = useState("250000");
  const [rate, setRate] = useState("9");
  const [term, setTerm] = useState("10");

  const results = useMemo(() => {
    const annualNoi = parseNum(noi);
    const annualExisting = parseNum(existingDebt);
    const newMonthly = monthlyPayment(parseNum(loanAmount), parseNum(rate), parseNum(term));
    const annualNew = newMonthly * 12;
    const totalDebtService = annualExisting + annualNew;
    const dscr = totalDebtService > 0 ? annualNoi / totalDebtService : null;

    // Max affordable annual debt service at DSCR 1.25, minus existing, back to principal.
    const maxAnnualNew = Math.max(0, annualNoi / 1.25 - annualExisting);
    const perDollarAnnual = monthlyPayment(1, parseNum(rate), parseNum(term)) * 12;
    const maxLoan = perDollarAnnual > 0 ? maxAnnualNew / perDollarAnnual : 0;

    return { newMonthly, totalDebtService, dscr, maxLoan };
  }, [noi, existingDebt, loanAmount, rate, term]);

  const dscr = results.dscr;
  const status =
    dscr === null
      ? null
      : dscr >= 1.5
        ? { label: "Strong", color: "text-green-600 dark:text-green-500", note: "Comfortably above the 1.25x most banks require. Lenders will see healthy repayment capacity." }
        : dscr >= 1.25
          ? { label: "Bankable", color: "text-primary", note: "You meet the typical 1.25x bank benchmark, though with limited cushion. Strengthening cash flow improves your terms." }
          : dscr >= 1.0
            ? { label: "Below benchmark", color: "text-amber-600 dark:text-amber-500", note: "You can cover payments, but you're under the 1.25x most banks want. Consider a smaller loan, longer term, or improving income." }
            : { label: "Not coverable", color: "text-destructive", note: "Your income doesn't cover this debt load. Banks will decline at this level — reduce the loan or grow income first." };

  const gaugePct = dscr === null ? 0 : Math.max(0, Math.min(100, (dscr / 2) * 100));

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
            <Link href="/sign-up">
              <Button data-testid="button-header-signup">Get Free Score</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main id="main-content" className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm text-muted-foreground mb-4">
              <Calculator className="h-4 w-4" aria-hidden="true" />
              Free Loan Tool
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight" data-testid="text-calculator-title">
              DSCR Calculator: Can Your Business Afford This Loan?
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">
              Banks use your Debt Service Coverage Ratio to decide if you can repay. Most want at
              least <strong>1.25x</strong> — enter your numbers to see where you stand.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your numbers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="noi">Annual net operating income ($)</Label>
                  <Input id="noi" inputMode="decimal" value={noi} onChange={(e) => setNoi(e.target.value)} data-testid="input-noi" />
                  <p className="text-xs text-muted-foreground">Revenue minus operating expenses, before loan payments and taxes.</p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="existing">Existing annual debt payments ($)</Label>
                  <Input id="existing" inputMode="decimal" value={existingDebt} onChange={(e) => setExistingDebt(e.target.value)} data-testid="input-existing-debt" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="amount">New loan amount ($)</Label>
                  <Input id="amount" inputMode="decimal" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} data-testid="input-loan-amount" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="rate">Interest rate (%)</Label>
                    <Input id="rate" inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} data-testid="input-rate" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="term">Term (years)</Label>
                    <Input id="term" inputMode="decimal" value={term} onChange={(e) => setTerm(e.target.value)} data-testid="input-term" />
                  </div>
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
                    <span className="text-sm text-muted-foreground">Debt Service Coverage Ratio</span>
                    <span className={`text-3xl font-bold tabular-nums ${status?.color ?? ""}`} data-testid="text-dscr-value">
                      {dscr === null ? "—" : `${dscr.toFixed(2)}x`}
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-muted overflow-hidden" aria-hidden="true">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${gaugePct}%` }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1" aria-hidden="true">
                    <span>0x</span>
                    <span className="font-medium">1.25x bank minimum</span>
                    <span>2x+</span>
                  </div>
                </div>

                {status && (
                  <p className="text-sm" data-testid="text-dscr-status">
                    <span className={`font-semibold ${status.color}`}>{status.label}.</span>{" "}
                    <span className="text-muted-foreground">{status.note}</span>
                  </p>
                )}

                <div className="rounded-lg border divide-y text-sm">
                  <div className="flex justify-between p-3">
                    <span className="text-muted-foreground">New loan monthly payment</span>
                    <span className="font-medium tabular-nums" data-testid="text-monthly-payment">{fmt(results.newMonthly)}</span>
                  </div>
                  <div className="flex justify-between p-3">
                    <span className="text-muted-foreground">Total annual debt service</span>
                    <span className="font-medium tabular-nums" data-testid="text-annual-debt">{fmt(results.totalDebtService)}</span>
                  </div>
                  <div className="flex justify-between p-3">
                    <span className="text-muted-foreground">Max loan at 1.25x DSCR</span>
                    <span className="font-medium tabular-nums" data-testid="text-max-loan">{fmt(results.maxLoan)}</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  Estimates only — actual bank terms vary. Learn more in our{" "}
                  <Link href="/guides/how-to-improve-dscr">
                    <span className="underline cursor-pointer hover:text-foreground">guide to improving your DSCR</span>
                  </Link>.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 rounded-xl border bg-primary/5 p-8 text-center">
            <h2 className="text-2xl font-semibold">DSCR is just 1 of 10 criteria banks check</h2>
            <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
              Upload your business plan and get a free instant score across all the criteria lenders
              actually use — no account needed.
            </p>
            <Link href="/#free-preview">
              <Button size="lg" className="mt-5" data-testid="button-calculator-cta" onClick={() => trackClick("calculator_cta")}>
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
