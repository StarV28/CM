import { Request, Response, NextFunction } from "express";
import AnalModel from "../external/admin/adminAnalModel.js";

//---------------------------------------//

export default class AdminController {
  static async createAnalyticsCrypto(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data = req.body;
      const result = await AnalModel.createAnalytic(data);

      if (result.success) {
        return res.status(200).json({ success: true });
      } else {
        return res.status(400).json({ success: false });
      }
    } catch (err) {
      console.error("Error fetching analytics create", (err as Error)?.message);
      next(err);
    }
  }
}
