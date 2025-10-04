export interface TradeDataRaw {
  Year: number;
  Month: string;
  Country: string;
  cmdCode?: number;
  cmdcode?: number;
  cmdDesc: string;
  qty: number;
  "Value $": number;
}

export interface TradeData {
  Year: number;
  Month: string;
  Country: string;
  cmdCode: number;
  cmdDesc: string;
  qty: number;
  ValueUSD: number;
  UnitPrice: number;
}

export interface TradeFilters {
  years: number[];
  countries: string[];
  commodities: string[];
  cmdCodes: number[];
}
