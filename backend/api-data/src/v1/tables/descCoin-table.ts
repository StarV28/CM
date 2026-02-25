import getPool from "../../../db/connect_MySQL.js";

export async function createDescCoin() {
  const pool = await getPool();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS coins_description (
    id INT PRIMARY KEY,
    symbol VARCHAR(64),

    en TEXT,
    de TEXT,
    ua TEXT,
    tr TEXT,
    hi TEXT
    )
    `);
}
