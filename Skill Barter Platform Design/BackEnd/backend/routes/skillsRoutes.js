// backend/routes/skillsRoutes.js
import express from "express";
import {
  getAllSkillsWithInstructors,
  getSkillsList,
} from "../controllers/skillsController.js";

const router = express.Router();

// Main Skill Explorer endpoint
router.get("/", getAllSkillsWithInstructors);

// Simple list for dropdowns
router.get("/list", getSkillsList);

export default router;
