// src/app.ts - Configuración de Express
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from '@/config/environment';

// Crear instancia de Express
const app: Express = express();

// ==========================================
// MIDDLEWARES GLOBALES
// ==========================================

// Seguridad HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS - Permitir peticiones cross-origin
app.use(cors({
  origin: config.NODE_ENV === 'production' 
    ? ['https://tu-dominio.com'] // Cambia por tu dominio en producción
    : ['http://localhost:3000', 'http://localhost:5173'], // Puertos comunes de desarrollo
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting - Limitar peticiones por IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 peticiones por ventana de tiempo
  message: {
    error: 'Demasiadas peticiones desde esta IP, intenta de nuevo en 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Logging HTTP requests
if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Parser JSON
app.use(express.json({ limit: '10mb' }));

// Parser URL-encoded
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ==========================================
// RUTAS
// ==========================================

// Ruta de salud del servidor
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV
  });
});

// Ruta raíz con información de la API
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: '🎓 Sistema Educativo API',
    version: '1.0.0',
    status: 'Activo',
    endpoints: {
      health: '/health',
      api: '/api'
    },
    documentation: '/api/docs'
  });
});

// Rutas de la API
/* app.use('/api', (req: Request, res: Response) => {
  res.status(200).json({
    message: '📚 API del Sistema Educativo',
    version: '1.0.0',
    available_endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      students: '/api/students',
      teachers: '/api/teachers',
      courses: '/api/courses',
      grades: '/api/grades'
    },
    status: 'En desarrollo'
  });
}); */

// Importar rutas principales
import apiRoutes from '@/routes';

// Rutas de la API
app.use('/api', apiRoutes);

// ==========================================
// MANEJO DE ERRORES
// ==========================================

// Middleware para rutas no encontradas
app.use('', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
    timestamp: new Date().toISOString()
  });
});

// Middleware global de manejo de errores
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Error:', err);
  
  // Error de desarrollo vs producción
  const isDevelopment = config.NODE_ENV === 'development';
  
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    ...(isDevelopment && { 
      error: err.message,
      stack: err.stack 
    }),
    timestamp: new Date().toISOString()
  });
});

export default app;