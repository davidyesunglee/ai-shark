import { 
  assessments,
  userRegistrations,
  billingProfiles,
  transactionRecords,
  creditLedger,
  advertisingRevenue,
  customerFeedback,
  type Assessment,
  type InsertAssessment,
  type UserRegistration,
  type InsertUserRegistration,
  type BillingProfile,
  type InsertBillingProfile,
  type TransactionRecord,
  type InsertTransactionRecord,
  type InsertCreditLedger,
  type PaymentTier,
  type AdvertisingRevenue,
  type InsertAdvertisingRevenue,
  type CustomerFeedback,
  type InsertCustomerFeedback,
} from "@shared/schema";
import { db } from "./db";
import { eq, isNull, desc, sql, gte, and } from "drizzle-orm";

export interface IStorage {
  getAssessment(id: string): Promise<Assessment | undefined>;
  getAssessmentsByUser(userId: string): Promise<Assessment[]>;
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  updateAssessment(id: string, updates: Partial<Assessment>): Promise<Assessment | undefined>;
  deleteAssessment(id: string): Promise<boolean>;
  getUserRegistration(userId: string): Promise<UserRegistration | undefined>;
  createUserRegistration(registration: InsertUserRegistration): Promise<UserRegistration>;
  getAllRegistrations(): Promise<UserRegistration[]>;
  getUnsentRegistrations(): Promise<UserRegistration[]>;
  markRegistrationsAsEmailed(ids: string[]): Promise<void>;
  getAdvertisingRevenueLastWeek(): Promise<AdvertisingRevenue[]>;
  createAdvertisingRevenue(data: InsertAdvertisingRevenue): Promise<AdvertisingRevenue>;
  markAdvertisingRevenueAsEmailed(ids: string[]): Promise<void>;
  createCustomerFeedback(data: InsertCustomerFeedback): Promise<CustomerFeedback>;
  getAllFeedback(): Promise<CustomerFeedback[]>;
  updateFeedback(id: string, updates: Partial<CustomerFeedback>): Promise<CustomerFeedback | undefined>;
  getAssessmentsLastWeek(): Promise<Assessment[]>;
  getAllAssessments(): Promise<Assessment[]>;
}

export class DatabaseStorage implements IStorage {
  async getAssessment(id: string): Promise<Assessment | undefined> {
    const [assessment] = await db.select().from(assessments).where(eq(assessments.id, id));
    return assessment || undefined;
  }

  async getAssessmentsByUser(userId: string): Promise<Assessment[]> {
    return await db.select().from(assessments)
      .where(eq(assessments.userId, userId))
      .orderBy(desc(assessments.uploadDate));
  }

  async createAssessment(insertAssessment: InsertAssessment): Promise<Assessment> {
    const [assessment] = await db.insert(assessments).values(insertAssessment as any).returning();
    return assessment;
  }

  async updateAssessment(id: string, updates: Partial<Assessment>): Promise<Assessment | undefined> {
    const [assessment] = await db.update(assessments)
      .set(updates)
      .where(eq(assessments.id, id))
      .returning();
    return assessment || undefined;
  }

  async deleteAssessment(id: string): Promise<boolean> {
    const result = await db.delete(assessments).where(eq(assessments.id, id)).returning();
    return result.length > 0;
  }

  async getUserRegistration(userId: string): Promise<UserRegistration | undefined> {
    const [registration] = await db.select().from(userRegistrations)
      .where(eq(userRegistrations.userId, userId));
    return registration || undefined;
  }

  async createUserRegistration(registration: InsertUserRegistration): Promise<UserRegistration> {
    const [newRegistration] = await db.insert(userRegistrations).values(registration).returning();
    return newRegistration;
  }

  async getAllRegistrations(): Promise<UserRegistration[]> {
    return await db.select().from(userRegistrations).orderBy(desc(userRegistrations.registeredAt));
  }

  async getUnsentRegistrations(): Promise<UserRegistration[]> {
    return await db.select().from(userRegistrations)
      .where(isNull(userRegistrations.emailedAt))
      .orderBy(desc(userRegistrations.registeredAt));
  }

  async markRegistrationsAsEmailed(ids: string[]): Promise<void> {
    for (const id of ids) {
      await db.update(userRegistrations)
        .set({ emailedAt: new Date() })
        .where(eq(userRegistrations.id, id));
    }
  }

  async getBillingProfile(userRegistrationId: string): Promise<BillingProfile | undefined> {
    const [profile] = await db.select().from(billingProfiles)
      .where(eq(billingProfiles.userRegistrationId, userRegistrationId));
    return profile || undefined;
  }

  async getBillingProfileByStripeCustomer(stripeCustomerId: string): Promise<BillingProfile | undefined> {
    const [profile] = await db.select().from(billingProfiles)
      .where(eq(billingProfiles.stripeCustomerId, stripeCustomerId));
    return profile || undefined;
  }

  async createBillingProfile(profile: InsertBillingProfile): Promise<BillingProfile> {
    const [newProfile] = await db.insert(billingProfiles).values(profile as any).returning();
    return newProfile;
  }

  async updateBillingProfile(userRegistrationId: string, updates: Partial<BillingProfile>): Promise<BillingProfile | undefined> {
    const [profile] = await db.update(billingProfiles)
      .set({ ...updates, updatedAt: new Date() } as any)
      .where(eq(billingProfiles.userRegistrationId, userRegistrationId))
      .returning();
    return profile || undefined;
  }

  async upsertBillingProfile(userRegistrationId: string, data: Partial<InsertBillingProfile>): Promise<BillingProfile> {
    const existing = await this.getBillingProfile(userRegistrationId);
    if (existing) {
      const updated = await this.updateBillingProfile(userRegistrationId, data);
      return updated!;
    }
    return await this.createBillingProfile({
      userRegistrationId,
      ...data,
    } as InsertBillingProfile);
  }

  async deductCredit(userRegistrationId: string, assessmentId: string): Promise<boolean> {
    const profile = await this.getBillingProfile(userRegistrationId);
    if (!profile || profile.creditsRemaining <= 0) {
      return false;
    }

    const newBalance = profile.creditsRemaining - 1;
    await db.update(billingProfiles)
      .set({ creditsRemaining: newBalance, updatedAt: new Date() })
      .where(eq(billingProfiles.userRegistrationId, userRegistrationId));

    await db.insert(creditLedger).values({
      userRegistrationId,
      assessmentId,
      delta: -1,
      reason: "evaluation",
      balanceAfter: newBalance,
    });

    return true;
  }

  async addCredits(userRegistrationId: string, amount: number, reason: "purchase" | "reset"): Promise<void> {
    const profile = await this.getBillingProfile(userRegistrationId);
    const currentBalance = profile?.creditsRemaining || 0;
    const newBalance = reason === "reset" ? amount : currentBalance + amount;

    await db.update(billingProfiles)
      .set({ 
        creditsRemaining: newBalance,
        creditWindowStart: reason === "reset" ? new Date() : undefined,
        updatedAt: new Date(),
      })
      .where(eq(billingProfiles.userRegistrationId, userRegistrationId));

    await db.insert(creditLedger).values({
      userRegistrationId,
      delta: reason === "reset" ? newBalance : amount,
      reason,
      balanceAfter: newBalance,
    });
  }

  async createTransactionRecord(transaction: InsertTransactionRecord): Promise<TransactionRecord> {
    const [record] = await db.insert(transactionRecords).values(transaction as any).returning();
    return record;
  }

  async getUnsentTransactions(): Promise<TransactionRecord[]> {
    return await db.select().from(transactionRecords)
      .where(isNull(transactionRecords.emailedAt))
      .orderBy(desc(transactionRecords.createdAt));
  }

  async markTransactionsAsEmailed(ids: string[]): Promise<void> {
    for (const id of ids) {
      await db.update(transactionRecords)
        .set({ emailedAt: new Date() })
        .where(eq(transactionRecords.id, id));
    }
  }

  async getRegistrationById(id: string): Promise<UserRegistration | undefined> {
    const [registration] = await db.select().from(userRegistrations)
      .where(eq(userRegistrations.id, id));
    return registration || undefined;
  }

  async canUserAccessAssessmentDetails(userRegistrationId: string): Promise<boolean> {
    const profile = await this.getBillingProfile(userRegistrationId);
    if (!profile) return false;
    return profile.currentTier !== "free";
  }

  async getMonthlyEvaluationCount(userRegistrationId: string): Promise<number> {
    const profile = await this.getBillingProfile(userRegistrationId);
    if (!profile?.creditWindowStart) return 0;
    
    const result = await db.select({ count: sql<number>`count(*)` })
      .from(creditLedger)
      .where(eq(creditLedger.userRegistrationId, userRegistrationId));
    
    return result[0]?.count || 0;
  }

  async getSuccessfulTransactionsLastWeek(): Promise<TransactionRecord[]> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return await db.select().from(transactionRecords)
      .where(and(
        eq(transactionRecords.paymentStatus, "succeeded"),
        gte(transactionRecords.createdAt, oneWeekAgo)
      ))
      .orderBy(desc(transactionRecords.createdAt));
  }

  async getAdvertisingRevenueLastWeek(): Promise<AdvertisingRevenue[]> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return await db.select().from(advertisingRevenue)
      .where(gte(advertisingRevenue.reportDate, oneWeekAgo))
      .orderBy(desc(advertisingRevenue.reportDate));
  }

  async createAdvertisingRevenue(data: InsertAdvertisingRevenue): Promise<AdvertisingRevenue> {
    const [result] = await db.insert(advertisingRevenue).values(data).returning();
    return result;
  }

  async markAdvertisingRevenueAsEmailed(ids: string[]): Promise<void> {
    for (const id of ids) {
      await db.update(advertisingRevenue)
        .set({ emailedAt: new Date() })
        .where(eq(advertisingRevenue.id, id));
    }
  }

  async createCustomerFeedback(data: InsertCustomerFeedback): Promise<CustomerFeedback> {
    const [result] = await db.insert(customerFeedback).values(data as any).returning();
    return result;
  }

  async getAllFeedback(): Promise<CustomerFeedback[]> {
    return await db.select().from(customerFeedback)
      .orderBy(desc(customerFeedback.createdAt));
  }

  async updateFeedback(id: string, updates: Partial<CustomerFeedback>): Promise<CustomerFeedback | undefined> {
    const [result] = await db.update(customerFeedback)
      .set(updates)
      .where(eq(customerFeedback.id, id))
      .returning();
    return result || undefined;
  }

  async getAssessmentsLastWeek(): Promise<Assessment[]> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return await db.select().from(assessments)
      .where(gte(assessments.uploadDate, oneWeekAgo))
      .orderBy(desc(assessments.uploadDate));
  }

  async getAllAssessments(): Promise<Assessment[]> {
    return await db.select().from(assessments)
      .orderBy(desc(assessments.uploadDate));
  }
}

export const storage = new DatabaseStorage();
