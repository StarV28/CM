export type TradingCoin = {
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
};
