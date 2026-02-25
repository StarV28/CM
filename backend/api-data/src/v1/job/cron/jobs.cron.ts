import type { CronJobConfig } from "../types/cron.type.js";
import { getNewsRedis } from "../../external/news/newsRedis/NewsGetRedisHelper.js";

//-------------------------------------------------------------------------------------//

export const jobs: CronJobConfig[] = [
  {
    name: "news",
    schedule: "0 */20 * * * *",
    ttlMs: 1000 * 60 * 10,
    retries: 2,
    timeoutMs: 1000 * 60 * 3,
    handler: async () => {
      console.log("🔄 cron refresh news");

      await Promise.all([
        getNewsRedis("Germany-news"),
        getNewsRedis("World-news"),
        getNewsRedis("Indie-news"),
        getNewsRedis("Turkey-news"),
        getNewsRedis("Ukraine-news"),
      ]);
    },
  },
];
