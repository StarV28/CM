import express, { Router } from "express";
import NewsController from "../controllers/NewsController.js";
import { newsRateLimit } from "../../../middleware/newsRateLimit.js";

const router: Router = express.Router();

router.use("/", newsRateLimit, NewsController.getNewsUa);

export default router;
