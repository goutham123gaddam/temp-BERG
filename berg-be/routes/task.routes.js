// berg-be/routes/task.routes.js - Fixed route order

import express from "express";
import {
  createTask,
  getAllTasks,
  getTasksByBatchId,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getMyTasks,
  getTaskStatistics,
  updateAnnotationDecision,
} from "../controllers/task.controller.js";

const router = express.Router();

// Specific routes MUST come before parametric routes
// Otherwise Express treats "my-tasks" and "statistics" as :id parameters

// Specific routes FIRST
router.get("/my-tasks", getMyTasks); // Get tasks assigned to current user
router.get("/statistics", getTaskStatistics); // Get task statistics for dashboard

// General routes
router.get("/", getTasksByBatchId); // Get tasks (optionally filtered by batchId)
router.post("/", createTask);

// Parametric routes LAST
router.get("/:id", getTaskById);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.patch("/:id/status", updateTaskStatus);
router.put("/:id/annotation", updateAnnotationDecision); // Update annotation decision

export default router;
