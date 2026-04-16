import express, { Router } from "express";
import RatesController from "../controllers/RatesController.js";
import { globalRateLimit } from "../../../middleware/globalRateLimit.js";

const router: Router = express.Router();

router.use("/banks", globalRateLimit, RatesController.banksRates);

export default router;
