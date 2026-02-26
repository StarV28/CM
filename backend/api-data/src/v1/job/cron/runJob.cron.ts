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
