import { buildTradingCoins } from "./buildTrCoins.js";
import type {
  TradingCoinRedisDelta,
  TradingCoinView,
} from "../../type/buildTrCoins.types.js";
// import { syncRedis } from "../../../../infrastructure/storage/redis/redis.repository.js";
import { cacheRedisServer } from "../../../../../../utils/cacheRedisServer.js";

//-------------------------------------------------------------------------------------//

export async function trCoinsRedisDelta(): Promise<
  Record<string, TradingCoinRedisDelta>
> {
  const coins = (await buildTradingCoins()).slice(0, 150);
  const redisDelta = normalizeDelta(coins);

  // await syncRedis("coins:delta", delta, 45);
  await cacheRedisServer.set("coins:delta", redisDelta, 25);
  return redisDelta;
}

function normalizeDelta(
  coins: TradingCoinView[],
): Record<string, TradingCoinRedisDelta> {
  const delta: Record<string, TradingCoinRedisDelta> = {};

  for (const el of coins) {
    delta[el.symbol] = {
      cmc_id: el.cmc_id,
      price_usd: el.price_usd,
      rating: el.rating,
      volume_24h: Number(el.volume_24h),
      volume_change_24h: Number(el.volume_change_24h),
      percent_change_24h: Number(el.percent_change_24h),
      priceDiff: el.priceDiff,
      changed: el.changed,
    };
  }
  return delta;
}
