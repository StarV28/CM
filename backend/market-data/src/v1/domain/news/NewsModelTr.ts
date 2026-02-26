import NewsApiModel from "./NewsApiModel.js";
import NewsHelperRSS from "./NewsHelperRSS.js";
import { News } from "../../modules/types/news.js";

//-------------------------------------------------------------------------------------//
const feeds = [
  "https://www.trthaber.com/ekonomi_articles.rss",
  "https://www.kriptofoni.com/kripto-para-haberleri/feed/",
  "https://www.haberturk.com/rss/ekonomi.xml",
  "https://www.kriptofoni.com/nft-haberleri/feed/",
  "https://www.kriptofoni.com/finans-ve-ekonomi-haberleri/feed/",
];
//-------------------------------------------------------------------------------------//

export default class NewsModelTr {
  static async allNewsTr(): Promise<void> {
    try {
      const newsApi: News[] = await NewsApiModel.newsAPI("ua");
      NewsHelperRSS.allNews(feeds, "Turkey", newsApi);
    } catch (err) {
      console.error("Error All news Turkey", (err as Error)?.message);
      throw err;
    }
  }
}
