import { studentRepository } from './student.repository';
import { Student, StudentFilter, CreateStudentDTO, UpdateStudentDTO, StudentWithGrades, BaseStudent } from './student.types';
import { userService } from '../users/user.service';

export class StudentService {
  async getAllStudents(filter?: StudentFilter): Promise<BaseStudent[]> {
    return studentRepository.findAll(filter);
  }

  async getStudentById(id: number): Promise<BaseStudent | null> {
    return studentRepository.findById(id);
  }

  async getStudentByUserId(userId: number): Promise<BaseStudent | null> {
    return studentRepository.findByUserId(userId);
  }

  async createStudent(studentData: CreateStudentDTO): Promise<BaseStudent> {
    // Verificar que el usuario existe
    const user = await userService.getUserById(studentData.userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar que no es ya un estudiante
    const existingStudent = await studentRepository.findByUserId(studentData.userId);
    if (existingStudent) {
      throw new Error('Este usuario ya está registrado como estudiante');
    }

    // Verificar que el studentId es único
    const studentWithId = await studentRepository.findByStudentId(studentData.studentId);
    if (studentWithId) {
      throw new Error('El código de estudiante ya está en uso');
    }

    return studentRepository.create(studentData);
  }

  async updateStudent(id: number, studentData: UpdateStudentDTO): Promise<BaseStudent> {
    if (studentData.studentId) {
      // Verificar que el nuevo studentId es único
      const studentWithId = await studentRepository.findByStudentId(studentData.studentId);
      if (studentWithId && studentWithId.id !== id) {
        throw new Error('El código de estudiante ya está en uso');
      }
    }

    return studentRepository.update(id, studentData);
  }

  async deleteStudent(id: number): Promise<void> {
    return studentRepository.delete(id);
  }

  async getStudentGrades(studentId: number): Promise<StudentWithGrades | null> {
    return studentRepository.getStudentWithGrades(studentId);
  }
}

export const studentService = new StudentService();