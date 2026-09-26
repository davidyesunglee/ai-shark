import express, { type Express } from "express";
import { runMigrations } from "stripe-replit-sync";
import { TIER_CREDITS, isSubscriptionTier } from "@workspace/db";
import { storage } from "./storage";
import { getStripeSync } from "./stripeClient";
import { WebhookHandlers } from "./webhookHandlers";
import { logger } from "./lib/logger";

async function processBillingWebhook(event: any) {
  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userRegistrationId = session.metadata?.userRegistrationId;
      const tier = session.metadata?.tier;

      if (userRegistrationId) {
        if (await storage.hasTransactionForCheckoutSession(session.id)) return;

        const credits = TIER_CREDITS[tier as keyof typeof TIER_CREDITS] ?? 1;
        await storage.upsertBillingProfile(userRegistrationId, {
          currentTier: tier,
          stripeCustomerId: session.customer,
          activeSubscriptionId: session.subscription || null,
          lastPaymentAt: new Date(),
        });
        await storage.addCredits(
          userRegistrationId,
          credits,
          isSubscriptionTier(tier) ? "reset" : "purchase",
        );
        await storage.createTransactionRecord({
          userRegistrationId,
          stripeCheckoutSessionId: session.id,
          stripePaymentIntentId: session.payment_intent,
          amount: session.amount_total,
          currency: session.currency,
          taxAmount: session.total_details?.amount_tax,
          tier,
          paymentStatus: "succeeded",
          paidAt: new Date(),
        });
      }
    }

    if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object;
      if (invoice.billing_reason === "subscription_create") return;
      if (await storage.hasTransactionForInvoice(invoice.id)) return;

      const billingProfile = await storage.getBillingProfileByStripeCustomer(
        invoice.customer,
      );
      if (billingProfile && isSubscriptionTier(billingProfile.currentTier)) {
        const cycleCredits =
          TIER_CREDITS[
            billingProfile.currentTier as keyof typeof TIER_CREDITS
          ] ?? 2;
        await storage.addCredits(
          billingProfile.userRegistrationId,
          cycleCredits,
          "reset",
        );
        await storage.updateBillingProfile(billingProfile.userRegistrationId, {
          lastPaymentAt: new Date(),
        });
        await storage.createTransactionRecord({
          userRegistrationId: billingProfile.userRegistrationId,
          stripeInvoiceId: invoice.id,
          amount: invoice.amount_paid,
          currency: invoice.currency,
          taxAmount: invoice.tax,
          tier: billingProfile.currentTier,
          paymentStatus: "succeeded",
          paidAt: new Date(),
        });
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;
      const billingProfile = await storage.getBillingProfileByStripeCustomer(
        subscription.customer,
      );
      if (billingProfile) {
        await storage.updateBillingProfile(billingProfile.userRegistrationId, {
          currentTier: "free",
          activeSubscriptionId: null,
          creditsRemaining: 0,
        });
      }
    }
  } catch (error) {
    logger.error({ err: error }, "Error processing billing webhook");
  }
}

export function registerStripeWebhook(app: Express) {
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req, res) => {
      const signature = req.headers["stripe-signature"];
      if (!signature) {
        return res.status(400).json({ error: "Missing stripe-signature" });
      }

      const sig = Array.isArray(signature) ? signature[0] : signature;
      if (!Buffer.isBuffer(req.body)) {
        return res.status(500).json({ error: "Webhook processing error" });
      }

      let eventBody: any;
      try {
        eventBody = JSON.parse(req.body.toString());
      } catch {
        return res.status(400).json({ error: "Invalid payload" });
      }

      const eventType = eventBody?.type as string | undefined;
      if (eventType !== "invoice.upcoming") {
        try {
          await WebhookHandlers.processWebhook(req.body, sig);
        } catch (error: any) {
          const message = String(error?.message ?? "");
          const isSignatureError =
            error?.type === "StripeSignatureVerificationError" ||
            /signature|No signatures found/i.test(message);
          if (isSignatureError) {
            return res.status(400).json({ error: "Invalid signature" });
          }
          logger.warn(
            { err: error, eventType },
            "Non-fatal Stripe synchronization error",
          );
        }
      }

      await processBillingWebhook(eventBody);
      return res.status(200).json({ received: true });
    },
  );
}

export async function initializeStripe() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return;

  try {
    await runMigrations({ databaseUrl });
    const stripeSync = await getStripeSync();
    if (process.env.NODE_ENV === "production") {
      await stripeSync.findOrCreateManagedWebhook(
        "https://aishark.org/api/stripe/webhook",
      );
    }
    void stripeSync.syncBackfill().catch((error: unknown) => {
      logger.error({ err: error }, "Stripe background synchronization failed");
    });
  } catch (error) {
    logger.error({ err: error }, "Stripe initialization failed");
  }
}