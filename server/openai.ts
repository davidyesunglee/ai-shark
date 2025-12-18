import OpenAI from "openai";
import type { CriterionScore, AssessmentStatus } from "@shared/schema";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface AnalysisResult {
  overallScore: number;
  executiveSummary: string;
  criteria: CriterionScore[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

const ASSESSMENT_PROMPT = `You are an expert bank loan officer and financial analyst. Analyze the following business plan and evaluate it against standard bank debt financing criteria.

Provide a comprehensive assessment with the following structure in JSON format:

{
  "overallScore": <number 0-100>,
  "executiveSummary": "<2-3 paragraph summary of the business plan's viability for bank debt financing>",
  "criteria": [
    {
      "id": "creditworthiness",
      "name": "Creditworthiness",
      "score": <number 0-100>,
      "analysis": "<detailed analysis paragraph>",
      "keyFindings": ["<finding 1>", "<finding 2>", "<finding 3>"]
    },
    {
      "id": "cash_flow",
      "name": "Cash Flow Analysis",
      "score": <number 0-100>,
      "analysis": "<detailed analysis paragraph>",
      "keyFindings": ["<finding 1>", "<finding 2>", "<finding 3>"]
    },
    {
      "id": "collateral",
      "name": "Collateral Assessment",
      "score": <number 0-100>,
      "analysis": "<detailed analysis paragraph>",
      "keyFindings": ["<finding 1>", "<finding 2>", "<finding 3>"]
    },
    {
      "id": "debt_equity",
      "name": "Debt-to-Equity Ratio",
      "score": <number 0-100>,
      "analysis": "<detailed analysis paragraph>",
      "keyFindings": ["<finding 1>", "<finding 2>", "<finding 3>"]
    },
    {
      "id": "market_viability",
      "name": "Market Viability",
      "score": <number 0-100>,
      "analysis": "<detailed analysis paragraph>",
      "keyFindings": ["<finding 1>", "<finding 2>", "<finding 3>"]
    },
    {
      "id": "management",
      "name": "Management Team",
      "score": <number 0-100>,
      "analysis": "<detailed analysis paragraph>",
      "keyFindings": ["<finding 1>", "<finding 2>", "<finding 3>"]
    }
  ],
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>", "<strength 4>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
  "recommendations": ["<recommendation 1>", "<recommendation 2>", "<recommendation 3>", "<recommendation 4>"]
}

Scoring guide:
- 75-100: Strong candidate for bank debt financing
- 50-74: May qualify with additional documentation or collateral
- 0-49: Significant improvements needed before qualifying

Be specific, cite details from the business plan where possible, and provide actionable recommendations.

BUSINESS PLAN CONTENT:
`;

export async function analyzeBusinessPlan(content: string): Promise<AnalysisResult> {
  const truncatedContent = content.slice(0, 50000);
  
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are an expert bank loan officer and financial analyst. Always respond with valid JSON only, no markdown formatting.",
      },
      {
        role: "user",
        content: ASSESSMENT_PROMPT + truncatedContent,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
    max_tokens: 4000,
  });

  const resultText = response.choices[0]?.message?.content;
  if (!resultText) {
    throw new Error("No response from OpenAI");
  }

  try {
    const result = JSON.parse(resultText) as AnalysisResult;
    
    if (typeof result.overallScore !== "number" || !Array.isArray(result.criteria)) {
      throw new Error("Invalid response structure");
    }
    
    return result;
  } catch (error) {
    console.error("Failed to parse OpenAI response:", resultText);
    throw new Error("Failed to parse analysis results");
  }
}
