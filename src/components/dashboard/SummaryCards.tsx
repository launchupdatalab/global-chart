import { TradeData } from "@/types/trade";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Package, Globe, Box } from "lucide-react";
import { formatCurrency, formatNumber } from "@/utils/tradeDataLoader";

interface SummaryCardsProps {
  data: TradeData[];
}

export const SummaryCards = ({ data }: SummaryCardsProps) => {
  const totalRecords = data.length;
  const totalValue = data.reduce((sum, d) => sum + d.ValueUSD, 0);
  const avgUnitPrice = data.reduce((sum, d) => sum + d.UnitPrice, 0) / data.length;
  const uniqueCountries = new Set(data.map((d) => d.Country)).size;
  const uniqueCommodities = new Set(data.map((d) => d.cmdDesc)).size;

  const cards = [
    {
      title: "Total Records",
      value: formatNumber(totalRecords),
      icon: Package,
      color: "text-chart-1",
    },
    {
      title: "Total Value",
      value: formatCurrency(totalValue),
      icon: DollarSign,
      color: "text-chart-2",
    },
    {
      title: "Avg Unit Price",
      value: formatCurrency(avgUnitPrice),
      icon: TrendingUp,
      color: "text-chart-3",
    },
    {
      title: "Countries",
      value: uniqueCountries.toString(),
      icon: Globe,
      color: "text-chart-4",
    },
    {
      title: "Commodities",
      value: uniqueCommodities.toString(),
      icon: Box,
      color: "text-chart-5",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {cards.map((card, index) => (
        <Card key={index} className="transition-all hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
