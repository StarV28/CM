import getPool from "../../../../../../db/connect_MySQL.js";

//-------------------------------------------------------------------------------------//
export async function marketData() {
  try {
    const pool = await getPool();

    const [rows] = await pool.query("SELECT * FROM cmc_metadata");
    return rows;
  } catch (err) {
    console.error(
      "Error getting Market data from db ",
      (err as Error)?.message
    );
    throw err;
  }
}
