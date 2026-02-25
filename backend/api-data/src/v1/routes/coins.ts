import express, { Router } from "express";
import CoinsController from "./../controllers/CoinsController.js";

const router: Router = express.Router();

router.get("/", CoinsController.getTopCoinsController);

// router.get("/all", CoinsController.getAllCoins);

router.get("/:id", CoinsController.getCoinIdController);

router.get("/:id/description", CoinsController.getDescriptionController);

export default router;
