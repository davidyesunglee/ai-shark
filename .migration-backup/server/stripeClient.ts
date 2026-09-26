import Stripe from 'stripe';

let connectionSettings: any;

async function getCredentials() {
  const isProduction = process.env.REPLIT_DEPLOYMENT === '1';
  
  // Check for direct environment variable keys first (for production)
  if (process.env.STRIPE_LIVE_SECRET_KEY && process.env.STRIPE_LIVE_PUBLISHABLE_KEY) {
    console.log('[Stripe] Using live API keys from environment variables');
    return {
      publishableKey: process.env.STRIPE_LIVE_PUBLISHABLE_KEY,
      secretKey: process.env.STRIPE_LIVE_SECRET_KEY,
    };
  }
  
  // Fall back to Replit connector for development
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? 'repl ' + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
      ? 'depl ' + process.env.WEB_REPL_RENEWAL
      : null;

  if (!xReplitToken) {
    throw new Error('Stripe credentials not found. Please set STRIPE_LIVE_SECRET_KEY and STRIPE_LIVE_PUBLISHABLE_KEY environment variables.');
  }

  const connectorName = 'stripe';
  const targetEnvironment = isProduction ? 'production' : 'development';

  const url = new URL(`https://${hostname}/api/v2/connection`);
  url.searchParams.set('include_secrets', 'true');
  url.searchParams.set('connector_names', connectorName);
  url.searchParams.set('environment', targetEnvironment);

  const response = await fetch(url.toString(), {
    headers: {
      'Accept': 'application/json',
      'X_REPLIT_TOKEN': xReplitToken
    }
  });

  const data = await response.json();
  
  connectionSettings = data.items?.[0];

  if (!connectionSettings || (!connectionSettings.settings.publishable || !connectionSettings.settings.secret)) {
    throw new Error(`Stripe ${targetEnvironment} connection not found. Please set STRIPE_LIVE_SECRET_KEY and STRIPE_LIVE_PUBLISHABLE_KEY environment variables.`);
  }

  return {
    publishableKey: connectionSettings.settings.publishable,
    secretKey: connectionSettings.settings.secret,
  };
}

export async function getUncachableStripeClient() {
  const { secretKey } = await getCredentials();

  return new Stripe(secretKey);
}

export async function getStripePublishableKey() {
  const { publishableKey } = await getCredentials();
  return publishableKey;
}

export async function getStripeSecretKey() {
  const { secretKey } = await getCredentials();
  return secretKey;
}

let stripeSync: any = null;
let lastSecretKeyUsed: string | null = null;

export async function getStripeSync() {
  const secretKey = await getStripeSecretKey();
  
  // Reset stripeSync if the secret key changed (e.g., switched from TEST to LIVE)
  if (stripeSync && lastSecretKeyUsed && lastSecretKeyUsed !== secretKey) {
    console.log('[Stripe] Detected credential change, resetting sync client');
    stripeSync = null;
  }
  
  if (!stripeSync) {
    const { StripeSync } = await import('stripe-replit-sync');
    lastSecretKeyUsed = secretKey;

    stripeSync = new StripeSync({
      poolConfig: {
        connectionString: process.env.DATABASE_URL!,
        max: 2,
      },
      stripeSecretKey: secretKey,
    });
  }
  return stripeSync;
}
