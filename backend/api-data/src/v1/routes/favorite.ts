import express, { Router } from "express";
import FavoriteController from "../controllers/FavoriteController.js";
import { globalRateLimit } from "../../../middleware/globalRateLimit.js";

const router: Router = express.Router();

router.post("/", globalRateLimit, FavoriteController.favoriteCreate);

router.get("/list", globalRateLimit, FavoriteController.getListFavorite);

router.delete(
  "/delete",
  globalRateLimit,
  FavoriteController.deleteCoinByFavorites,
);

export default router;
