import express from "express";
import {
  getAllBatches,
  getBatchById,
  createBatch,
  updateBatch,
  deleteBatch,
  getBatchesByProjectId,
  getBatchStatistics,
} from "../controllers/batch.controller.js";

const router = express.Router();

router.get("/statistics", getBatchStatistics);
router.get("/", getBatchesByProjectId);
router.get("/:id", getBatchById);
router.post("/", createBatch);
router.put("/:id", updateBatch);
router.delete("/:id", deleteBatch);

export default router;
