import { TradeData } from "@/types/trade";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lightbulb, Users, Briefcase, TrendingUp, Globe2, Award } from "lucide-react";

interface StrategyInsightsProps {
  data: TradeData[];
}

interface Insight {
  icon: any;
  title: string;
  description: string;
  category: "Policy" | "Youth & SME" | "Market";
  priority: "High" | "Medium";
}

export const StrategyInsights = ({ data }: StrategyInsightsProps) => {
  const generateInsights = (): Insight[] => {
    // Analyze commodity diversity
    const uniqueCommodities = new Set(data.map(d => d.cmdCode)).size;
    const uniqueCountries = new Set(data.map(d => d.Country)).size;
    
    // Find fastest growing commodities
    const commodityGrowth = data.reduce((acc, item) => {
      const key = item.cmdDesc;
      if (!acc[key]) acc[key] = { early: 0, late: 0 };
      
      if (item.Year <= 2021) acc[key].early += item.ValueUSD;
      else acc[key].late += item.ValueUSD;
      
      return acc;
    }, {} as Record<string, any>);
    
    const fastestGrowing = Object.entries(commodityGrowth)
      .map(([name, vals]) => ({
        name,
        growth: vals.early > 0 ? ((vals.late - vals.early) / vals.early) * 100 : 0
      }))
      .sort((a, b) => b.growth - a.growth)[0];

    // Analyze market concentration
    const countryValues = data.reduce((acc, item) => {
      acc[item.Country] = (acc[item.Country] || 0) + item.ValueUSD;
      return acc;
    }, {} as Record<string, number>);
    
    const totalValue = Object.values(countryValues).reduce((sum, v) => sum + v, 0);
    const topMarketShare = (Math.max(...Object.values(countryValues)) / totalValue) * 100;

    const insights: Insight[] = [
      {
        icon: Globe2,
        title: "Diversify Export Markets",
        description: `Your top market represents ${topMarketShare.toFixed(1)}% of trade. Expand to ${uniqueCountries} countries to reduce dependency and increase resilience.`,
        category: "Policy",
        priority: topMarketShare > 40 ? "High" : "Medium"
      },
      {
        icon: Users,
        title: "Youth & SME Export Training",
        description: `Launch export readiness programs targeting ${fastestGrowing?.name || "high-growth sectors"}. Provide mentorship, market access, and digital tools to engage young entrepreneurs.`,
        category: "Youth & SME",
        priority: "High"
      },
      {
        icon: TrendingUp,
        title: "Focus on High-Growth Commodities",
        description: `Prioritize ${fastestGrowing?.name || "emerging sectors"} showing ${fastestGrowing?.growth.toFixed(1)}% growth. Invest in quality standards and certifications for premium markets.`,
        category: "Market",
        priority: "High"
      },
      {
        icon: Briefcase,
        title: "SME Export Finance Access",
        description: `Create export credit guarantee schemes for small businesses. Partner with financial institutions to offer low-interest loans for export-oriented SMEs.`,
        category: "Youth & SME",
        priority: "High"
      },
      {
        icon: Award,
        title: "Quality Certification Programs",
        description: `Establish national certification programs to meet international standards. This will unlock premium markets and increase unit prices by 15-30%.`,
        category: "Policy",
        priority: "Medium"
      },
      {
        icon: Lightbulb,
        title: "Digital Export Platform",
        description: `Build a unified digital platform connecting Rwandan exporters with global buyers. Include real-time market intelligence, trade documentation, and logistics support.`,
        category: "Youth & SME",
        priority: "High"
      }
    ];

    return insights.sort((a, b) => {
      if (a.priority === "High" && b.priority !== "High") return -1;
      if (a.priority !== "High" && b.priority === "High") return 1;
      return 0;
    });
  };

  const insights = generateInsights();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Policy": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Youth & SME": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "Market": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-primary" />
          <CardTitle>Strategic Export Recommendations</CardTitle>
        </div>
        <CardDescription>
          Data-driven policy recommendations and engagement strategies for export growth
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {insights.map((insight, idx) => {
            const Icon = insight.icon;
            return (
              <Card key={idx} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap justify-end">
                      <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(insight.category)}`}>
                        {insight.category}
                      </span>
                      {insight.priority === "High" && (
                        <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                          High Priority
                        </span>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-base mt-2">{insight.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {insight.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
