import express from "express";
import {
  createTask,
  getAllTasks,
  getTasksByBatchId,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from "../controllers/task.controller.js";

const router = express.Router();

router.get("/", getTasksByBatchId);
router.get("/:id", getTaskById);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

router.patch("/:id/status", updateTaskStatus);

export default router;
