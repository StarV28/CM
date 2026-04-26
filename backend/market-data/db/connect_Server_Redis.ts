// <reference types="ioredis" />
import { Redis } from "ioredis";
import config from "../config/index.js";
//---------------------------------------//
const urlRedis = config.url.redis_url;
if (!urlRedis) {
  throw new Error("REDIS_URL is not defined");
}

export const redis_server = new Redis(urlRedis, {
  lazyConnect: false,
  connectTimeout: 5000,
  maxRetriesPerRequest: 3,
});

redis_server.on("connect", () => console.log("✅ Redis connected"));
redis_server.on("error", (err: Error) => console.error("Redis error:", err));
