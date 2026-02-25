import express, { Router } from "express";
import RatesController from "../controllers/RatesController.js";

const router: Router = express.Router();

router.use("/banks", RatesController.banksRates);

export default router;
