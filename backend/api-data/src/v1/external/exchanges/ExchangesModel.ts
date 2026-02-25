import redis from "../../../../db/connect_Redis.js";
//-------------------------------------------------------------------------------------//

interface Kline {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
interface Source {
  key: string;
  pair: string;
  candles: Kline[];
}
//-------------------------------------------------------------------------------------//
export async function allEx(): Promise<Source[] | null> {
  try {
    const cached = await redis.get("market:exchange");
    if (!cached) return null;

    if (typeof cached === "string") {
      return JSON.parse(cached) as Source[];
    }
    return cached as Source[];
  } catch (err) {
    console.error(
      "Error getting Exchanges data from redis ",
      (err as Error)?.message
    );
    throw err;
  }
}
