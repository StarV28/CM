import cron from "node-cron";
import NewsModelUa from "../external/news/NewsModelUa.js";
import NewsModelDe from "../external/news/NewsModelDe.js";
import NewsModelTr from "../external/news/NewsModelTr.js";
import NewsModelEn from "../external/news/NewsModelEn.js";

class UpdaterCron {
  static start(): void {
    //--News-------------------------------------//
    cron.schedule("*/20 * * * *", async () => {
      console.log("[News] Starting update...");
      try {
        await Promise.all([
          NewsModelUa.allNewsUkr(),
          NewsModelDe.allNewsDe(),
          NewsModelTr.allNewsTr(),
          NewsModelEn.allNewsWorld(),
        ]);
        console.log(`[News] Saved news ✅`);
      } catch (err) {
        console.error("[News update] Error:", (err as Error).message);
      }
    });

    console.log("💰 Currency update service started");
  }
}

export default UpdaterCron;
