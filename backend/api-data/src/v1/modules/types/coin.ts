export interface CoinApiResponse {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency: number;
  price_change_percentage_30d_in_currency: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
}

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  rank: number;
  price_usd: number;
  market_cap: number;
  volume_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  price_change_percentage_30d: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
}
export interface CoinsCash {
  id: string;
  symbol: string;
  name: string;
  image: string;
  price_usd: number;
  market_cap: number;
  rank: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  volume_24h: number;
  last_updated: string;
  // current_price?: number;
  // market_cap_rank?: number;
}

type SqlValue = string | number | boolean | Date | null | Buffer;

type DbRow = Record<string, SqlValue>;

export type CoinDescRow = DbRow & {
  id: number;
  coin_id?: string;
  en?: string;
  de?: string;
  ua?: string;
  tr?: string;
  hi?: string;
};
export type Locale = "en" | "de" | "ua" | "tr" | "hi";
