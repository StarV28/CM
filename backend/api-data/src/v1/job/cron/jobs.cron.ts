import NewsModelUa from "../../external/news/NewsModelUa.js";
import NewsModelDe from "../../external/news/NewsModelDe.js";
import NewsModelTr from "../../external/news/NewsModelTr.js";
import NewsModelEn from "../../external/news/NewsModelEn.js";
import NewsModelHi from "../../external/news/NewsModelHi.js";
import type { CronJobConfig } from "../types/cron.type.js";

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
        NewsModelUa.allNewsUkr(),
        NewsModelDe.allNewsDe(),
        NewsModelTr.allNewsTr(),
        NewsModelEn.allNewsWorld(),
        NewsModelHi.allNewsHi(),
      ]);
    },
  },
];
