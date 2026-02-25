import ItemDBService from "../../modules/CRUD.js";
import redisClient from "../../../../db/connect_Redis.js";
import getPool from "../../../../db/connect_MySQL.js";
import type { CoinsRedis } from "../../../types/coins.type.js";

//-------------------------------------------------------------------------------------//

class CoinsModel {
  //-----getting all coins--------------------------------------------------------------------------------//
  static async getAllCoins() {
    try {
      const cacheKey = "coins:snapshots";
      const cachedData = await redisClient.get<CoinsRedis>(cacheKey);
      if (cachedData) {
        const data = (
          typeof cachedData === "string"
            ? Object.values(JSON.parse(cachedData))
            : Object.values(cachedData)
        ) as CoinsRedis[];

        data.sort((a, b) => a.rating - b.rating);
        return data;
      }
      const res = await ItemDBService.getList("coins");

      return res;
    } catch (err) {
      console.error("Error fetching all coins:", (err as Error).message);
      throw err;
    }
  }

  //--Getting Top 50 coins-----------------------------------------------------------------------------------//
  static async getCoinsTop(limit: number | null, favoriteIds: number[] = []) {
    try {
      const pool = await getPool();

      // ----- Redis cache
      const cacheKey = "coins:snapshots";
      const cachedData = await redisClient.get<CoinsRedis>(cacheKey);
      if (cachedData) {
        const data = (
          typeof cachedData === "string"
            ? Object.values(JSON.parse(cachedData))
            : Object.values(cachedData)
        ) as CoinsRedis[];

        data.sort((a, b) => a.rating - b.rating);

        if (!limit) return data;

        const topCoins = data.slice(0, limit);

        const topIds = new Set(topCoins.map((c) => c.id));

        const missingFav = data.filter(
          (c) => favoriteIds.includes(c.id) && !topIds.has(c.id),
        );

        const combined = [...topCoins, ...missingFav];

        combined.sort((a, b) => {
          const aFav = favoriteIds.includes(a.id);
          const bFav = favoriteIds.includes(b.id);

          if (aFav && !bFav) return -1;
          if (!aFav && bFav) return 1;

          return a.rating - b.rating;
        });

        return combined;
      }

      // ----- DB query
      let sql: string;
      let params: number[] = [];

      if (limit != null) {
        if (!Number.isInteger(limit) || limit < 1 || limit > 1000) {
          throw new Error("Invalid limit");
        }
      }

      if (limit && favoriteIds.length > 0) {
        const favPlaceholders = favoriteIds.map(() => "?").join(",");

        sql = `
        SELECT * FROM coins
        WHERE id IN (${favPlaceholders})
           OR id IN (
               SELECT id FROM coins
               ORDER BY rating ASC
               LIMIT ${limit}
           )
        ORDER BY
          CASE WHEN id IN (${favPlaceholders}) THEN 0 ELSE 1 END,
          rating ASC
      `;

        params = [...favoriteIds, ...favoriteIds]; // для IN и CASE WHEN
      } else if (limit) {
        sql = `
        SELECT * FROM coins
        ORDER BY rating ASC
        LIMIT ${limit}
      `;
      } else if (favoriteIds.length > 0) {
        const favPlaceholders = favoriteIds.map(() => "?").join(",");
        sql = `
        SELECT * FROM coins
        ORDER BY CASE WHEN id IN (${favPlaceholders}) THEN 0 ELSE 1 END,
                 rating ASC
      `;
        params = [...favoriteIds];
      } else {
        sql = `SELECT * FROM coins ORDER BY rating ASC`;
      }

      const [rows] = await pool.query(sql, params);

      return rows;
    } catch (err) {
      console.error("Error fetching top coins:", (err as Error).message);
      throw err;
    }
  }

  //----Description Coin---------------------------------------------------------------------------------//
  static async getDescriptionCoin(id: number) {
    try {
      const res = await ItemDBService.getByID("coins", "cmc_id", id);
      return res;
    } catch (err) {
      console.error("Error getting description coin", (err as Error)?.message);
      throw err;
    }
  }
}

export default CoinsModel;
