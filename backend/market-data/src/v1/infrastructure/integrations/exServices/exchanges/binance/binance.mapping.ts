import axios from "axios";
import type { BinanceInfo, BinanceSymbol } from "../../types/exchangesMapp.js";

export async function getBinanceSpotUsdtMarkets() {
  const { data } = await axios.get<BinanceInfo>(
    "https://api.binance.com/api/v3/exchangeInfo",
  );

  return data.symbols
    .filter(
      (s: BinanceSymbol) =>
        s.status === "TRADING" &&
        s.isSpotTradingAllowed === true &&
        s.quoteAsset === "USDT",
    )
    .map((s: BinanceSymbol) => ({
      exchange: "binance" as const,
      base_asset: s.baseAsset.toUpperCase(),
      quote_asset: s.quoteAsset,
      exchange_symbol: s.symbol,
    }));
}
