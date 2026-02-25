import express, { Router } from "express";
import { logFrontendError } from "../controllers/error.controller.js";

const router: Router = express.Router();

router.post("/log-error", logFrontendError);

export default router;
