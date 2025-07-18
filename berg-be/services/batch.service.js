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
    return this.prisma.batch.findMany({});
  }

  async getBatchesByProjectId(projectId) {
    return this.prisma.batch.findMany({
      where: projectId ? { projectId } : {},
    });
  }

  async getBatchById(id) {
    return this.prisma.batch.findUnique({
      where: { id },
    });
  }

  async updateBatch(id, data) {
    return this.prisma.batch.update({
      where: { id },
      data,
    });
  }

  async deleteBatch(id) {
    return this.prisma.batch.delete({
      where: { id },
    });
  }
}
