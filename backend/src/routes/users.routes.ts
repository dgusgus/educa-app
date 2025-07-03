// src/routes/users.routes.ts - Rutas de gestión de usuarios
import { Router, Request, Response } from 'express';
import{ userController } from '@/modules/users/user.controller'
import { authenticate } from '@/modules/auth/auth.middleware';
import { authorize } from '@/modules/auth/authorization.middleware';
import { createUserSchema, validate } from '@/utils/validation';

// Crear router de usuarios
const router = Router();

// RUTAS CRUD DE USUARIOS
// Solo ADMIN puede listar todos los usuarios
router.get('/',authenticate,authorize(['ADMIN']), userController.getAllUsers); // GET /api/users - Listar todos los usuarios
// Cualquier usuario autenticado puede ver su perfil
router.get('/:id', authenticate, userController.getUserById);

// Solo ADMIN puede crear usuarios
router.post('/', validate(createUserSchema),authenticate, authorize(['ADMIN']), userController.createUser);

// ADMIN puede actualizar cualquier usuario, otros solo pueden actualizarse a sí mismos
router.put('/:id', authenticate, async (req, res, next) => {
  if (req.user?.role === 'ADMIN') {
    return userController.updateUser(req, res, next);
  }
  
  // Verificar que el usuario está actualizando su propio perfil
  if (parseInt(req.params.id) !== req.user?.userId) {
    return res.status(403).json({ error: 'Solo puedes actualizar tu propio perfil' });
  }
  
  return userController.updateUser(req, res, next);
});

// Solo ADMIN puede eliminar usuarios
router.delete('/:id', authenticate, authorize(['ADMIN']), userController.deleteUser);

// INFORMACIÓN DEL MÓDULO USERS

// GET /api/users (ruta raíz ya definida arriba, esta es solo documentación)
router.get('/info', (req: Request, res: Response) => {
  res.status(200).json({
    module: 'Gestión de Usuarios',
    description: 'CRUD completo para usuarios del sistema educativo',
    version: '1.0.0',
    endpoints: {
      'GET /': 'Listar todos los usuarios con paginación y filtros',
      'GET /:id': 'Obtener usuario específico por ID',
      'POST /': 'Crear nuevo usuario',
      'PUT /:id': 'Actualizar usuario completo',
      'DELETE /:id': 'Eliminar usuario',
      'PATCH /:id/status': 'Cambiar estado del usuario',
      'GET /:id/profile': 'Obtener perfil completo del usuario'
    },
    roles_supported: ['admin', 'teacher', 'student'],
    status_options: ['active', 'inactive', 'suspended'],
    status: 'En desarrollo - Endpoints simulados',
    timestamp: new Date().toISOString()
  });
});

export default router;