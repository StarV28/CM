import express, { Router } from "express";
import ExchangesController from "../controllers/ExchangesController.js";
import { globalRateLimit } from "../../../middleware/globalRateLimit.js";

const router: Router = express.Router();

router.get("/:id", globalRateLimit, ExchangesController.allExController);

export default router;
