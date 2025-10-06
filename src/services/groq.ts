import { config } from "@/config/api";

interface GroqMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface GroqResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export class GroqService {
  private apiKey: string;
  private baseUrl = "https://api.groq.com/openai/v1/chat/completions";

  constructor() {
    this.apiKey = config.groqCloudApiKey;
  }

  async chat(messages: GroqMessage[], model = "llama-3.3-70b-versatile"): Promise<string> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          max_tokens: 2048,
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.statusText}`);
      }

      const data: GroqResponse = await response.json();
      return data.choices[0]?.message?.content || "";
    } catch (error) {
      console.error("Groq API Error:", error);
      throw error;
    }
  }

  async predictMarketTrends(historicalData: any[]): Promise<any> {
    const dataStr = JSON.stringify(historicalData.slice(0, 100));
    
    const messages: GroqMessage[] = [
      {
        role: "system",
        content: "You are an expert in trade analytics and demand forecasting. Analyze data and provide accurate predictions with confidence intervals."
      },
      {
        role: "user",
        content: `Analyze this Rwanda export data and predict market trends for the next 24 months:

${dataStr}

Provide predictions in JSON format with:
- commodity: string
- currentValue: number
- predicted2025: number
- predicted2026: number
- confidenceLevel: "high" | "medium" | "low"
- growthRate: number
- keyDrivers: string[]
- risks: string[]

Return top 5 commodities with highest growth potential.`
      }
    ];

    const response = await this.chat(messages);
    try {
      return JSON.parse(response);
    } catch {
      return { predictions: [], error: "Failed to parse predictions" };
    }
  }

  async analyzeSMEOpportunities(tradeData: string): Promise<string> {
    const messages: GroqMessage[] = [
      {
        role: "system",
        content: "You are an expert in SME development and export promotion in Rwanda."
      },
      {
        role: "user",
        content: `Based on this trade data, identify specific opportunities for Rwandan SMEs and youth entrepreneurs:

${tradeData}

Provide:
1. Low-barrier entry commodities for SMEs
2. Required investment and training
3. Market access strategies
4. Success stories and case studies
5. Government support programs available`
      }
    ];

    return this.chat(messages);
  }
}

export const groqService = new GroqService();
