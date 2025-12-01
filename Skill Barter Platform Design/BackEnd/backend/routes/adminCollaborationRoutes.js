// backend/routes/adminCollaborationRoutes.js
import express from "express";
import { requireAdmin } from "../middleware/authMiddleware.js";
import {
  getCollaborations,
  updateCollaborationStatus,
} from "../controllers/adminCollaborationController.js";

const router = express.Router();

router.get("/", requireAdmin, getCollaborations);
router.put("/:id", requireAdmin, updateCollaborationStatus);

export default router;
