import express, { Router } from "express";
import mainRouter from "./main.js";

const router: Router = express.Router();

// change 'use' bi get/post/put/delete
router.use("/", mainRouter);

export default router;
