import express, { Router } from "express";
import AdminController from "../controllers/AdminController.js";
import sanitizeMiddleware from "../../../middleware/sanitize.js";

const router: Router = express.Router();

router.post(
  "/analytics",
  sanitizeMiddleware,
  AdminController.createAnalyticsCrypto,
);

export default router;
