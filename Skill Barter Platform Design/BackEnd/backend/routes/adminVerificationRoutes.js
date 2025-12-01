// backend/routes/adminVerificationRoutes.js
import express from "express";
import { requireAdmin } from "../middleware/authMiddleware.js";
import {
  getSkillVerifications,
  updateSkillVerificationStatus,
} from "../controllers/adminVerificationController.js";

const router = express.Router();

router.get("/", requireAdmin, getSkillVerifications);
router.put("/:id", requireAdmin, updateSkillVerificationStatus);

export default router;
