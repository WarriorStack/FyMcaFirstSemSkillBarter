import express from "express";
import { getPeopleForExplore } from "../controllers/peopleController.js";
import { getPublicProfile } from "../controllers/profileController.js";

const router = express.Router();

// Public profile alias
router.get("/profile/:id", getPublicProfile);

// Explore list
router.get("/explore", getPeopleForExplore);

export default router;
