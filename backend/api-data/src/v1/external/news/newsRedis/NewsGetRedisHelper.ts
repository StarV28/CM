import { cacheRedisServer } from "../../../../../utils/cacheRedisServer.js";
import type { News } from "../../../modules/types/news.js";

//---------------------------------------//

export async function getNewsRedis(local: string): Promise<News[]> {
  try {
    const news = await cacheRedisServer.get(`${local}-news`);
    return news ? (news as News[]) : [];
  } catch (err) {
    console.error("Error get News cache Redis", (err as Error)?.message);
    return [];
  }
}
