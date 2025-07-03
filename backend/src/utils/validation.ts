import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

//? Login schema
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
});

//? create user schema
export const createUserSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  role: z.enum(['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'])
});

//? refresh token schema
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token es requerido')
});

//? Create student schemas
export const createStudentSchema = z.object({
  userId: z.number().int().positive('ID de usuario inválido'),
  studentId: z.string().min(3, 'El código de estudiante debe tener al menos 3 caracteres'),
  grade: z.string().min(1, 'El grado es requerido'),
  section: z.string().min(1, 'La sección es requerida')
});

//? Update student schema
export const updateStudentSchema = z.object({
  studentId: z.string().min(3, 'El código de estudiante debe tener al menos 3 caracteres').optional(),
  grade: z.string().min(1, 'El grado es requerido').optional(),
  section: z.string().min(1, 'La sección es requerida').optional()
});

//? Validation middleware
export const validate = (schema: z.ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validación fallida',
        details: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }))
      });
    }
    next(error);
  }
};