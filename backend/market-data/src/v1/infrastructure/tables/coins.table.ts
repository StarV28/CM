import getPool from "../../../../db/connect_MySQL.js";

export async function createCoinsCmcTable() {
  const pool = await getPool();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS coins (
      cmc_id INT NOT NULL,

      symbol VARCHAR(20) NOT NULL,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL,
      logo VARCHAR(500),

      price_usd DECIMAL(20, 8),
      high_24h DECIMAL(20, 8),
      low_24h DECIMAL(20, 8),

      market_cap DECIMAL(30, 2),
      market_cap_change_percentage_24h DECIMAL(10, 4),
      rating INT,

      circulating_supply DECIMAL(30, 2),
      total_supply DECIMAL(30, 2),
      max_supply DECIMAL(30, 2),

      volume_24h DECIMAL(30, 2),
      volume_change_24h DECIMAL(10, 4),

      percent_change_24h DECIMAL(10, 4),
      percent_change_7d DECIMAL(10, 4),
      percent_change_30d DECIMAL(10, 4),

      fully_diluted_market_cap DECIMAL(30, 2),

      description TEXT,
      website VARCHAR(500),
      explorer VARCHAR(500),

      binance VARCHAR(20),
      bybit VARCHAR(20),
      okx VARCHAR(20),
      kraken VARCHAR(20),

      added_at DATETIME NULL,

      updated_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

      PRIMARY KEY (cmc_id),

      INDEX idx_symbol (symbol),
      INDEX idx_rating (rating),
      INDEX idx_market_cap (market_cap)

    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
}
