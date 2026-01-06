import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type AssessmentStatus = "analyzing" | "complete" | "needs_review" | "failed";

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
