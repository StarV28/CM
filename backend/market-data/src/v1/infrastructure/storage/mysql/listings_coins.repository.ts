import getPool from "../../../../../db/connect_MySQL.js";
import type { TopCmcCoins } from "../types/mysql.type.js";

export async function saveTop500coins(data: TopCmcCoins) {
  const pool = await getPool();

  const values = data.map((c) => [
    c.cmc_id,
    c.symbol,
    c.slug,
    c.name,
    c.circulating_supply ?? null,
    c.total_supply ?? null,
    c.max_supply ?? null,
  ]);

  const sql = `
    INSERT INTO cmc_symbol
      (cmc_id, symbol, slug, name, circulating_supply, total_supply, max_supply)
    VALUES ?
    ON DUPLICATE KEY UPDATE
      symbol = VALUES(symbol),
      slug = VALUES(slug),
      name = VALUES(name),
      circulating_supply = VALUES(circulating_supply),
      total_supply = VALUES(total_supply),
      max_supply = VALUES(max_supply)
  `;

  await pool.query(sql, [values]);
}
