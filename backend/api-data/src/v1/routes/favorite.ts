import express, { Router } from "express";
import FavoriteController from "../controllers/FavoriteController.js";

const router: Router = express.Router();

router.post("/", FavoriteController.favoriteCreate);

router.get("/list", FavoriteController.getListFavorite);

router.delete("/delete", FavoriteController.deleteCoinByFavorites);

export default router;
