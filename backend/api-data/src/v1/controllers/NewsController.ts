import { Request, Response, NextFunction } from "express";
import { getNewsRedis } from "../external/news/newsRedis/NewsGetRedisHelper.js";

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
          news = await getNewsRedis("World");
          break;
        case "de":
          news = await getNewsRedis("Germany");
          break;
        case "ua":
          news = await getNewsRedis("Ukraine");

          break;
        case "tr":
          news = await getNewsRedis("Turkey");

          break;
        case "hi":
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
