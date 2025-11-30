import express from "express";
import multer from "multer";
import path from "path";

import {
  getProfile,
  updateProfile,
  getUserSkills,
  addUserSkill,
  updateUserSkill,
  deleteUserSkill,
  saveAvatar,
  getUserReviews,
  addUserReview,
  getPublicProfile
} from "../controllers/profileController.js";

const router = express.Router();

// ------- public profile FIRST -------
router.get("/public/:id", getPublicProfile);

// avatar upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/avatars"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar_${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

// profile
router.get("/", getProfile);
router.put("/", updateProfile);

// skills
router.get("/skills", getUserSkills);
router.post("/skills", addUserSkill);
router.put("/skills/:skillId", updateUserSkill);
router.delete("/skills/:skillId", deleteUserSkill);

// avatar
router.post("/avatar", upload.single("avatar"), saveAvatar);

// reviews
router.get("/reviews", getUserReviews);
router.post("/reviews", addUserReview);

export default router;
