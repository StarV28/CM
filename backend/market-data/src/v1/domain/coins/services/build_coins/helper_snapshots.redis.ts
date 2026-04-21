import { buildTradingCoins } from "./buildTrCoins.js";
import { TradingCoinRedisView } from "../../type/buildTrCoins.types.js";
// import { syncRedis } from "../../../../infrastructure/storage/redis/redis.repository.js";
import { cacheRedisServer } from "../../../../../../utils/cacheRedisServer.js";
//-------------------------------------------------------------------------------------//

export async function trCoinsRedisSnapshots(): Promise<TradingCoinRedisView[]> {
  const lockKey = "lock:snapshot";
  const isLocked = await cacheRedisServer.setKey(lockKey, 90);

  if (!isLocked) {
    console.log("Snapshots: Lock------------>", isLocked);
    const cached = await cacheRedisServer.get("coins:snapshots");
    return (cached as TradingCoinRedisView[]) || [];
  }
  const coins = await buildTradingCoins();

  const redisCoins = coins.map((c) => ({
    id: c.cmc_id,
    symbol: c.symbol,
    name: c.name,
    logo: c.logo,

    price_usd: c.price_usd,
    high24h: c.high24h,
    low24h: c.low24h,
    market_cap_change_percentage_24h: c.market_cap_change_percentage_24h,
    market_cap: c.market_cap,
    rating: c.rating,

    circulating_supply: c.circulating_supply,
    total_supply: c.total_supply,
    max_supply: c.max_supply,

    volume_24h: c.volume_24h,
    volume_change_24h: c.volume_change_24h,
    percent_change_24h: c.percent_change_24h,
    percent_change_7d: c.percent_change_7d,
    percent_change_30d: c.percent_change_30d,

    binance: c.binance,
    bybit: c.bybit,
    okx: c.okx,
    kraken: c.kraken,
  }));

  try {
    // await syncRedis("coins:snapshots", redisCoins, 120);
    await cacheRedisServer.set("coins:snapshots", redisCoins, 120);
    return redisCoins;
  } finally {
    await cacheRedisServer.del(lockKey);
  }
}
