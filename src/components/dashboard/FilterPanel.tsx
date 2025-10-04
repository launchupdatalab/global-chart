import { TradeFilters } from "@/types/trade";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";

interface FilterPanelProps {
  availableYears: number[];
  availableCountries: string[];
  availableCommodities: string[];
  availableCmdCodes: number[];
  filters: TradeFilters;
  onFilterChange: (filters: TradeFilters) => void;
}

export const FilterPanel = ({
  availableYears,
  availableCountries,
  availableCommodities,
  availableCmdCodes,
  filters,
  onFilterChange,
}: FilterPanelProps) => {
  const toggleYear = (year: number) => {
    const years = filters.years.includes(year)
      ? filters.years.filter((y) => y !== year)
      : [...filters.years, year];
    onFilterChange({ ...filters, years });
  };

  const toggleCountry = (country: string) => {
    const countries = filters.countries.includes(country)
      ? filters.countries.filter((c) => c !== country)
      : [...filters.countries, country];
    onFilterChange({ ...filters, countries });
  };

  const toggleCommodity = (commodity: string) => {
    const commodities = filters.commodities.includes(commodity)
      ? filters.commodities.filter((c) => c !== commodity)
      : [...filters.commodities, commodity];
    onFilterChange({ ...filters, commodities });
  };

  const toggleCmdCode = (code: number) => {
    const cmdCodes = filters.cmdCodes.includes(code)
      ? filters.cmdCodes.filter((c) => c !== code)
      : [...filters.cmdCodes, code];
    onFilterChange({ ...filters, cmdCodes });
  };

  const clearFilters = () => {
    onFilterChange({ years: [], countries: [], commodities: [], cmdCodes: [] });
  };

  const hasActiveFilters =
    filters.years.length > 0 ||
    filters.countries.length > 0 ||
    filters.commodities.length > 0 ||
    filters.cmdCodes.length > 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Filters</CardTitle>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="mb-2 text-sm font-medium">Years</h4>
          <div className="flex flex-wrap gap-2">
            {availableYears.map((year) => (
              <Badge
                key={year}
                variant={filters.years.includes(year) ? "default" : "outline"}
                className="cursor-pointer transition-all hover:scale-105"
                onClick={() => toggleYear(year)}
              >
                {year}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-2 text-sm font-medium">Countries ({availableCountries.length})</h4>
          <ScrollArea className="h-40 rounded-md border p-2">
            <div className="space-y-1">
              {availableCountries.map((country) => (
                <div
                  key={country}
                  className={`cursor-pointer rounded px-2 py-1 text-sm transition-colors hover:bg-muted ${
                    filters.countries.includes(country) ? "bg-primary/10 font-medium" : ""
                  }`}
                  onClick={() => toggleCountry(country)}
                >
                  {country}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div>
          <h4 className="mb-2 text-sm font-medium">Commodities ({availableCommodities.length})</h4>
          <ScrollArea className="h-40 rounded-md border p-2">
            <div className="space-y-1">
              {availableCommodities.map((commodity) => (
                <div
                  key={commodity}
                  className={`cursor-pointer rounded px-2 py-1 text-sm transition-colors hover:bg-muted ${
                    filters.commodities.includes(commodity) ? "bg-secondary/10 font-medium" : ""
                  }`}
                  onClick={() => toggleCommodity(commodity)}
                >
                  <span className="line-clamp-2">{commodity}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div>
          <h4 className="mb-2 text-sm font-medium">CMD Codes ({availableCmdCodes.length})</h4>
          <ScrollArea className="h-32 rounded-md border p-2">
            <div className="flex flex-wrap gap-2">
              {availableCmdCodes.map((code) => (
                <Badge
                  key={code}
                  variant={filters.cmdCodes.includes(code) ? "default" : "outline"}
                  className="cursor-pointer transition-all hover:scale-105"
                  onClick={() => toggleCmdCode(code)}
                >
                  {code}
                </Badge>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};
