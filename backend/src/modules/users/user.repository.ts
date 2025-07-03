import { PrismaClient } from '@prisma/client';
import { CreateUserDTO, UpdateUserDTO, User } from './user.types';

const prisma = new PrismaClient();

export class UserRepository {
  async findAll(): Promise<User[]> {
    return prisma.user.findMany();
  }

  async findById(id: number): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async create(userData: CreateUserDTO): Promise<User> {
    return prisma.user.create({ data: userData });
  }

  async update(id: number, userData: UpdateUserDTO): Promise<User> {
    return prisma.user.update({ where: { id }, data: userData });
  }

  async delete(id: number): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }
}

export const userRepository = new UserRepository();