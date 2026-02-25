import { redis_server } from "../db/connect_Server_Redis.js";

export const cacheRedisServer = {
  async get<T>(key: string): Promise<T | null> {
    redis_server.on("error", (err) => console.error("Redis error:", err));
    const data = await redis_server.get(key);
    return data ? JSON.parse(data) : null;
  },
  async set<T>(key: string, value: T, ttlSeconds: number) {
    redis_server.on("error", (err) => console.error("Redis error:", err));
    await redis_server.set(key, JSON.stringify(value), "EX", ttlSeconds);
  },
  async del(key: string) {
    await redis_server.del(key);
  },
};
