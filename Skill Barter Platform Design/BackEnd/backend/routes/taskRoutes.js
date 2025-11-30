import express from "express";
import {
  getTasksByCollab,
  getMyTasks,
  createTask,
  updateTask,
  moveTask,
  deleteTask,
} from "../controllers/taskController.js";

const router = express.Router();

// GET tasks inside a collaboration board
router.get("/collab/:collab_id", getTasksByCollab);

// GET all tasks assigned to a user
router.get("/my/:user_id", getMyTasks);

// CREATE a task
router.post("/create", createTask);

// UPDATE task fields
router.put("/:task_id", updateTask);

// MOVE task between columns
router.put("/:task_id/move", moveTask);

// DELETE task
router.delete("/:task_id", deleteTask);

export default router;
