import jwt from 'jsonwebtoken';
import {
  AuthTokenPayload,
  LoginDTO,
  AuthResponse,
  RefreshTokenPayload,
  RefreshTokenDTO
} from './auth.types';
import { userService } from '../users/user.service';
import { config } from '@/config/environment';
import { refreshTokenRepository } from './refresh-token.repository';
import { User, RefreshToken } from '@prisma/client';

export class AuthService {
  private readonly JWT_SECRET = config.JWT_SECRET;
  private readonly ACCESS_TOKEN_EXPIRES_IN = '15m'; // 15 minutos
  private readonly REFRESH_TOKEN_EXPIRES_IN = '7d'; // 7 días

  async login(loginData: LoginDTO): Promise<AuthResponse> {
    const user = await userService.validateUser(loginData.email, loginData.password);
    
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    // Generar access token
    const accessToken = this.generateAccessToken(user);
    
    // Generar y guardar refresh token
    const refreshToken = await this.generateRefreshToken(user.id);

    // Eliminamos la contraseña antes de devolver el usuario
    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken: refreshToken.token
    };
  }

  async refreshToken(refreshTokenData: RefreshTokenDTO): Promise<AuthResponse> {
    const { refreshToken } = refreshTokenData;
    
    // Verificar el refresh token en la base de datos
    const storedToken = await refreshTokenRepository.findByToken(refreshToken);
    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new Error('Refresh token inválido o expirado');
    }

    // Generar nuevo access token
    const accessToken = this.generateAccessToken(storedToken.user);

    // Opcional: Rotar el refresh token (eliminar el viejo y crear uno nuevo)
    const newRefreshToken = await this.rotateRefreshToken(storedToken);

    return {
      user: {
        id: storedToken.user.id,
        email: storedToken.user.email,
        name: storedToken.user.name,
        role: storedToken.user.role,
        createdAt: storedToken.user.createdAt,
        updatedAt: storedToken.user.updatedAt
      },
      accessToken,
      refreshToken: newRefreshToken.token
    };
  }

  async logout(refreshTokenData: RefreshTokenDTO): Promise<void> {
    const { refreshToken } = refreshTokenData;
    const storedToken = await refreshTokenRepository.findByToken(refreshToken);
    
    if (storedToken) {
      await refreshTokenRepository.delete(storedToken.id);
    }
  }

  private generateAccessToken(user: User): string {
    const payload: AuthTokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    return jwt.sign(payload, this.JWT_SECRET, { 
      expiresIn: this.ACCESS_TOKEN_EXPIRES_IN 
    });
  }

  private async generateRefreshToken(userId: number): Promise<{ token: string; id: number }> {
    // Limpiar tokens expirados
    await refreshTokenRepository.deleteExpired();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 días de expiración

    const token = jwt.sign(
      { userId },
      this.JWT_SECRET + '_REFRESH', // Usamos un secreto diferente
      { expiresIn: this.REFRESH_TOKEN_EXPIRES_IN }
    );

    const storedToken = await refreshTokenRepository.create(token, userId, expiresAt);

    return {
      token,
      id: storedToken.id
    };
  }

  private async rotateRefreshToken(oldToken: RefreshToken): Promise<{ token: string; id: number }> {
    // Eliminar el token viejo
    await refreshTokenRepository.delete(oldToken.id);
    
    // Crear uno nuevo
    return this.generateRefreshToken(oldToken.userId);
  }

  verifyAccessToken(token: string): AuthTokenPayload {
    return jwt.verify(token, this.JWT_SECRET) as AuthTokenPayload;
  }

  verifyRefreshToken(token: string): RefreshTokenPayload {
    return jwt.verify(token, this.JWT_SECRET + '_REFRESH') as RefreshTokenPayload;
  }
}

export const authService = new AuthService();