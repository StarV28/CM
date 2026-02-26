import { News } from "../../modules/types/news.js";
import NewsApiModel from "./NewsApiModel.js";
import NewsHelperRSS from "./NewsHelperRSS.js";

//-------------------------------------------------------------------------------------//
const feeds = [
  "https://www.ukrinform.ua/rss",
  "https://incrypted.com/feed/",
  "https://cryptonews.com.ua/feed",
  "https://forklog.com/rss",
];
//-------------------------------------------------------------------------------------//

export default class NewsModelUa {
  static async allNewsUkr(): Promise<void> {
    try {
      const newsApi: News[] = await NewsApiModel.newsAPI("ua");
      NewsHelperRSS.allNews(feeds, "Ukraine", newsApi);
    } catch (err) {
      console.error("Error All news Ukraine", (err as Error)?.message);
      throw err;
    }
  }
}
