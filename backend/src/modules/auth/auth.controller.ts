import { Request, Response } from 'express';
import { authService } from './auth.service';
import { LoginDTO, RefreshTokenDTO } from './auth.types';
import { validate } from '@/utils/validation';
//import { refreshTokenSchema } from '@/utils/validation'

export const authController = {
  login: async (req: Request, res: Response) => {
    const loginData: LoginDTO = req.body;

    try {
      const authResponse = await authService.login(loginData);
      res.json(authResponse);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(401).json({ error: errorMessage });
    }
  },

  refreshToken: async (req: Request, res: Response) => {
    const refreshTokenData: RefreshTokenDTO = req.body;

    try {
      const authResponse = await authService.refreshToken(refreshTokenData);
      res.json(authResponse);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(401).json({ error: errorMessage });
    }
  },

  logout: async (req: Request, res: Response) => {
    const refreshTokenData: RefreshTokenDTO = req.body;

    try {
      await authService.logout(refreshTokenData);
      res.status(204).send();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(401).json({ error: errorMessage });
    }
  },

  getProfile: async (req: Request, res: Response) => {
    // El usuario está disponible en req.user gracias al middleware
    res.json(req.user);
  }
};