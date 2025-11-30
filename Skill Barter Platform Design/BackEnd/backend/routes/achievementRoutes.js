import express from "express";
import { getAchievements, addAchievement } from "../controllers/achievementController.js";

const router = express.Router();

router.get("/", getAchievements);       // /achievements?user_id=1
router.post("/", addAchievement);       // Add achievement

export default router;
