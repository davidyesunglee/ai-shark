import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { runMigrations } from "stripe-replit-sync";
import { getStripeSync, getUncachableStripeClient } from "./stripeClient";
import { WebhookHandlers } from "./webhookHandlers";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./db";
import { storage } from "./storage";

// Top-level debug logging - Version 2
console.log("[Boot] Server starting... v2");
console.log(`[Boot] NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`[Boot] PORT: ${process.env.PORT}`);

const app = express();
const httpServer = createServer(app);

// Debug: Log ALL incoming requests in production
if (process.env.NODE_ENV === "production") {
  app.use((req, _res, next) => {
    console.log(`[Request] ${req.method} ${req.url}`);
    next();
  });
}

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

async function initStripe() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.log("[Stripe] Skipping - DATABASE_URL not set");
    return;
  }

  try {
    console.log("[Stripe] Initializing schema...");
    await runMigrations({ databaseUrl });
    console.log("[Stripe] Schema ready");

    const stripeSync = await getStripeSync();

    // Use custom domain for webhook URL if available, otherwise fallback to Replit domain
    const customDomain = "aishark.org";
    const replitDomain = process.env.REPLIT_DOMAINS?.split(",")[0];
    const domain = customDomain || replitDomain;
    
    if (process.env.NODE_ENV !== "production") {
      // Dev must NOT manage the live webhook: creating/deleting the aishark.org
      // endpoint from dev invalidates the secret stored in the production DB,
      // breaking signature verification for real payments.
      console.log("[Stripe] Skipping webhook setup in development (production endpoint is managed by the deployed app)");
    } else if (domain) {
      console.log("[Stripe] Setting up managed webhook...");
      const webhookBaseUrl = `https://${domain}`;
      console.log(`[Stripe] Webhook URL: ${webhookBaseUrl}/api/stripe/webhook`);
      const result = await stripeSync.findOrCreateManagedWebhook(
        `${webhookBaseUrl}/api/stripe/webhook`
      );
      if (result?.webhook?.url) {
        console.log(`[Stripe] Webhook configured: ${result.webhook.url}`);
      } else {
        console.log("[Stripe] Webhook setup completed");
      }
    } else {
      console.log("[Stripe] Skipping webhook setup - no domain configured");
    }

    console.log("[Stripe] Syncing data in background...");
    stripeSync
      .syncBackfill()
      .then(() => console.log("[Stripe] Data sync complete"))
      .catch((err: Error) => console.error("[Stripe] Sync error:", err));
  } catch (error) {
    console.error("[Stripe] Initialization error:", error);
  }
}

app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const signature = req.headers["stripe-signature"];
    if (!signature) {
      return res.status(400).json({ error: "Missing stripe-signature" });
    }

    try {
      const sig = Array.isArray(signature) ? signature[0] : signature;

      if (!Buffer.isBuffer(req.body)) {
        console.error("[Stripe] Webhook error: req.body is not a Buffer");
        return res.status(500).json({ error: "Webhook processing error" });
      }

      // Parse event body up-front so we can decide what to do
      let eventBody: any;
      try {
        eventBody = JSON.parse(req.body.toString());
      } catch (parseErr: any) {
        console.error("[Stripe] Webhook body parse error:", parseErr.message);
        return res.status(400).json({ error: "Invalid payload" });
      }

      const eventType = eventBody?.type as string | undefined;

      // Some Stripe events (e.g. invoice.upcoming) are previews without an
      // object id, which the sync library cannot insert into Postgres. We
      // skip syncing those events but still acknowledge them so Stripe does
      // not keep retrying and eventually disable the webhook.
      const skipSyncEvents = new Set<string>([
        "invoice.upcoming",
      ]);

      if (!skipSyncEvents.has(eventType ?? "")) {
        try {
          // Process with StripeSync for data syncing (this validates the signature)
          await WebhookHandlers.processWebhook(req.body as Buffer, sig);
        } catch (syncError: any) {
          const msg = String(syncError?.message ?? "");
          const isSignatureError =
            syncError?.type === "StripeSignatureVerificationError" ||
            /signature|No signatures found/i.test(msg);

          if (isSignatureError) {
            // Bad signature: reject so Stripe knows the request was tampered with
            console.error("[Stripe] Webhook signature verification failed:", msg);
            return res.status(400).json({ error: "Invalid signature" });
          }

          // Non-signature sync error (e.g. schema/insert issues for events the
          // library doesn't fully support). Log it but continue so we still
          // run our billing logic and return 200 to Stripe.
          console.warn(
            `[Stripe] Sync error (non-fatal) for event ${eventType ?? "unknown"}:`,
            msg,
          );
        }
      } else {
        console.log(`[Webhook] Skipping sync for non-syncable event: ${eventType}`);
      }

      console.log("[Webhook] Processing event:", eventType);
      await processBillingWebhook(eventBody);

      res.status(200).json({ received: true });
    } catch (error: any) {
      console.error("[Stripe] Webhook error:", error.message);
      // Return 200 so Stripe stops retrying — we've already logged the error.
      // Returning 4xx caused Stripe to retry indefinitely and threaten to
      // disable the webhook on April 23, 2026.
      res.status(200).json({ received: true, warning: "internal error logged" });
    }
  }
);

async function processBillingWebhook(event: any) {
  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userRegistrationId = session.metadata?.userRegistrationId;
      const tier = session.metadata?.tier;

      console.log("[Webhook] checkout.session.completed - userRegistrationId:", userRegistrationId, "tier:", tier);

      if (userRegistrationId) {
        const credits = tier === "subscription" ? 2 : 1;
        
        await storage.upsertBillingProfile(userRegistrationId, {
          currentTier: tier as any,
          creditsRemaining: credits,
          stripeCustomerId: session.customer,
          activeSubscriptionId: session.subscription || null,
          lastPaymentAt: new Date(),
        });

        await storage.addCredits(userRegistrationId, credits, "purchase");

        await storage.createTransactionRecord({
          userRegistrationId,
          stripeCheckoutSessionId: session.id,
          stripePaymentIntentId: session.payment_intent,
          amount: session.amount_total,
          currency: session.currency,
          taxAmount: session.total_details?.amount_tax,
          tier: tier as any,
          paymentStatus: "succeeded",
          paidAt: new Date(),
        });
        
        console.log("[Webhook] Billing profile updated for:", userRegistrationId, "credits:", credits, "tier:", tier);
      }
    }

    if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object;
      const customerId = invoice.customer;

      console.log("[Webhook] invoice.payment_succeeded - customerId:", customerId);

      const billingProfile = await storage.getBillingProfileByStripeCustomer(customerId);
      if (billingProfile && billingProfile.currentTier === "subscription") {
        await storage.addCredits(billingProfile.userRegistrationId, 2, "reset");
        await storage.updateBillingProfile(billingProfile.userRegistrationId, {
          lastPaymentAt: new Date(),
        });

        await storage.createTransactionRecord({
          userRegistrationId: billingProfile.userRegistrationId,
          stripeInvoiceId: invoice.id,
          amount: invoice.amount_paid,
          currency: invoice.currency,
          taxAmount: invoice.tax,
          tier: "subscription",
          paymentStatus: "succeeded",
          paidAt: new Date(),
        });
        
        console.log("[Webhook] Subscription credits reset for:", billingProfile.userRegistrationId);
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;
      const customerId = subscription.customer;

      console.log("[Webhook] customer.subscription.deleted - customerId:", customerId);

      const billingProfile = await storage.getBillingProfileByStripeCustomer(customerId);
      if (billingProfile) {
        await storage.updateBillingProfile(billingProfile.userRegistrationId, {
          currentTier: "free",
          activeSubscriptionId: null,
          creditsRemaining: 0,
        });
        
        console.log("[Webhook] Subscription cancelled for:", billingProfile.userRegistrationId);
      }
    }
  } catch (error) {
    console.error("[Webhook] Error processing billing:", error);
    // Don't throw - we still want to return 200 to Stripe
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

// Background initialization (runs after server starts)
async function initializeBackground() {
  // Skip migrations in production - schema is managed via db:push
  // This prevents deployment timeout issues
  if (process.env.NODE_ENV !== "production") {
    console.log("[Database] Running migrations (dev only)...");
    try {
      await migrate(db, { migrationsFolder: "./migrations" });
      console.log("[Database] Migrations complete");
    } catch (error: any) {
      if (error?.code === "42P07") {
        // Schema is managed via `npm run db:push`; the legacy migration files
        // overlap with the pushed schema, so "already exists" here is benign.
        console.log("[Database] Schema already up to date (managed via db:push)");
      } else {
        console.error("[Database] Migration error:", error);
      }
    }
  } else {
    console.log("[Database] Skipping migrations in production");
  }
  
  await initStripe();
}

(async () => {
  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Default to 5000 for development
  const port = parseInt(process.env.PORT || "5000", 10);
  console.log(`[Server] PORT env: ${process.env.PORT}, using port: ${port}`);
  
  // In production, register all routes BEFORE listening
  if (process.env.NODE_ENV === "production") {
    console.log("[Production] Initializing routes...");
    
    // Add health endpoint
    app.get("/health", (_req, res) => {
      res.status(200).send("OK");
    });
    
    // Register all routes (includes auth/session setup)
    await registerRoutes(httpServer, app);
    
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      console.error("[Error Handler]", err.message, err.stack);
      res.status(status).json({ message });
    });
    
    // Serve static files
    serveStatic(app);
    
    console.log("[Production] Routes initialized, starting server...");
    
    // Now start listening
    httpServer.listen(
      {
        port,
        host: "0.0.0.0",
        reusePort: true,
      },
      () => {
        log(`serving on port ${port}`);
        
        // Run background initialization (stripe sync, etc.)
        initializeBackground().catch(err => {
          console.error("[Background Init] Error:", err);
        });
      },
    );
  } else {
    // Development mode - original behavior
    await registerRoutes(httpServer, app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      console.error("[Error Handler]", err.message, err.stack);
      res.status(status).json({ message });
    });

    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);

    httpServer.listen(
      {
        port,
        host: "0.0.0.0",
        reusePort: true,
      },
      () => {
        log(`serving on port ${port}`);
        initializeBackground().catch(err => {
          console.error("[Background Init] Error:", err);
        });
      },
    );
  }
})();
