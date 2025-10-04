import { TradeData } from "@/types/trade";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/utils/tradeDataLoader";

interface CountryChartProps {
  data: TradeData[];
}

export const CountryChart = ({ data }: CountryChartProps) => {
  const countryData = data.reduce((acc, item) => {
    if (!acc[item.Country]) {
      acc[item.Country] = 0;
    }
    acc[item.Country] += item.ValueUSD;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(countryData)
    .map(([country, value]) => ({ country, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Top 10 Countries by Trade Value</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="country" 
              angle={-45}
              textAnchor="end"
              height={100}
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
            <Bar dataKey="value" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
