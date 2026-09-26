import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Shield, CreditCard, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import logoImage from "@/assets/shark-mark.svg";
import { useSEO } from "@/lib/useSEO";

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

export default function PricingPage() {
  useSEO({
    title: "Pricing — AI Shark Business Plan Assessment | $6.99/mo or $13.99",
    description: "Affordable AI business plan assessment pricing. One-time evaluation $13.99 or monthly subscription $6.99/mo with 2 evaluations. Includes Lender Readiness Grade, SWOT, financial ratios, and PDF export.",
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

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Register and explore the platform",
      features: [
        "Create an account",
        "Access About & Education pages",
        "View sample assessments",
      ],
      limitations: [
        "No business plan evaluations",
        "No score access or downloads",
      ],
      tier: "free",
      popular: false,
    },
    {
      name: "Iteration Plan",
      price: "$6.99",
      period: "/month",
      description: "Business plans often need revision. Upload, review feedback, revise your plan, and re-upload to compare evaluations.",
      features: [
        "2 evaluations per month — score, fix, re-score",
        "Full AI-powered analysis",
        "Detailed scoring & recommendations",
        "Download assessment reports",
        "Priority support",
      ],
      tier: "subscription",
      popular: true,
    },
    {
      name: "One-Time Evaluation",
      price: "$13.99",
      period: "one-time",
      description: "Perfect for single assessments",
      features: [
        "1 business plan evaluation",
        "Full AI-powered analysis",
        "Detailed scoring & recommendations",
        "Download assessment report",
      ],
      tier: "one_time",
      popular: false,
    },
  ];

  const advisorPlans = [
    {
      name: "Pro Plan",
      price: "$49",
      period: "/month",
      description: "For coaches and consultants who review client plans regularly",
      features: [
        "20 evaluations per month",
        "Full AI-powered analysis on every plan",
        "Detailed scoring & recommendations",
        "Downloadable PDF reports for clients",
        "Priority support",
      ],
      tier: "subscription_pro",
      popular: false,
    },
    {
      name: "Advisor Plan",
      price: "$99",
      period: "/month",
      description: "For SBDCs, CPA firms, and fractional CFOs reviewing plans at volume",
      features: [
        "50 evaluations per month",
        "Full AI-powered analysis on every plan",
        "Detailed scoring & recommendations",
        "Downloadable PDF reports for clients",
        "Priority support",
      ],
      tier: "subscription_advisor",
      popular: false,
    },
  ];

  const getProductForTier = (tier: string) => {
    return productsData?.products?.find((p) => p.metadata?.tier === tier);
  };

  const formatPrice = (amount: number) => {
    return `$${(amount / 100).toFixed(2)}`;
  };

  if (productsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" role="status" aria-label="Loading pricing">
          <div className="w-full max-w-5xl grid gap-6 md:grid-cols-3 px-4" aria-hidden="true">
            {[1, 2, 3].map((item) => <div key={item} className="h-[420px] animate-pulse rounded-xl bg-muted" />)}
          </div>
          <span className="sr-only">Loading pricing options...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50" role="banner">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <img src={logoImage} alt="AI Shark Logo" className="h-8 w-auto" data-testid="img-logo" />
              <span className="font-semibold text-lg hidden sm:inline" data-testid="text-app-title">AI Shark</span>
            </div>
          </Link>
          <nav aria-label="Main navigation">
            <div className="flex items-center gap-2">
              {user ? (
                <Link href="/dashboard">
                  <Button variant="ghost" data-testid="link-dashboard">Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" data-testid="link-login">Sign In</Button>
                  </Link>
                  <Link href="/signup">
                    <Button data-testid="link-signup">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      <main id="main-content" className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the level of plan review that fits your next lender conversation.
            All prices are in USD and exclude applicable taxes.
          </p>
        </div>

        <div className="flex items-center justify-center gap-6 mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>Payments handled by Stripe</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CreditCard className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>Manage or cancel subscriptions in Stripe</span>
          </div>
        </div>

        <div className="text-center mb-10">
          <Button variant="outline" asChild data-testid="button-pricing-sample">
            <Link href="/sample">
              <FileText className="h-4 w-4 mr-2" aria-hidden="true" />
              See what a full report looks like
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => {
            const product = getProductForTier(plan.tier);
            const price = product?.prices?.[0];
            const isSubscription = plan.tier === "subscription";
            const isCurrentPlan = billingData?.tier === plan.tier;

            return (
              <Card
                key={plan.tier}
                data-testid={`card-plan-${plan.tier}`}
                className={`relative flex flex-col ${plan.popular ? "border-primary shadow-lg scale-105" : ""}`}
                role="region"
                aria-label={`${plan.name} plan - ${price ? formatPrice(price.unit_amount) : plan.price} ${plan.period}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary">
                      <Star className="h-3 w-3 mr-1" aria-hidden="true" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">
                      {price ? formatPrice(price.unit_amount) : plan.price}
                    </span>
                    <span className="text-muted-foreground ml-1">{plan.period}</span>
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                  {plan.tier !== "free" && (
                    <p className="text-xs text-muted-foreground mt-1">+ applicable taxes</p>
                  )}
                </CardHeader>

                <CardContent className="flex-1">
                  <ul className="space-y-3" aria-label={`${plan.name} features`}>
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                    {plan.limitations?.map((limitation, i) => (
                      <li key={`limit-${i}`} className="flex items-start gap-2 text-muted-foreground">
                        <span className="h-5 w-5 text-center shrink-0" aria-hidden="true">-</span>
                        <span className="text-sm">{limitation}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  {plan.tier === "free" ? (
                    <Button
                      variant="outline"
                      className="w-full"
                      data-testid="button-register-free"
                      onClick={() => setLocation(user ? "/dashboard" : "/signup")}
                    >
                      {user ? "Go to Dashboard" : "Sign Up Free"}
                    </Button>
                  ) : isCurrentPlan ? (
                    <Button variant="secondary" className="w-full" disabled aria-label={`${plan.name} - Current Plan`}>
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      data-testid={`button-select-${plan.tier}`}
                      onClick={() => price && handleSelectPlan(price.id, isSubscription, plan.tier)}
                       disabled={authLoading || processingTier !== null || !price}
                    >
                      {processingTier === plan.tier ? (
                        "Processing..."
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" aria-hidden="true" />
                          {isSubscription ? "Subscribe Now" : "Buy Now"}
                        </>
                      )}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <section className="mt-16 max-w-4xl mx-auto" aria-labelledby="advisor-plans-title">
          <div className="text-center mb-8">
            <h2 id="advisor-plans-title" className="text-3xl font-bold mb-3">For Advisors & Firms</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Review business plans for clients? Get volume pricing built for business coaches,
              accountants, SBDC counselors, and fractional CFOs.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {advisorPlans.map((plan) => {
              const product = getProductForTier(plan.tier);
              const price = product?.prices?.[0];
              const isCurrentPlan = billingData?.tier === plan.tier;
              return (
                <Card
                  key={plan.tier}
                  data-testid={`card-plan-${plan.tier}`}
                  className="relative flex flex-col"
                  role="region"
                  aria-label={`${plan.name} - ${price ? formatPrice(price.unit_amount) : plan.price} ${plan.period}`}
                >
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">
                        {price ? formatPrice(price.unit_amount) : plan.price}
                      </span>
                      <span className="text-muted-foreground ml-1">{plan.period}</span>
                    </div>
                    <CardDescription className="mt-2">{plan.description}</CardDescription>
                    <p className="text-xs text-muted-foreground mt-1">+ applicable taxes</p>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-3" aria-label={`${plan.name} features`}>
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    {isCurrentPlan ? (
                      <Button variant="secondary" className="w-full" disabled aria-label={`${plan.name} - Current Plan`}>
                        Current Plan
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        data-testid={`button-select-${plan.tier}`}
                        onClick={() => price && handleSelectPlan(price.id, true, plan.tier)}
                         disabled={authLoading || processingTier !== null || !price}
                      >
                        {processingTier === plan.tier ? (
                          "Processing..."
                        ) : (
                          <>
                            <Zap className="h-4 w-4 mr-2" aria-hidden="true" />
                            Subscribe Now
                          </>
                        )}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="mt-16 max-w-3xl mx-auto" aria-labelledby="faq-title">
          <h2 id="faq-title" className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-muted-foreground">
                We accept all major credit and debit cards including Visa, Mastercard, American Express, and Discover.
                All payments are securely processed through Stripe.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">How does the Iteration Plan work?</h3>
              <p className="text-muted-foreground">
                 The Iteration Plan includes 2 evaluations each month, so you can review an updated plan after making changes.
                 Credits reset each billing cycle. You can manage payment details, invoices, or cancellation through the
                 Stripe billing portal in your dashboard.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">What if I need more evaluations?</h3>
              <p className="text-muted-foreground">
                Subscribers can purchase additional one-time evaluations at any time.
                Credits from one-time purchases are added to your account balance.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Are my payment details secure?</h3>
              <p className="text-muted-foreground">
                 Stripe processes payment details. AI Shark does not store your card details on its servers.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-16 pt-8 border-t">
          <p className="text-xs text-muted-foreground text-center max-w-4xl mx-auto" data-testid="text-disclaimer">
            <strong>Disclaimer:</strong> AI Shark provides analytical perspectives on business plan documentation and data for informational purposes only. Results do not imply any expectation of positive or negative outcomes from banking or financial institutions. Our assessments are not to be construed as a decision to fund or not fund any business. Always consult with qualified financial professionals before making funding decisions. For questions or assistance, contact us at{" "}<a href="mailto:info@aishark.org" className="underline hover:text-foreground" data-testid="link-contact-email">info@aishark.org</a>.
          </p>
        </div>
      </main>
    </div>
  );
}
