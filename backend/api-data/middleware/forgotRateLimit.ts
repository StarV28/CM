import redis from "../db/connect_Redis.js";
import { Request, Response, NextFunction } from "express";

const FORGOT_IP_LIMIT = 5;
const FORGOT_EMAIL_LIMIT = 5;
const WINDOW = 60 * 60 * 3;

export default async function forgotRateLimiter(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const ipHeader = req.headers["x-forwarded-for"];
    let ip: string | undefined;

    if (Array.isArray(ipHeader)) {
      ip = ipHeader[0];
    } else if (typeof ipHeader === "string") {
      ip = ipHeader.split(",")[0].trim();
    } else {
      ip = req.ip;
    }

    const { email } = req.body.data;
    if (!email) {
      return res
        .status(200)
        .json({ success: false, message: "Email is required" });
    }
    const ipKey = `forgotIp:${ip}`;
    const emailKey = `forgotEmail:${email}`;

    const [ipAttemptsRaw, emailAttemptsRaw] = await Promise.all([
      redis.get(ipKey),
      redis.get(emailKey),
    ]);

    const parseAttempt = (v: unknown) =>
      typeof v === "string"
        ? parseInt(v, 10) || 0
        : typeof v === "number"
          ? v
          : 0;

    let ipAttempts = parseAttempt(ipAttemptsRaw);
    let emailAttempts = parseAttempt(emailAttemptsRaw);

    if (ipAttempts >= FORGOT_IP_LIMIT) {
      return res.status(200).json({
        success: false,
        message: "Too many attempts from you. Try again in 3 hour.",
        attempts: Math.max(FORGOT_IP_LIMIT - ipAttempts, 0),
      });
    }

    if (emailAttempts >= FORGOT_EMAIL_LIMIT) {
      return res.status(200).json({
        success: false,
        message: "Too many attempts for you. Try again in 1 hour.",
        attempts: Math.max(FORGOT_EMAIL_LIMIT - emailAttempts, 0),
      });
    }

    const incrIp = await redis.incr(ipKey);
    const incrEmail = await redis.incr(emailKey);

    ipAttempts =
      typeof incrIp === "number"
        ? incrIp
        : parseInt(String(incrIp), 10) || ipAttempts + 1;
    emailAttempts =
      typeof incrEmail === "number"
        ? incrEmail
        : parseInt(String(incrEmail), 10) || emailAttempts + 1;

    if (ipAttempts === 1) await redis.expire(ipKey, WINDOW);
    if (emailAttempts === 1) await redis.expire(emailKey, WINDOW);

    const remainingIplAttempts = FORGOT_IP_LIMIT - ipAttempts;
    req.body.ipAttempts = remainingIplAttempts;

    next();
  } catch (e) {
    console.error("Rate limit error:", e);
    res.status(500).json({ message: "Server error" });
  }
}
