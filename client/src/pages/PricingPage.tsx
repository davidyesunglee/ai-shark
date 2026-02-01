import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Shield, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";

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
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [processingTier, setProcessingTier] = useState<string | null>(null);

  // Reset processing state when component mounts (e.g., returning from Stripe)
  useEffect(() => {
    setProcessingTier(null);
  }, []);

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
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        // No URL returned - reset state and show error
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
      // Reset processing state after a delay to handle redirect timing
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
      name: "Monthly Subscription",
      price: "$6.99",
      period: "/month",
      description: "Best value for regular users",
      features: [
        "2 business plan evaluations per month",
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

  const getProductForTier = (tier: string) => {
    return productsData?.products?.find((p) => p.metadata?.tier === tier);
  };

  const formatPrice = (amount: number) => {
    return `$${(amount / 100).toFixed(2)}`;
  };

  if (productsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading pricing...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get professional AI-powered business plan evaluations for bank debt financing decisions.
            All prices are in USD and exclude applicable taxes.
          </p>
        </div>

        <div className="flex items-center justify-center gap-6 mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 text-green-500" />
            <span>PCI Compliant</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CreditCard className="h-4 w-4 text-blue-500" />
            <span>Secure Payments via Stripe</span>
          </div>
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
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary">
                      <Star className="h-3 w-3 mr-1" />
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
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                    {plan.limitations?.map((limitation, i) => (
                      <li key={`limit-${i}`} className="flex items-start gap-2 text-muted-foreground">
                        <span className="h-5 w-5 text-center shrink-0">-</span>
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
                      onClick={() => setLocation(user ? "/dashboard" : "/register")}
                    >
                      {user ? "Go to Dashboard" : "Register Free"}
                    </Button>
                  ) : isCurrentPlan ? (
                    <Button variant="secondary" className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      data-testid={`button-select-${plan.tier}`}
                      onClick={() => price && handleSelectPlan(price.id, isSubscription, plan.tier)}
                      disabled={processingTier !== null || !price}
                    >
                      {processingTier === plan.tier ? (
                        "Processing..."
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
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

        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-muted-foreground">
                We accept all major credit and debit cards including Visa, Mastercard, American Express, and Discover.
                All payments are securely processed through Stripe.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">How does the subscription work?</h3>
              <p className="text-muted-foreground">
                The monthly subscription gives you 2 business plan evaluations per month. Your credits reset on each billing cycle.
                You can cancel anytime from your account settings.
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
                Yes, we use Stripe for payment processing, which is PCI Level 1 certified.
                We never store your card details on our servers. All transactions are encrypted and secure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
