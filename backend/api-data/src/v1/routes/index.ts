import express, { Router } from "express";
import mainRouter from "./main.js";
import userRouter from "./user.js";
import userCoins from "./coins.js";
import userNews from "./news.js";
import userRates from "./rates.js";
import useExchanges from "./exchanges.js";
import userError from "./error.js";
import userAuth from "./auth.js";
import userFavorite from "./favorite.js";

const router: Router = express.Router();

// change 'use' bi get/post/put/delete
router.use("/", mainRouter);
router.use("/user", userRouter);
router.use("/coins", userCoins);
router.use("/news", userNews);
router.use("/rates", userRates);
router.use("/exchanges", useExchanges);
router.use("/error", userError);
router.use("/auth", userAuth);
router.use("/favorite", userFavorite);

export default router;
