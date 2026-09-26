import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Check, Minus, ShieldCheck, CreditCard, FileText, ArrowRight, RefreshCw, Receipt } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { useSEO } from "@/lib/useSEO";
import { MarketingHeader, MarketingFooter, Reveal } from "@/components/marketing/MarketingChrome";

interface Price {
  id: string;
  unit_amount: number;
  currency: string;
  recurring: { interval: string } | null;
}

interface Product {
  id: string;
  name: string;
  description: string;
  metadata: { tier: string; credits: string };
  prices: Price[];
}

type PaidPlan = {
  name: string;
  price: string;
  period: string;
  tagline: string;
  bestFor: string;
  features: string[];
  billingNote: string;
  tier: string;
  subscription: boolean;
  icon: typeof Receipt;
};

export default function PricingPage() {
  useSEO({
    title: "Pricing — AI Shark Business Plan Review | $13.99 once or $6.99/mo",
    description:
      "Free no-account preview, free account, one-time full report $13.99 with no recurring billing, or $6.99/mo for 2 reports a month while revising. Advisor plans available.",
    canonical: "/pricing",
  });
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [processingTier, setProcessingTier] = useState<string | null>(null);

  const { data: productsData, isLoading: productsLoading } = useQuery<{ products: Product[] }>({
    queryKey: ["/api/products"],
  });

  const { data: billingData } = useQuery<{ tier: string; creditsRemaining: number; hasActiveSubscription: boolean }>({
    queryKey: ["/api/billing/status"],
    enabled: !!user,
  });

  const checkoutMutation = useMutation({
    mutationFn: async ({ priceId, mode }: { priceId: string; mode: string }) => {
      const response = await apiRequest("POST", "/api/checkout/create-session", { priceId, mode });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to start checkout");
      }
      return data;
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      } else {
        setProcessingTier(null);
        toast({
          title: "Checkout Error",
          description: "Unable to start checkout. Please try again.",
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      setProcessingTier(null);
      toast({
        title: "Checkout Error",
        description: error.message || "Failed to start checkout. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setTimeout(() => {
        setProcessingTier(null);
      }, 5000);
    },
  });

  const handleSelectPlan = (priceId: string, isSubscription: boolean, tier: string) => {
    if (!user) {
      setLocation("/login");
      return;
    }
    setProcessingTier(tier);
    checkoutMutation.mutate({ priceId, mode: isSubscription ? "subscription" : "payment" });
  };

  const plans: PaidPlan[] = [
    {
      name: "One-Time Report",
      price: "$13.99",
      period: "once",
      tagline: "One full report. No recurring billing.",
      bestFor: "You have a near-final plan and want one thorough read before a meeting.",
      features: [
        "1 full business plan evaluation",
        "All 10 considerations scored with findings",
        "Specific recommendations for each gap",
        "SWOT, market analysis and 6 financial ratios",
        "Downloadable PDF report",
      ],
      billingNote: "Charged once. Nothing renews.",
      tier: "one_time",
      subscription: false,
      icon: Receipt,
    },
    {
      name: "Iteration Plan",
      price: "$6.99",
      period: "/month",
      tagline: "For revising and re-checking.",
      bestFor: "You expect to revise the plan and want to compare versions over a few weeks.",
      features: [
        "2 full evaluations per month",
        "Everything in the one-time report",
        "Score, revise, re-score to compare versions",
        "Downloadable PDF reports",
        "Priority support",
      ],
      billingNote: "Renews monthly until you cancel. Credits reset each billing cycle. Cancel in the Stripe billing portal.",
      tier: "subscription",
      subscription: true,
      icon: RefreshCw,
    },
  ];

  const advisorPlans = [
    {
      name: "Pro Plan",
      price: "$49",
      period: "/month",
      description: "For coaches and consultants who review client plans regularly.",
      features: ["20 evaluations per month", "Full analysis on every plan", "Downloadable PDF reports for clients", "Priority support"],
      tier: "subscription_pro",
    },
    {
      name: "Advisor Plan",
      price: "$99",
      period: "/month",
      description: "For SBDCs, CPA firms and fractional CFOs reviewing plans at volume.",
      features: ["50 evaluations per month", "Full analysis on every plan", "Downloadable PDF reports for clients", "Priority support"],
      tier: "subscription_advisor",
    },
  ];

  const getProductForTier = (tier: string) => {
    return productsData?.products?.find((p) => p.metadata?.tier === tier);
  };

  const formatPrice = (amount: number) => {
    return `$${(amount / 100).toFixed(2)}`;
  };

  const renderBuyButton = (tier: string, name: string, isSubscription: boolean, label: string, coral = false) => {
    const product = getProductForTier(tier);
    const price = product?.prices?.[0];
    if (billingData?.tier === tier) {
      return (
        <button className="mk-btn mk-btn-ghost w-full" disabled aria-label={`${name} - Current Plan`}>
          Current plan
        </button>
      );
    }
    return (
      <button
        className={`mk-btn w-full ${coral ? "mk-btn-coral" : "mk-btn-primary"}`}
        data-testid={`button-select-${tier}`}
        onClick={() => price && handleSelectPlan(price.id, isSubscription, tier)}
        disabled={authLoading || processingTier !== null || !price}
      >
        {processingTier === tier ? "Opening secure checkout..." : label}
        {processingTier !== tier && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
      </button>
    );
  };

  const displayPrice = (tier: string, fallback: string) => {
    const price = getProductForTier(tier)?.prices?.[0];
    return price ? formatPrice(price.unit_amount) : fallback;
  };

  return (
    <div className="mk min-h-[100dvh]">
      <a href="#main-content" className="skip-to-content">Skip to main content</a>
      <MarketingHeader signedIn={!!user} />

      <main id="main-content">
        <section className="mx-auto max-w-6xl px-4 pb-10 pt-14 md:pt-20">
          <div className="max-w-3xl">
            <p className="mk-mono mk-coral mk-rise">Pricing</p>
            <h1 className="mk-display mk-rise mt-3 text-4xl font-semibold leading-tight sm:text-6xl" style={{ animationDelay: "80ms" }}>
              Start free. Pay only if the detail is worth it.
            </h1>
            <p className="mk-ink-soft mk-rise mt-5 text-lg leading-relaxed" style={{ animationDelay: "160ms" }}>
              Prices in USD, before applicable taxes. Payments are handled by Stripe. Every paid option includes the same full report — the difference is how many you need.
            </p>
          </div>
        </section>

        {/* FREE ROW */}
        <section className="mx-auto max-w-6xl px-4" aria-labelledby="free-title">
          <h2 id="free-title" className="sr-only">Free options</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Reveal className="mk-card flex flex-col p-6" >
              <div data-testid="card-plan-preview" className="flex h-full flex-col">
                <p className="mk-mono mk-blue">Free preview · no account</p>
                <p className="mk-display mt-2 text-3xl font-semibold">$0</p>
                <p className="mk-ink-soft mt-2 text-sm">A quick read on your plan from the homepage. We ask for an email to deliver the result.</p>
                <ul className="mt-4 space-y-2 text-sm">
                  {["Overall score (0–100) and readiness grade (A–F)", "One-line summary", "Top 3 gaps"].map((f) => (
                    <li key={f} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 mk-blue" aria-hidden="true" />{f}</li>
                  ))}
                  <li className="mk-ink-soft flex gap-2"><Minus className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />No per-criterion detail or PDF</li>
                </ul>
                <a href={`${import.meta.env.BASE_URL}#free-preview`} className="mk-btn mk-btn-ghost mt-6 self-start" data-testid="button-try-preview">
                  Try the free preview
                </a>
              </div>
            </Reveal>
            <Reveal delay={80} className="mk-card flex flex-col p-6" >
              <div data-testid="card-plan-free" className="flex h-full flex-col">
                <p className="mk-mono mk-blue">Free account</p>
                <p className="mk-display mt-2 text-3xl font-semibold">$0</p>
                <p className="mk-ink-soft mt-2 text-sm">Needed to buy and keep full reports. Creating one does not include an evaluation.</p>
                <ul className="mt-4 space-y-2 text-sm">
                  {["A dashboard to store and revisit reports", "Access to purchase full reports", "Education pages and sample report"].map((f) => (
                    <li key={f} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 mk-blue" aria-hidden="true" />{f}</li>
                  ))}
                  <li className="mk-ink-soft flex gap-2"><Minus className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />No evaluations included</li>
                </ul>
                <button
                  className="mk-btn mk-btn-ghost mt-6 self-start"
                  data-testid="button-register-free"
                  onClick={() => setLocation(user ? "/dashboard" : "/signup")}
                >
                  {user ? "Go to dashboard" : "Create free account"}
                </button>
              </div>
            </Reveal>
          </div>
        </section>

        {/* PAID */}
        <section className="mx-auto max-w-6xl px-4 py-12" aria-labelledby="paid-title">
          <h2 id="paid-title" className="mk-display text-2xl font-semibold sm:text-3xl">Full report options</h2>
          <p className="mk-ink-soft mt-2 text-sm">Requires a free account. You'll sign in before checkout.</p>
          {productsLoading ? (
            <div className="mt-6 grid gap-6 md:grid-cols-2" role="status" aria-label="Loading pricing">
              {[1, 2].map((i) => <div key={i} className="h-[440px] animate-pulse rounded-[18px] bg-[hsl(var(--mk-paper-2))]" />)}
              <span className="sr-only">Loading pricing options...</span>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {plans.map((plan, i) => {
                const Icon = plan.icon;
                const shown = displayPrice(plan.tier, plan.price);
                return (
                  <Reveal key={plan.tier} delay={i * 90}>
                    <div
                      className={`mk-card flex h-full flex-col p-7 ${plan.subscription ? "" : "!border-2 !border-[hsl(var(--mk-blue))]"}`}
                      data-testid={`card-plan-${plan.tier}`}
                      role="region"
                      aria-label={`${plan.name} - ${shown} ${plan.period}`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-semibold">{plan.name}</p>
                        <Icon className="h-5 w-5 mk-ink-soft" aria-hidden="true" />
                      </div>
                      <p className="mt-4">
                        <span className="mk-display text-5xl font-semibold">{shown}</span>
                        <span className="mk-ink-soft ml-1">{plan.period}</span>
                      </p>
                      <p className="mt-2 font-semibold mk-blue">{plan.tagline}</p>
                      <p className="mk-ink-soft mt-3 text-sm"><span className="font-semibold text-[hsl(var(--mk-ink))]">Best if: </span>{plan.bestFor}</p>
                      <ul className="mt-5 flex-1 space-y-2.5 border-t mk-rule pt-5 text-sm">
                        {plan.features.map((f) => (
                          <li key={f} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 mk-blue" aria-hidden="true" />{f}</li>
                        ))}
                      </ul>
                      <p className="mk-paper2 mt-5 rounded-xl px-4 py-3 text-xs leading-relaxed">{plan.billingNote} Plus applicable taxes.</p>
                      <div className="mt-5">{renderBuyButton(plan.tier, plan.name, plan.subscription, plan.subscription ? "Subscribe" : "Buy one report")}</div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          )}

          <div className="mk-ink-soft mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
            <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 mk-blue" aria-hidden="true" />Payments processed by Stripe</span>
            <span className="flex items-center gap-2"><CreditCard className="h-4 w-4 mk-blue" aria-hidden="true" />Card details never stored by AI Shark</span>
            <Link href="/sample" className="mk-link flex items-center gap-2" data-testid="button-pricing-sample">
              <FileText className="h-4 w-4" aria-hidden="true" />See the full fictional sample report
            </Link>
          </div>
        </section>

        {/* ADVISOR */}
        <section className="mk-deep" aria-labelledby="advisor-plans-title">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-[1fr_2fr]">
            <div>
              <p className="mk-mono text-[hsl(var(--mk-coral))]">For advisors and firms</p>
              <h2 id="advisor-plans-title" className="mk-display mt-3 text-3xl font-semibold">Reviewing plans for clients?</h2>
              <p className="mt-3 text-sm leading-relaxed opacity-75">Volume plans for business coaches, accountants, SBDC counselors and fractional CFOs. Monthly subscriptions, cancel in Stripe.</p>
              <Link href="/partners" className="mt-5 inline-block text-sm font-semibold underline underline-offset-4" data-testid="link-partners">More about advisor use</Link>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {advisorPlans.map((plan) => {
                const shown = displayPrice(plan.tier, plan.price);
                return (
                  <div key={plan.tier} className="flex flex-col rounded-[18px] border border-white/15 bg-white/[0.04] p-6" data-testid={`card-plan-${plan.tier}`} role="region" aria-label={`${plan.name} - ${shown} ${plan.period}`}>
                    <p className="font-semibold">{plan.name}</p>
                    <p className="mt-3"><span className="mk-display text-4xl font-semibold">{shown}</span><span className="ml-1 opacity-70">{plan.period}</span></p>
                    <p className="mt-2 text-sm opacity-75">{plan.description}</p>
                    <ul className="mt-4 flex-1 space-y-2 text-sm">
                      {plan.features.map((f) => (
                        <li key={f} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--mk-coral))]" aria-hidden="true" />{f}</li>
                      ))}
                    </ul>
                    <p className="mt-4 text-xs opacity-60">Renews monthly. Plus applicable taxes.</p>
                    <div className="mt-4">{productsLoading ? <div className="h-11 animate-pulse rounded-full bg-white/10" /> : renderBuyButton(plan.tier, plan.name, true, "Subscribe", true)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-4xl px-4 py-16" aria-labelledby="faq-title">
          <h2 id="faq-title" className="mk-display text-3xl font-semibold">Billing questions</h2>
          <dl className="mt-8 divide-y divide-[hsl(var(--mk-line))] border-y mk-rule">
            {[
              ["What's the difference between the free preview and a free account?", "The preview runs from the homepage without an account and gives a score, grade and top three gaps. A free account is what you need to buy, store and download full reports — it does not include an evaluation on its own."],
              ["Does the one-time report renew?", "No. The one-time report is a single charge for one evaluation. Nothing recurs."],
              ["When does the subscription make sense?", "When you plan to revise. The Iteration Plan includes 2 evaluations each billing cycle so you can compare versions. Credits reset each cycle, and you can cancel any time in the Stripe billing portal from your dashboard."],
              ["What if I need more evaluations?", "You can buy additional one-time evaluations at any time. Those credits are added to your account balance."],
              ["What payment methods do you accept?", "Major credit and debit cards, processed securely by Stripe. AI Shark does not store your card details."],
              ["Will a paid report improve my chances of approval?", "We can't promise that. The report helps you find and fix documentation gaps; lending decisions depend on factors we don't see, including your credit and verified financials."],
            ].map(([q, a]) => (
              <div key={q} className="py-5">
                <dt className="font-semibold">{q}</dt>
                <dd className="mk-ink-soft mt-2 text-[0.95rem] leading-relaxed">{a}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
