import { cacheRedisServer } from "../../../../utils/cacheRedisServer.js";

//---------------------------------------//
export default class AnalyticsModel {
  static async readAnalyticsFromRedis(locale: string) {
    try {
      const listKey = `analytics:list:${locale}`;
      const dates = await cacheRedisServer.range(listKey, 0, 4);

      const articles = [];

      for (const date of dates) {
        const data = await cacheRedisServer.get(`analytics:${locale}:${date}`);
        if (data) {
          articles.push(data);
        }
      }

      return {
        main: articles[0] || null,
        previous: articles.slice(1),
      };
    } catch (err) {
      console.error("Error reading analytics text", (err as Error)?.message);
      throw err;
    }
  }
}
