import { TradeData } from "@/types/trade";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/utils/tradeDataLoader";

interface CmdCodeChartProps {
  data: TradeData[];
}

export const CmdCodeChart = ({ data }: CmdCodeChartProps) => {
  const cmdCodeData = data.reduce((acc, item) => {
    if (!acc[item.cmdCode]) {
      acc[item.cmdCode] = 0;
    }
    acc[item.cmdCode] += item.ValueUSD;
    return acc;
  }, {} as Record<number, number>);

  const chartData = Object.entries(cmdCodeData)
    .map(([code, value]) => ({ code, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Top 10 CMD Codes by Trade Value</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="code" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Bar dataKey="value" fill="hsl(var(--chart-4))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
