import { SymbolsEx } from "../../../shared/types/coins.type.js";

export type TradingCoinView = {
  cmc_id: number;
  symbol: string;
  name: string;
  slug: string;

  price_usd: number;
  high24h: number;
  low24h: number;
  market_cap_change_percentage_24h: number;
  market_cap: number;
  rating: number;

  logo?: string;
  description?: string;
  website?: string[];
  explorer?: string[];

  circulating_supply?: number;
  total_supply?: number;
  max_supply?: number;

  volume_24h?: number;
  volume_change_24h?: number;
  percent_change_24h?: number;
  percent_change_7d?: number;
  percent_change_30d?: number;
  fully_diluted_market_cap?: number;

  symbolsEx: SymbolsEx;

  binance: string | null;
  bybit: string | null;
  okx: string | null;
  kraken: string | null;

  added_at?: string;

  priceDiff: number;
  changed: boolean;
};

export type CmcTopCoin = {
  cmc_id: number;
  symbol: string;
  slug: string;
  name: string;
  cmc_rank?: number;
  market_cap?: number;
  volume_24h?: number;
  circulating_supply?: number;
  total_supply?: number;
  max_supply?: number;
};

export type CmcQuoteCoin = {
  price?: number;
  volume_24h?: number;
  volume_change_24h: number;
  market_cap?: number;
  market_cap_change_24h?: number;
  percent_change_1h?: number;
  percent_change_24h?: number;
  percent_change_7d?: number;
  percent_change_30d?: number;
  fully_diluted_market_cap?: number;
};

export type CmcMarketCoin = {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  description?: string;
  logo?: string;
  website?: string[];
  whitepaper?: string[];
  explorer?: string[];
  reddit?: string[];
  github?: string[];
  tags?: string[];
  platform?: {
    id: number;
    name: string;
    symbol: string;
    slug: string;
    token_address: string;
  };
  added_at?: string;
};

export type ExData = {
  price_usd: number;
  high24h: number;
  low24h: number;
  market_cap_change_percentage_24h: number;
  market_cap: number;
  rating: number;
  symbolsEx: SymbolsEx;
  sources: string[];
};

//---------------------------------------//
export type TradingCoinRedisView = {
  cmc_id: number;
  symbol: string;
  name: string;
  logo?: string;

  price_usd: number;
  high24h: number;
  low24h: number;
  market_cap_change_percentage_24h: number;
  market_cap: number;
  rating: number;

  circulating_supply?: number;
  total_supply?: number;
  max_supply?: number;

  volume_24h?: number;
  volume_change_24h?: number;
  percent_change_24h?: number;
  percent_change_7d?: number;
  percent_change_30d?: number;

  binance: string | null;
  bybit: string | null;
  okx: string | null;
  kraken: string | null;
};

export type TradingCoinRedisDelta = {
  cmc_id: number;
  price_usd: number;
  rating: number;

  volume_24h?: number;
  volume_change_24h?: number;
  percent_change_24h?: number;
  priceDiff: number;
  changed: boolean;
};
