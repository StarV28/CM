// import type { CronJobConfig } from "../types/cron.type.js";

// // ------------------------------------------------------------
// type LockMap = Map<string, number>;

// // живёт пока жив процесс
// const localLocks: LockMap = new Map();

// // ------------------------------------------------------------

// async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
//   return Promise.race([
//     promise,
//     new Promise<T>((_, reject) =>
//       setTimeout(() => reject(new Error("Job timeout exceeded")), ms),
//     ),
//   ]);
// }

// // ------------------------------------------------------------

// export async function runJob(job: CronJobConfig) {
//   const start = Date.now();
//   const now = Date.now();

//   try {
//     // 🔒 проверка локального lock
//     const nextAllowedRun = localLocks.get(job.name) ?? 0;

//     if (now < nextAllowedRun) {
//       console.log(`[${job.name}] skipped (local ttl lock)`);
//       return;
//     }

//     // ставим lock ДО выполнения
//     localLocks.set(job.name, now + job.ttlMs);

//     let attempt = 0;
//     const maxRetries = job.retries ?? 0;
//     const delay = job.retryDelayMs ?? 2000;

//     while (attempt <= maxRetries) {
//       try {
//         const exec = job.timeoutMs
//           ? withTimeout(job.handler(), job.timeoutMs)
//           : job.handler();

//         await exec;

//         console.log(`[${job.name}] success in ${Date.now() - start}ms`);
//         return;
//       } catch (err) {
//         attempt++;
//         if (attempt > maxRetries) throw err;

//         const backoff = delay * attempt;
//         console.log(`[${job.name}] retry ${attempt} in ${backoff}ms`);
//         await new Promise((r) => setTimeout(r, backoff));
//       }
//     }
//   } catch (err) {
//     console.error(`[${job.name}] failed:`, err);
//   }
// }

import type { CronJobConfig } from "../types/cron.type.js";
import { cacheRedisServer } from "../../../../utils/cacheRedisServer.js";

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Job timeout exceeded")), ms),
    ),
  ]);
}

export async function runJob(job: CronJobConfig) {
  const lockKey = `lock:cron:${job.name}`;
  const ttlSec = Math.ceil(job.ttlMs / 1000);

  // 🔒 Redis NX lock — атомарно, шарится между серверами
  const acquired = await cacheRedisServer.setKey(lockKey, ttlSec);
  if (!acquired) {
    console.log(`[${job.name}] skipped (redis lock)`);
    return;
  }

  const start = Date.now();
  let attempt = 0;
  const maxRetries = job.retries ?? 0;
  const delay = job.retryDelayMs ?? 2000;

  try {
    while (attempt <= maxRetries) {
      try {
        const exec = job.timeoutMs
          ? withTimeout(job.handler(), job.timeoutMs)
          : job.handler();
        await exec;
        console.log(`[${job.name}] success in ${Date.now() - start}ms`);
        await cacheRedisServer.del(lockKey); // 🔓 DEL только при успехе
        return;
      } catch (err) {
        attempt++;
        if (attempt > maxRetries) throw err;
        const backoff = delay * attempt;
        console.log(`[${job.name}] retry ${attempt} in ${backoff}ms`);
        await new Promise((r) => setTimeout(r, backoff));
      }
    }
  } catch (err) {
    console.error(`[${job.name}] failed — lock expires in ${ttlSec}s:`, err);
    // lock НЕ удаляем — висит до TTL, защищая от повторного запуска сломанной джобы
  }
}
