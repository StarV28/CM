import express, { Router } from "express";
import AnalyticsController from "../controllers/AnalyticsController.js";
import { globalRateLimit } from "../../../middleware/globalRateLimit.js";

const router: Router = express.Router();

router.get("/", globalRateLimit, AnalyticsController.getAnalyticsCrypto);

export default router;
