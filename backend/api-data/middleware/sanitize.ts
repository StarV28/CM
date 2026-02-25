// middleware/sanitize.ts
import sanitizeHtml from "sanitize-html";
import { Request, Response, NextFunction } from "express";

function deepSanitize(obj: unknown): unknown {
  if (typeof obj === "string") return sanitizeHtml(obj);

  if (Array.isArray(obj)) return obj.map(deepSanitize);

  if (typeof obj === "object" && obj !== null) {
    const clean: Record<string, unknown> = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clean[key] = deepSanitize((obj as Record<string, unknown>)[key]);
      }
    }
    return clean;
  }

  return obj;
}

export default function sanitizeMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.body) req.body = deepSanitize(req.body) as Record<string, unknown>;
  next();
}
