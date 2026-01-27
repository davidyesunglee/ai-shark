import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { parseDocument } from "./documentParser";
import { analyzeBusinessPlan, isOpenAIConfigured } from "./openai";
import { setupAuth, isAuthenticated } from "./replit_integrations/auth";
import { insertUserRegistrationSchema } from "@shared/schema";
import { startWeeklyEmailScheduler, startTransactionEmailScheduler } from "./emailScheduler";
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
      dbStatus,
      host: req.get("host"),
      protocol: req.protocol,
      secure: req.secure,
      timestamp: new Date().toISOString(),
    });
  });

  await setupAuth(app);
  
  startWeeklyEmailScheduler();
  startTransactionEmailScheduler();

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
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      if (!isOpenAIConfigured()) {
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
      const registration = await storage.getUserRegistration(userId);
      if (!registration) {
        return res.status(403).json({ message: "Registration required" });
      }

      const billingProfile = await storage.getBillingProfile(registration.id);
      res.json({
        tier: billingProfile?.currentTier || "free",
        creditsRemaining: billingProfile?.creditsRemaining || 0,
        hasActiveSubscription: !!billingProfile?.activeSubscriptionId,
      });
    } catch (error) {
      console.error("Error fetching billing status:", error);
      res.status(500).json({ message: "Failed to fetch billing status" });
    }
  });

  app.get("/api/products", async (req, res) => {
    try {
      console.log("[Products] Fetching products from stripe schema...");
      const result = await db.execute(sql`
        SELECT 
          p.id as product_id,
          p.name as product_name,
          p.description as product_description,
          p.metadata as product_metadata,
          pr.id as price_id,
          pr.unit_amount,
          pr.currency,
          pr.recurring
        FROM stripe.products p
        LEFT JOIN stripe.prices pr ON pr.product = p.id AND pr.active = true
        WHERE p.active = true
        ORDER BY pr.unit_amount
      `);
      console.log("[Products] Query returned", result.rows?.length, "rows");

      const productsMap = new Map();
      for (const row of result.rows as any[]) {
        if (!productsMap.has(row.product_id)) {
          productsMap.set(row.product_id, {
            id: row.product_id,
            name: row.product_name,
            description: row.product_description,
            metadata: row.product_metadata,
            prices: [],
          });
        }
        if (row.price_id) {
          productsMap.get(row.product_id).prices.push({
            id: row.price_id,
            unit_amount: row.unit_amount,
            currency: row.currency,
            recurring: row.recurring,
          });
        }
      }

      const products = Array.from(productsMap.values());
      console.log("[Products] Returning", products.length, "products:", JSON.stringify(products.map(p => ({ id: p.id, name: p.name, priceIds: p.prices.map((pr: any) => pr.id) }))));
      res.json({ products });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.post("/api/checkout/create-session", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      const { priceId } = req.body;
      
      console.log("[Checkout] Starting checkout for user:", userId, "price:", priceId, "body:", JSON.stringify(req.body));

      if (!priceId) {
        console.log("[Checkout] ERROR: No priceId provided");
        return res.status(400).json({ message: "Price ID is required" });
      }

      const registration = await storage.getUserRegistration(userId);
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
      executiveSummary: result.executiveSummary,
      criteria: result.criteria,
      strengths: result.strengths,
      weaknesses: result.weaknesses,
      recommendations: result.recommendations,
    });

    console.log(`Analysis complete for assessment ${assessmentId}`);
  } catch (error) {
    console.error(`Analysis failed for assessment ${assessmentId}:`, error);
    await storage.updateAssessment(assessmentId, {
      status: "failed",
    });
  }
}
