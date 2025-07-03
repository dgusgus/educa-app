import { Router } from 'express';
import { studentController } from '../modules/students/student.controller';
import { authenticate } from '../modules/auth/auth.middleware';
import { authorize } from '../modules/auth/authorization.middleware';
import { validate } from '@/utils/validation';
import { createStudentSchema, updateStudentSchema } from '@/utils/validation';
import { studentService, StudentService } from '@/modules/students/student.service';

const router = Router();

// Solo ADMIN puede listar todos los estudiantes
router.get('/', authenticate, authorize(['ADMIN']), studentController.getAllStudents);

// ADMIN puede ver cualquier estudiante, estudiantes solo su propio perfil
router.get('/:id', authenticate, async (req, res, next) => {
  if (req.user?.role === 'ADMIN') {
    return studentController.getStudentById(req, res);
  }
  
  // Verificar que el estudiante está viendo su propio perfil
  const studentId = parseInt(req.params.id, 10);
  const student = await studentService.getStudentByUserId(req.user?.userId || 0);
  
  if (!student || student.id !== studentId) {
    return res.status(403).json({ error: 'Solo puedes ver tu propio perfil' });
  }
  
  return studentController.getStudentById(req, res);
});

// Ruta especial para que los estudiantes vean su propio perfil
router.get('/profile/me', authenticate, studentController.getStudentProfile);

// Ver calificaciones
router.get('/:id/grades', authenticate, studentController.getStudentGrades);

// Solo ADMIN puede crear estudiantes
router.post(
  '/',
  authenticate,
  authorize(['ADMIN']),
  validate(createStudentSchema),
  studentController.createStudent
);

// ADMIN puede actualizar cualquier estudiante, estudiantes solo su propio perfil
router.put(
  '/:id',
  authenticate,
  validate(updateStudentSchema),
  async (req, res, next) => {
    if (req.user?.role === 'ADMIN') {
      return studentController.updateStudent(req, res);
    }
    
    // Verificar que el estudiante está actualizando su propio perfil
    const studentId = parseInt(req.params.id, 10);
    const student = await studentService.getStudentByUserId(req.user?.userId || 0);
    
    if (!student || student.id !== studentId) {
      return res.status(403).json({ error: 'Solo puedes actualizar tu propio perfil' });
    }
    
    return studentController.updateStudent(req, res);
  }
);

// Solo ADMIN puede eliminar estudiantes
router.delete('/:id', authenticate, authorize(['ADMIN']), studentController.deleteStudent);

export default router;