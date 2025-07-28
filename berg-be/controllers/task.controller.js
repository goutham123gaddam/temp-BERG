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

    // Validate annotation decision format if provided
    if (updateData.annotationDecision) {
      const { decision, confidence, annotatorId } =
        updateData.annotationDecision;

      if (!decision || confidence === undefined || !annotatorId) {
        return res.status(400).json({
          error:
            "Invalid annotation decision format. Required: decision, confidence, annotatorId",
        });
      }

      // Add timestamp if not provided
      if (!updateData.annotationDecision.timestamp) {
        updateData.annotationDecision.timestamp = new Date().toISOString();
      }

      // If annotation decision is provided, mark as completed
      updateData.status = "completed";
    }

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

    if (error.message === "Task not found") {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(500).json({ error: "Failed to update task" });
  }
};

export const createTask = async (req, res) => {
  try {
    const {
      batchId,
      taskType,
      assignedUser,
      templateType,
      templateData,
      // Legacy fields for backward compatibility:
      inputs,
      outputs,
    } = req.body;

    // Validate required fields
    if (!batchId || !taskType || !assignedUser) {
      return res.status(400).json({
        error: "Missing required fields: batchId, taskType, assignedUser",
      });
    }

    const taskData = {
      batchId,
      taskType,
      assignedUser,
      templateType,
      templateData,
      // Legacy support:
      inputs: inputs || [],
      outputs: outputs || [],
    };

    const newTask = await serviceManager.getTaskService().createTask(taskData);
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
    const { batchId, templateType, status, assignedUser } = req.query;

    let tasks;

    if (batchId) {
      // Get tasks for specific batch
      tasks = await serviceManager.getTaskService().getTasksByBatchId(batchId);
    } else {
      // Get all tasks (for admin view)
      tasks = await serviceManager.getTaskService().getAllTasks();
    }

    // Apply client-side filtering for now (will be moved to service in Task 7)
    if (templateType) {
      const templateTypes = templateType.split(",");
      tasks = tasks.filter((task) => templateTypes.includes(task.templateType));
    }

    if (status) {
      const statuses = status.split(",");
      tasks = tasks.filter((task) => statuses.includes(task.status));
    }

    if (assignedUser) {
      tasks = tasks.filter((task) => task.assignedUser === assignedUser);
    }

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

    if (error.message === "Task not found") {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(500).json({ error: "Failed to delete task" });
  }
};

/**
 * Get tasks assigned to the authenticated user (for annotator view)
 */
export const getMyTasks = async (req, res) => {
  try {
    // TODO: Get user from JWT token in Task 7
    const userEmail = req.user?.email || req.query.assignedUser;

    if (!userEmail) {
      return res.status(400).json({ error: "User email required" });
    }

    const tasks = await serviceManager.getTaskService().getMyTasks(userEmail);
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching my tasks:", error);
    res.status(500).json({ error: "Failed to fetch assigned tasks" });
  }
};

/**
 * Get task statistics for dashboard
 */
export const getTaskStatistics = async (req, res) => {
  try {
    const { assignedUser, templateType } = req.query;
    const filters = {};

    if (assignedUser) filters.assignedUser = assignedUser;
    if (templateType) filters.templateType = templateType;

    const stats = await serviceManager
      .getTaskService()
      .getTaskStatistics(filters);
    res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching task statistics:", error);
    res.status(500).json({ error: "Failed to fetch task statistics" });
  }
};

/**
 * Specific endpoint for updating annotation decisions
 */
export const updateAnnotationDecision = async (req, res) => {
  try {
    const { id } = req.params;
    const { annotationDecision } = req.body;

    if (!annotationDecision) {
      return res.status(400).json({ error: "Annotation decision is required" });
    }

    // Validate required fields
    const { decision, confidence, annotatorId } = annotationDecision;
    if (!decision || confidence === undefined || !annotatorId) {
      return res.status(400).json({
        error:
          "Invalid annotation decision. Required: decision, confidence, annotatorId",
      });
    }

    // Add timestamp
    const finalAnnotation = {
      ...annotationDecision,
      timestamp: new Date().toISOString(),
    };

    const updatedTask = await serviceManager
      .getTaskService()
      .updateAnnotationDecision(id, finalAnnotation);

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error updating annotation decision:", error);

    if (error.message === "Task not found") {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(500).json({ error: "Failed to update annotation decision" });
  }
};
