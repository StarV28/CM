import express, { Router } from "express";
import CoinsController from "./../controllers/CoinsController.js";
import { globalRateLimit } from "../../../middleware/globalRateLimit.js";

const router: Router = express.Router();

router.get("/", globalRateLimit, CoinsController.getTopCoinsController);

router.get("/:id", globalRateLimit, CoinsController.getCoinIdController);

router.get(
  "/:id/description",
  globalRateLimit,
  CoinsController.getDescriptionController,
);

export default router;
