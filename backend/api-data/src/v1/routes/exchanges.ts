import express, { Router } from "express";
import ExchangesController from "../controllers/ExchangesController.js";

const router: Router = express.Router();

router.use("/", ExchangesController.allExController);

export default router;
