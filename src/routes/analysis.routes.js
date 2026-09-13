import express from "express";
import { analyzeResumeController } from "../controllers/analysis.controller.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post(
  "/analyze-resume",
  upload.single("resume"),
  analyzeResumeController
);

export default router;