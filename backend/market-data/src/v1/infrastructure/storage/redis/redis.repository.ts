import redis from "../../../../../db/connect_Redis.js";

//-------------------------------------------------------------------------------------//
export async function syncRedis<T>(
  key: string,
  values: T,
  ttlSeconds: number,
): Promise<void> {
  await redis.setex(key, ttlSeconds, JSON.stringify(values));
}

export async function getRedis<T>(key: string): Promise<T | null> {
  const res = await redis.get<T>(key);
  return res ?? null;
}
