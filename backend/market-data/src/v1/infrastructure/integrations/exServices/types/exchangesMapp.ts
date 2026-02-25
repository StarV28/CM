export interface BinanceInfo {
  symbols: BinanceSymbol[];
}

export interface BinanceSymbol {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  status: string;
  isSpotTradingAllowed: boolean;
}

export interface BybitExchangeInfo {
  retCode: number;
  retMsg: string;
  result: {
    category: string;
    list: BybitSymbol[];
  };
}

export interface BybitSymbol {
  symbol: string;
  baseCoin: string;
  quoteCoin: string;
  status: string;
}

export interface OkxSymbol {
  instId: string;
  instType: "SPOT" | string;
  baseCcy: string;
  quoteCcy: string;
  state: "live" | string;
}

export interface OkxInfo {
  code: string;
  msg: string;
  data: OkxSymbol[];
}

export type Exchanges = "binance" | "bybit" | "okx" | "kraken";

export type ExchangePair = {
  exchange: Exchanges;
  base_asset: string;
  quote_asset: string;
  exchange_symbol: string;
};

export type CommonSymbol = {
  base_asset: string;
  quote_asset: string;
  symbols?: {
    binance: string | undefined;
    bybit: string | undefined;
    okx: string | undefined;
    kraken: string | undefined;
  };
};

export type CollectCoins = {
  cmc_id: number;
  symbol: string;
  slug: string;
  name: string;

  base_asset: string;
  quote_asset: string;

  volume_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number | null;

  binance: string | null;
  bybit: string | null;
  okx: string | null;
  kraken: string | null;
};
