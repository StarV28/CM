import NewsApiModel from "./NewsApiModel.js";
import NewsHelperRSS from "./NewsHelperRSS.js";
import type { News } from "./types/news.type.js";

//-------------------------------------------------------------------------------------//
const feeds = [
  "https://coinfunda.com/feed/",
  "https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms",
  "https://blog.unocoin.com/feed/",
];
//-------------------------------------------------------------------------------------//

export default class NewsModelHi {
  static async allNewsHi(): Promise<void> {
    try {
      const newsApi: News[] = await NewsApiModel.newsAPI("ua");
      NewsHelperRSS.allNews(feeds, "Indie", newsApi);
    } catch (err) {
      console.error("Error All news Indie", (err as Error)?.message);
      throw err;
    }
  }
}
