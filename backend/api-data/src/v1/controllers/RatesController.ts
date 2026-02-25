import { Request, Response, NextFunction } from "express";
import redisClient from "../../../db/connect_Redis.js";
//-------------------------------------------------------------------------------------//

class RatesController {
  //----Banks---------------------------------------------------------------------------------//
  static async banksRates(req: Request, res: Response, next: NextFunction) {
    try {
      const cacheKey = "banks-rates";
      const cachedData: string | null = await redisClient.get(cacheKey);
      const data =
        typeof cachedData === "string" ? JSON.parse(cachedData) : cachedData;
      return res.status(200).json(data);
    } catch (err) {
      console.error("Banks controller error:", (err as Error)?.message);
      next(err);
    }
  }
}

export default RatesController;
