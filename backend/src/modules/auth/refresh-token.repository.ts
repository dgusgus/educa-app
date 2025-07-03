import { PrismaClient } from "@prisma/client";
import prisma from "@/utils/prisma";

export class RefreshTokenRepository {
  async create(token: string, userId: number, expiresAt: Date) {
    return prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt
      }
    });
  }

  async findById(id: number) {
    return prisma.refreshToken.findUnique({
      where: { id },
      include: { user: true }
    });
  }

  async findByToken(token: string) {
    return prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true }
    });
  }

  async delete(id: number) {
    return prisma.refreshToken.delete({
      where: { id }
    });
  }

  async deleteAllForUser(userId: number) {
    return prisma.refreshToken.deleteMany({
      where: { userId }
    });
  }

  async deleteExpired() {
    return prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });
  }
}

export const refreshTokenRepository = new RefreshTokenRepository();