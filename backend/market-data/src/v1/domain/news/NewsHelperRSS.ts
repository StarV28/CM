import axios from "axios";
import { parseStringPromise } from "xml2js";
// import { cache } from "../../../../utils/cacheNode.js";
import type { News } from "./types/news.type.js";
import { cacheRedisServer } from "../../../../utils/cacheRedisServer.js";

interface RssItem {
  title?: string;
  link?: string;
  pubDate?: string;
  enclosure?: { $?: { url?: string } };
  ["media:content"]?: { $?: { url?: string } };
}

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
