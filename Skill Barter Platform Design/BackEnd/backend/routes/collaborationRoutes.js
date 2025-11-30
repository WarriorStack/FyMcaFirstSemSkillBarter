// backend/routes/collaborationRoutes.js
import express from "express";
import {
  requestCollaboration,
  acceptCollaboration,
  rejectCollaboration,
  getMyCollaborations,
} from "../controllers/collaborationController.js";

const router = express.Router();

// Send a new collaboration request (person or skill)
router.post("/request", requestCollaboration);

// Accept / reject a specific collaboration
router.post("/:id/accept", acceptCollaboration);
router.post("/:id/reject", rejectCollaboration);

// List collaborations where the user is requester or provider
router.get("/mine", getMyCollaborations);

export default router;
