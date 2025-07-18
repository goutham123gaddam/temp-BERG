export class TaskService {
  /**
   * @param {import('@prisma/client').PrismaClient} prisma
   */
  constructor(prisma) {
    this.prisma = prisma;
  }

  async createTask(data) {
    return this.prisma.task.create({
      data,
    });
  }

  async getAllTasks() {
    return this.prisma.task.findMany({});
  }

  async getTasksByBatchId(batchId) {
    return this.prisma.task.findMany({
      where: batchId ? { batchId } : {},
    });
  }

  async getTaskById(id) {
    return this.prisma.task.findUnique({
      where: { id },
    });
  }

  async updateTask(id, data) {
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
    const { projectId, dueDate } = batch;

    // Recalculate project progress
    const allProjectTasks = await this.prisma.task.findMany({
      where: {
        batch: {
          projectId,
        },
      },
    });

    const total = allProjectTasks.length;
    const completed = allProjectTasks.filter(
      (t) => t.status === "completed"
    ).length;
    const progress = total === 0 ? 0 : completed / total;

    await this.prisma.project.update({
      where: { id: projectId },
      data: { progress },
    });

    // Update batch SLA status if all tasks are completed
    const batchTasks = await this.prisma.task.findMany({
      where: { batchId },
    });

    const allCompleted = batchTasks.every((t) => t.status === "completed");

    if (allCompleted) {
      const now = new Date();
      let slaStatus = "on_track";

      if (now > dueDate) {
        slaStatus = "overdue";
      } else {
        const diff = (dueDate - now) / (1000 * 60 * 60 * 24); // days left
        if (diff <= 5) slaStatus = "at_risk";
      }

      await this.prisma.batch.update({
        where: { id: batchId },
        data: { slaStatus },
      });
    }

    return updatedTask;
  }

  async deleteTask(id) {
    return this.prisma.task.delete({
      where: { id },
    });
  }
}
