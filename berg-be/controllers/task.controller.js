import { serviceManager } from "../services/serviceManager.js";

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

export const updateTask = async (req, res) => {
  try {
    const updated = await serviceManager
      .getTaskService()
      .updateTask(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Failed to update task" });
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
