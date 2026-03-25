import type { RequestAnalytics } from "../../../types/adminAnal.type.js";
import getPool from "../../../../db/connect_MySQL.js";
import { cacheRedisServer } from "../../../../utils/cacheRedisServer.js";
import { normalizeAnalytics } from "./normalizeAnalytics.js";
import type { Coins } from "../../../types/coins.type.js";
import type { RowDataPacket } from "mysql2";

//---------------------------------------//

export default class AnalModel {
  static async createAnalytic(data: RequestAnalytics) {
    try {
      const pool = await getPool();
      const { text, locale } = data;

      const limit = 5;
      const sql = `SELECT * FROM coins ORDER BY rating ASC LIMIT ${limit}
      `;
      const [rows] = await pool.query<RowDataPacket[]>(sql);

      const coins = rows as unknown as Coins[];

      const analyticData = normalizeAnalytics(text, locale, coins);

      if (!analyticData) {
        return { success: false };
      }

      const date = new Date().toISOString().slice(0, 10);
      const key = `analytics:${locale}:${date}`;
      const listKey = `analytics:list:${locale}`;

      await cacheRedisServer.set(key, analyticData, 259200);

      await cacheRedisServer.push(listKey, date);

      await cacheRedisServer.trim(listKey, 0, 4);

      return { success: true };
    } catch (err) {
      console.error(
        "Error create Analytics analModel",
        (err as Error)?.message,
      );
      throw err;
    }
  }
}
