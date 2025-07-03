// src/routes/auth.routes.ts - Rutas de autenticación
import { Router } from 'express';
import { authController } from '@/modules/auth/auth.controller';
import { authenticate } from '@/modules/auth/auth.middleware';
import { loginSchema, validate, refreshTokenSchema } from '@/utils/validation';

// Crear router de autenticación
const router = Router();
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', validate(refreshTokenSchema), authController.refreshToken);
router.post('/logout', validate(refreshTokenSchema), authController.logout);
router.get('/profile', authenticate, authController.getProfile);



export default router;



// ==========================================
// INFORMACIÓN DEL MÓDULO AUTH
// ==========================================

// GET /api/auth - Información del módulo de autenticación
/* router.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    module: 'Autenticación',
    description: 'Gestión de autenticación y autorización de usuarios',
    version: '1.0.0',
    endpoints: {
      'POST /login': 'Iniciar sesión',
      'POST /register': 'Registrar nuevo usuario',
      'POST /logout': 'Cerrar sesión',
      'GET /me': 'Obtener información del usuario actual',
      'POST /refresh': 'Renovar token de acceso',
      'POST /forgot-password': 'Solicitar recuperación de contraseña',
      'POST /reset-password': 'Restablecer contraseña'
    },
    status: 'En desarrollo - Endpoints simulados',
    timestamp: new Date().toISOString()
  });
}); */