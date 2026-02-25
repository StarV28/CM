import NewsApiModel from "./NewsApiModel.js";
import NewsHelperRSS from "./NewsHelperRSS.js";
import { News } from "../../modules/types/news.js";

//-------------------------------------------------------------------------------------//
const feeds = [
  "https://feeds.content.dowjones.io/public/rss/mw_topstories",
  "https://ambcrypto.com/feed/",
];

//-------------------------------------------------------------------------------------//

export default class newsModelEn {
  static async allNewsUkr(): Promise<void> {
    try {
      const newsApi: News[] = await NewsApiModel.newsAPI("ua");
      NewsHelperRSS.allNews(feeds, "World", newsApi);
    } catch (err) {
      console.error("Error All news World", (err as Error)?.message);
      throw err;
    }
  }
}
