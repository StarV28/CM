import getPool from "../../../../../../db/connect_MySQL.js";
import { cache } from "../../../../../../shared/utils/cache_nodes.js";

//-------------------------------------------------------------------------------------//
export async function topData() {
  try {
    const pool = await getPool();

    const cached = cache.get("topCmcCoins");
    if (cached) return cached;

    const [rows] = await pool.query("SELECT * FROM  cmc_symbol");
    cache.set("topCmcCoins", rows, 60 * 60 * 8);
    return rows;
  } catch (err) {
    console.error(
      "Error getting data Top 500 coins from db",
      (err as Error)?.message
    );
    throw err;
  }
}
