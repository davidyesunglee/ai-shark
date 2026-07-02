import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export type AssessmentStatus = "analyzing" | "complete" | "needs_review" | "failed";

export const userRegistrations = pgTable("user_registrations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique(),
  username: varchar("username").notNull(),
  email: varchar("email").notNull(),
  phoneNumber: varchar("phone_number"),
  streetAddress: text("street_address"),
  city: varchar("city"),
  state: varchar("state"),
  zipCode: varchar("zip_code"),
  country: varchar("country").notNull().default("United States"),
  companyName: varchar("company_name"),
  jobTitle: varchar("job_title"),
  industry: varchar("industry"),
  companySize: varchar("company_size"),
  howDidYouHear: varchar("how_did_you_hear"),
  registeredAt: timestamp("registered_at").defaultNow().notNull(),
  emailedAt: timestamp("emailed_at"),
});

export const insertUserRegistrationSchema = createInsertSchema(userRegistrations).omit({
  id: true,
  registeredAt: true,
  emailedAt: true,
});

export type InsertUserRegistration = z.infer<typeof insertUserRegistrationSchema>;
export type UserRegistration = typeof userRegistrations.$inferSelect;

export const criterionScoreSchema = z.object({
  id: z.string(),
  name: z.string(),
  score: z.number(),
  analysis: z.string(),
  keyFindings: z.array(z.string()),
});

export type CriterionScore = z.infer<typeof criterionScoreSchema>;

export const swotSchema = z.object({
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  opportunities: z.array(z.string()),
  threats: z.array(z.string()),
});

export type SwotAnalysis = z.infer<typeof swotSchema>;

export const marketAnalysisSchema = z.object({
  targetMarket: z.string(),
  marketSize: z.string(),
  competitivePosition: z.string(),
  growthPotential: z.string(),
});

export type MarketAnalysis = z.infer<typeof marketAnalysisSchema>;

export const financialRatioSchema = z.object({
  name: z.string(),
  value: z.string(),
  assessment: z.string(),
});

export type FinancialRatio = z.infer<typeof financialRatioSchema>;

export const assessments = pgTable("assessments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  businessName: text("business_name").notNull(),
  fileName: text("file_name").notNull(),
  fileContent: text("file_content"),
  uploadDate: timestamp("upload_date").defaultNow().notNull(),
  status: text("status").notNull().$type<AssessmentStatus>().default("analyzing"),
  overallScore: integer("overall_score"),
  lenderReadinessGrade: varchar("lender_readiness_grade"),
  executiveSummary: text("executive_summary"),
  criteria: jsonb("criteria").$type<CriterionScore[]>(),
  strengths: jsonb("strengths").$type<string[]>(),
  weaknesses: jsonb("weaknesses").$type<string[]>(),
  recommendations: jsonb("recommendations").$type<string[]>(),
  swot: jsonb("swot").$type<SwotAnalysis>(),
  marketAnalysis: jsonb("market_analysis").$type<MarketAnalysis>(),
  financialRatios: jsonb("financial_ratios").$type<FinancialRatio[]>(),
});

export const insertAssessmentSchema = createInsertSchema(assessments).omit({
  id: true,
  uploadDate: true,
});

export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type Assessment = typeof assessments.$inferSelect;

export type PaymentTier = "free" | "subscription" | "one_time";
export type PaymentStatus = "pending" | "succeeded" | "failed" | "refunded";
export type CreditReason = "purchase" | "evaluation" | "reset" | "manual";

export const billingProfiles = pgTable("billing_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userRegistrationId: varchar("user_registration_id").notNull().unique(),
  stripeCustomerId: varchar("stripe_customer_id"),
  currentTier: text("current_tier").notNull().$type<PaymentTier>().default("free"),
  activeSubscriptionId: varchar("active_subscription_id"),
  activePriceId: varchar("active_price_id"),
  creditsRemaining: integer("credits_remaining").notNull().default(0),
  creditWindowStart: timestamp("credit_window_start"),
  lastPaymentAt: timestamp("last_payment_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertBillingProfileSchema = createInsertSchema(billingProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertBillingProfile = z.infer<typeof insertBillingProfileSchema>;
export type BillingProfile = typeof billingProfiles.$inferSelect;

export const transactionRecords = pgTable("transaction_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userRegistrationId: varchar("user_registration_id").notNull(),
  stripePaymentIntentId: varchar("stripe_payment_intent_id"),
  stripeCheckoutSessionId: varchar("stripe_checkout_session_id"),
  stripeInvoiceId: varchar("stripe_invoice_id"),
  priceId: varchar("price_id"),
  amount: integer("amount").notNull(),
  currency: varchar("currency").notNull().default("usd"),
  taxAmount: integer("tax_amount"),
  tier: text("tier").$type<PaymentTier>(),
  paymentStatus: text("payment_status").notNull().$type<PaymentStatus>().default("pending"),
  paidAt: timestamp("paid_at"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  emailedAt: timestamp("emailed_at"),
});

export const insertTransactionRecordSchema = createInsertSchema(transactionRecords).omit({
  id: true,
  createdAt: true,
  emailedAt: true,
});

export type InsertTransactionRecord = z.infer<typeof insertTransactionRecordSchema>;
export type TransactionRecord = typeof transactionRecords.$inferSelect;

export const creditLedger = pgTable("credit_ledger", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userRegistrationId: varchar("user_registration_id").notNull(),
  assessmentId: varchar("assessment_id"),
  delta: integer("delta").notNull(),
  reason: text("reason").notNull().$type<CreditReason>(),
  balanceAfter: integer("balance_after").notNull(),
  occurredAt: timestamp("occurred_at").defaultNow().notNull(),
});

export const insertCreditLedgerSchema = createInsertSchema(creditLedger).omit({
  id: true,
  occurredAt: true,
});

export type InsertCreditLedger = z.infer<typeof insertCreditLedgerSchema>;
export type CreditLedgerEntry = typeof creditLedger.$inferSelect;

export const advertisingRevenue = pgTable("advertising_revenue", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  source: varchar("source").notNull(),
  amount: integer("amount").notNull(),
  currency: varchar("currency").notNull().default("usd"),
  impressions: integer("impressions"),
  clicks: integer("clicks"),
  reportDate: timestamp("report_date").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  emailedAt: timestamp("emailed_at"),
});

export const insertAdvertisingRevenueSchema = createInsertSchema(advertisingRevenue).omit({
  id: true,
  createdAt: true,
  emailedAt: true,
});

export type InsertAdvertisingRevenue = z.infer<typeof insertAdvertisingRevenueSchema>;
export type AdvertisingRevenue = typeof advertisingRevenue.$inferSelect;

export type FeedbackType = "general" | "bug" | "feature" | "support" | "satisfaction";

export const customerFeedback = pgTable("customer_feedback", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  email: varchar("email").notNull(),
  name: varchar("name"),
  feedbackType: text("feedback_type").notNull().$type<FeedbackType>().default("general"),
  subject: varchar("subject"),
  message: text("message").notNull(),
  rating: integer("rating"),
  assessmentId: varchar("assessment_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  emailedAt: timestamp("emailed_at"),
  resolved: boolean("resolved").default(false),
});

export const insertCustomerFeedbackSchema = createInsertSchema(customerFeedback).omit({
  id: true,
  createdAt: true,
  emailedAt: true,
  resolved: true,
});

export type InsertCustomerFeedback = z.infer<typeof insertCustomerFeedbackSchema>;
export type CustomerFeedback = typeof customerFeedback.$inferSelect;

// ── Site visits & clicks tracking ──────────────────────────────────
export type SiteEventType = "visit" | "click";

export const siteEvents = pgTable("site_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventType: text("event_type").notNull().$type<SiteEventType>().default("visit"),
  path: varchar("path").notNull(),
  label: varchar("label"),
  referrer: text("referrer"),
  userAgent: text("user_agent"),
  ipHash: varchar("ip_hash"),
  occurredAt: timestamp("occurred_at").defaultNow().notNull(),
});

export const insertSiteEventSchema = createInsertSchema(siteEvents).omit({
  id: true,
  occurredAt: true,
});

export type InsertSiteEvent = z.infer<typeof insertSiteEventSchema>;
export type SiteEvent = typeof siteEvents.$inferSelect;

export * from "./models/chat";
export * from "./models/auth";
