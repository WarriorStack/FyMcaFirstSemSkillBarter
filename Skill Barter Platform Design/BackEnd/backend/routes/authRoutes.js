import express from "express";
import { signup, login } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup); // /auth/signup
router.post("/login", login);   // /auth/login

export default router;
