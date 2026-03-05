import CollectRedis from "../../application/coins/collectCoinsRedis.js";
import { collectEx } from "../../application/exchanges/collectEx.js";
import { collectRates } from "../../application/rates/collectRates.js";
import ColectDataCMC from "../../application/coins/collectDataCMC.js";
import { collectTrCoinsMySQL } from "../../application/coins/collectCoinsMySQL.js";
import { CronJobConfig } from "../types/cron.type.js";

import NewsModelUa from "../../domain/news/NewsModelUa.js";
import NewsModelDe from "../../domain/news/NewsModelDe.js";
import NewsModelTr from "../../domain/news/NewsModelTr.js";
import NewsModelEn from "../../domain/news/NewsModelEn.js";
import NewsModelHi from "../../domain/news/NewsModelHi.js";

export const jobs: CronJobConfig[] = [
  {
    name: "news",
    schedule: "0 0 * * * *",
    ttlMs: 1000 * 60 * 50,
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
  {
    name: "tr_coins_mysql",
    schedule: "0 0 */4 * * *",
    ttlMs: 1000 * 60 * 60 * 2,
    retries: 2,
    timeoutMs: 1000 * 60 * 5,
    handler: async () => {
      await collectTrCoinsMySQL();
    },
  },
  {
    name: "cmc_top",
    schedule: "0 0 */4 * * *",
    ttlMs: 1000 * 60 * 60 * 2,
    retries: 2,
    timeoutMs: 1000 * 60 * 5,
    handler: ColectDataCMC.fetchCMCTopCoins,
  },
  {
    name: "cmc_finance",
    schedule: "0 0 */8 * * *",
    ttlMs: 1000 * 60 * 60 * 4,
    retries: 2,
    timeoutMs: 1000 * 60 * 8,
    handler: ColectDataCMC.fetchCMCFinData,
  },
  {
    name: "cmc_meta",
    schedule: "0 0 0 */7 * *",
    ttlMs: 1000 * 60 * 60 * 2,
    retries: 1,
    handler: async () => {
      await ColectDataCMC.fetchCMCMetaData();
    },
  },
  {
    name: "redis_snapshot",
    schedule: "0 */2 * * * *",
    ttlMs: 1000 * 100,
    retries: 1,
    handler: CollectRedis.snapshotRedis,
  },
  {
    name: "exchanges",
    schedule: "*/45 * * * * *",
    ttlMs: 1000 * 30,
    retries: 2,
    handler: collectEx,
  },
  {
    name: "redis_delta",
    schedule: "*/45 * * * * *",
    ttlMs: 1000 * 30,
    handler: CollectRedis.deltaRedis,
  },
  {
    name: "rates",
    schedule: "0 0 */8 * * *",
    ttlMs: 1000 * 60 * 60 * 4,
    retries: 2,
    handler: collectRates,
  },
];
