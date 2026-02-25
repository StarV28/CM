export interface Coin {
  id: number;
  symbol: string;
  slug: string;
  name: string;
  logo: string;
  rating: number;
  price_usd: number;
  market_cap: number;
  volume_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  high_24h: number;
  low_24h: number;

  volume_change_24h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  percent_change_30d: number;
  market_cap_change_24h: number;

  market_cap_change_percentage_24h: number;
  fully_diluted_market_cap: string | null;

  website: string;
  explorer: string | null;
  description?: string;
  updated_at: string;

  added_at: string | null;

  binance: string;
  bybit: string;
  kraken: string;
  okx: string;
}

export interface CoinWithDescription {
  id: number;
  symbol: string;
  slug: string;
  name: string;
  logo: string;
  rating: number;
  price_usd: number;
  market_cap: number;
  volume_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  high_24h: number;
  low_24h: number;

  volume_change_24h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  percent_change_30d: number;
  market_cap_change_24h: number;

  market_cap_change_percentage_24h: number;
  fully_diluted_market_cap: string | null;

  website: string;
  explorer: string | null;
  description?: string;
  updated_at: string;

  added_at: string | null;

  exchanges: ExchangeName[] | null;
}

export interface Coins {
  id: number;
  symbol: string;
  name: string;
  logo: string;
  price_usd: number;
  market_cap: number;
  rating: number;
  percent_change_24h: number;
  percent_change_7d: number;
  volume_24h: number;
  last_updated?: string;
  current_price?: number;
  changed?: boolean;
  priceDiff?: number | null;

  high24h?: number;
  low24h?: number;
  total_supply?: number;
  max_supply?: number;
  volume_change_24h?: number;
  percent_change_30d?: number;

  binance: string | null;
  bybit: string | null;
  okx: string | null;
  kraken: string | null;
}

export interface RowData {
  id: number;
  rank: number;
  name: string;
  symbol: string;
  img: string;
  price: number;

  price_change_24: number | string;
  price_change_7d: number | string;
  percent_change_30d: number | string;

  value_24: number;
  volume_change_24h?: number;
  market_cap: number;

  high24h?: number;
  low24h?: number;
  total_supply?: number;
  max_supply?: number;

  changed?: boolean;
  priceDiff?: number | null;

  exchanges: ExchangeName[] | null;
}

export type ExchangeName = "Binance" | "Bybit" | "OKX" | "Kraken";
