import { User } from '../users/user.types';
import { Enrollment, Grade } from '@prisma/client';

export interface BaseStudent {
  id: number;
  userId: number;
  studentId: string;
  grade: string;
  section: string;
  enrolledAt: Date;
}

export interface Student extends BaseStudent {
  user: User;
  enrollments?: Enrollment[];
}

export interface StudentWithGrades extends Student {
  enrollments?: (Enrollment & {
    grades: Grade[];
  })[];
}

export interface CreateStudentDTO {
  userId: number;
  studentId: string;
  grade: string;
  section: string;
}

export interface UpdateStudentDTO {
  studentId?: string;
  grade?: string;
  section?: string;
}

export interface StudentFilter {
  grade?: string;
  section?: string;
}