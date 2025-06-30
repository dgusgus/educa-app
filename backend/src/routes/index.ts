// src/routes/index.ts - Router principal que organiza todas las rutas
import { Router } from 'express';

// Importar routers específicos
import authRoutes from './auth.routes';
/* import studentRoutes from './students.routes';
import teacherRoutes from './teachers.routes';
import courseRoutes from './courses.routes';
import gradeRoutes from './grades.routes'; */
import userRoutes from './users.routes';

// Crear router principal
const router = Router();

// ==========================================
// RUTAS DE LA API
// ==========================================

// Ruta de bienvenida de la API
router.get('/', (req, res) => {
  res.json({
    message: '🎓 Bienvenido al Sistema Educativo API',
    version: '1.0.0',
    status: 'Activo',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: {
        description: 'Autenticación y autorización',
        routes: [
          'POST /api/auth/login',
          'POST /api/auth/register', 
          'POST /api/auth/logout',
          'GET /api/auth/profile'
        ]
      },
      users: {
        description: 'Gestión de usuarios del sistema',
        routes: [
          'GET /api/users',
          'GET /api/users/:id',
          'PUT /api/users/:id',
          'DELETE /api/users/:id'
        ]
      },
      students: {
        description: 'Gestión de estudiantes',
        routes: [
          'GET /api/students',
          'GET /api/students/:id',
          'POST /api/students',
          'PUT /api/students/:id',
          'DELETE /api/students/:id'
        ]
      },
      teachers: {
        description: 'Gestión de profesores',
        routes: [
          'GET /api/teachers',
          'GET /api/teachers/:id', 
          'POST /api/teachers',
          'PUT /api/teachers/:id',
          'DELETE /api/teachers/:id'
        ]
      },
      courses: {
        description: 'Gestión de cursos y materias',
        routes: [
          'GET /api/courses',
          'GET /api/courses/:id',
          'POST /api/courses',
          'PUT /api/courses/:id',
          'DELETE /api/courses/:id'
        ]
      },
      grades: {
        description: 'Gestión de calificaciones',
        routes: [
          'GET /api/grades',
          'GET /api/grades/student/:studentId',
          'POST /api/grades',
          'PUT /api/grades/:id',
          'DELETE /api/grades/:id'
        ]
      }
    },
    documentation: {
      message: 'Documentación disponible en cada endpoint',
      example: 'GET /api/students para ver estudiantes de ejemplo'
    }
  });
});

// ==========================================
// REGISTRAR RUTAS ESPECÍFICAS
// ==========================================

// Autenticación
router.use('/auth', authRoutes);

// Gestión de usuarios
router.use('/users', userRoutes);

// Gestión de estudiantes
//router.use('/students', studentRoutes);

// Gestión de profesores
//router.use('/teachers', teacherRoutes);

// Gestión de cursos
//router.use('/courses', courseRoutes);

// Gestión de calificaciones
//router.use('/grades', gradeRoutes);


// ==========================================
// MANEJO DE RUTAS NO ENCONTRADAS

// Middleware para rutas no encontradas dentro de /api
router.use('', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint no encontrado: ${req.method} ${req.originalUrl}`,
    suggestion: 'Verifica la documentación en /api para ver endpoints disponibles',
    available_modules: ['/api/auth', '/api/users'],
    timestamp: new Date().toISOString()
  });
});
export default router;