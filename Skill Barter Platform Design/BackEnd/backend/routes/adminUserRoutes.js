import express from "express";
import { requireAdmin } from "../middleware/authMiddleware.js";
import {
  getAllUsers,
  setActiveStatus,
  promoteToAdmin,
  deleteUser,
} from "../controllers/adminUserController.js";

const router = express.Router();

router.get("/", requireAdmin, getAllUsers);
router.put("/activate/:id", requireAdmin, setActiveStatus);
router.put("/promote/:id", requireAdmin, promoteToAdmin);
router.delete("/:id", requireAdmin, deleteUser);

export default router;
