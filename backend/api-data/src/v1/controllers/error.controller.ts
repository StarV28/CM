import { Request, Response, NextFunction } from "express";

// Интерфейс для ошибки с дополнительными полями
interface FrontendError extends Error {
  stack?: string;
  url?: string;
  userAgent?: string;
}

export const logFrontendError = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const { message, stack, url, userAgent } = req.body;
  const err: FrontendError = new Error(message);

  err.stack = stack;
  err.url = url;
  err.userAgent = userAgent;

  next(err);
};
