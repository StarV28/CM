import axios from "axios";
import { parseStringPromise } from "xml2js";
// import { cache } from "../../../../utils/cacheNode.js";
import { News } from "../../modules/types/news.js";
import { cacheRedisServer } from "../../../../utils/cacheRedisServer.js";

interface RssItem {
  title?: string;
  link?: string;
  pubDate?: string;
  enclosure?: { $?: { url?: string } };
  ["media:content"]?: { $?: { url?: string } };
}
//---------------------------------------//
// const NEWS_LOADING_KEY = "news_loading";

// //---------------------------------------//
// export default class NewsHelperRSS {
//   private feeds: string[];

//   constructor(feeds: string[]) {
//     this.feeds = feeds;
//   }
//   // -------- fetch всех фидов --------
//   private async fetchAllFeeds(): Promise<News[]> {
//     const results = await Promise.allSettled(
//       this.feeds.map((feed) => this.fetchFeed(feed, 5000)),
//     );

//     return results
//       .filter(
//         (r): r is PromiseFulfilledResult<News[]> => r.status === "fulfilled",
//       )
//       .flatMap((r) => r.value);
//   }

//   //-----------------------------------------------------
//   private async fetchFeed(feedUrl: string, timeout = 5000): Promise<News[]> {
//     try {
//       const response = (await Promise.race([
//         axios.get(feedUrl.trim(), {
//           headers: { "User-Agent": "Mozilla/5.0 (Node.js; CryptoMonitorBot)" },
//         }),
//         new Promise((_, reject) =>
//           setTimeout(() => reject(new Error("Timeout")), timeout),
//         ),
//       ])) as unknown;

//       const { data } = response as { data: string };

//       const parsed = await parseStringPromise(data, { explicitArray: false });
//       const items: RssItem[] = parsed?.rss?.channel?.item
//         ? Array.isArray(parsed.rss.channel.item)
//           ? parsed.rss.channel.item
//           : [parsed.rss.channel.item]
//         : [];

//       const newsItems: News[] = items.slice(0, 3).map((n) => ({
//         title: n.title ?? "",
//         url: n.link ?? "",
//         image: n.enclosure?.$?.url ?? n["media:content"]?.$?.url ?? "",
//         source: parsed?.rss?.channel?.title ?? "Unknown",
//         publishedAt:
//           n.pubDate?.slice(0, 22) ??
//           new Date().toISOString().slice(0, 19).replace("T", " "),
//         urlToImage:
//           n.enclosure?.$?.url ?? n["media:content"]?.$?.url ?? undefined,
//       }));

//       // Кэшируем по отдельному фиду на 20 мин
//       cacheRedisServer.set(feedUrl, newsItems, 60 * 20);

//       return newsItems;
//     } catch (err) {
//       console.error("Feed error:", feedUrl, (err as Error).message);
//       return [];
//     }
//   }

//   // -------- главный метод --------
//   async allNews(cacheKey: string, newsApi?: News[]) {
//     const cached = await cacheRedisServer.get<News[]>(cacheKey);

//     // ✅ если есть cache → сразу отдаём (очень важно)
//     if (cached) {
//       console.log("🟢 cache hit");

//       // background refresh (не блокирует пользователя)
//       this.refreshInBackground(cacheKey, newsApi);

//       return cached;
//     }

//     // если cache пуст → защищаемся от параллельных запросов
//     if (await cacheRedisServer.get(NEWS_LOADING_KEY)) {
//       console.log("⏳ already loading → return empty");
//       return [];
//     }

//     await cacheRedisServer.set(NEWS_LOADING_KEY, true, 60);

//     try {
//       console.log("🔄 cold start fetch");

//       const rssNews = await this.fetchAllFeeds();
//       const source = newsApi ? [...rssNews, ...newsApi] : rssNews;

//       await cacheRedisServer.set(cacheKey, source, 60 * 20); // 20 min TTL
//       return source;
//     } finally {
//       cacheRedisServer.del(NEWS_LOADING_KEY);
//     }
//   }

//   // -------- background refresh --------
//   private async refreshInBackground(cacheKey: string, newsApi?: News[]) {
//     if (await cacheRedisServer.get(NEWS_LOADING_KEY)) return Promise.resolve();

//     await cacheRedisServer.set(NEWS_LOADING_KEY, true, 60);

//     try {
//       const rssNews = await this.fetchAllFeeds();
//       const source = newsApi ? [...rssNews, ...newsApi] : rssNews;

//       await cacheRedisServer.set(cacheKey, source, 60 * 20);
//       console.log("♻️ cache refreshed");
//     } catch (err) {
//       console.log("⚠️ refresh failed → keep old cache");
//       throw err;
//     } finally {
//       await cacheRedisServer.del(NEWS_LOADING_KEY);
//     }
//   }
// }

//---------------------------------------//

export default class NewsHelperRSS {
  static async allNews(
    feedsUrl: string[],
    local: string,
    newsApi?: News[],
  ): Promise<void> {
    try {
      const res = await Promise.allSettled(
        feedsUrl.map((feed) => this.fetchFeed(feed, 5000)),
      );

      const rssNews = res
        .filter(
          (r): r is PromiseFulfilledResult<News[]> => r.status === "fulfilled",
        )
        .flatMap((r) => r.value);

      const news = newsApi ? [...rssNews, ...newsApi] : rssNews;

      await cacheRedisServer.set(`${local}-news`, news, 60 * 30);
    } catch (err) {
      console.error("Error allNews", (err as Error)?.message);
    }
  }

  //---------------------------------------//

  static async fetchFeed(feedUrl: string, timeout = 5000) {
    try {
      const response = (await Promise.race([
        axios.get(feedUrl.trim(), {
          headers: { "User-Agent": "Mozilla/5.0 (Node.js; CryptoMonitorBot)" },
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), timeout),
        ),
      ])) as unknown;

      const { data } = response as { data: string };

      const parsed = await parseStringPromise(data, { explicitArray: false });
      const items: RssItem[] = parsed?.rss?.channel?.item
        ? Array.isArray(parsed.rss.channel.item)
          ? parsed.rss.channel.item
          : [parsed.rss.channel.item]
        : [];

      const newsItems: News[] = items.slice(0, 3).map((n) => ({
        title: n.title ?? "",
        url: n.link ?? "",
        image: n.enclosure?.$?.url ?? n["media:content"]?.$?.url ?? "",
        source: parsed?.rss?.channel?.title ?? "Unknown",
        publishedAt:
          n.pubDate?.slice(0, 22) ??
          new Date().toISOString().slice(0, 19).replace("T", " "),
        urlToImage:
          n.enclosure?.$?.url ?? n["media:content"]?.$?.url ?? undefined,
      }));

      console.log("NEW VERSION 777777");
      return newsItems;
    } catch (err) {
      console.error("Feed error:", feedUrl, (err as Error).message);
      return [];
    }
  }
}
