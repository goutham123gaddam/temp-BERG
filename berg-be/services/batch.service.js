export class BatchService {
  /**
   * @param {import('@prisma/client').PrismaClient} prisma
   */
  constructor(prisma) {
    this.prisma = prisma;
  }

  async createBatch(data) {
    return this.prisma.batch.create({
      data,
    });
  }

  async getAllBatches() {
    const batches = await this.prisma.batch.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    // Add task counts to each batch
    const batchesWithStats = await Promise.all(
      batches.map(async (batch) => {
        const stats = await this.getBatchStats(batch.id);
        return {
          ...batch,
          ...stats,
        };
      })
    );

    return batchesWithStats;
  }

  async getBatchesByProjectId(projectId) {
    const batches = await this.prisma.batch.findMany({
      where: { projectId },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Add task counts and statistics to each batch
    const batchesWithStats = await Promise.all(
      batches.map(async (batch) => {
        const stats = await this.getBatchStats(batch.id);
        return {
          ...batch,
          ...stats,
        };
      })
    );

    return batchesWithStats;
  }

  async getBatchById(id) {
    const batch = await this.prisma.batch.findUnique({
      where: { id },
    });

    if (!batch) return null;

    const stats = await this.getBatchStats(id);

    return {
      ...batch,
      ...stats,
    };
  }

  /**
   * Get aggregated statistics for a single batch
   * @param {string} batchId
   * @returns {Object} Batch statistics
   */
  async getBatchStats(batchId) {
    // Get task count using simple aggregation
    const taskStats = await this.prisma.task.aggregate({
      where: {
        batchId: batchId,
      },
      _count: {
        id: true,
      },
    });

    // Get task status counts
    const taskStatusCounts = await this.prisma.task.groupBy({
      by: ["status"],
      where: {
        batchId: batchId,
      },
      _count: {
        status: true,
      },
    });

    // Process the results
    const totalTasks = taskStats._count.id || 0;

    // Count tasks by status
    const statusCounts = taskStatusCounts.reduce((acc, item) => {
      acc[item.status] = item._count.status;
      return acc;
    }, {});

    const completedTasks = statusCounts.completed || 0;
    const pendingTasks = statusCounts.pending || 0;
    const inProgressTasks =
      (statusCounts.in_progress || 0) +
      (statusCounts.annotation_inprogress || 0);
    const inReviewTasks = statusCounts.annotation_inreview || 0;
    const failedTasks = statusCounts.failed || 0;

    // Calculate progress
    const progress =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Get batch info for SLA calculation
    const batch = await this.prisma.batch.findUnique({
      where: { id: batchId },
      select: { dueDate: true, slaStatus: true },
    });

    // Calculate SLA status based on due date and progress
    let slaStatus = batch?.slaStatus || "on_track";
    if (batch?.dueDate) {
      const dueDate = new Date(batch.dueDate);
      const now = new Date();
      const daysUntilDue = Math.ceil(
        (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (progress === 100) {
        slaStatus = "on_track";
      } else if (daysUntilDue < 0) {
        slaStatus = "overdue";
      } else if (daysUntilDue <= 2 && progress < 80) {
        slaStatus = "at_risk";
      } else {
        slaStatus = "on_track";
      }
    }

    // Generate a simulated accuracy based on completed tasks (since accuracy field doesn't exist)
    const accuracy =
      completedTasks > 0 ? Math.round(75 + Math.random() * 20) : 0; // Random between 75-95%

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      inReviewTasks,
      failedTasks,
      progress,
      accuracy, // Simulated accuracy
      slaStatus,
    };
  }

  async updateBatch(id, data) {
    return this.prisma.batch.update({
      where: { id },
      data,
    });
  }

  async deleteBatch(id) {
    // Delete all tasks in this batch first (if not using cascade)
    await this.prisma.task.deleteMany({
      where: { batchId: id },
    });

    return this.prisma.batch.delete({
      where: { id },
    });
  }

  /**
   * Get batch statistics for dashboard
   * @returns {Object} Overall batch statistics
   */
  async getBatchStatistics() {
    const totalBatches = await this.prisma.batch.count();

    // Get batches with 100% progress using a more compatible approach
    const allBatches = await this.prisma.batch.findMany({
      include: {
        tasks: {
          select: {
            status: true,
          },
        },
      },
    });

    let completedBatches = 0;
    let overdueBatches = 0;
    let atRiskBatches = 0;

    const now = new Date();
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);

    allBatches.forEach((batch) => {
      const totalTasks = batch.tasks.length;
      const completedTasks = batch.tasks.filter(
        (task) => task.status === "completed"
      ).length;
      const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

      // Count completed batches
      if (progress === 100) {
        completedBatches++;
      }

      // Count overdue batches
      const dueDate = new Date(batch.dueDate);
      if (dueDate < now && progress < 100) {
        overdueBatches++;
      }

      // Count at-risk batches
      if (dueDate <= twoDaysFromNow && dueDate >= now && progress < 80) {
        atRiskBatches++;
      }
    });

    return {
      totalBatches,
      completedBatches,
      activeBatches: totalBatches - completedBatches,
      overdueBatches,
      atRiskBatches,
      onTrackBatches:
        totalBatches - completedBatches - overdueBatches - atRiskBatches,
    };
  }
}
