import { Application, Request, Response, NextFunction } from "express";
import { MailModule } from "../utils/mail.module.js";
import { TelegramModule } from "../utils/telegram.module.js";

interface CustomError extends Error {
  status?: number;
}

const errorHandler = (app: Application): void => {
  const mail = new MailModule();
  const telegram = new TelegramModule();

  // 404
  app.use((req: Request, res: Response, next: NextFunction) => {
    const err: CustomError = new Error("Not Found");
    err.status = 404;
    next(err);
  });

  // Все ошибки
  app.use(
    async (
      err: CustomError,
      req: Request,
      res: Response,
      _next: NextFunction,
    ) => {
      const status = err.status && err.status !== 0 ? err.status : 200;
      const message = err.message || "Server Error";

      console.error(`[${status}] ${message}`, err.stack);

      const text = `Ошибка [${status}]: ${message}\nStack: ${
        err.stack || ""
      }\nURL: ${req.originalUrl}\nUserAgent: ${
        req.headers["user-agent"] || ""
      }`;
      await mail.sendError(
        process.env.ERROR_EMAIL_RECIPIENT || "",
        `Ошибка [${status}]`,
        text,
      );
      await telegram.sendMessage(text);

      res.status(status).json({ success: true, message });
    },
  );
};

export default errorHandler;
