import getPool from "../../../db/connect_MySQL.js";

export async function createFavoritesTable() {
  const pool = await getPool();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS favorites (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT NOT NULL,
      coinId INT NOT NULL,
      symbol VARCHAR(100) NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      
      CONSTRAINT fk_fav_user FOREIGN KEY (userId)
        REFERENCES users(id) ON DELETE CASCADE,
      CONSTRAINT fk_fav_coin FOREIGN KEY (coinId)
        REFERENCES coins(cmc_id) ON DELETE CASCADE
    );
  `);

  // Индексы для ускорения выборки
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites (userId);
  `);
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_favorites_coin ON favorites (coinId);
  `);
}
