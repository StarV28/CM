import axios from "axios";
import { RawTicker } from "../../../cmc/types/rawTicker.js";

export async function getBybitTicker(symbol: string): Promise<RawTicker> {
  const { data } = await axios.get("https://api.bybit.com/v5/market/tickers", {
    params: {
      category: "spot",
      symbol,
    },
  });

  const item = data.result.list[0];

  return {
    exchange: "bybit",
    symbol: item.symbol,
    price: Number(item.lastPrice),
    high24h: Number(item.highPrice24h),
    low24h: Number(item.lowPrice24h),
    volume24h: Number(item.volume24h),
    change24hPercent: Number(item.price24hPcnt) * 100,
  };
}
