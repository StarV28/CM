export type CronJobConfig = {
  name: string; // уникальный id
  schedule: string; // cron expression (node-cron, 6 полей)
  ttlMs: number; // TTL lock в Redis
  retries?: number; // кол-во retry
  retryDelayMs?: number; // базовая задержка
  timeoutMs?: number; // защита от зависаний
  handler: () => Promise<void>; // бизнес логика
};
