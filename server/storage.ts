import { 
  assessments,
  userRegistrations,
  type Assessment,
  type InsertAssessment,
  type UserRegistration,
  type InsertUserRegistration,
} from "@shared/schema";
import { db } from "./db";
import { eq, isNull, desc } from "drizzle-orm";

export interface IStorage {
  getAssessment(id: string): Promise<Assessment | undefined>;
  getAssessmentsByUser(userId: string): Promise<Assessment[]>;
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  updateAssessment(id: string, updates: Partial<Assessment>): Promise<Assessment | undefined>;
  deleteAssessment(id: string): Promise<boolean>;
  getUserRegistration(replitUserId: string): Promise<UserRegistration | undefined>;
  createUserRegistration(registration: InsertUserRegistration): Promise<UserRegistration>;
  getAllRegistrations(): Promise<UserRegistration[]>;
  getUnsentRegistrations(): Promise<UserRegistration[]>;
  markRegistrationsAsEmailed(ids: string[]): Promise<void>;
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

  async getUserRegistration(replitUserId: string): Promise<UserRegistration | undefined> {
    const [registration] = await db.select().from(userRegistrations)
      .where(eq(userRegistrations.replitUserId, replitUserId));
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
}

export const storage = new DatabaseStorage();
