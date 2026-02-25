import express, { Router } from "express";
import UserController from "../controllers/UserController.js";
import forgotRateLimiter from "../../../middleware/forgotRateLimit.js";
import sanitizeMiddleware from "../../../middleware/sanitize.js";
import { validate } from "../../../middleware/validate.js";
import {
  userSignUpSchema,
  userLogInSchema,
  changePassSchema,
  updateUserSchema,
} from "../../../validation/user.schema.js";

const router: Router = express.Router();

router.post(
  "/create",
  sanitizeMiddleware,
  validate(userSignUpSchema),
  UserController.userCreateController,
);

router.post(
  "/login",
  sanitizeMiddleware,
  validate(userLogInSchema),
  // forgotRateLimiter,
  UserController.userLoginController,
);

router.post(
  "/password",
  sanitizeMiddleware,
  validate(changePassSchema),
  forgotRateLimiter,
  UserController.userChangePass,
);

router.post("/password/code", UserController.getCheckedCodePass);

router.post("/password/update", UserController.updatePassword);

router.post(
  "/update",
  sanitizeMiddleware,
  validate(updateUserSchema),
  UserController.updateUser,
);

router.delete("/delete-user", UserController.deleteUser);

export default router;
