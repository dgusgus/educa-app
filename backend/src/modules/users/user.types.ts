export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';
  createdAt: Date;
  updatedAt: Date;
}

export type CreateUserDTO = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateUserDTO = Partial<CreateUserDTO>;

// Para autenticación
export interface AuthPayload {
  userId: number;
  email: string;
  role: string;
}
