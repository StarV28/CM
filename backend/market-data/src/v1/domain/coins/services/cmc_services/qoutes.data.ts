import getPool from "../../../../../../db/connect_MySQL.js";
import { cache } from "../../../../../../shared/utils/cache_nodes.js";
//-------------------------------------------------------------------------------------//
export async function quotesData() {
  try {
    const pool = await getPool();
    const cached = cache.get("metadataCmc");
    if (cached) return cached;

    const [rows] = await pool.query("SELECT * FROM cmc_quotes");
    cache.set("metadataCmc", rows, 60 * 60 * 4);
    return rows;
  } catch (err) {
    console.error("Error getting quotes data from db", (err as Error)?.message);
    throw err;
  }
}
