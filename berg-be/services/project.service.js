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
    return this.prisma.project.findMany({});
  }

  async getProjectById(id) {
    return this.prisma.project.findUnique({
      where: { id },
    });
  }

  async updateProject(id, data) {
    return this.prisma.project.update({
      where: { id },
      data,
    });
  }

  async deleteProject(id) {
    return this.prisma.project.delete({
      where: { id },
    });
  }
}
