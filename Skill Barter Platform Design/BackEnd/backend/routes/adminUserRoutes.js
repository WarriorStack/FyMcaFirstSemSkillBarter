// backend/routes/adminUserRoutes.js
import express from "express";
import { requireAdmin } from "../middleware/authMiddleware.js";
import {
  getAllUsers,
  setActiveStatus,
  promoteToAdmin,
  deleteUser,
  getUserDetails,
  updateUserRole,
  setShadowBanStatus,
  setMessagingStatus,
} from "../controllers/adminUserController.js";

const router = express.Router();

// List all users
router.get("/", requireAdmin, getAllUsers);

// Detailed view for a single user (profile + skills + collabs + projects + reports + transactions)
router.get("/:id/details", requireAdmin, getUserDetails);

// Activate / deactivate
router.put("/activate/:id", requireAdmin, setActiveStatus);

// Role management: student/mentor/trainer/admin
router.put("/role/:id", requireAdmin, updateUserRole);

// Shadow-ban toggle
router.put("/shadow-ban/:id", requireAdmin, setShadowBanStatus);

// Block messaging toggle
router.put("/messaging/:id", requireAdmin, setMessagingStatus);

// Promote to admin (kept for compatibility, now just calls updateUserRole)
router.put("/promote/:id", requireAdmin, promoteToAdmin);

// Delete
router.delete("/:id", requireAdmin, deleteUser);

export default router;
