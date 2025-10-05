import { TradeData } from "@/types/trade";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatCurrency } from "@/utils/tradeDataLoader";
import { TrendingUp } from "lucide-react";

interface TrendForecastProps {
  data: TradeData[];
}

export const TrendForecast = ({ data }: TrendForecastProps) => {
  const generateForecast = () => {
    // Aggregate by year
    const yearlyData = data.reduce((acc, item) => {
      if (!acc[item.Year]) {
        acc[item.Year] = { year: item.Year, actual: 0 };
      }
      acc[item.Year].actual += item.ValueUSD;
      return acc;
    }, {} as Record<number, any>);

    const historicalData = Object.values(yearlyData).sort((a: any, b: any) => a.year - b.year);

    // Simple linear regression for forecast
    const years = historicalData.map((d: any) => d.year);
    const values = historicalData.map((d: any) => d.actual);
    
    const n = years.length;
    const sumX = years.reduce((a, b) => a + b, 0);
    const sumY = values.reduce((a, b) => a + b, 0);
    const sumXY = years.reduce((sum, year, i) => sum + year * values[i], 0);
    const sumX2 = years.reduce((sum, year) => sum + year * year, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Generate forecast for next 2 years
    const lastYear = Math.max(...years);
    const forecastYears = [lastYear + 1, lastYear + 2];
    
    const forecastData = forecastYears.map(year => ({
      year,
      forecast: slope * year + intercept,
      lowerBound: (slope * year + intercept) * 0.85,
      upperBound: (slope * year + intercept) * 1.15
    }));

    // Combine historical and forecast
    return [
      ...historicalData.map((d: any) => ({ ...d, forecast: null, lowerBound: null, upperBound: null })),
      ...forecastData.map(d => ({ ...d, actual: null }))
    ];
  };

  const chartData = generateForecast();
  const growthRate = chartData.length >= 2 
    ? ((chartData[chartData.length - 1].forecast || chartData[chartData.length - 1].actual) - 
       chartData[0].actual) / chartData[0].actual * 100 
    : 0;

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Export Value Trend & Forecast</CardTitle>
              <CardDescription>
                Historical data with ML-based predictions for next 2 years
              </CardDescription>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Projected Growth</p>
            <p className={`text-2xl font-bold ${growthRate > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {growthRate > 0 ? '+' : ''}{growthRate.toFixed(1)}%
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="year" 
              className="text-xs"
            />
            <YAxis className="text-xs" />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke="hsl(var(--chart-1))" 
              strokeWidth={3}
              name="Actual Value"
              dot={{ fill: "hsl(var(--chart-1))", r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="forecast" 
              stroke="hsl(var(--chart-2))" 
              strokeWidth={3}
              strokeDasharray="5 5"
              name="Forecast"
              dot={{ fill: "hsl(var(--chart-2))", r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="upperBound" 
              stroke="hsl(var(--chart-3))" 
              strokeWidth={1}
              strokeDasharray="3 3"
              name="Upper Bound"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="lowerBound" 
              stroke="hsl(var(--chart-3))" 
              strokeWidth={1}
              strokeDasharray="3 3"
              name="Lower Bound"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
