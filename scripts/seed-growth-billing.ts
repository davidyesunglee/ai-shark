// Creates the Pro and Advisor subscription tiers plus the SHARK15 15%-off
// promotion code in Stripe. Idempotent — safe to re-run.
// Run: npx tsx scripts/seed-growth-billing.ts
import { getUncachableStripeClient } from "../server/stripeClient";

const TIERS = [
  {
    tier: "subscription_pro",
    name: "Pro Plan",
    description: "20 business plan evaluations per month for advisors and coaches",
    amount: 4900,
    credits: "20",
  },
  {
    tier: "subscription_advisor",
    name: "Advisor Plan",
    description: "50 business plan evaluations per month for firms reviewing client plans at volume",
    amount: 9900,
    credits: "50",
  },
];

async function main() {
  const stripe = await getUncachableStripeClient();

  for (const t of TIERS) {
    const existing = await stripe.products.search({ query: `metadata['tier']:'${t.tier}' AND active:'true'` });
    if (existing.data.length > 0) {
      console.log(`${t.name} already exists:`, existing.data[0].id);
      continue;
    }
    const product = await stripe.products.create({
      name: t.name,
      description: t.description,
      metadata: { tier: t.tier, credits: t.credits },
    });
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: t.amount,
      currency: "usd",
      recurring: { interval: "month" },
    });
    console.log(`Created ${t.name}: product ${product.id}, price ${price.id}`);
  }

  // 15% off promotion code for the drip campaign
  const promos = await stripe.promotionCodes.list({ code: "SHARK15", limit: 1 });
  if (promos.data.length > 0) {
    console.log("SHARK15 already exists:", promos.data[0].id);
  } else {
    const coupon = await stripe.coupons.create({
      percent_off: 15,
      duration: "once",
      name: "Drip campaign 15% off",
    });
    let promo;
    try {
      promo = await stripe.promotionCodes.create({ coupon: coupon.id, code: "SHARK15" } as any);
    } catch {
      // Newer Stripe API versions changed the creation shape
      promo = await stripe.promotionCodes.create({
        promotion: { type: "coupon", coupon: coupon.id },
        code: "SHARK15",
      } as any);
    }
    console.log("Created SHARK15 promotion code:", promo.id);
  }
}

main().then(() => process.exit(0)).catch((e) => {
  console.error(e);
  process.exit(1);
});
