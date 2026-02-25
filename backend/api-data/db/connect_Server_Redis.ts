// <reference types="ioredis" />
import { Redis } from "ioredis";
import config from "../config/index.js";

export const redis_server = new Redis(
  config.url.redis_url ?? "redis://localhost:6379",
  {
    lazyConnect: false,
    connectTimeout: 5000,
    maxRetriesPerRequest: 1,
  },
);

redis_server.on("connect", () => console.log("✅ Redis connected"));
redis_server.on("error", (err: Error) => console.error("Redis error:", err));
