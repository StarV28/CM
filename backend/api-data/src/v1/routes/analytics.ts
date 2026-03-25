import express, { Router } from "express";
import AnalyticsController from "../controllers/AnalyticsController.js";

const router: Router = express.Router();

router.get("/", AnalyticsController.getAnalyticsCrypto);

export default router;
