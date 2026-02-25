import pLimit from "p-limit";
import { aggregateTickers } from "./aggregateTickers.js";
import { collectTickers } from "./collectTickers.js";
import { getMatcherCoins } from "../../../domain/coins/services/MatcherService.js";
import { calcCoinRating } from "../../../domain/coins/services/calculateCoinRating.js";
import { cache } from "../../../../../shared/utils/cache_nodes.js";
import type { CollectCoins } from "./types/exchangesMapp.js";

//-------------------------------------------------------------------------------------//
const limit = pLimit(10);

export async function exOrchestrator() {
  console.log("exOrchestrator START");

  let coins: CollectCoins[] = cache.get("tradingCoins") as CollectCoins[];
  if (!coins) {
    coins = ((await getMatcherCoins()) as CollectCoins[]) ?? [];
  }
  //---------------------------------------//

  const tasks = coins.map((coin) =>
    limit(async () => {
      try {
        const tickers = await collectTickers(coin);
        return await aggregateTickers(tickers);
      } catch (e) {
        console.error(`Error for ${coin.symbol}`, (e as Error).message);
        return null;
      }
    }),
  );

  //---------------------------------------//

  const results = await Promise.allSettled(tasks);

  const snapshots = results
    .filter(
      (
        r,
      ): r is PromiseFulfilledResult<
        NonNullable<ReturnType<typeof aggregateTickers>>
      > => r.status === "fulfilled" && r.value !== null,
    )
    .map((r) => ({
      ...r.value,
      symbol: r.value.symbol.endsWith("USDT")
        ? r.value.symbol.slice(0, -4)
        : r.value.symbol,
    }));
  console.log("exOrchestrator STOP");

  const exCoinsData = await calcCoinRating(snapshots);
  if (exCoinsData) {
    return exCoinsData;
  }
  return snapshots;
}
