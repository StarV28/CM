import rateLimit from "express-rate-limit";

export const globalRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 минута
  max: 100, // максимум запросов с IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Try later.",
  },
});

export const authLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Try later.",
  },
});
