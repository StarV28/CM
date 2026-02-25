import getPool from "../../../../../db/connect_MySQL.js";
//-------------------------------------------------------------------------------------//

export async function saveVolumeBulk(
  volumeData: { cmc_id: number; volume_24h: number }[]
) {
  if (!volumeData.length) return;

  const pool = await getPool();

  try {
    const values = volumeData.map(() => "(?, ?)").join(", ");

    const params = volumeData.flatMap((v) => [v.cmc_id, v.volume_24h]);

    const sql = `
      INSERT INTO cmc_symbol (cmc_id, volume_24h)
      VALUES ${values}
      ON DUPLICATE KEY UPDATE
        volume_24h = VALUES(volume_24h)
    `;

    const [rows] = await pool.query(sql, params);
    return rows;
  } catch (err) {
    console.error("Error saving bulk volume_24h:", (err as Error)?.message);
    throw err;
  }
}
