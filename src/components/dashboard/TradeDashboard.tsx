import { useState, useMemo } from "react";
import { TradeData, TradeFilters } from "@/types/trade";
import {
  loadTradeData,
  getUniqueYears,
  getUniqueCountries,
  getUniqueCommodities,
  getUniqueCmdCodes,
} from "@/utils/tradeDataLoader";
import { FilterPanel } from "./FilterPanel";
import { SummaryCards } from "./SummaryCards";
import { CountryChart } from "./CountryChart";
import { CommodityChart } from "./CommodityChart";
import { MonthlyTrendChart } from "./MonthlyTrendChart";
import { CmdCodeChart } from "./CmdCodeChart";

export const TradeDashboard = () => {
  const allData = useMemo(() => loadTradeData(), []);
  
  const [filters, setFilters] = useState<TradeFilters>({
    years: [],
    countries: [],
    commodities: [],
    cmdCodes: [],
  });

  const filteredData = useMemo(() => {
    let result = allData;

    if (filters.years.length > 0) {
      result = result.filter((d) => filters.years.includes(d.Year));
    }
    if (filters.countries.length > 0) {
      result = result.filter((d) => filters.countries.includes(d.Country));
    }
    if (filters.commodities.length > 0) {
      result = result.filter((d) => filters.commodities.includes(d.cmdDesc));
    }
    if (filters.cmdCodes.length > 0) {
      result = result.filter((d) => filters.cmdCodes.includes(d.cmdCode));
    }

    return result;
  }, [allData, filters]);

  const availableYears = useMemo(() => getUniqueYears(allData), [allData]);
  const availableCountries = useMemo(() => getUniqueCountries(allData), [allData]);
  const availableCommodities = useMemo(() => getUniqueCommodities(allData), [allData]);
  const availableCmdCodes = useMemo(() => getUniqueCmdCodes(allData), [allData]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Trade Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Interactive trade data visualization and analysis (2020-2024)
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <FilterPanel
              availableYears={availableYears}
              availableCountries={availableCountries}
              availableCommodities={availableCommodities}
              availableCmdCodes={availableCmdCodes}
              filters={filters}
              onFilterChange={setFilters}
            />
          </div>

          <div className="space-y-6 lg:col-span-3">
            <SummaryCards data={filteredData} />
            
            <div className="grid gap-6 lg:grid-cols-2">
              <CountryChart data={filteredData} />
              <CommodityChart data={filteredData} />
            </div>

            <MonthlyTrendChart data={filteredData} />

            <div className="grid gap-6 lg:grid-cols-2">
              <CmdCodeChart data={filteredData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
