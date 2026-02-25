// exchanges/okx.ts
import axios from "axios";
import { RawTicker } from "../../../cmc/types/rawTicker.js";

export async function getOkxTicker(symbol: string): Promise<RawTicker> {
  // BTCUSDT → BTC-USDT
  const instId = symbol.replace("USDT", "-USDT");

  const { data } = await axios.get("https://www.okx.com/api/v5/market/ticker", {
    params: { instId },
  });

  const item = data.data[0];

  return {
    exchange: "okx",
    symbol,
    price: Number(item.last),
    high24h: Number(item.high24h),
    low24h: Number(item.low24h),
    volume24h: Number(item.vol24h),
    change24hPercent:
      ((Number(item.last) - Number(item.open24h)) / Number(item.open24h)) * 100,
  };
}
