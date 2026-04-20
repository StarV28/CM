import NewsApiModel from "./NewsApiModel.js";
import NewsHelperRSS from "./NewsHelperRSS.js";
import type { News } from "./types/news.type.js";

//-------------------------------------------------------------------------------------//
const feeds = [
  "https://www.kriptofoni.com/kripto-para-haberleri/feed/",
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
