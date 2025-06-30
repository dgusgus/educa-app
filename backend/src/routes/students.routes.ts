// src/routes/students.routes.ts - Rutas de gestión de estudiantes
import { Router, Request, Response } from 'express';

const router = Router();

// Datos de ejemplo de estudiantes
const studentsData = [
  {
    id: 1,
    studentCode: 'EST001',
    firstName: 'Ana',
    lastName: 'García',
    email: 'ana.garcia@estudiante.edu',
    dateOfBirth: '2005-03-15',
    grade: '4to Secundaria',
    section: 'A',
    phone: '+591 123 456 789',
    address: 'Av. 6 de Agosto, Oruro',
    guardianName: 'María García',
    guardianPhone: '+591 987 654 321',
    enrollmentDate: '2024-02-01',
    status: 'ACTIVE',
    gpa: 8.5
  },
  {
    id: 2,
    studentCode: 'EST002',
    firstName: 'Carlos',
    lastName: 'Mamani',
    email: 'carlos.mamani@estudiante.edu',
    dateOfBirth: '2006-07-22',
    grade: '3ro Secundaria',
    section: 'B',
    phone: '+591 234 567 890',
    address: 'Calle Sucre 123, Oruro',
    guardianName: 'Pedro Mamani',
    guardianPhone: '+591 876 543 210',
    enrollmentDate: '2023-02-01',
    status: 'ACTIVE',
    gpa: 9.2
  },
  {
    id: 3,
    studentCode: 'EST003',
    firstName: 'Lucía',
    lastName: 'Quispe',
    email: 'lucia.quispe@estudiante.edu',
    dateOfBirth: '2005-11-08',
    grade: '4to Secundaria',
    section: 'A',
    phone: '+591 345 678 901',
    address: 'Zona Norte, Oruro',
    guardianName: 'Rosa Quispe',
    guardianPhone: '+591 765 432 109',
    enrollmentDate: '2024-02-01',
    status: 'ACTIVE',
    gpa: 7.8
  }
];

// ==========================================
// RUTAS DE ESTUDIANTES
// ==========================================

// GET /api/students - Obtener todos los estudiantes
router.get('/', (req: Request, res: Response) => {
  const { grade, section, status, search } = req.query;
  
  let filteredStudents = [...studentsData];
  
  // Filtrar por grado
  if (grade) {
    filteredStudents = filteredStudents.filter(student => 
      student.grade.toLowerCase().includes(grade.toString().toLowerCase())
    );
  }
  
  // Filtrar por sección
  if (section) {
    filteredStudents = filteredStudents.filter(student => 
      student.section === section
    );
  }
  
  // Filtrar por estado
  if (status) {
    filteredStudents = filteredStudents.filter(student => 
      student.status === status
    );
  }
  
  // Búsqueda por nombre
  if (search) {
    filteredStudents = filteredStudents.filter(student => 
      student.firstName.toLowerCase().includes(search.toString().toLowerCase()) ||
      student.lastName.toLowerCase().includes(search.toString().toLowerCase()) ||
      student.studentCode.toLowerCase().includes(search.toString().toLowerCase())
    );
  }
  
  res.json({
    success: true,
    message: 'Lista de estudiantes obtenida exitosamente',
    data: {
      students: filteredStudents,
      total: filteredStudents.length,
      filters: {
        grade: grade || null,
        section: section || null,
        status: status || null,
        search: search || null
      }
    },
    timestamp: new Date().toISOString()
  });
});

// GET /api/students/:id - Obtener estudiante específico
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const student = studentsData.find(s => s.id === parseInt(id));
  
  if (!student) {
    return res.status(404).json({
      success: false,
      message: 'Estudiante no encontrado',
      timestamp: new Date().toISOString()
    });
  }
  
  res.json({
    success: true,
    message: 'Estudiante encontrado',
    data: {
      student: {
        ...student,
        subjects: [
          { name: 'Matemáticas', teacher: 'Prof. Juan Pérez', grade: 8.5 },
          { name: 'Física', teacher: 'Prof. María López', grade: 9.0 },
          { name: 'Química', teacher: 'Prof. Carlos Ruiz', grade: 7.5 },
          { name: 'Historia', teacher: 'Prof. Ana Martínez', grade: 8.8 }
        ],
        attendance: {
          present: 85,
          absent: 5,
          late: 3,
          percentage: 94.4
        }
      }
    },
    timestamp: new Date().toISOString()
  });
});

// POST /api/students - Crear nuevo estudiante
router.post('/', (req: Request, res: Response) => {
  const newStudent = {
    id: studentsData.length + 1,
    studentCode: `EST${String(studentsData.length + 1).padStart(3, '0')}`,
    ...req.body,
    enrollmentDate: new Date().toISOString().split('T')[0],
    status: 'ACTIVE',
    gpa: 0.0
  };
  
  studentsData.push(newStudent);
  
  res.status(201).json({
    success: true,
    message: 'Estudiante creado exitosamente',
    data: {
      student: newStudent
    },
    timestamp: new Date().toISOString()
  });
});

// PUT /api/students/:id - Actualizar estudiante
router.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const studentIndex = studentsData.findIndex(s => s.id === parseInt(id));
  
  if (studentIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Estudiante no encontrado',
      timestamp: new Date().toISOString()
    });
  }
  
  studentsData[studentIndex] = {
    ...studentsData[studentIndex],
    ...req.body,
    id: parseInt(id) // Asegurar que el ID no cambie
  };
  
  res.json({
    success: true,
    message: 'Estudiante actualizado exitosamente',
    data: {
      student: studentsData[studentIndex]
    },
    timestamp: new Date().toISOString()
  });
});

// DELETE /api/students/:id - Eliminar estudiante
router.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const studentIndex = studentsData.findIndex(s => s.id === parseInt(id));
  
  if (studentIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Estudiante no encontrado',
      timestamp: new Date().toISOString()
    });
  }
  
  const deletedStudent = studentsData.splice(studentIndex, 1)[0];
  
  res.json({
    success: true,
    message: 'Estudiante eliminado exitosamente',
    data: {
      deletedStudent
    },
    timestamp: new Date().toISOString()
  });
});

// GET /api/students/:id/grades - Obtener calificaciones de un estudiante
router.get('/:id/grades', (req: Request, res: Response) => {
  const { id } = req.params;
  const student = studentsData.find(s => s.id === parseInt(id));
  
  if (!student) {
    return res.status(404).json({
      success: false,
      message: 'Estudiante no encontrado',
      timestamp: new Date().toISOString()
    });
  }
  
  res.json({
    success: true,
    message: 'Calificaciones del estudiante',
    data: {
      student: {
        id: student.id,
        name: `${student.firstName} ${student.lastName}`,
        code: student.studentCode
      },
      grades: [
        {
          subject: 'Matemáticas',
          grades: [
            { type: 'Examen', score: 85, date: '2024-05-15', weight: 0.4 },
            { type: 'Tarea', score: 90, date: '2024-05-10', weight: 0.3 },
            { type: 'Participación', score: 88, date: '2024-05-20', weight: 0.3 }
          ],
          average: 87.4
        },
        {
          subject: 'Física',
          grades: [
            { type: 'Laboratorio', score: 92, date: '2024-05-18', weight: 0.5 },
            { type: 'Examen', score: 88, date: '2024-05-25', weight: 0.5 }
          ],
          average: 90.0
        }
      ],
      overallGPA: student.gpa
    },
    timestamp: new Date().toISOString()
  });
});

export default router;