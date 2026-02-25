import { buildTradingCoins } from "../../domain/coins/services/build_coins/buildTrCoins.js";
import { syncCoins } from "../../infrastructure/storage/mysql/coins.repository.js";
//-------------------------------------------------------------------------------------//
export async function collectTrCoinsMySQL() {
  const coins = await buildTradingCoins();

  if (!coins) return [];
  await syncCoins(coins);

  return coins;
}
