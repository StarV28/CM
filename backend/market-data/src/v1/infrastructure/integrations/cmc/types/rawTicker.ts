export interface RawTicker {
  exchange: "binance" | "bybit" | "okx" | "kraken";
  symbol: string;
  price: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  change24hPercent?: number | null;
}
