import axios from "axios";
import type { RawTicker } from "../../../cmc/types/rawTicker.js";

//-------------------------------------------------------------------------------------//
export async function getKrakenTicker(symbol: string): Promise<RawTicker> {
  const { data } = await axios.get("https://api.kraken.com/0/public/Ticker", {
    params: { pair: symbol },
  });

  const resultKey = Object.keys(data.result)?.[0];
  if (!resultKey) {
    throw new Error(`Kraken: no data for ${symbol}`);
  }

  const t = data.result[resultKey];

  return {
    exchange: "kraken",
    symbol,
    price: Number(t.c[0]),
    high24h: Number(t.h[1]),
    low24h: Number(t.l[1]),
    volume24h: Number(t.v[1]),
    change24hPercent: null,
  };
}
