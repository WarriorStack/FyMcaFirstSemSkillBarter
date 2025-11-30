import express from "express";
import { getConversationMessages, sendMessage } from "../controllers/messageController.js";

const router = express.Router();

router.get("/conversation/:id", getConversationMessages);
router.post("/send", sendMessage);

export default router;
