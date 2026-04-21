import { buildTradingCoins } from "./buildTrCoins.js";
import type { TradingCoinRedisDelta } from "../../type/buildTrCoins.types.js";
// import { syncRedis } from "../../../../infrastructure/storage/redis/redis.repository.js";
import { cacheRedisServer } from "../../../../../../utils/cacheRedisServer.js";

//-------------------------------------------------------------------------------------//

export async function trCoinsRedisDelta(): Promise<
  Record<string, TradingCoinRedisDelta>
> {
  const lockKey = "lock:delta";
  const isLocked = await cacheRedisServer.setKey(lockKey, 30);
  if (!isLocked) {
    console.log("Delta: lock--------->", isLocked);
    const cached = await cacheRedisServer.get("coins:delta");
    return (cached as Record<string, TradingCoinRedisDelta>) || {};
  }
  const coins = (await buildTradingCoins()).slice(0, 150);
  const delta: Record<string, TradingCoinRedisDelta> = {};

  for (const el of coins) {
    delta[el.symbol] = {
      id: el.cmc_id,
      price_usd: el.price_usd,
      rating: el.rating,
      volume_24h: Number(el.volume_24h),
      volume_change_24h: Number(el.volume_change_24h),
      percent_change_24h: Number(el.percent_change_24h),
      priceDiff: el.priceDiff,
      changed: el.changed,
    };
  }

  try {
    // await syncRedis("coins:delta", delta, 45);
    await cacheRedisServer.set("coins:delta", delta, 45);
    return delta;
  } finally {
    await cacheRedisServer.del(lockKey);
  }
}
