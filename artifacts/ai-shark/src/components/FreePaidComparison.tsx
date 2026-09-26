import { Check, ArrowRight, Minus } from "lucide-react";
import { Link } from "wouter";
import { trackClick } from "@/lib/useSEO";

// Keep these lists in sync with backend truth:
// free = TEASER_PROMPT output, paid = ASSESSMENT_PROMPT output (server/openai.ts).
const FREE_ITEMS = [
  "Overall documentation score (0–100)",
  "Lender Readiness Grade (A–F)",
  "One-line summary of your plan",
  "Top 3 gaps to look at first",
];

const PAID_ITEMS = [
  "All 10 debt-financing considerations, scored and explained",
  "Specific recommendations for each gap",
  "6 financial ratios lenders commonly review (DSCR, debt-to-equity and more)",
  "Full SWOT and market analysis",
  "Detailed strengths and weaknesses",
  "Downloadable PDF report",
];

export function FreePaidComparison() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2" data-testid="free-paid-comparison">
      <div className="rounded-2xl border border-[hsl(220_25%_82%)] bg-[hsl(42_45%_98.5%)] p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(219_20%_38%)]">Step 1 · Free preview</p>
        <p className="mt-1 text-2xl font-bold">$0</p>
        <p className="text-sm text-[hsl(219_20%_38%)]">No account or card. Email required to deliver it.</p>
        <ul className="mt-4 space-y-2.5">
          {FREE_ITEMS.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(217_91%_35%)]" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
          <li className="flex items-start gap-2 text-sm text-[hsl(219_20%_38%)]">
            <Minus className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Per-criterion detail is not included</span>
          </li>
        </ul>
      </div>
      <div className="rounded-2xl border-2 border-[hsl(217_91%_35%)] bg-[hsl(42_45%_98.5%)] p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(217_91%_35%)]">Step 2 · Full report (optional)</p>
        <p className="mt-1 text-2xl font-bold">
          $13.99 <span className="text-sm font-medium text-[hsl(219_20%_38%)]">one-time</span>
        </p>
        <p className="text-sm text-[hsl(219_20%_38%)]">or $6.99/mo for 2 reports a month while you revise. Free account required.</p>
        <ul className="mt-4 space-y-2.5">
          {PAID_ITEMS.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(12_70%_38%)]" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <Link
          href="/pricing"
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[hsl(217_91%_35%)] underline-offset-2 hover:underline"
          data-testid="link-comparison-pricing"
          onClick={() => trackClick("comparison_view_pricing")}
        >
          Compare options on pricing
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
