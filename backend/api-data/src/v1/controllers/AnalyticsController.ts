import { Request, Response, NextFunction } from "express";
import AnalyticsModel from "../external/analytics/analyticsModel.js";

//---------------------------------------//
export default class AnalyticsController {
  static async getAnalyticsCrypto(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const locale = req.query.locale as string;

      if (!locale) throw new Error("Locale required");

      const articles = await AnalyticsModel.readAnalyticsFromRedis(locale);

      if (!articles) return res.status(404);

      res.status(200).json({ articles });
    } catch (err) {
      console.error("Error fetching analytics", (err as Error)?.message);
      next(err);
    }
  }
}
