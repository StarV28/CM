import getPool from "../../../../db/connect_MySQL.js";

//-------------------------------------------------------------------------------------//
export async function createCmcQuotes() {
  const pool = await getPool();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS cmc_quotes (
      cmc_id INT NOT NULL,

      volume_24h DECIMAL(30, 8) DEFAULT NULL,
      volume_change_24h DECIMAL(10, 4) DEFAULT NULL,

      percent_change_24h DECIMAL(10, 4) DEFAULT NULL,
      percent_change_7d DECIMAL(10, 4) DEFAULT NULL,
      percent_change_30d DECIMAL(10, 4) DEFAULT NULL,

      fully_diluted_market_cap DECIMAL(30, 2) DEFAULT NULL,

      updated_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

      PRIMARY KEY (cmc_id),

      CONSTRAINT fk_cmc_quotes_symbol
        FOREIGN KEY (cmc_id)
        REFERENCES cmc_symbol (cmc_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
}
