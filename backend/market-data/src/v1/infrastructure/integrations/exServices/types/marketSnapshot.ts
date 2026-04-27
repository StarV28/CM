export interface MarketSnapshot {
  symbol: string;

  symbolBinance: string | null;
  symbolBybit: string | null;
  symbolOkx: string | null;
  symbolKraken: string | null;

  price_usd: number;
  high24h: number;
  low24h: number;

  volume24h: number;
  market_cap_change_percentage_24h: number;

  sources: string[];
  sourceCount: number;

  timestamp: string;
}
