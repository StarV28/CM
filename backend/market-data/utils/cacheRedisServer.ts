import { redis_server } from "../db/connect_Server_Redis.js";

export const cacheRedisServer = {
  async get<T>(key: string): Promise<T | null> {
    const data = await redis_server.get(key);
    return data ? JSON.parse(data) : null;
  },
  async set<T>(key: string, value: T, ttlSeconds: number) {
    return await redis_server.set(key, JSON.stringify(value), "EX", ttlSeconds);
  },
  async setKey(key: string, ttlSeconds: number) {
    return await redis_server.set(key, "1", "EX", ttlSeconds, "NX");
  },
  async del(key: string) {
    return await redis_server.del(key);
  },
};
