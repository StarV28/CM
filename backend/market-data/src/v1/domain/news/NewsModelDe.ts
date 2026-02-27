import NewsApiModel from "./NewsApiModel.js";
import NewsHelperRSS from "./NewsHelperRSS.js";
import type { News } from "./types/news.type.js";

const feeds: string[] = [
  "https://www.btc-echo.de/feed/",
  "https://de.cointelegraph.com/rss",
  "https://blockzeit.com/de/feed/",
];

export default class NewsModelDe {
  static async allNewsDe(): Promise<void> {
    try {
      const newsApi: News[] = await NewsApiModel.newsAPI("ua");
      NewsHelperRSS.allNews(feeds, "Germany", newsApi);
    } catch (err) {
      console.error("Error All news Germany", (err as Error)?.message);
      throw err;
    }
  }
}
