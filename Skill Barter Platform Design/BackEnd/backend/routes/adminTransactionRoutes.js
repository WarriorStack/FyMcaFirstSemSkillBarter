// backend/routes/adminTransactionRoutes.js
import express from "express";
import { requireAdmin } from "../middleware/authMiddleware.js";
import {
  adjustUserPoints,
  getUserTransactions,
} from "../controllers/adminTransactionController.js";

const router = express.Router();

router.get("/:userId", requireAdmin, getUserTransactions);
router.post("/adjust/:userId", requireAdmin, adjustUserPoints);

export default router;
