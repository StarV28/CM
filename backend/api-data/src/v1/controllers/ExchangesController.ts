import { Request, Response, NextFunction } from "express";
import Ex from "../external/exchanges/ExModel.js";

//-------------------------------------------------------------------------------------//
class ExchangesController {
  //
  //-------------------------------------------------------------------------------------//
  static async allExController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: "Invalid id" });
      }
      const data = await Ex.exData(id);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }
}

export default ExchangesController;
