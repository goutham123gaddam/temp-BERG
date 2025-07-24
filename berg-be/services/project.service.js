export class ProjectService {
  /**
   * @param {import('@prisma/client').PrismaClient} prisma
   */
  constructor(prisma) {
    this.prisma = prisma;
  }

  async createProject(data) {
    return this.prisma.project.create({
      data,
    });
  }

  async getAllProjects() {
    // Get projects with their related data
    const projects = await this.prisma.project.findMany({
      include: {
        batches: {
          include: {
            tasks: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate additional fields for each project
    return projects.map((project) => {
      const calculations = this.calculateProjectMetrics(project);

      return {
        ...project,
        totalTasks: calculations.totalTasks,
        completedTasks: calculations.completedTasks,
        pendingTasks: calculations.pendingTasks,
        inProgressTasks: calculations.inProgressTasks,
        progress: calculations.progress,
        accuracy: calculations.accuracy,
        totalBatches: calculations.totalBatches,
        completedBatches: calculations.completedBatches,
        overdueBatches: calculations.overdueBatches,
      };
    });
  }

  async getProjectById(id) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        batches: {
          include: {
            tasks: true,
          },
        },
      },
    });

    if (!project) return null;

    const calculations = this.calculateProjectMetrics(project);

    return {
      ...project,
      totalTasks: calculations.totalTasks,
      completedTasks: calculations.completedTasks,
      pendingTasks: calculations.pendingTasks,
      inProgressTasks: calculations.inProgressTasks,
      progress: calculations.progress,
      accuracy: calculations.accuracy,
      totalBatches: calculations.totalBatches,
      completedBatches: calculations.completedBatches,
      overdueBatches: calculations.overdueBatches,
    };
  }

  async updateProject(id, data) {
    return this.prisma.project.update({
      where: { id },
      data,
    });
  }

  async deleteProject(id) {
    // Delete all related data first (cascade should handle this, but being explicit)
    await this.prisma.task.deleteMany({
      where: {
        batch: {
          projectId: id,
        },
      },
    });

    await this.prisma.batch.deleteMany({
      where: { projectId: id },
    });

    return this.prisma.project.delete({
      where: { id },
    });
  }

  /**
   * Calculate various metrics for a project
   * @param {Object} project - Project with batches and tasks included
   * @returns {Object} Calculated metrics
   */
  calculateProjectMetrics(project) {
    const batches = project.batches || [];
    const totalBatches = batches.length;

    // Flatten all tasks from all batches
    const allTasks = batches.flatMap((batch) => batch.tasks || []);
    const totalTasks = allTasks.length;

    // Count tasks by status
    const completedTasks = allTasks.filter(
      (task) => task.status === "completed"
    ).length;
    const pendingTasks = allTasks.filter(
      (task) => task.status === "pending"
    ).length;
    const inProgressTasks = allTasks.filter(
      (task) => task.status === "in_progress"
    ).length;

    // Calculate progress percentage
    const progress =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Calculate accuracy (you might want to add an accuracy field to tasks)
    // For now, let's simulate accuracy based on completed tasks
    const accuracy =
      completedTasks > 0 ? Math.min(95, 70 + Math.random() * 25) : 0;

    // Count completed batches (all tasks in batch are completed)
    const completedBatches = batches.filter((batch) => {
      const batchTasks = batch.tasks || [];
      return (
        batchTasks.length > 0 &&
        batchTasks.every((task) => task.status === "completed")
      );
    }).length;

    // Count overdue batches
    const now = new Date();
    const overdueBatches = batches.filter((batch) => {
      const dueDate = new Date(batch.dueDate);
      const batchTasks = batch.tasks || [];
      const isCompleted =
        batchTasks.length > 0 &&
        batchTasks.every((task) => task.status === "completed");
      return dueDate < now && !isCompleted;
    }).length;

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      progress: Math.round(progress),
      accuracy: Math.round(accuracy * 10) / 10, // Round to 1 decimal place
      totalBatches,
      completedBatches,
      overdueBatches,
    };
  }

  /**
   * Get project statistics for dashboard
   * @returns {Object} Overall statistics
   */
  async getProjectStatistics() {
    const projects = await this.getAllProjects();

    const totalProjects = projects.length;
    const totalTasks = projects.reduce(
      (sum, project) => sum + project.totalTasks,
      0
    );
    const completedTasks = projects.reduce(
      (sum, project) => sum + project.completedTasks,
      0
    );
    const averageAccuracy =
      projects.length > 0
        ? projects.reduce((sum, project) => sum + project.accuracy, 0) /
          projects.length
        : 0;

    const completedProjects = projects.filter((p) => p.progress === 100).length;
    const activeProjects = totalProjects - completedProjects;

    return {
      totalProjects,
      completedProjects,
      activeProjects,
      totalTasks,
      completedTasks,
      pendingTasks: totalTasks - completedTasks,
      averageAccuracy: Math.round(averageAccuracy * 10) / 10,
      completionRate:
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    };
  }
}
