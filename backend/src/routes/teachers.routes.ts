// src/routes/teachers.routes.ts - Rutas de gestión de profesores
import { Router, Request, Response } from 'express';

const router = Router();

// Datos de ejemplo de profesores
const teachersData = [
  {
    id: 1,
    teacherCode: 'PROF001',
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan.perez@escuela.edu',
    phone: '+591 123 456 789',
    dateOfBirth: '1980-05-15',
    hireDate: '2020-02-01',
    department: 'Matemáticas',
    specialization: 'Matemática Avanzada',
    subjects: ['Matemáticas', 'Álgebra', 'Geometría'],
    status: 'ACTIVE',
    salary: 4500,
    education: 'Licenciatura en Matemáticas - Universidad Mayor de San Andrés',
    experience: '8 años'
  },
  {
    id: 2,
    teacherCode: 'PROF002',
    firstName: 'María',
    lastName: 'López',
    email: 'maria.lopez@escuela.edu',
    phone: '+591 234 567 890',
    dateOfBirth: '1985-09-22',
    hireDate: '2021-03-15',
    department: 'Ciencias',
    specialization: 'Física Experimental',
    subjects: ['Física', 'Química'],
    status: 'ACTIVE',
    salary: 4200,
    education: 'Maestría en Física - Universidad Técnica de Oruro',
    experience: '6 años'
  },
  {
    id: 3,
    teacherCode: 'PROF003',
    firstName: 'Carlos',
    lastName: 'Ruiz',
    email: 'carlos.ruiz@escuela.edu',
    phone: '+591 345 678 901',
    dateOfBirth: '1978-12-03',
    hireDate: '2019-01-20',
    department: 'Humanidades',
    specialization: 'Historia Boliviana',
    subjects: ['Historia', 'Educación Cívica', 'Geografía'],
    status: 'ACTIVE',
    salary: 4300,
    education: 'Licenciatura en Historia - Universidad de San Simón',
    experience: '12 años'
  }
];

// ==========================================
// RUTAS DE PROFESORES
// ==========================================

// GET /api/teachers - Obtener todos los profesores
router.get('/', (req: Request, res: Response) => {
  const { department, status, search } = req.query;
  
  let filteredTeachers = [...teachersData];
  
  // Filtrar por departamento
  if (department) {
    filteredTeachers = filteredTeachers.filter(teacher => 
      teacher.department.toLowerCase().includes(department.toString().toLowerCase())
    );
  }
  
  // Filtrar por estado
  if (status) {
    filteredTeachers = filteredTeachers.filter(teacher => 
      teacher.status === status
    );
  }
  
  // Búsqueda por nombre
  if (search) {
    filteredTeachers = filteredTeachers.filter(teacher => 
      teacher.firstName.toLowerCase().includes(search.toString().toLowerCase()) ||
      teacher.lastName.toLowerCase().includes(search.toString().toLowerCase()) ||
      teacher.teacherCode.toLowerCase().includes(search.toString().toLowerCase()) ||
      teacher.specialization.toLowerCase().includes(search.toString().toLowerCase())
    );
  }
  
  res.json({
    success: true,
    message: 'Lista de profesores obtenida exitosamente',
    data: {
      teachers: filteredTeachers,
      total: filteredTeachers.length,
      departments: ['Matemáticas', 'Ciencias', 'Humanidades', 'Idiomas', 'Artes'],
      filters: {
        department: department || null,
        status: status || null,
        search: search || null
      }
    },
    timestamp: new Date().toISOString()
  });
});

// GET /api/teachers/:id - Obtener profesor específico
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const teacher = teachersData.find(t => t.id === parseInt(id));
  
  if (!teacher) {
    return res.status(404).json({
      success: false,
      message: 'Profesor no encontrado',
      timestamp: new Date().toISOString()
    });
  }
  
  res.json({
    success: true,
    message: 'Profesor encontrado',
    data: {
      teacher: {
        ...teacher,
        schedule: [
          { day: 'Lunes', subject: 'Matemáticas', grade: '4to A', time: '08:00-09:00' },
          { day: 'Lunes', subject: 'Álgebra', grade: '5to B', time: '09:00-10:00' },
          { day: 'Martes', subject: 'Geometría', grade: '3ro A', time: '10:00-11:00' },
          { day: 'Miércoles', subject: 'Matemáticas', grade: '4to B', time: '08:00-09:00' }
        ],
        students: {
          total: 125,
          byGrade: {
            '3ro': 35,
            '4to': 45,
            '5to': 45
          }
        },
        performance: {
          averageGrade: 8.3,
          attendanceRate: 96.5,
          evaluationScore: 4.7
        }
      }
    },
    timestamp: new Date().toISOString()
  });
});

// POST /api/teachers - Crear nuevo profesor
router.post('/', (req: Request, res: Response) => {
  const newTeacher = {
    id: teachersData.length + 1,
    teacherCode: `PROF${String(teachersData.length + 1).padStart(3, '0')}`,
    ...req.body,
    hireDate: new Date().toISOString().split('T')[0],
    status: 'ACTIVE'
  };
  
  teachersData.push(newTeacher