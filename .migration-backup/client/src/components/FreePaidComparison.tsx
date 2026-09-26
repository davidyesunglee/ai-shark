import { Check, Lock, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { trackClick } from "@/lib/useSEO";

// Keep these lists in sync with backend truth:
// free = TEASER_PROMPT output, paid = ASSESSMENT_PROMPT output (server/openai.ts).
const FREE_ITEMS = [
  "Overall score (0–100)",
  "Lender Readiness Grade (A–F)",
  "One-line verdict on your plan",
  "Top 3 weaknesses holding you back",
];

const PAID_ITEMS = [
  "All 10 bank lending criteria, scored & explained",
  "Specific, actionable recommendations to fix weaknesses",
  "6 financial ratios banks check (DSCR, debt-to-equity…)",
  "Full SWOT and market analysis",
  "Detailed strengths & weaknesses breakdown",
  "Downloadable PDF report",
];

export function FreePaidComparison() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2" data-testid="free-paid-comparison">
      <Card>
        <CardContent className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <Badge variant="secondary">Free preview</Badge>
            <span className="text-sm text-muted-foreground">No account needed</span>
          </div>
          <ul className="space-y-2">
            {FREE_ITEMS.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card className="border-primary/40">
        <CardContent className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <Badge>Full report</Badge>
            <span className="text-sm text-muted-foreground">$13.99 one-time or $6.99/mo</span>
          </div>
          <ul className="space-y-2">
            {PAID_ITEMS.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/pricing"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-2 hover:underline"
            data-testid="link-comparison-pricing"
            onClick={() => trackClick("comparison_view_pricing")}
          >
            See pricing details
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
