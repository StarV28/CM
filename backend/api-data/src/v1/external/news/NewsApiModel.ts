import axios from "axios";
import { News } from "../../modules/types/news.js";
import dotenv from "dotenv";
dotenv.config();
//-------------------------------------------------------------------------------------//

interface NewsApi {
  title: string;
  url: string;
  image: string;
  source: { name: string };
  publishedAt: string;
  urlToImage?: string;
}

type language = string;
//-------------------------------------------------------------------------------------//
export default class NewsApiModel {
  //-------------------------------------------------------------------------------------//
  static normalizeNews(n: NewsApi) {
    return {
      title: n.title,
      url: n.url,
      image: n.urlToImage,
      source: typeof n.source === "string" ? n.source : n.source.name,
      publishedAt: n.publishedAt,
      urlToImage: n?.urlToImage,
    };
  }
  //----NEWS API---------------------------------------------------------------------------------//

  static async newsAPI(lang: language): Promise<News[]> {
    const NEWS_API_KEY = process.env.NEWSAPI_KEY;
    const apiNewsApi = axios.create({
      baseURL: "https://newsapi.org/v2",
      timeout: 10000,
    });
    try {
      const res = await apiNewsApi.get("/everything", {
        params: {
          // q: "cryptocurrency OR finance",
          q: "cryptocurrency OR bitcoin OR ethereum",
          language: `${lang}`,
          sortBy: "publishedAt",
          pageSize: 3,
          apiKey: NEWS_API_KEY,
        },
      });
      const formatted: News[] = res.data.articles.map(this.normalizeNews);
      return formatted;
    } catch (err) {
      console.error("Error by getting News", (err as Error)?.message);
      throw err;
    }
  }
}
