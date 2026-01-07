import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export type AssessmentStatus = "analyzing" | "complete" | "needs_review" | "failed";

export const userRegistrations = pgTable("user_registrations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  replitUserId: varchar("replit_user_id").notNull().unique(),
  username: varchar("username").notNull(),
  email: varchar("email").notNull(),
  phoneNumber: varchar("phone_number").notNull(),
  streetAddress: text("street_address").notNull(),
  city: varchar("city").notNull(),
  state: varchar("state").notNull(),
  zipCode: varchar("zip_code").notNull(),
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

export const assessments = pgTable("assessments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  businessName: text("business_name").notNull(),
  fileName: text("file_name").notNull(),
  fileContent: text("file_content"),
  uploadDate: timestamp("upload_date").defaultNow().notNull(),
  status: text("status").notNull().$type<AssessmentStatus>().default("analyzing"),
  overallScore: integer("overall_score"),
  executiveSummary: text("executive_summary"),
  criteria: jsonb("criteria").$type<CriterionScore[]>(),
  strengths: jsonb("strengths").$type<string[]>(),
  weaknesses: jsonb("weaknesses").$type<string[]>(),
  recommendations: jsonb("recommendations").$type<string[]>(),
});

export const insertAssessmentSchema = createInsertSchema(assessments).omit({
  id: true,
  uploadDate: true,
});

export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type Assessment = typeof assessments.$inferSelect;

export * from "./models/chat";
export * from "./models/auth";
