import express, { Router } from "express";
import {
  googleAuthCallback,
  googleAuthRedirect,
  googleAnswerMe,
} from "../controllers/AuthGoogleController.js";

const router: Router = express.Router();

router.get("/google", googleAuthRedirect);

router.get("/google/callback", googleAuthCallback);

router.get("/me", googleAnswerMe);

export default router;
