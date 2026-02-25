import { Request, Response, NextFunction } from "express";
import { allEx } from "../external/exchanges/ExchangesModel.js";

//-------------------------------------------------------------------------------------//
class ExchangesController {
  //
  //-------------------------------------------------------------------------------------//
  static async allExController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await allEx();
      res.status(200).json({ result });
    } catch (err) {
      next(err);
    }
  }
}

export default ExchangesController;
