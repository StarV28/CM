import axios from "axios";
import type {
  BybitExchangeInfo,
  BybitSymbol,
} from "../../types/exchangesMapp.js";

export async function getBybitSpotUsdtMarkets() {
  const { data } = await axios.get<BybitExchangeInfo>(
    "https://api.bybit.com/v5/market/instruments-info?category=spot"
  );

  return data.result.list
    .filter(
      (s: BybitSymbol) => s.status === "Trading" && s.quoteCoin === "USDT"
    )
    .map((s: BybitSymbol) => ({
      exchange: "bybit" as const,
      base_asset: s.baseCoin,
      quote_asset: s.quoteCoin,
      exchange_symbol: s.symbol,
    }));
}
