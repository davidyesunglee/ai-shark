import { getUncachableStripeClient } from './stripeClient';

const PRODUCTS = {
  subscription: {
    name: 'AI Shark Monthly Subscription',
    description: 'Monthly subscription for business plan evaluations. Includes up to 2 evaluations per month.',
    metadata: {
      tier: 'subscription',
      credits: '2',
    },
    price: {
      amount: 699,
      currency: 'usd',
      recurring: { interval: 'month' as const },
    },
  },
  oneTime: {
    name: 'AI Shark Single Evaluation',
    description: 'One-time purchase for a single business plan evaluation with full score and download.',
    metadata: {
      tier: 'one_time',
      credits: '1',
    },
    price: {
      amount: 1399,
      currency: 'usd',
    },
  },
};

async function seedProducts() {
  console.log('Seeding Stripe products...');
  const stripe = await getUncachableStripeClient();

  for (const [key, productData] of Object.entries(PRODUCTS)) {
    console.log(`Creating product: ${productData.name}`);

    const existingProducts = await stripe.products.search({
      query: `name:'${productData.name}'`,
    });

    if (existingProducts.data.length > 0) {
      console.log(`  Product already exists: ${existingProducts.data[0].id}`);
      continue;
    }

    const product = await stripe.products.create({
      name: productData.name,
      description: productData.description,
      metadata: productData.metadata,
      tax_code: 'txcd_10000000',
    });

    console.log(`  Created product: ${product.id}`);

    const priceConfig: any = {
      product: product.id,
      unit_amount: productData.price.amount,
      currency: productData.price.currency,
      tax_behavior: 'exclusive',
    };

    if ('recurring' in productData.price) {
      priceConfig.recurring = productData.price.recurring;
    }

    const price = await stripe.prices.create(priceConfig);
    console.log(`  Created price: ${price.id} ($${(priceConfig.unit_amount / 100).toFixed(2)})`);
  }

  console.log('Product seeding complete!');
}

seedProducts().catch(console.error);
