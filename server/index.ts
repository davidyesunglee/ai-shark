import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { runMigrations } from "stripe-replit-sync";
import { getStripeSync } from "./stripeClient";
import { WebhookHandlers } from "./webhookHandlers";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./db";

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

    const domain = process.env.REPLIT_DOMAINS?.split(",")[0];
    if (domain) {
      console.log("[Stripe] Setting up managed webhook...");
      const webhookBaseUrl = `https://${domain}`;
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

      await WebhookHandlers.processWebhook(req.body as Buffer, sig);
      res.status(200).json({ received: true });
    } catch (error: any) {
      console.error("[Stripe] Webhook error:", error.message);
      res.status(400).json({ error: "Webhook processing error" });
    }
  }
);

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
    } catch (error) {
      console.error("[Database] Migration error:", error);
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
