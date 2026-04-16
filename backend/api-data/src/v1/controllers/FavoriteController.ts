import { Request, Response, NextFunction } from "express";
import ItemDBService from "../modules/CRUD.js";
import FavoriteService from "../modules/favoriteService.js";
import type { AuthRequest } from "../../types/global.types.js";

//-------------------------------------------------------------------------------------//
export default class FavoriteController {
  //---------------------------------------//

  static async getListFavorite(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = Number(req.user?.id);
      if (!userId) {
        throw new Error("Invalid userId");
      }

      const result = await FavoriteService.getAllFavoriteCoinsUSer(userId);
      if (!result) {
        return res
          .status(201)
          .json({ success: false, message: "Error getting favorite coins" });
      }
      return res.status(200).json({ result });
    } catch (err) {
      console.error("Error getting favorite coins Controller", err);
      next(err);
    }
  }

  //---------------------------------------//
  static async favoriteCreate(req: Request, res: Response, next: NextFunction) {
    try {
      // await FavoriteService.favoritesTable();

      const data = req.body.data;
      if (
        !data.userId ||
        !data.coinId ||
        data.coinId === null ||
        !data.symbol
      ) {
        return res
          .status(200)
          .json({ success: false, message: "Error add coin favorite" });
      }
      // const existingFavorite = await FavoriteService.getCheckFindUserCoin(
      //   data.userId,
      //   data.coinId
      // );

      // if (existingFavorite) {
      //   return res.status(200).json({
      //     success: false,
      //     message: "You already have such a coin saved",
      //   });
      // }
      const result = await ItemDBService.create("favorites", data);
      if (result && result.affectedRows === 1) {
        const allFavorite = await FavoriteService.getAllFavoriteCoinsUSer(
          data.userId,
        );
        return res.status(201).json({
          success: true,
          message: "Coin added successful",
          data: allFavorite,
        });
      } else {
        return res.status(200).json({
          success: false,
          message: "Error add favorite coin",
        });
      }
    } catch (err) {
      console.error("Error created favorite coin Controller", err);
      next(err);
    }
  }
  //-------------------------------------------------------------------------------------//
  static async deleteCoinByFavorites(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const coinId = Number(req.query.coinId);
      if (!coinId) {
        throw new Error("Invalid coinId");
      }
      const userId = Number(req.query.userId);
      if (!userId) {
        throw new Error("Invalid userId");
      }
      const result = await FavoriteService.deleteFavorite(coinId, userId);
      if (result && result.affectedRows === 1) {
        return res.status(200).json({
          success: true,
          message: "Coin deleted successful",
        });
      } else {
        return res.status(200).json({
          success: false,
          message: "Error delete favorite coin",
        });
      }
    } catch (err) {
      console.error("Error delete coin by favorites", (err as Error)?.message);
      next(err);
    }
  }
}
