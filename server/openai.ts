import { GoogleGenAI } from "@google/genai";
import type { CriterionScore } from "@shared/schema";

let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY!,
      httpOptions: {
        apiVersion: "",
        baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
      },
    });
  }
  return geminiClient;
}

export function isOpenAIConfigured(): boolean {
  return !!(process.env.AI_INTEGRATIONS_GEMINI_API_KEY && process.env.AI_INTEGRATIONS_GEMINI_BASE_URL);
}

export interface AnalysisResult {
  overallScore: number;
  executiveSummary: string;
  criteria: CriterionScore[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  swot?: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  marketAnalysis?: {
    targetMarket: string;
    marketSize: string;
    competitivePosition: string;
    growthPotential: string;
  };
  financialRatios?: {
    name: string;
    value: string;
    assessment: string;
  }[];
  lenderReadinessGrade?: string;
}

const ASSESSMENT_PROMPT = `You are a senior bank loan officer, certified financial analyst, and business plan expert with 20+ years of experience evaluating business plans for commercial debt financing. Your assessments are used by financial institutions to make lending decisions.

Analyze the following business plan and produce a COMPREHENSIVE evaluation. Compare this plan against industry best practices and bank financing standards.

Return a JSON object with EXACTLY this structure:

{
  "overallScore": <number 0-100>,
  "lenderReadinessGrade": "<one of: A, B+, B, B-, C+, C, C-, D, F>",
  "executiveSummary": "<3-4 paragraph analysis covering: business viability, financial health, market position, key risk factors, and overall lending recommendation. Be specific and cite details from the plan.>",
  "criteria": [
    {
      "id": "creditworthiness",
      "name": "Creditworthiness & Credit History",
      "score": <0-100>,
      "analysis": "<Detailed paragraph on owner/business credit profile, payment history indicators, any red flags or positive signals>",
      "keyFindings": ["<specific finding>", "<specific finding>", "<specific finding>"]
    },
    {
      "id": "cash_flow",
      "name": "Cash Flow & Debt Service Coverage",
      "score": <0-100>,
      "analysis": "<Analyze projected cash flows, DSCR (target >1.25x), operating cash flow sufficiency, seasonality, and burn rate if applicable>",
      "keyFindings": ["<finding>", "<finding>", "<finding>"]
    },
    {
      "id": "collateral",
      "name": "Collateral & Asset Base",
      "score": <0-100>,
      "analysis": "<Evaluate tangible assets, real estate, equipment, receivables offered as collateral. Loan-to-value assessment.>",
      "keyFindings": ["<finding>", "<finding>", "<finding>"]
    },
    {
      "id": "debt_equity",
      "name": "Debt-to-Equity & Capital Structure",
      "score": <0-100>,
      "analysis": "<Review leverage ratios, owner equity contribution, working capital, existing debt obligations, and capital adequacy>",
      "keyFindings": ["<finding>", "<finding>", "<finding>"]
    },
    {
      "id": "market_viability",
      "name": "Market Viability & Demand",
      "score": <0-100>,
      "analysis": "<Assess target market size, customer demand evidence, market trends, and sustainability of revenue model in current economic environment>",
      "keyFindings": ["<finding>", "<finding>", "<finding>"]
    },
    {
      "id": "management",
      "name": "Management Team & Experience",
      "score": <0-100>,
      "analysis": "<Evaluate leadership qualifications, relevant industry experience, track record, key person risk, and organizational depth>",
      "keyFindings": ["<finding>", "<finding>", "<finding>"]
    },
    {
      "id": "financial_projections",
      "name": "Financial Projections & Assumptions",
      "score": <0-100>,
      "analysis": "<Assess realism of revenue projections, expense assumptions, profitability timeline, break-even analysis, and 3-5 year forecasts>",
      "keyFindings": ["<finding>", "<finding>", "<finding>"]
    },
    {
      "id": "revenue_model",
      "name": "Revenue Model & Profitability",
      "score": <0-100>,
      "analysis": "<Evaluate revenue streams, pricing strategy, gross/net margins, customer acquisition cost, lifetime value, and path to profitability>",
      "keyFindings": ["<finding>", "<finding>", "<finding>"]
    },
    {
      "id": "industry_risk",
      "name": "Industry & Regulatory Risk",
      "score": <0-100>,
      "analysis": "<Assess industry-specific risks, regulatory environment, compliance requirements, market cyclicality, and external risk factors>",
      "keyFindings": ["<finding>", "<finding>", "<finding>"]
    },
    {
      "id": "competitive_position",
      "name": "Competitive Position & Differentiation",
      "score": <0-100>,
      "analysis": "<Evaluate competitive advantages, market differentiation, barriers to entry, competitive threats, and sustainable competitive moat>",
      "keyFindings": ["<finding>", "<finding>", "<finding>"]
    }
  ],
  "strengths": ["<concrete strength 1>", "<concrete strength 2>", "<concrete strength 3>", "<concrete strength 4>", "<concrete strength 5>"],
  "weaknesses": ["<concrete weakness 1>", "<concrete weakness 2>", "<concrete weakness 3>", "<concrete weakness 4>"],
  "recommendations": ["<specific actionable recommendation 1>", "<specific actionable recommendation 2>", "<specific actionable recommendation 3>", "<specific actionable recommendation 4>", "<specific actionable recommendation 5>"],
  "swot": {
    "strengths": ["<SWOT strength 1>", "<SWOT strength 2>", "<SWOT strength 3>"],
    "weaknesses": ["<SWOT weakness 1>", "<SWOT weakness 2>", "<SWOT weakness 3>"],
    "opportunities": ["<market opportunity 1>", "<market opportunity 2>", "<market opportunity 3>"],
    "threats": ["<external threat 1>", "<external threat 2>", "<external threat 3>"]
  },
  "marketAnalysis": {
    "targetMarket": "<description of primary target market and customer profile>",
    "marketSize": "<estimated TAM/SAM indicators based on plan data, or assessment of market size claims>",
    "competitivePosition": "<where this business stands relative to competitors>",
    "growthPotential": "<assessment of realistic growth trajectory over 3-5 years>"
  },
  "financialRatios": [
    {"name": "Debt Service Coverage Ratio (DSCR)", "value": "<estimated or stated value, or 'Not provided'>", "assessment": "<Good/Acceptable/Concerning/Not Available>"},
    {"name": "Current Ratio", "value": "<value or 'Not provided'>", "assessment": "<Good/Acceptable/Concerning/Not Available>"},
    {"name": "Gross Profit Margin", "value": "<value or 'Not provided'>", "assessment": "<Good/Acceptable/Concerning/Not Available>"},
    {"name": "Debt-to-Equity Ratio", "value": "<value or 'Not provided'>", "assessment": "<Good/Acceptable/Concerning/Not Available>"},
    {"name": "Break-Even Timeline", "value": "<months/years or 'Not provided'>", "assessment": "<Good/Acceptable/Concerning/Not Available>"},
    {"name": "Owner Equity Contribution", "value": "<% or amount or 'Not provided'>", "assessment": "<Good/Acceptable/Concerning/Not Available>"}
  ]
}

Scoring guide:
- 85-100 (Grade A): Excellent candidate, meets all bank lending criteria
- 75-84 (Grade B+/B): Strong candidate with minor gaps
- 65-74 (Grade B-/C+): Good candidate, some documentation or collateral concerns
- 50-64 (Grade C/C-): May qualify with significant additional documentation
- 35-49 (Grade D): Material improvements needed before bank financing
- 0-34 (Grade F): Not ready for bank debt financing

IMPORTANT: 
- Be specific — cite actual numbers, names, and details from the plan
- If data is missing from the plan, note it as a gap
- Return ONLY valid JSON, no markdown, no code blocks, just the raw JSON object

BUSINESS PLAN CONTENT:
`;

export async function analyzeBusinessPlan(content: string): Promise<AnalysisResult> {
  const truncatedContent = content.slice(0, 50000);

  const gemini = getGeminiClient();
  const response = await gemini.models.generateContent({
    model: "gemini-2.5-flash",
    contents: ASSESSMENT_PROMPT + truncatedContent,
    config: {
      responseMimeType: "application/json",
    },
  });

  const resultText = response.text;
  if (!resultText) {
    throw new Error("No response from Gemini");
  }

  try {
    const result = JSON.parse(resultText) as AnalysisResult;

    if (typeof result.overallScore !== "number" || !Array.isArray(result.criteria)) {
      throw new Error("Invalid response structure");
    }

    return result;
  } catch (error) {
    console.error("Failed to parse Gemini response:", resultText);
    throw new Error("Failed to parse analysis results");
  }
}
