// import redis from "../../../../db/connect_Redis.js";
import ItemDBService from "../../modules/CRUD.js";
import ExAdaptSymbol from "./ExAdaptSymbol.js";
import ExProviders from "./ExProviders.js";
import { cacheRedisServer } from "../../../../utils/cacheRedisServer.js";
import type { Coin } from "../../../types/global.types.js";

//-------------------------------------------------------------------------------------//

interface Kline {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
// interface Source {
//   key: string;
//   pair: string;
//   candles: Kline[];
// }
interface ExchangeData {
  key: string;
  pair: string;
  candles: Kline[];
}
export type ResData = [number, string, string, string, string, string, string];
//-------------------------------------------------------------------------------------//
// export async function allEx(): Promise<Source[] | null> {
//   try {
//     const cached = await redis.get("market:exchange");
//     if (!cached) return null;

//     if (typeof cached === "string") {
//       return JSON.parse(cached) as Source[];
//     }
//     return cached as Source[];
//   } catch (err) {
//     console.error(
//       "Error getting Exchanges data from redis ",
//       (err as Error)?.message,
//     );
//     throw err;
//   }
// }

export default class Ex {
  static async exData(id: number) {
    try {
      const coin = await ItemDBService.getByID<Coin>("coins", "cmc_id", id);
      if (!coin) return [];

      const exchanges = [
        {
          key: "binance",
          symbol: coin.symbolBinance,
          fn1: ExAdaptSymbol.getAdaptBinance,
          fn2: ExProviders.getBinanceEx,
        },
        {
          key: "bybit",
          symbol: coin.symbolBybit,
          fn1: ExAdaptSymbol.getAdaptBybit,
          fn2: ExProviders.getBybitEx,
        },
        {
          key: "okx",
          symbol: coin.symbolOkx,
          fn1: ExAdaptSymbol.getAdaptOkx,
          fn2: ExProviders.getOkxEx,
        },
        {
          key: "kraken",
          symbol: coin.symbolKraken,
          fn1: ExAdaptSymbol.getAdaptKraken,
          fn2: ExProviders.getKrakenEx,
        },
      ];

      const tasks = exchanges.map(async (ex) => {
        if (!ex.symbol) return null;

        const pair = ex.fn1(ex.symbol);
        const candles = await ex.fn2(pair);
        if (!candles.length) return null;

        return {
          key: ex.key,
          pair: ex.symbol,
          candles: candles,
        };
      });

      const settled = await Promise.allSettled(tasks);

      settled
        .filter((r) => r.status === "rejected")
        .forEach((r) => console.error("Exchange failed:", r.reason));

      const values: ExchangeData[] = settled
        .filter(
          (r): r is PromiseFulfilledResult<ExchangeData | null> =>
            r.status === "fulfilled",
        )
        .map((r) => r.value)
        .filter((v): v is ExchangeData => v !== null);

      if (values.length) {
        await cacheRedisServer.set("market:exchange", values, 30);
      }
    } catch (err) {
      console.error("Error fetching exchange data", (err as Error)?.message);
      throw err;
    }
  }
}
