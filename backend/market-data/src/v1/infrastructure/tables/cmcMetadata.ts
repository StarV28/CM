import getPool from "../../../../db/connect_MySQL.js";

//-------------------------------------------------------------------------------------//
export async function createCmcMetadata() {
  const pool = await getPool();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS cmc_metadata (
    cmc_id INT UNSIGNED NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    symbol VARCHAR(50) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT,
    logo VARCHAR(255),
    website VARCHAR(255),
    explorer VARCHAR(255),
    
    platform_id INT UNSIGNED,
    platform_name VARCHAR(255),
    platform_symbol VARCHAR(50),
    platform_slug VARCHAR(100),
    platform_token_address VARCHAR(255),
    
    infinite BOOLEAN NOT NULL DEFAULT FALSE,
    added_at DATETIME,
    launched_at DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    `);
}
