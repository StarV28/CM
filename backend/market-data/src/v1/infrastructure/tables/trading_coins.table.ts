import getPool from "../../../../db/connect_MySQL.js";

export async function createTradingSymbol() {
  const pool = await getPool();

  await pool.query(`
CREATE TABLE IF NOT EXISTS trading_coins (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,

  cmc_id INT NOT NULL UNIQUE,
  symbol VARCHAR(50) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,

  binance VARCHAR(30),
  bybit VARCHAR(30),
  okx VARCHAR(30),
  kraken VARCHAR(30),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
);

`);
}
