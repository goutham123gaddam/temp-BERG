export class UserService {
  /**
   * @param {import('@prisma/client').PrismaClient} prisma
   */
  constructor(prisma) {
    this.prisma = prisma;
  }

  async getAllUsers() {
    const result = await this.prisma.$queryRaw`
      SELECT id, email, raw_user_meta_data
      FROM auth.users
    `;
    return result;
  }

  async getUserById(id) {
    const result = await this.prisma.$queryRaw`
      SELECT id, email, raw_user_meta_data
      FROM auth.users
      WHERE id = ${id}::uuid
      LIMIT 1
    `;
    return result?.[0] || null;
  }
}
