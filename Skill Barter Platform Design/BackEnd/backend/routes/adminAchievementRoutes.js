// backend/routes/adminAchievementRoutes.js
import express from "express";
import { requireAdmin } from "../middleware/authMiddleware.js";
import {
  getAchievements,
  createAchievement,
  deleteAchievement,
  getAchievementStats,
} from "../controllers/adminAchievementController.js";

const router = express.Router();

router.get("/", requireAdmin, getAchievements);
router.post("/", requireAdmin, createAchievement);
router.delete("/:id", requireAdmin, deleteAchievement);
router.get("/stats/summary", requireAdmin, getAchievementStats);

export default router;
