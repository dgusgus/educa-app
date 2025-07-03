import { PrismaClient, Student } from '@prisma/client';
import prisma from '@/utils/prisma';
import { BaseStudent, CreateStudentDTO, StudentFilter, StudentWithGrades, UpdateStudentDTO } from './student.types';

export class StudentRepository {
  async findAll(filter?: StudentFilter): Promise<BaseStudent[]> {
    return prisma.student.findMany({
      where: filter,
      //include: { user: true }
    });
  }

  async findById(id: number): Promise<Student | null> {
    return prisma.student.findUnique({
      where: { id },
      include: { user: true }
    });
  }

  async findByUserId(userId: number): Promise<Student | null> {
    return prisma.student.findUnique({
      where: { userId },
      include: { user: true }
    });
  }

  async findByStudentId(studentId: string): Promise<Student | null> {
    return prisma.student.findUnique({
      where: { studentId },
      include: { user: true }
    });
  }

  async create(studentData: CreateStudentDTO): Promise<Student> {
    return prisma.student.create({
      data: studentData,
      include: { user: true }
    });
  }

  async update(id: number, studentData: UpdateStudentDTO): Promise<Student> {
    return prisma.student.update({
      where: { id },
      data: studentData,
      include: { user: true }
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.student.delete({ where: { id } });
  }

  async getStudentWithGrades(studentId: number): Promise<StudentWithGrades | null> {
    return prisma.student.findUnique({
      where: { id: studentId },
      include: {
        user: true,
        enrollments: {
          include: {
            course: true,
            grades: true
          }
        }
      }
    });
  }
}

export const studentRepository = new StudentRepository();