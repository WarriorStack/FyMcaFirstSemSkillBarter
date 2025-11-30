import express from "express";
import { requireAdmin } from "../middleware/authMiddleware.js";
import { getAnalytics } from "../controllers/adminAnalyticsController.js";

const router = express.Router();

router.get("/", requireAdmin, getAnalytics);

export default router;
