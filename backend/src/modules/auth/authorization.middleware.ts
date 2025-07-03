import { Request, Response, NextFunction } from 'express';
import { AuthTokenPayload } from './auth.types';

type Role = AuthTokenPayload['role'];

export const authorize = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    next();
  };
};