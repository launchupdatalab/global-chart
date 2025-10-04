import { TradeData, TradeDataRaw } from "@/types/trade";
import data2020 from "@/data/2020.json";
import data2021 from "@/data/2021.json";
import data2022 from "@/data/2022.json";
import data2023 from "@/data/2023.json";
import data2024 from "@/data/2024.json";

export const loadTradeData = (): TradeData[] => {
  const allRawData: TradeDataRaw[] = [
    ...(data2020 as TradeDataRaw[]),
    ...(data2021 as TradeDataRaw[]),
    ...(data2022 as TradeDataRaw[]),
    ...(data2023 as TradeDataRaw[]),
    ...(data2024 as TradeDataRaw[]),
  ];

  return allRawData.map((item) => {
    const cmdCode = item.cmdCode || item.cmdcode || 0;
    const valueUSD = item["Value $"] || 0;
    const qty = item.qty || 0;
    const unitPrice = qty > 0 ? valueUSD / qty : 0;

    return {
      Year: item.Year,
      Month: item.Month,
      Country: item.Country,
      cmdCode,
      cmdDesc: item.cmdDesc,
      qty,
      ValueUSD: valueUSD,
      UnitPrice: unitPrice,
    };
  });
};

export const getUniqueYears = (data: TradeData[]): number[] => {
  return Array.from(new Set(data.map((d) => d.Year))).sort();
};

export const getUniqueCountries = (data: TradeData[]): string[] => {
  return Array.from(new Set(data.map((d) => d.Country))).sort();
};

export const getUniqueCommodities = (data: TradeData[]): string[] => {
  return Array.from(new Set(data.map((d) => d.cmdDesc))).sort();
};

export const getUniqueCmdCodes = (data: TradeData[]): number[] => {
  return Array.from(new Set(data.map((d) => d.cmdCode))).sort((a, b) => a - b);
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
};
