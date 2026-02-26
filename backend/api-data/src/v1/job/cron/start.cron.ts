// import cron from "node-cron";
// import { jobs } from "./jobs.cron.js";
// import { runJob } from "./runJob.cron.js";

// export async function startCronScheduler() {
//   console.log("[CRON] Warmup:first start all task...");

//   for (const job of jobs) {
//     try {
//       await runJob(job);
//     } catch (err) {
//       console.error(`[CRON] Warmup ${job.name} failed:`, err);
//     }
//   }

//   console.log("[CRON] Warmup finish. launch on schedule...");

//   for (const job of jobs) {
//     cron.schedule(job.schedule, () => runJob(job));
//     console.log(`[CRON] ${job.name} → ${job.schedule}`);
//   }
// }
