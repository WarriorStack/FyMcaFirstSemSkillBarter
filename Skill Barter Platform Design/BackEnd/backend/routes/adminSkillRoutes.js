// backend/routes/adminSkillRoutes.js
import express from "express";
import { requireAdmin } from "../middleware/authMiddleware.js";
import {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  mergeSkills,
} from "../controllers/adminSkillController.js";

const router = express.Router();

router.get("/", requireAdmin, getSkills);
router.post("/", requireAdmin, createSkill);
router.put("/:id", requireAdmin, updateSkill);
router.delete("/:id", requireAdmin, deleteSkill);

// Merge duplicate skills: { fromId, toId }
router.post("/merge", requireAdmin, mergeSkills);

export default router;
