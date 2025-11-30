// backend/routes/adminRoutes.js
import express from "express";
import { getAdminDashboardData } from "../controllers/adminController.js";
import { requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// All admin endpoints should be protected + admin-only
router.get("/dashboard", requireAdmin, getAdminDashboardData);


export default router;
