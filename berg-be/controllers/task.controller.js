import { serviceManager } from "../services/serviceManager.js";

export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ["pending", "in_progress", "completed", "failed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    // Prepare update data
    const updateData = { status };

    // If marking as completed, set completedAt timestamp
    if (status === "completed") {
      updateData.completedAt = new Date();
    }

    // If moving from completed to another status, clear completedAt
    if (status !== "completed") {
      updateData.completedAt = null;
    }

    const updatedTask = await serviceManager
      .getTaskService()
      .updateTask(id, updateData);

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error updating task status:", error);
    res.status(500).json({ error: "Failed to update task status" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // If status is being updated to completed, ensure completedAt is set
    if (updateData.status === "completed" && !updateData.completedAt) {
      updateData.completedAt = new Date();
    }

    // If status is not completed, ensure completedAt is null
    if (updateData.status && updateData.status !== "completed") {
      updateData.completedAt = null;
    }

    const updated = await serviceManager
      .getTaskService()
      .updateTask(id, updateData);

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
};

export const createTask = async (req, res) => {
  try {
    const newTask = await serviceManager.getTaskService().createTask(req.body);
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await serviceManager.getTaskService().getAllTasks();
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

export const getTasksByBatchId = async (req, res) => {
  try {
    const { batchId } = req.query;
    const tasks = await serviceManager
      .getTaskService()
      .getTasksByBatchId(batchId);
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks by batchId:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await serviceManager
      .getTaskService()
      .getTaskById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.status(200).json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ error: "Failed to fetch task" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    await serviceManager.getTaskService().deleteTask(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
};
