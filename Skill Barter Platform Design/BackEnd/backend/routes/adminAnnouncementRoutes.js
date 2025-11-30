import express from "express";
import { requireAdmin } from "../middleware/authMiddleware.js";
import {
  createAnnouncement,
  getAnnouncements,
} from "../controllers/adminAnnouncementController.js";

const router = express.Router();

router.post("/", requireAdmin, createAnnouncement);
router.get("/", requireAdmin, getAnnouncements);

export default router;
