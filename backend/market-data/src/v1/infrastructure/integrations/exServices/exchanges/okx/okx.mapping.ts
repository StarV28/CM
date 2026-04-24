import axios from "axios";
import type { OkxSymbol, OkxInfo } from "../../types/exchangesMapp.js";

export async function getOkxSpotUsdtMarkets() {
  const { data } = await axios.get<OkxInfo>(
    "https://www.okx.com/api/v5/public/instruments?instType=SPOT",
  );

  return data.data
    .filter(
      (s: OkxSymbol) =>
        s.instType === "SPOT" && s.state === "live" && s.quoteCcy === "USDT",
    )
    .map((s: OkxSymbol) => ({
      exchange: "okx" as const,
      base_asset: s.baseCcy.toUpperCase(),
      quote_asset: s.quoteCcy,
      exchange_symbol: s.instId.replace("-", ""),
    }));
}
