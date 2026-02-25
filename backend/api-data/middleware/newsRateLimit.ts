import rateLimit from "express-rate-limit";

export const newsRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 минута
  max: 60, // максимум 60 запросов на /news
  standardHeaders: true,
  legacyHeaders: false,
});
