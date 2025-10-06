import { useState } from "react";
import { TradeData } from "@/types/trade";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, Users, FileText, Loader2 } from "lucide-react";
import { geminiService } from "@/services/gemini";
import { groqService } from "@/services/groq";
import { toast } from "sonner";

interface AIInsightsPanelProps {
  data: TradeData[];
}

export const AIInsightsPanel = ({ data }: AIInsightsPanelProps) => {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<{
    opportunities?: string;
    demand?: string;
    policy?: string;
    sme?: string;
  }>({});

  const analyzeOpportunities = async () => {
    setLoading(true);
    try {
      // Prepare data summary
      const summary = data.slice(0, 50).map(d => ({
        year: d.Year,
        commodity: d.cmdDesc,
        value: d.ValueUSD,
        country: d.Country,
      }));

      const result = await geminiService.analyzeTradeOpportunities(
        JSON.stringify(summary, null, 2)
      );
      
      setInsights(prev => ({ ...prev, opportunities: result }));
      toast.success("AI analysis complete!");
    } catch (error) {
      toast.error("Failed to analyze opportunities");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const predictDemand = async () => {
    setLoading(true);
    try {
      const predictions = await groqService.predictMarketTrends(data);
      setInsights(prev => ({ ...prev, demand: JSON.stringify(predictions, null, 2) }));
      toast.success("Demand prediction complete!");
    } catch (error) {
      toast.error("Failed to predict demand");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const generatePolicy = async () => {
    setLoading(true);
    try {
      const analysis = insights.opportunities || "Rwanda export trade analysis";
      const result = await geminiService.generatePolicyRecommendations(analysis);
      setInsights(prev => ({ ...prev, policy: result }));
      toast.success("Policy recommendations generated!");
    } catch (error) {
      toast.error("Failed to generate policy recommendations");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeSME = async () => {
    setLoading(true);
    try {
      const summary = JSON.stringify(data.slice(0, 30));
      const result = await groqService.analyzeSMEOpportunities(summary);
      setInsights(prev => ({ ...prev, sme: result }));
      toast.success("SME analysis complete!");
    } catch (error) {
      toast.error("Failed to analyze SME opportunities");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <CardTitle>AI-Powered Trade Intelligence</CardTitle>
          </div>
          <CardDescription>
            Advanced analytics using machine learning to identify opportunities, predict demand, and generate strategic recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button
              onClick={analyzeOpportunities}
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <TrendingUp className="h-4 w-4" />}
              Identify Opportunities
            </Button>
            
            <Button
              onClick={predictDemand}
              disabled={loading}
              variant="secondary"
              className="flex items-center gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Predict Demand (ML)
            </Button>
            
            <Button
              onClick={generatePolicy}
              disabled={loading}
              variant="outline"
              className="flex items-center gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
              Policy Recommendations
            </Button>
            
            <Button
              onClick={analyzeSME}
              disabled={loading}
              variant="outline"
              className="flex items-center gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Users className="h-4 w-4" />}
              SME/Youth Opportunities
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Display */}
      {insights.opportunities && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge variant="default">AI Analysis</Badge>
              <CardTitle className="text-lg">Export Opportunities Identified</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg overflow-auto max-h-96">
                {insights.opportunities}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {insights.demand && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">ML Prediction</Badge>
              <CardTitle className="text-lg">Demand Forecast (24 Months)</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg overflow-auto max-h-96">
              {insights.demand}
            </pre>
          </CardContent>
        </Card>
      )}

      {insights.policy && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge>Policy</Badge>
              <CardTitle className="text-lg">Strategic Recommendations</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg overflow-auto max-h-96">
              {insights.policy}
            </pre>
          </CardContent>
        </Card>
      )}

      {insights.sme && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge variant="outline">SME/Youth</Badge>
              <CardTitle className="text-lg">Opportunities for Small Businesses</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg overflow-auto max-h-96">
              {insights.sme}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
