import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { parseDocument } from "./documentParser";
import { analyzeBusinessPlan, isOpenAIConfigured } from "./openai";
import { setupAuth, isAuthenticated, registerAuthRoutes } from "./replit_integrations/auth";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  await setupAuth(app);
  registerAuthRoutes(app);

  app.get("/api/assessments", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
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
      const userId = req.user?.claims?.sub;
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

      const userId = req.user?.claims?.sub;
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
      const userId = req.user?.claims?.sub;
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
