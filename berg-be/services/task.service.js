export class TaskService {
  /**
   * @param {import('@prisma/client').PrismaClient} prisma
   */
  constructor(prisma) {
    this.prisma = prisma;
  }

  async createTask(data) {
    const taskData = {
      ...data,
      status: data.status || "pending",
      templateType: data.templateType || null,
      templateData: data.templateData || null,
      annotationDecision: null, // Always null for new tasks
      // Keep legacy fields for backward compatibility
      inputs: data.inputs || [],
      outputs: data.outputs || [],
    };

    const newTask = await this.prisma.task.create({
      data: taskData,
      include: {
        batch: {
          include: {
            project: {
              select: {
                id: true,
                projectName: true,
              },
            },
          },
        },
      },
    });

    // Recalculate metrics after creating a new task
    await this.recalculateProjectMetrics(newTask.batch.project.id);
    await this.recalculateBatchMetrics(newTask.batchId);

    return newTask;
  }

  async getAllTasks() {
    return this.prisma.task.findMany({
      include: {
        batch: {
          include: {
            project: {
              select: {
                id: true,
                projectName: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getTasksByBatchId(batchId) {
    return this.prisma.task.findMany({
      where: batchId ? { batchId } : {},
      include: {
        batch: {
          include: {
            project: {
              select: {
                id: true,
                projectName: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Get tasks assigned to a specific user (for annotator view)
   * @param {string} assignedUser - User email/identifier
   */
  async getMyTasks(assignedUser) {
    return this.prisma.task.findMany({
      where: {
        assignedUser,
        status: {
          in: ["pending", "in_progress"], // Only pending and in_progress tasks for annotators
        },
      },
      include: {
        batch: {
          include: {
            project: {
              select: {
                id: true,
                projectName: true,
              },
            },
          },
        },
      },
      orderBy: [
        { status: "asc" }, // Pending tasks first
        { createdAt: "desc" },
      ],
    });
  }

  /**
   * Get tasks with role-based filtering (NOT USED)
   * @param {string} userRole - 'admin', 'annotator', etc.
   * @param {string} userId - User identifier
   * @param {Object} filters - Additional filters
   */
  async getTasksWithRoleFilter(userRole, userId, filters = {}) {
    let whereClause = {};

    // Role-based filtering
    if (userRole === "annotator") {
      whereClause.assignedUser = userId;
    }

    // Apply additional filters
    if (filters.status && filters.status.length > 0) {
      whereClause.status = { in: filters.status };
    }

    if (filters.templateType && filters.templateType.length > 0) {
      whereClause.templateType = { in: filters.templateType };
    }

    if (filters.dateRange) {
      whereClause.createdAt = {
        gte: new Date(filters.dateRange.start),
        lte: new Date(filters.dateRange.end),
      };
    }

    return this.prisma.task.findMany({
      where: whereClause,
      include: {
        batch: {
          include: {
            project: {
              select: {
                id: true,
                projectName: true,
              },
            },
          },
        },
      },
      orderBy: [
        { status: "asc" }, // Pending tasks first
        { createdAt: "desc" },
      ],
    });
  }

  async getTaskById(id) {
    return this.prisma.task.findUnique({
      where: { id },
      include: {
        batch: {
          include: {
            project: {
              select: {
                id: true,
                projectName: true,
              },
            },
          },
        },
      },
    });
  }

  async updateTask(id, data) {
    // Get the current task to compare status changes
    const currentTask = await this.prisma.task.findUnique({
      where: { id },
      include: {
        batch: {
          include: {
            project: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (!currentTask) {
      throw new Error("Task not found");
    }

    // Prepare update data
    const updateData = { ...data };

    // If annotation decision is being updated, automatically mark as completed
    if (data.annotationDecision) {
      updateData.status = "completed";
      updateData.completedAt = new Date();
    }

    // If status is being updated to completed, set completedAt
    if (data.status === "completed" && !updateData.completedAt) {
      updateData.completedAt = new Date();
    }

    // If status is not completed, clear completedAt
    if (data.status && data.status !== "completed") {
      updateData.completedAt = null;
    }

    const updatedTask = await this.prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        batch: {
          include: {
            project: {
              select: {
                id: true,
                projectName: true,
              },
            },
          },
        },
      },
    });

    const { batchId, batch } = updatedTask;
    const { project } = batch;

    // Recalculate metrics if status changed
    if (currentTask.status !== updatedTask.status) {
      await this.recalculateProjectMetrics(project.id);
      await this.recalculateBatchMetrics(batchId);
    }

    return updatedTask;
  }

  async deleteTask(id) {
    // Get task info before deletion for metric recalculation
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        batch: {
          include: {
            project: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (!task) {
      throw new Error("Task not found");
    }

    await this.prisma.task.delete({
      where: { id },
    });

    // Recalculate metrics after deletion
    await this.recalculateProjectMetrics(task.batch.project.id);
    await this.recalculateBatchMetrics(task.batchId);

    return { success: true };
  }

  /**
   * Update annotation decision for a task (primary annotator action)
   * @param {string} id Task ID
   * @param {Object} annotationDecision Annotation decision data
   */
  async updateAnnotationDecision(id, annotationDecision) {
    const updatedTask = await this.prisma.task.update({
      where: { id },
      data: {
        annotationDecision,
        status: "completed",
        completedAt: new Date(),
      },
      include: {
        batch: {
          include: {
            project: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    // Recalculate metrics
    await this.recalculateProjectMetrics(updatedTask.batch.project.id);
    await this.recalculateBatchMetrics(updatedTask.batchId);

    return updatedTask;
  }

  /**
   * Get tasks by template type (NOT USED)
   * @param {string} templateType Template type to filter by
   */
  async getTasksByTemplateType(templateType) {
    return this.prisma.task.findMany({
      where: { templateType },
      include: {
        batch: {
          include: {
            project: {
              select: {
                id: true,
                projectName: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Get task statistics for dashboard
   */
  async getTaskStatistics(filters = {}) {
    let whereClause = {};

    if (filters.assignedUser) {
      whereClause.assignedUser = filters.assignedUser;
    }

    if (filters.templateType) {
      whereClause.templateType = filters.templateType;
    }

    const tasks = await this.prisma.task.findMany({
      where: whereClause,
    });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(
      (task) => task.status === "completed"
    ).length;
    const inProgressTasks = tasks.filter(
      (task) => task.status === "in_progress"
    ).length;
    const pendingTasks = tasks.filter(
      (task) => task.status === "pending"
    ).length;
    const failedTasks = tasks.filter((task) => task.status === "failed").length;

    const progress =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      failedTasks,
      progress,
    };
  }

  /**
   * Recalculate and update project metrics based on all its tasks
   * @param {string} projectId
   */
  async recalculateProjectMetrics(projectId) {
    // Get all tasks for this project
    const allProjectTasks = await this.prisma.task.findMany({
      where: {
        batch: {
          projectId,
        },
      },
    });

    const totalTasks = allProjectTasks.length;
    const completedTasks = allProjectTasks.filter(
      (task) => task.status === "completed"
    ).length;

    // Calculate progress as a decimal (0.0 to 1.0)
    const progress = totalTasks === 0 ? 0 : completedTasks / totalTasks;

    // Update project with new progress
    await this.prisma.project.update({
      where: { id: projectId },
      data: { progress },
    });

    return { totalTasks, completedTasks, progress };
  }

  /**
   * Recalculate and update batch SLA status based on its tasks and due date
   * @param {string} batchId
   */
  async recalculateBatchMetrics(batchId) {
    // Get batch details and all its tasks
    const batch = await this.prisma.batch.findUnique({
      where: { id: batchId },
      include: {
        tasks: true,
      },
    });

    if (!batch) {
      return;
    }

    const { tasks, dueDate } = batch;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(
      (task) => task.status === "completed"
    ).length;

    // Calculate progress
    const progress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

    // Determine SLA status
    let slaStatus = "on_track";

    if (totalTasks > 0) {
      const now = new Date();
      const dueDateTime = new Date(dueDate);
      const daysUntilDue = Math.ceil(
        (dueDateTime.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (progress === 100) {
        // All tasks completed - always on track
        slaStatus = "on_track";
      } else if (daysUntilDue < 0) {
        // Past due date and not completed
        slaStatus = "overdue";
      } else if (daysUntilDue <= 2 && progress < 80) {
        // Close to due date with low progress
        slaStatus = "at_risk";
      } else {
        slaStatus = "on_track";
      }
    }

    // Update batch SLA status
    await this.prisma.batch.update({
      where: { id: batchId },
      data: { slaStatus },
    });

    return { totalTasks, completedTasks, progress, slaStatus };
  }
}
