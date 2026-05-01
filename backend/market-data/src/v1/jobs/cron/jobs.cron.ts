import CollectRedis from "../../application/coins/collectCoinsRedis.js";
// import { collectEx } from "../../application/exchanges/collectEx.js";
import { collectRates } from "../../application/rates/collectRates.js";
import ColectDataCMC from "../../application/coins/collectDataCMC.js";
import { collectTrCoinsMySQL } from "../../application/coins/collectCoinsMySQL.js";
import type { CronJobConfig } from "../types/cron.type.js";

import NewsModelUa from "../../domain/news/NewsModelUa.js";
import NewsModelDe from "../../domain/news/NewsModelDe.js";
import NewsModelTr from "../../domain/news/NewsModelTr.js";
import NewsModelEn from "../../domain/news/NewsModelEn.js";
import NewsModelHi from "../../domain/news/NewsModelHi.js";

export const jobs: CronJobConfig[] = [
  {
    name: "news",
    schedule: "0 0 * * * *", // каждый час
    ttlMs: 1000 * 60 * 50, // lock 50 мин
    retries: 2,
    retryDelayMs: 2000, // retry через 2с, 4с
    timeoutMs: 1000 * 60 * 3, // таймаут 3 мин
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
    schedule: "0 0 */4 * * *", // каждые 4 часа
    ttlMs: 1000 * 60 * 60 * 2, // lock 2 часа
    retries: 2,
    retryDelayMs: 2000, // retry через 2с, 4с
    timeoutMs: 1000 * 60 * 5, // таймаут 5 мин
    handler: async () => {
      await collectTrCoinsMySQL();
    },
  },
  {
    name: "cmc_top",
    schedule: "0 0 */4 * * *", // каждые 4 часа
    ttlMs: 1000 * 60 * 60 * 2, // lock 2 часа
    retries: 2,
    retryDelayMs: 2000, // retry через 2с, 4с
    timeoutMs: 1000 * 60 * 5, // таймаут 5 мин
    handler: ColectDataCMC.fetchCMCTopCoins,
  },
  {
    name: "cmc_finance",
    schedule: "0 0 */8 * * *", // каждые 8 часов
    ttlMs: 1000 * 60 * 60 * 4, // lock 4 часа
    retries: 2,
    retryDelayMs: 2000, // retry через 2с, 4с
    timeoutMs: 1000 * 60 * 8, // таймаут 8 мин
    handler: ColectDataCMC.fetchCMCFinData,
  },
  {
    name: "cmc_meta",
    schedule: "0 0 0 */7 * *", // каждые 7 дней
    ttlMs: 1000 * 60 * 60 * 24 * 6, // lock 6 дней
    retries: 1,
    retryDelayMs: 2000, // retry через 2с
    handler: async () => {
      await ColectDataCMC.fetchCMCMetaData();
    },
  },
  {
    name: "redis_snapshot",
    schedule: "0 */2 * * * *", // каждые 2 минуты
    ttlMs: 1000 * 100, // lock 100 сек
    retries: 1,
    retryDelayMs: 3000, // retry через 3с
    handler: CollectRedis.snapshotRedis,
  },
  {
    name: "redis_delta",
    schedule: "*/30 * * * * *", // каждые 30 секунд
    ttlMs: 1000 * 25, // lock 25 сек
    retryDelayMs: 1000, // retry через 1с
    handler: CollectRedis.deltaRedis,
  },
  // {
  //   name: "exchanges",
  //   schedule: "*/45 * * * * *", // каждые 45 секунд
  //   ttlMs: 1000 * 40, // lock 40 сек
  //   retries: 2,
  //   retryDelayMs: 1500, // retry через 1.5с, 3с
  //   handler: collectEx,
  // },
  {
    name: "rates",
    schedule: "0 0 */8 * * *", // каждые 8 часов
    ttlMs: 1000 * 60 * 60 * 4, // lock 4 часа
    retries: 2,
    retryDelayMs: 2000, // retry через 2с, 4с
    handler: collectRates,
  },
];
