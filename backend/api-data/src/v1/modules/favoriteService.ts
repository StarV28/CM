import getPool from "../../../db/connect_MySQL.js";
import { ResultSetHeader } from "mysql2/promise";
import { createFavoritesTable } from "../tables/favorite.table.js";

//-------------------------------------------------------------------------------------//
export default class FavoriteService {
  static async favoritesTable() {
    try {
      const pool = await getPool();

      const [rows] = await pool.query(`SHOW TABLES LIKE 'favorites'`);
      if (Array.isArray(rows) && rows.length <= 0) {
        await createFavoritesTable();
      }
    } catch (err) {
      console.error("Error find Favorite table", (err as Error)?.message);
      return null;
    }
  }
  //-------------------------------------------------------------------------------------//
  static async getCheckFindUserCoin(userId: number | string, coinId: string) {
    try {
      const pool = await getPool();
      const sql = `SELECT * FROM favorites WHERE userId = ? AND coinId = ? LIMIT 1`;
      const [rows] = await pool.query(sql, [userId, coinId]);
      return Array.isArray(rows) && rows.length > 0;
    } catch (err) {
      console.error("Error find coin & user id", (err as Error)?.message);
      return null;
    }
  }
  //-------------------------------------------------------------------------------------//
  static async getAllFavoriteCoinsUSer(
    userId: string | number | undefined | null
  ) {
    try {
      const pool = await getPool();
      const sql = `SELECT * FROM favorites WHERE userId = ?`;
      const [rows] = await pool.query(sql, [userId]);
      return rows;
    } catch (err) {
      console.error("Error find user", (err as Error)?.message);
      return null;
    }
  }
  //-------------------------------------------------------------------------------------//
  static async deleteFavorite(coinId: number, userId: number) {
    try {
      const pool = await getPool();
      const sql = `DELETE FROM favorites WHERE userid = ? AND coinId = ?`;
      const [rows] = await pool.execute<ResultSetHeader>(sql, [userId, coinId]);
      return rows;
    } catch (err) {
      console.error("Error delete favorite coin", (err as Error)?.message);
      return null;
    }
  }
}
