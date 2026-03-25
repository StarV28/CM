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
  async push(key: string, value: string) {
    await redis_server.lpush(key, value);
  },
  async trim(key: string, start: number, stop: number) {
    await redis_server.ltrim(key, start, stop);
  },
  async range(key: string, start: number, stop: number) {
    return await redis_server.lrange(key, start, stop);
  },
};
