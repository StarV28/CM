import getPool from "../../../../../db/connect_MySQL.js";
import { CmcQuotesData } from "../types/mysql.type.js";

//-------------------------------------------------------------------------------------//
export async function saveCmcQuotes(data: CmcQuotesData[]) {
  if (!data.length) return;

  const pool = await getPool();

  const values = data.map((c) => [
    c.cmc_id,
    c.volume_24h,
    c.volume_change_24h,
    c.percent_change_24h,
    c.percent_change_7d,
    c.percent_change_30d,
    c.fully_diluted_market_cap,
  ]);

  const sql = `
    INSERT INTO cmc_quotes (
      cmc_id,
      volume_24h,
      volume_change_24h,
      percent_change_24h,
      percent_change_7d,
      percent_change_30d,
      fully_diluted_market_cap
    )
    VALUES ?
    ON DUPLICATE KEY UPDATE
      volume_24h = VALUES(volume_24h),
      volume_change_24h = VALUES(volume_change_24h),
      percent_change_24h = VALUES(percent_change_24h),
      percent_change_7d = VALUES(percent_change_7d),
      percent_change_30d = VALUES(percent_change_30d),
      fully_diluted_market_cap = VALUES(fully_diluted_market_cap),
      updated_at = CURRENT_TIMESTAMP
  `;

  await pool.query(sql, [values]);
}
