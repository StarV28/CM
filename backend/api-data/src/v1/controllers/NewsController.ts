import { Request, Response, NextFunction } from "express";
import { getNewsRedis } from "../external/news/newsRedis/NewsGetRedisHelper.js";
// import NewsModelUa from "../external/news/NewsModelUa.js";
// import NewsModelDe from "../external/news/NewsModelDe.js";
// import NewsModelTr from "../external/news/NewsModelTr.js";
// import NewsModelHi from "../external/news/NewsModelHi.js";
// import NewsModelEn from "../external/news/NewsModelEn.js";

//-------------------------------------------------------------------------------------//
interface News {
  title: string;
  url: string;
  image?: string;
  source: string;
  publishedAt: string;
  urlToImage?: string;
}

class NewsController {
  //---CoinGecko News----------------------------------------------------------------------------------//
  static async getNewsUa(req: Request, res: Response, next: NextFunction) {
    try {
      const locale = req.query.locale;
      let news: News[] = [];
      switch (locale) {
        case "en":
          // news = await NewsModelEn.allNewsWorld();
          news = await getNewsRedis("World");
          break;
        case "de":
          // news = await NewsModelDe.allNewsDe();
          news = await getNewsRedis("Germany");
          break;
        case "ua":
          // news = await NewsModelUa.allNewsUkr();
          news = await getNewsRedis("Ukraine");

          break;
        case "tr":
          // news = await NewsModelTr.allNewsTr();
          news = await getNewsRedis("Turkey");

          break;
        case "hi":
          // news = await NewsModelHi.allNewsHi();
          news = await getNewsRedis("Indie");

          break;
        default:
          break;
      }

      res.status(200).json(news);
    } catch (err) {
      next(err);
      return [];
    }
  }
}

export default NewsController;
