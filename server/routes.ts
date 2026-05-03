import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { parseDocument } from "./documentParser";
import { analyzeBusinessPlan, isOpenAIConfigured } from "./openai";
import { setupAuth, isAuthenticated } from "./replit_integrations/auth";
import { insertUserRegistrationSchema, insertCustomerFeedbackSchema } from "@shared/schema";
import { startWeeklyEmailScheduler, startTransactionEmailScheduler, startRevenueReportScheduler, startExpenseReportScheduler, startWeeklySiteReportScheduler, triggerSiteReportManually, startWeeklyVisitsReportScheduler, triggerVisitsReportManually } from "./emailScheduler";
import crypto from "crypto";
import { getUncachableStripeClient, getStripePublishableKey } from "./stripeClient";
import { db } from "./db";
import { sql } from "drizzle-orm";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // ── Site visits & clicks tracking ──────────────────────────────────
  // Server-side page-view tracking. Records only HTML page navigations
  // (not API calls, not static assets, not bots). IPs are hashed for privacy.
  const TRACKED_PAGE_PATHS = new Set([
    "/", "/pricing", "/education", "/about", "/contact",
    "/privacy", "/terms", "/login", "/signup", "/register",
    "/dashboard", "/payment/success", "/verify-email",
  ]);
  const BOT_REGEX = /bot|crawler|spider|crawling|facebookexternalhit|slurp|mediapartners|googlebot|bingbot|baiduspider|yandex|duckduckbot|applebot|gptbot|claudebot|ccbot/i;
  const VISITS_HASH_SALT = process.env.SESSION_SECRET || "ai-shark-default-salt";

  app.use((req, _res, next) => {
    try {
      if (req.method !== "GET") return next();
      const path = req.path;
      // Only track top-level page paths the user can navigate to
      if (!TRACKED_PAGE_PATHS.has(path)) return next();
      // Skip API/static (already filtered above, but extra safety)
      if (path.startsWith("/api") || path.startsWith("/assets")) return next();
      // Skip bots
      const ua = (req.headers["user-agent"] as string) || "";
      if (BOT_REGEX.test(ua)) return next();
      // Skip prefetch / non-HTML asks
      const accept = (req.headers["accept"] as string) || "";
      if (accept && !accept.includes("text/html") && !accept.includes("*/*")) {
        return next();
      }

      const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.ip || "";
      const ipHash = ip
        ? crypto.createHash("sha256").update(VISITS_HASH_SALT + ip).digest("hex").substring(0, 32)
        : null;

      // Fire-and-forget — never delay request
      storage.recordSiteEvent({
        eventType: "visit",
        path,
        label: null as any,
        referrer: (req.headers["referer"] as string) || null as any,
        userAgent: ua.substring(0, 500) || null as any,
        ipHash: ipHash as any,
      }).catch(() => {});
    } catch {
      // Never block requests on tracking errors
    }
    next();
  });

  // SPA pageview tracking — Wouter route changes don't hit the server, so
  // the client beacons the new path here on each in-app navigation.
  app.post("/api/track-pageview", async (req, res) => {
    try {
      const path = String(req.body?.path || "/").substring(0, 200);
      if (!TRACKED_PAGE_PATHS.has(path)) return res.status(204).end();
      const ua = (req.headers["user-agent"] as string) || "";
      if (BOT_REGEX.test(ua)) return res.status(204).end();
      const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.ip || "";
      const ipHash = ip
        ? crypto.createHash("sha256").update(VISITS_HASH_SALT + ip).digest("hex").substring(0, 32)
        : null;
      const clientReferrer = typeof req.body?.referrer === "string" ? req.body.referrer.substring(0, 500) : null;
      await storage.recordSiteEvent({
        eventType: "visit",
        path,
        label: null as any,
        referrer: clientReferrer as any,
        userAgent: ua.substring(0, 500) || null as any,
        ipHash: ipHash as any,
      });
      res.status(204).end();
    } catch (err: any) {
      console.error("[Track Pageview] error:", err.message);
      res.status(204).end();
    }
  });

  // Lightweight click-tracking endpoint used by the trackClick() client helper
  app.post("/api/track-click", async (req, res) => {
    try {
      const label = String(req.body?.label || "").substring(0, 100);
      const path = String(req.body?.path || "/").substring(0, 200);
      if (!label) return res.status(204).end();
      const ua = (req.headers["user-agent"] as string) || "";
      if (BOT_REGEX.test(ua)) return res.status(204).end();
      const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.ip || "";
      const ipHash = ip
        ? crypto.createHash("sha256").update(VISITS_HASH_SALT + ip).digest("hex").substring(0, 32)
        : null;
      await storage.recordSiteEvent({
        eventType: "click",
        path,
        label,
        referrer: (req.headers["referer"] as string) || null as any,
        userAgent: ua.substring(0, 500) || null as any,
        ipHash: ipHash as any,
      });
      res.status(204).end();
    } catch (err: any) {
      console.error("[Track Click] error:", err.message);
      res.status(204).end();
    }
  });

  // Admin: trigger weekly visits/clicks report manually
  app.post("/api/admin/trigger-visits-report", async (req, res) => {
    try {
      const adminKey = req.headers["x-admin-key"];
      if (adminKey !== process.env.SESSION_SECRET) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      await triggerVisitsReportManually();
      res.json({ success: true, message: "Visits report sent" });
    } catch (error: any) {
      console.error("[Admin] Visits report error:", error);
      res.status(500).json({ message: error.message || "Failed" });
    }
  });

  // ── SEO: robots.txt and sitemap.xml ─────────────────────────────────
  // These are served from Express so they work in both dev and production
  // without depending on Vite's static file copy behavior.
  app.get("/robots.txt", (_req, res) => {
    res.type("text/plain").send(
`User-agent: *
Allow: /
Disallow: /admin/
Disallow: /dashboard
Disallow: /api/
Disallow: /payment/success
Disallow: /verify-email
Disallow: /register

# Block aggressive AI training bots that don't drive traffic
User-agent: GPTBot
Disallow: /
User-agent: ClaudeBot
Disallow: /
User-agent: CCBot
Disallow: /

Sitemap: https://aishark.org/sitemap.xml
`
    );
  });

  app.get("/sitemap.xml", (_req, res) => {
    const today = new Date().toISOString().split("T")[0];
    const pages: Array<{ loc: string; priority: string; changefreq: string }> = [
      { loc: "/", priority: "1.0", changefreq: "weekly" },
      { loc: "/pricing", priority: "0.9", changefreq: "monthly" },
      { loc: "/education", priority: "0.9", changefreq: "monthly" },
      { loc: "/about", priority: "0.7", changefreq: "monthly" },
      { loc: "/contact", priority: "0.6", changefreq: "monthly" },
      { loc: "/signup", priority: "0.8", changefreq: "monthly" },
      { loc: "/login", priority: "0.5", changefreq: "yearly" },
      { loc: "/privacy", priority: "0.3", changefreq: "yearly" },
      { loc: "/terms", priority: "0.3", changefreq: "yearly" },
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (p) =>
      `  <url>
    <loc>https://aishark.org${p.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    res.type("application/xml").send(xml);
  });

  // Health check endpoint for debugging production issues
  app.get("/api/health", async (req, res) => {
    let dbStatus = "unknown";
    try {
      await db.execute(sql`SELECT 1`);
      dbStatus = "connected";
    } catch (e: any) {
      dbStatus = `error: ${e.message}`;
    }
    
    res.json({
      status: "ok",
      environment: process.env.NODE_ENV || "not set",
      hasSessionSecret: !!process.env.SESSION_SECRET,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasAiConfig: isOpenAIConfigured(),
      dbStatus,
      host: req.get("host"),
      protocol: req.protocol,
      secure: req.secure,
      timestamp: new Date().toISOString(),
    });
  });

  // Force Stripe resync endpoint (for fixing stale data)
  app.post("/api/admin/stripe-resync", async (req, res) => {
    try {
      const adminKey = req.headers["x-admin-key"];
      if (adminKey !== process.env.SESSION_SECRET) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      console.log("[Admin] Starting Stripe resync...");
      const { getStripeSync } = await import("./stripeClient");
      const stripeSync = await getStripeSync();
      
      // Force full resync
      await stripeSync.syncBackfill();
      
      console.log("[Admin] Stripe resync complete");
      res.json({ success: true, message: "Stripe data resynced successfully" });
    } catch (error: any) {
      console.error("[Admin] Stripe resync error:", error);
      res.status(500).json({ message: error.message || "Resync failed" });
    }
  });

  // Admin endpoint to record advertising revenue (for AdSense data import)
  app.post("/api/admin/advertising-revenue", async (req, res) => {
    try {
      const adminKey = req.headers["x-admin-key"];
      if (adminKey !== process.env.SESSION_SECRET) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const { source, amount, impressions, clicks, reportDate } = req.body;
      
      if (!source || amount === undefined || !reportDate) {
        return res.status(400).json({ message: "Missing required fields: source, amount, reportDate" });
      }
      
      const entry = await storage.createAdvertisingRevenue({
        source,
        amount: Math.round(amount * 100), // Convert to cents
        impressions: impressions || 0,
        clicks: clicks || 0,
        reportDate: new Date(reportDate),
      });
      
      console.log(`[Admin] Advertising revenue recorded: $${amount} from ${source}`);
      res.json({ success: true, entry });
    } catch (error: any) {
      console.error("[Admin] Advertising revenue error:", error);
      res.status(500).json({ message: error.message || "Failed to record advertising revenue" });
    }
  });

  // Customer feedback endpoint (public - no auth required)
  app.post("/api/feedback", async (req, res) => {
    try {
      const validatedData = insertCustomerFeedbackSchema.parse(req.body);
      const feedback = await storage.createCustomerFeedback(validatedData);
      
      // Send email notification for new feedback
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        await resend.emails.send({
          from: "AI Shark <info@aishark.org>",
          to: "vemangum@gmail.com",
          subject: `New Customer Feedback: ${validatedData.feedbackType} - ${validatedData.subject}`,
          html: `
            <h2>New Customer Feedback Received</h2>
            <p><strong>From:</strong> ${validatedData.name} (${validatedData.email})</p>
            <p><strong>Type:</strong> ${validatedData.feedbackType}</p>
            <p><strong>Subject:</strong> ${validatedData.subject}</p>
            <p><strong>Message:</strong></p>
            <p>${validatedData.message}</p>
            <hr>
            <p><em>Submitted at: ${new Date().toISOString()}</em></p>
          `,
        });
        console.log("[Feedback] Email notification sent");
      } catch (emailError) {
        console.error("[Feedback] Failed to send email notification:", emailError);
      }
      
      res.json({ success: true, feedback });
    } catch (error: any) {
      console.error("[Feedback] Error:", error);
      res.status(400).json({ message: error.message || "Failed to submit feedback" });
    }
  });

  // Admin feedback monitoring endpoint
  app.get("/api/admin/feedback", async (req, res) => {
    try {
      const adminKey = req.headers["x-admin-key"];
      if (adminKey !== process.env.SESSION_SECRET) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const allFeedback = await storage.getAllFeedback();
      res.json(allFeedback);
    } catch (error: any) {
      console.error("[Admin Feedback] Error:", error);
      res.status(500).json({ message: error.message || "Failed to fetch feedback" });
    }
  });

  // Admin mark feedback as resolved
  app.patch("/api/admin/feedback/:id", async (req, res) => {
    try {
      const adminKey = req.headers["x-admin-key"];
      if (adminKey !== process.env.SESSION_SECRET) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const { id } = req.params;
      const { resolved } = req.body;
      
      const updated = await storage.updateFeedback(id, { resolved });
      res.json({ success: true, feedback: updated });
    } catch (error: any) {
      console.error("[Admin Feedback] Update error:", error);
      res.status(500).json({ message: error.message || "Failed to update feedback" });
    }
  });

  await setupAuth(app);
  
  startWeeklyEmailScheduler();
  startTransactionEmailScheduler();
  startRevenueReportScheduler();
  startExpenseReportScheduler();
  startWeeklySiteReportScheduler();
  startWeeklyVisitsReportScheduler();

  app.get("/api/registration/status", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      const registration = await storage.getUserRegistration(userId);
      res.json({ isRegistered: !!registration, registration });
    } catch (error) {
      console.error("Error checking registration status:", error);
      res.status(500).json({ message: "Failed to check registration status" });
    }
  });

  app.post("/api/registration", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      
      const existing = await storage.getUserRegistration(userId);
      if (existing) {
        return res.status(400).json({ message: "Already registered" });
      }

      const validatedData = insertUserRegistrationSchema.parse({
        ...req.body,
        userId: userId,
      });

      const registration = await storage.createUserRegistration(validatedData);
      res.json({ success: true, registration });
    } catch (error: any) {
      console.error("Error creating registration:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid registration data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create registration" });
    }
  });

  app.get("/api/registrations/export", isAuthenticated, async (req: any, res) => {
    try {
      const registrations = await storage.getAllRegistrations();
      
      const csvHeader = "ID,Username,Email,Phone,Street Address,City,State,Zip,Country,Company,Job Title,Industry,Company Size,How Heard,Registered At\n";
      const csvRows = registrations.map(r => 
        `"${r.id}","${r.username}","${r.email}","${r.phoneNumber}","${r.streetAddress}","${r.city}","${r.state}","${r.zipCode}","${r.country}","${r.companyName || ''}","${r.jobTitle || ''}","${r.industry || ''}","${r.companySize || ''}","${r.howDidYouHear || ''}","${r.registeredAt}"`
      ).join("\n");
      
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=registrations.csv");
      res.send(csvHeader + csvRows);
    } catch (error) {
      console.error("Error exporting registrations:", error);
      res.status(500).json({ message: "Failed to export registrations" });
    }
  });

  app.post("/api/admin/trigger-emails", isAuthenticated, async (req: any, res) => {
    try {
      const { triggerEmailManually } = await import("./emailScheduler");
      await triggerEmailManually();
      res.json({ success: true, message: "Email triggered successfully" });
    } catch (error) {
      console.error("Error triggering email:", error);
      res.status(500).json({ message: "Failed to trigger email" });
    }
  });

  app.post("/api/admin/trigger-site-report", async (req, res) => {
    try {
      const adminKey = req.headers["x-admin-key"];
      if (adminKey !== process.env.SESSION_SECRET) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      await triggerSiteReportManually();
      res.json({ success: true, message: "Weekly site report triggered successfully" });
    } catch (error: any) {
      console.error("Error triggering site report:", error);
      res.status(500).json({ message: error.message || "Failed to trigger site report" });
    }
  });

  app.get("/api/assessments", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      const assessments = await storage.getAssessmentsByUser(userId);
      const mapped = assessments.map((a) => ({
        id: a.id,
        businessName: a.businessName,
        fileName: a.fileName,
        uploadDate: a.uploadDate,
        status: a.status,
        overallScore: a.overallScore,
      }));
      res.json(mapped);
    } catch (error) {
      console.error("Error fetching assessments:", error);
      res.status(500).json({ message: "Failed to fetch assessments" });
    }
  });

  app.get("/api/assessments/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      const assessment = await storage.getAssessment(req.params.id);
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }
      if (assessment.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      res.json(assessment);
    } catch (error) {
      console.error("Error fetching assessment:", error);
      res.status(500).json({ message: "Failed to fetch assessment" });
    }
  });

  app.post("/api/assessments/upload", isAuthenticated, upload.single("file"), async (req: any, res) => {
    console.log("[Upload] Request received, user:", req.user?.id);
    try {
      if (!req.file) {
        console.log("[Upload] No file in request");
        return res.status(400).json({ message: "No file uploaded" });
      }

      console.log("[Upload] File received:", req.file.originalname, "size:", req.file.size);

      if (!isOpenAIConfigured()) {
        console.log("[Upload] AI not configured");
        return res.status(503).json({ message: "AI analysis is not configured." });
      }

      const userId = req.user?.id;
      
      const registration = await storage.getUserRegistration(userId);
      if (!registration) {
        return res.status(403).json({ message: "Registration required before uploading business plans" });
      }

      const billingProfile = await storage.getBillingProfile(registration.id);
      if (!billingProfile || billingProfile.currentTier === "free") {
        return res.status(402).json({ 
          message: "Payment required. Please purchase a subscription or one-time evaluation.",
          requiresPayment: true 
        });
      }

      if (billingProfile.creditsRemaining <= 0) {
        return res.status(402).json({ 
          message: "No evaluation credits remaining. Please purchase additional credits.",
          requiresPayment: true 
        });
      }

      const { originalname, mimetype, buffer } = req.file;

      let fileContent: string;
      try {
        fileContent = await parseDocument(buffer, mimetype);
      } catch (parseError) {
        console.error("Document parsing error:", parseError);
        return res.status(400).json({ message: "Failed to parse document" });
      }

      const businessName = originalname
        .replace(/\.[^/.]+$/, "")
        .replace(/[_-]/g, " ")
        .replace(/\b\w/g, (c: string) => c.toUpperCase());

      const assessment = await storage.createAssessment({
        userId,
        businessName,
        fileName: originalname,
        fileContent,
        status: "analyzing",
        overallScore: null,
        executiveSummary: null,
        criteria: null,
        strengths: null,
        weaknesses: null,
        recommendations: null,
      });

      await storage.deductCredit(registration.id, assessment.id);

      res.json({
        id: assessment.id,
        businessName: assessment.businessName,
        fileName: assessment.fileName,
        uploadDate: assessment.uploadDate,
        status: assessment.status,
        overallScore: assessment.overallScore,
      });

      analyzeInBackground(assessment.id, fileContent);
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  app.delete("/api/assessments/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      const assessment = await storage.getAssessment(req.params.id);
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }
      if (assessment.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      const deleted = await storage.deleteAssessment(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Assessment not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting assessment:", error);
      res.status(500).json({ message: "Failed to delete assessment" });
    }
  });

  app.get("/api/stripe/publishable-key", async (req, res) => {
    try {
      const publishableKey = await getStripePublishableKey();
      res.json({ publishableKey });
    } catch (error) {
      console.error("Error getting Stripe key:", error);
      res.status(500).json({ message: "Stripe not configured" });
    }
  });

  app.get("/api/billing/status", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      console.log("[Billing Status] userId:", userId);
      
      const registration = await storage.getUserRegistration(userId);
      console.log("[Billing Status] registration:", registration?.id, registration?.email);
      
      if (!registration) {
        return res.status(403).json({ message: "Registration required" });
      }

      const billingProfile = await storage.getBillingProfile(registration.id);
      console.log("[Billing Status] billingProfile:", JSON.stringify(billingProfile));
      
      const response = {
        tier: billingProfile?.currentTier || "free",
        creditsRemaining: billingProfile?.creditsRemaining || 0,
        hasActiveSubscription: !!billingProfile?.activeSubscriptionId,
      };
      console.log("[Billing Status] response:", JSON.stringify(response));
      
      res.json(response);
    } catch (error) {
      console.error("Error fetching billing status:", error);
      res.status(500).json({ message: "Failed to fetch billing status" });
    }
  });

  app.get("/api/products", async (req, res) => {
    try {
      console.log("[Products] Fetching products directly from Stripe API...");
      
      // Fetch directly from Stripe to avoid stale database cache
      const stripe = await getUncachableStripeClient();
      
      // Get active products with their prices
      const stripeProducts = await stripe.products.list({
        active: true,
        expand: ['data.default_price'],
      });
      
      // Get active prices for these products
      const stripePrices = await stripe.prices.list({
        active: true,
        limit: 100,
      });
      
      // Build products with their prices
      const productsMap = new Map();
      
      for (const product of stripeProducts.data) {
        // Only include products with tier metadata
        if (product.metadata?.tier) {
          productsMap.set(product.id, {
            id: product.id,
            name: product.name,
            description: product.description || "",
            metadata: product.metadata,
            prices: [],
          });
        }
      }
      
      // Add prices to their products
      for (const price of stripePrices.data) {
        const productId = typeof price.product === 'string' ? price.product : price.product.id;
        if (productsMap.has(productId)) {
          productsMap.get(productId).prices.push({
            id: price.id,
            unit_amount: price.unit_amount,
            currency: price.currency,
            recurring: price.recurring,
          });
        }
      }
      
      // Sort prices by amount
      Array.from(productsMap.values()).forEach((product: any) => {
        product.prices.sort((a: any, b: any) => (a.unit_amount || 0) - (b.unit_amount || 0));
      });

      const products = Array.from(productsMap.values());
      console.log("[Products] Returning", products.length, "products from Stripe API:", JSON.stringify(products.map(p => ({ id: p.id, name: p.name, priceIds: p.prices.map((pr: any) => pr.id) }))));
      res.json({ products });
    } catch (error: any) {
      console.error("[Products] Error fetching from Stripe:", error.message);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.post("/api/checkout/create-session", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      const { priceId } = req.body;
      
      console.log("[Checkout] Starting checkout for user:", userId, "price:", priceId, "body:", JSON.stringify(req.body));
      console.log("[Checkout] req.user object:", JSON.stringify(req.user));

      if (!priceId) {
        console.log("[Checkout] ERROR: No priceId provided");
        return res.status(400).json({ message: "Price ID is required" });
      }

      if (!userId) {
        console.log("[Checkout] ERROR: No userId in request");
        return res.status(401).json({ message: "Not authenticated" });
      }

      const registration = await storage.getUserRegistration(userId);
      console.log("[Checkout] Registration lookup result:", JSON.stringify(registration));
      if (!registration) {
        console.log("[Checkout] Registration not found for user:", userId);
        return res.status(403).json({ message: "Registration required" });
      }

      let stripe;
      try {
        stripe = await getUncachableStripeClient();
      } catch (stripeError: any) {
        console.error("[Checkout] Failed to initialize Stripe client:", stripeError.message);
        return res.status(500).json({ message: "Payment system temporarily unavailable. Please try again later." });
      }

      // Fetch the price to determine if it's recurring
      let price;
      try {
        price = await stripe.prices.retrieve(priceId);
      } catch (priceError: any) {
        console.error("[Checkout] Failed to retrieve price:", priceError.message);
        return res.status(400).json({ message: "Invalid price selected. Please refresh and try again." });
      }
      
      const isSubscription = !!price.recurring;
      const mode = isSubscription ? "subscription" : "payment";
      const tier = isSubscription ? "subscription" : "one_time";

      let billingProfile = await storage.getBillingProfile(registration.id);
      let customerId = billingProfile?.stripeCustomerId;

      if (!customerId) {
        console.log("[Checkout] Creating new Stripe customer for registration:", registration.id);
        const customer = await stripe.customers.create({
          email: registration.email,
          name: registration.username,
          metadata: { userRegistrationId: registration.id },
        });
        customerId = customer.id;

        billingProfile = await storage.upsertBillingProfile(registration.id, {
          stripeCustomerId: customerId,
        });
      }

      const baseUrl = `https://${process.env.REPLIT_DOMAINS?.split(",")[0]}`;
      console.log("[Checkout] Creating session with baseUrl:", baseUrl);
      
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ["card"],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: mode,
        success_url: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/pricing`,
        automatic_tax: { enabled: true },
        billing_address_collection: "required",
        customer_update: {
          address: "auto",
          name: "auto",
        },
        metadata: {
          userRegistrationId: registration.id,
          tier: tier,
        },
      });

      console.log("[Checkout] Session created:", session.id);
      res.json({ url: session.url });
    } catch (error: any) {
      console.error("[Checkout] Error creating checkout session:", error.message, error.stack);
      res.status(500).json({ message: error.message || "Failed to create checkout session" });
    }
  });

  app.post("/api/billing/portal", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      const registration = await storage.getUserRegistration(userId);
      if (!registration) {
        return res.status(403).json({ message: "Registration required" });
      }

      const billingProfile = await storage.getBillingProfile(registration.id);
      if (!billingProfile?.stripeCustomerId) {
        return res.status(400).json({ message: "No billing profile found" });
      }

      const stripe = await getUncachableStripeClient();
      const baseUrl = `https://${process.env.REPLIT_DOMAINS?.split(",")[0]}`;

      const session = await stripe.billingPortal.sessions.create({
        customer: billingProfile.stripeCustomerId,
        return_url: `${baseUrl}/dashboard`,
      });

      res.json({ url: session.url });
    } catch (error) {
      console.error("Error creating portal session:", error);
      res.status(500).json({ message: "Failed to create portal session" });
    }
  });

  app.post("/api/stripe/webhook/process", async (req: any, res) => {
    try {
      const event = req.body;
      
      if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const userRegistrationId = session.metadata?.userRegistrationId;
        const tier = session.metadata?.tier;

        if (userRegistrationId) {
          const credits = tier === "subscription" ? 2 : 1;
          
          await storage.upsertBillingProfile(userRegistrationId, {
            currentTier: tier as any,
            creditsRemaining: credits,
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
        }
      }

      if (event.type === "invoice.payment_succeeded") {
        const invoice = event.data.object;
        const customerId = invoice.customer;

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
        }
      }

      if (event.type === "customer.subscription.deleted") {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        const billingProfile = await storage.getBillingProfileByStripeCustomer(customerId);
        if (billingProfile) {
          await storage.updateBillingProfile(billingProfile.userRegistrationId, {
            currentTier: "free",
            activeSubscriptionId: null,
            creditsRemaining: 0,
          });
        }
      }

      res.json({ received: true });
    } catch (error) {
      console.error("Error processing webhook:", error);
      res.status(500).json({ message: "Webhook processing failed" });
    }
  });

  return httpServer;
}

async function analyzeInBackground(assessmentId: string, content: string) {
  try {
    const result = await analyzeBusinessPlan(content);

    await storage.updateAssessment(assessmentId, {
      status: "complete",
      overallScore: result.overallScore,
      lenderReadinessGrade: result.lenderReadinessGrade,
      executiveSummary: result.executiveSummary,
      criteria: result.criteria,
      strengths: result.strengths,
      weaknesses: result.weaknesses,
      recommendations: result.recommendations,
      swot: result.swot,
      marketAnalysis: result.marketAnalysis,
      financialRatios: result.financialRatios,
    });

    console.log(`Analysis complete for assessment ${assessmentId}`);
  } catch (error) {
    console.error(`Analysis failed for assessment ${assessmentId}:`, error);
    await storage.updateAssessment(assessmentId, {
      status: "failed",
    });
  }
}
