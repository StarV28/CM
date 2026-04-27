import axios from "axios";
import { RawTicker } from "../../../cmc/types/rawTicker.js";

//-------------------------------------------------------------------------------------//

export async function getBinanceTicker(symbol: string): Promise<RawTicker> {
  const { data } = await axios.get(
    "https://api.binance.com/api/v3/ticker/24hr",
    { params: { symbol } },
  );
  return {
    exchange: "binance",
    symbol: data.symbol,
    price: Number(data.lastPrice),
    high24h: Number(data.highPrice),
    low24h: Number(data.lowPrice),
    volume24h: Number(data.volume),
    change24hPercent: Number(data.priceChangePercent),
  };
}
