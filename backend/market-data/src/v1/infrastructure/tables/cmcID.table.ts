import getPool from "../../../../db/connect_MySQL.js";

export async function createCMCIdTable() {
  const pool = await getPool();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS cmc_symbol (
      cmc_id INT NOT NULL PRIMARY KEY,
      symbol VARCHAR(50) NOT NULL,
      slug VARCHAR(100) NOT NULL,
      name VARCHAR(255) NOT NULL,
      circulating_supply BIGINT,
      total_supply BIGINT,
      max_supply BIGINT
    )
  `);
}
