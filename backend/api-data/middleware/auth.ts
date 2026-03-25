import { Request, Response, NextFunction, Express } from "express";
import { parseBearer } from "../utils/jwtHelpers.js";
import type { AuthRequest } from "../src/types/global.types.js";

const auth = (app: Express): void => {
  // Middleware для CORS
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    );
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE",
    );
    next();
  });

  // Middleware для аутентификации
  app.use((req: AuthRequest, res: Response, next: NextFunction) => {
    const openPaths: string[] = [
      "/api/v1/mains",
      "/api/v1/auth/login",
      "/api/v1/auth/signup",
      "/api/v1/error/log-error",
      "/api/v1/rates",
      "/api/v1/news",
      "/api/v1/coins",
      "/api/v1/exchanges",
      "/api/v1/user/create",
      "/api/v1/user/login",
      "/api/v1/auth/google",
      "/api/v1/auth/google/callback",
      "/api/v1/user/password",
      "/api/v1/user/analytics",
    ];

    const isOpen = openPaths.some((p) => req.path.startsWith(p));
    if (isOpen) return next();

    try {
      if (!req.headers.authorization) {
        return res.status(401).json({
          result: "Access Denied: No Authorization header provided",
        });
      }

      // Приведение req.headers к типу Headers
      const headers: { [key: string]: string | undefined } = {};
      for (const [key, value] of Object.entries(req.headers)) {
        headers[key] = Array.isArray(value) ? value[0] : value;
      }

      req.user = parseBearer(req.headers.authorization);
    } catch (err: unknown) {
      return res.status(401).json({
        result: "Access Denied: Invalid token",
        error: err instanceof Error ? err.message : "Unknown error -((",
      });
    }
    next();
  });
};

export default auth;
