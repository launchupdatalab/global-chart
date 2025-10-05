import { TradeData } from "@/types/trade";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Globe, Target } from "lucide-react";
import { formatCurrency, formatNumber } from "@/utils/tradeDataLoader";

interface OpportunitiesAnalysisProps {
  data: TradeData[];
}

interface Opportunity {
  commodity: string;
  cmdCode: number;
  growthRate: number;
  currentValue: number;
  topMarket: string;
  avgPrice: number;
  potential: "High" | "Medium" | "Low";
}

export const OpportunitiesAnalysis = ({ data }: OpportunitiesAnalysisProps) => {
  const analyzeOpportunities = (): Opportunity[] => {
    const commodityStats = data.reduce((acc, item) => {
      const key = `${item.cmdCode}-${item.cmdDesc}`;
      if (!acc[key]) {
        acc[key] = {
          cmdCode: item.cmdCode,
          cmdDesc: item.cmdDesc,
          yearlyData: {} as Record<number, { value: number; qty: number; countries: Set<string> }>,
        };
      }
      
      if (!acc[key].yearlyData[item.Year]) {
        acc[key].yearlyData[item.Year] = { value: 0, qty: 0, countries: new Set() };
      }
      
      acc[key].yearlyData[item.Year].value += item.ValueUSD;
      acc[key].yearlyData[item.Year].qty += item.qty;
      acc[key].yearlyData[item.Year].countries.add(item.Country);
      
      return acc;
    }, {} as Record<string, any>);

    const opportunities: Opportunity[] = [];

    Object.values(commodityStats).forEach((stat: any) => {
      const years = Object.keys(stat.yearlyData).map(Number).sort();
      if (years.length < 2) return;

      const firstYear = years[0];
      const lastYear = years[years.length - 1];
      
      const firstValue = stat.yearlyData[firstYear].value;
      const lastValue = stat.yearlyData[lastYear].value;
      
      const growthRate = ((lastValue - firstValue) / firstValue) * 100;
      
      // Find top market
      const countryValues = data
        .filter(d => d.cmdCode === stat.cmdCode)
        .reduce((acc, item) => {
          acc[item.Country] = (acc[item.Country] || 0) + item.ValueUSD;
          return acc;
        }, {} as Record<string, number>);
      
      const topMarket = Object.entries(countryValues).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
      
      const avgPrice = lastValue / stat.yearlyData[lastYear].qty;
      
      let potential: "High" | "Medium" | "Low" = "Low";
      if (growthRate > 50 && lastValue > 10000) potential = "High";
      else if (growthRate > 20 || lastValue > 50000) potential = "Medium";

      opportunities.push({
        commodity: stat.cmdDesc,
        cmdCode: stat.cmdCode,
        growthRate,
        currentValue: lastValue,
        topMarket,
        avgPrice,
        potential,
      });
    });

    return opportunities
      .sort((a, b) => {
        const potentialScore = { High: 3, Medium: 2, Low: 1 };
        return potentialScore[b.potential] - potentialScore[a.potential] || b.growthRate - a.growthRate;
      })
      .slice(0, 6);
  };

  const opportunities = analyzeOpportunities();

  const getPotentialColor = (potential: string) => {
    switch (potential) {
      case "High": return "bg-green-500";
      case "Medium": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Target className="h-6 w-6 text-primary" />
          <CardTitle>Rwanda's Next Big Export Opportunities</CardTitle>
        </div>
        <CardDescription>
          AI-powered analysis identifying high-potential export commodities based on growth trends and market demand
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {opportunities.map((opp, idx) => (
            <Card key={idx} className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="outline" className="mb-2">
                    CMD {opp.cmdCode}
                  </Badge>
                  <Badge className={getPotentialColor(opp.potential)}>
                    {opp.potential} Potential
                  </Badge>
                </div>
                <CardTitle className="text-base line-clamp-2">{opp.commodity}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="font-semibold text-green-600">
                    {opp.growthRate > 0 ? "+" : ""}{formatNumber(opp.growthRate)}% Growth
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span>
                    <span className="font-medium">Current Value:</span> {formatCurrency(opp.currentValue)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-primary" />
                  <span>
                    <span className="font-medium">Top Market:</span> {opp.topMarket}
                  </span>
                </div>
                
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    Avg Unit Price: {formatCurrency(opp.avgPrice)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
