import express from "express";
import { requireAdmin } from "../middleware/authMiddleware.js";
import {
  getReports,
  updateReportStatus,
} from "../controllers/adminReportController.js";

const router = express.Router();

router.get("/", requireAdmin, getReports);
router.put("/:id", requireAdmin, updateReportStatus);

export default router;
