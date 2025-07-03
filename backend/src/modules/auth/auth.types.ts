import { User } from '../users/user.types';

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthTokenPayload {
  userId: number;
  email: string;
  role: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenPayload {
  tokenId: number;
  userId: number;
}

export interface RefreshTokenDTO {
  refreshToken: string;
}