import { 
  type Assessment,
  type InsertAssessment,
  type AssessmentStatus,
  type CriterionScore 
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getAssessment(id: string): Promise<Assessment | undefined>;
  getAssessmentsByUser(userId: string): Promise<Assessment[]>;
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  updateAssessment(id: string, updates: Partial<Assessment>): Promise<Assessment | undefined>;
  deleteAssessment(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private assessments: Map<string, Assessment>;

  constructor() {
    this.assessments = new Map();
  }

  async getAssessment(id: string): Promise<Assessment | undefined> {
    return this.assessments.get(id);
  }

  async getAssessmentsByUser(userId: string): Promise<Assessment[]> {
    return Array.from(this.assessments.values())
      .filter(a => a.userId === userId)
      .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
  }

  async createAssessment(insertAssessment: InsertAssessment): Promise<Assessment> {
    const id = randomUUID();
    const status: AssessmentStatus = (insertAssessment.status as AssessmentStatus) ?? "analyzing";
    const criteria: CriterionScore[] | null = insertAssessment.criteria 
      ? (insertAssessment.criteria as CriterionScore[]) 
      : null;
    const strengths: string[] | null = insertAssessment.strengths 
      ? (insertAssessment.strengths as string[]) 
      : null;
    const weaknesses: string[] | null = insertAssessment.weaknesses 
      ? (insertAssessment.weaknesses as string[]) 
      : null;
    const recommendations: string[] | null = insertAssessment.recommendations 
      ? (insertAssessment.recommendations as string[]) 
      : null;

    const assessment: Assessment = {
      id,
      userId: insertAssessment.userId,
      businessName: insertAssessment.businessName,
      fileName: insertAssessment.fileName,
      fileContent: insertAssessment.fileContent ?? null,
      uploadDate: new Date(),
      status,
      overallScore: insertAssessment.overallScore ?? null,
      executiveSummary: insertAssessment.executiveSummary ?? null,
      criteria,
      strengths,
      weaknesses,
      recommendations,
    };
    this.assessments.set(id, assessment);
    return assessment;
  }

  async updateAssessment(id: string, updates: Partial<Assessment>): Promise<Assessment | undefined> {
    const existing = this.assessments.get(id);
    if (!existing) return undefined;
    
    const updated: Assessment = { ...existing, ...updates };
    this.assessments.set(id, updated);
    return updated;
  }

  async deleteAssessment(id: string): Promise<boolean> {
    return this.assessments.delete(id);
  }
}

export const storage = new MemStorage();
