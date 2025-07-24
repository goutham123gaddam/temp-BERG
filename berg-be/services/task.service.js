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
    };

    const newTask = await this.prisma.task.create({
      data: taskData,
      include: {
        batch: {
          select: {
            id: true,
            projectId: true,
          },
        },
      },
    });

    // Recalculate metrics after creating a new task
    await this.recalculateProjectMetrics(newTask.batch.projectId);
    await this.recalculateBatchMetrics(newTask.batchId);

    return newTask;
  }

  async getAllTasks() {
    return this.prisma.task.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getTasksByBatchId(batchId) {
    return this.prisma.task.findMany({
      where: batchId ? { batchId } : {},
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getTaskById(id) {
    return this.prisma.task.findUnique({
      where: { id },
    });
  }

  async updateTask(id, data) {
    // Get the current task to compare status changes
    const currentTask = await this.prisma.task.findUnique({
      where: { id },
      include: {
        batch: {
          select: {
            id: true,
            dueDate: true,
            projectId: true,
          },
        },
      },
    });

    if (!currentTask) {
      throw new Error("Task not found");
    }

    const updatedTask = await this.prisma.task.update({
      where: { id },
      data,
      include: {
        batch: {
          select: {
            id: true,
            dueDate: true,
            projectId: true,
          },
        },
      },
    });

    const { batchId, batch } = updatedTask;
    const { projectId } = batch;

    // Recalculate metrics if status changed
    if (currentTask.status !== updatedTask.status) {
      await this.recalculateProjectMetrics(projectId);
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
          select: {
            id: true,
            projectId: true,
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
    await this.recalculateProjectMetrics(task.batch.projectId);
    await this.recalculateBatchMetrics(task.batchId);

    return { success: true };
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

  /**
   * Get task statistics for a specific batch
   * @param {string} batchId
   */
  async getTaskStatistics(batchId) {
    const tasks = await this.prisma.task.findMany({
      where: { batchId },
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
   * Get task statistics for a specific project
   * @param {string} projectId
   */
  async getProjectTaskStatistics(projectId) {
    const tasks = await this.prisma.task.findMany({
      where: {
        batch: {
          projectId,
        },
      },
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
}
