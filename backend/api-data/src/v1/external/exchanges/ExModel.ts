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

interface ExchangeData {
  key: string;
  pair: string;
  candles: Kline[];
}
export type ResData = [number, string, string, string, string, string, string];
//-------------------------------------------------------------------------------------//
const inFlight = new Map<number, Promise<ExchangeData[]>>();
//-------------------------------------------------------------------------------------//

export default class Ex {
  //---------------------------------------//

  static async exData(id: number) {
    const cacheKey = `market:ex:${id}`;
    const cached = await cacheRedisServer.get(cacheKey);
    if (cached) return cached;

    if (inFlight.has(id)) {
      return await inFlight.get(id);
    }

    const task = this.fetchAndCache(id, cacheKey);

    inFlight.set(id, task);

    try {
      return await task;
    } finally {
      inFlight.delete(id);
    }
  }
  //---------------------------------------//

  private static async fetchAndCache(
    id: number,
    cacheKey: string,
  ): Promise<ExchangeData[]> {
    const coin = await ItemDBService.getByID<Coin>("coins", "cmc_id", id);

    if (!coin) return [];

    const exchanges = [
      {
        key: "binance",
        symbol: coin.symbolBinance,
        adapt: ExAdaptSymbol.getAdaptBinance,
        fetch: ExProviders.getBinanceEx,
      },
      {
        key: "bybit",
        symbol: coin.symbolBybit,
        adapt: ExAdaptSymbol.getAdaptBybit,
        fetch: ExProviders.getBybitEx,
      },
      {
        key: "okx",
        symbol: coin.symbolOkx,
        adapt: ExAdaptSymbol.getAdaptOkx,
        fetch: ExProviders.getOkxEx,
      },
      {
        key: "kraken",
        symbol: coin.symbolKraken,
        adapt: ExAdaptSymbol.getAdaptKraken,
        fetch: ExProviders.getKrakenEx,
      },
    ];

    const tasks = exchanges.map(async (ex) => {
      if (!ex.symbol) return null;

      const pair = ex.adapt(ex.symbol);
      const candles = await ex.fetch(pair);

      if (!candles.length) return null;

      return {
        key: ex.key,
        pair: ex.symbol,
        candles,
      };
    });

    const settled = await Promise.allSettled(tasks);

    const values = settled
      .filter(
        (r): r is PromiseFulfilledResult<ExchangeData | null> =>
          r.status === "fulfilled",
      )
      .map((r) => r.value)
      .filter(Boolean) as ExchangeData[];

    if (values.length) {
      await cacheRedisServer.set(cacheKey, values, 120);
    }

    return values;
  }
}
