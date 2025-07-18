import { serviceManager } from "../services/serviceManager.js";

export const createBatch = async (req, res) => {
  try {
    const newBatch = await serviceManager
      .getBatchService()
      .createBatch(req.body);
    res.status(201).json(newBatch);
  } catch (error) {
    console.error("Error creating batch:", error);
    res.status(500).json({ error: "Failed to create batch" });
  }
};

export const getAllBatches = async (req, res) => {
  try {
    const batches = await serviceManager.getBatchService().getAllBatches();
    res.status(200).json(batches);
  } catch (error) {
    console.error("Error fetching batches:", error);
    res.status(500).json({ error: "Failed to fetch batches" });
  }
};

export const getBatchesByProjectId = async (req, res) => {
  try {
    const { projectId } = req.query;
    const batches = await serviceManager
      .getBatchService()
      .getBatchesByProjectId(projectId);
    res.status(200).json(batches);
  } catch (error) {
    console.error("Error fetching batches by projectId:", error);
    res.status(500).json({ error: "Failed to fetch batches" });
  }
};

export const getBatchById = async (req, res) => {
  try {
    const batch = await serviceManager
      .getBatchService()
      .getBatchById(req.params.id);
    if (!batch) return res.status(404).json({ error: "Batch not found" });
    res.status(200).json(batch);
  } catch (error) {
    console.error("Error fetching batch:", error);
    res.status(500).json({ error: "Failed to fetch batch" });
  }
};

export const updateBatch = async (req, res) => {
  try {
    const updated = await serviceManager
      .getBatchService()
      .updateBatch(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating batch:", error);
    res.status(500).json({ error: "Failed to update batch" });
  }
};

export const deleteBatch = async (req, res) => {
  try {
    await serviceManager.getBatchService().deleteBatch(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting batch:", error);
    res.status(500).json({ error: "Failed to delete batch" });
  }
};
