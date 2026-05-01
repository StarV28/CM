import { Request } from "express";

export interface AuthRequest extends Request {
  user?: User;
}

type User = {
  id: number;
  email: string;
};

export interface Coin {
  id: number;
  symbol: string;
  name: string;
  logo: string;
  price_usd: number;
  high24h: number;
  low24h: number;
  market_cap_change_percentage_24h: number;
  market_cap: number;
  rating: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  volume_24h: string;
  volume_change_24h: string;
  percent_change_24h: string;
  percent_change_7d: string;
  percent_change_30d: string;
  binance: string;
  bybit: string;
  okx: string;
  kraken: string;
  symbolBinance: string;
  symbolBybit: string;
  symbolKraken: string;
  symbolOkx: string;
}
