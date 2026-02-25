export interface TradingCoins {
  symbol: string;
  price_usd: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  market_cap_change_percentage_24h: number;
  sources: string[];
  sourceCount: number;
  timestamp: string;
}

export interface CmcCoinsTop {
  cmc_id: number;
  symbol: string;
  slug: string;
  name: string;
  volume_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number | null;

  binance: string | null;
  bybit: string | null;
  okx: string | null;
  kraken: string | null;
}
