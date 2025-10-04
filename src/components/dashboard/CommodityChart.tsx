import { TradeData } from "@/types/trade";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/utils/tradeDataLoader";

interface CommodityChartProps {
  data: TradeData[];
}

export const CommodityChart = ({ data }: CommodityChartProps) => {
  const commodityData = data.reduce((acc, item) => {
    if (!acc[item.cmdDesc]) {
      acc[item.cmdDesc] = 0;
    }
    acc[item.cmdDesc] += item.ValueUSD;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(commodityData)
    .map(([commodity, value]) => ({ 
      commodity: commodity.length > 40 ? commodity.substring(0, 40) + "..." : commodity,
      fullName: commodity,
      value 
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Top 10 Commodities by Trade Value</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="commodity" 
              angle={-45}
              textAnchor="end"
              height={120}
              className="text-xs"
            />
            <YAxis className="text-xs" />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label, payload) => {
                if (payload && payload[0]) {
                  return payload[0].payload.fullName;
                }
                return label;
              }}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Bar dataKey="value" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
