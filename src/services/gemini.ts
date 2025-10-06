import { config } from "@/config/api";

interface GeminiMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[];
    };
  }[];
}

export class GeminiService {
  private apiKey: string;
  private baseUrl = "https://generativelanguage.googleapis.com/v1beta/models";

  constructor() {
    this.apiKey = config.geminiApiKey;
  }

  async generateContent(prompt: string, systemInstruction?: string): Promise<string> {
    try {
      const messages: GeminiMessage[] = [];
      
      if (systemInstruction) {
        messages.push({
          role: "user",
          parts: [{ text: systemInstruction }]
        });
      }
      
      messages.push({
        role: "user",
        parts: [{ text: prompt }]
      });

      const response = await fetch(
        `${this.baseUrl}/gemini-pro:generateContent?key=${this.apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: messages,
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const data: GeminiResponse = await response.json();
      return data.candidates[0]?.content?.parts[0]?.text || "";
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }

  async analyzeTradeOpportunities(data: string): Promise<string> {
    const prompt = `Analyze this Rwanda export trade data and identify the top 3 emerging export opportunities with highest growth potential:

${data}

Provide detailed analysis including:
1. Commodity name and why it's an opportunity
2. Target markets with highest demand
3. Growth trajectory and market size
4. Entry barriers and recommendations
5. Youth/SME participation opportunities

Format as JSON with clear structure.`;

    return this.generateContent(prompt);
  }

  async predictDemand(commodityData: string): Promise<string> {
    const prompt = `Based on this historical trade data, predict demand trends for the next 2 years:

${commodityData}

Provide:
1. Demand forecast with confidence levels
2. Seasonal patterns
3. Market expansion opportunities
4. Risk factors
5. Recommended actions

Use data-driven insights and provide specific numbers where possible.`;

    return this.generateContent(prompt);
  }

  async generatePolicyRecommendations(tradeAnalysis: string): Promise<string> {
    const prompt = `Based on this Rwanda trade analysis, generate strategic policy recommendations:

${tradeAnalysis}

Provide actionable recommendations for:
1. Export promotion strategies
2. Youth and SME engagement programs
3. Market diversification initiatives
4. Infrastructure and capacity building
5. Trade agreement priorities

Focus on practical, implementable policies.`;

    return this.generateContent(prompt);
  }
}

export const geminiService = new GeminiService();
