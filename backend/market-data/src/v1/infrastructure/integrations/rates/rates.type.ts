export interface NbuRates {
  rate: number;
  cc: string;
}

// interface MonoRate {
//   currencyCodeA: number;
//   currencyCodeB: number;
//   date: number;
//   rateBuy?: number;
//   rateSell?: number;
//   rateCross?: number;
// }

export interface PrivatRate {
  ccy: string;
  base_ccy: string;
  buy: string;
  sale: string;
}

export interface NormalizedRate {
  bank: string;
  currency_code: string;
  base_currency: string;
  rate_buy: number | null;
  rate_sell: number | null;
  date: string;
}
