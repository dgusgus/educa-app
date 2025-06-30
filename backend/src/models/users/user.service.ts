import bcrypt from 'bcryptjs';
import { CreateUserDTO, UpdateUserDTO, User } from './user.types';
import { userRepository } from './user.repository';
import { config } from '@/config/environment';

export class UserService {
  private readonly SALT_ROUNDS = 10;

  async getAllUsers(): Promise<User[]> {
    return userRepository.findAll();
  }

  async getUserById(id: number): Promise<User | null> {
    return userRepository.findById(id);
  }

  async createUser(userData: CreateUserDTO): Promise<User> {
    // Encriptar contraseña antes de guardar
    const hashedPassword = await bcrypt.hash(userData.password, this.SALT_ROUNDS);
    return userRepository.create({
      ...userData,
      password: hashedPassword
    });
  }

  async updateUser(id: number, userData: UpdateUserDTO): Promise<User> {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, this.SALT_ROUNDS);
    }
    return userRepository.update(id, userData);
  }

  async deleteUser(id: number): Promise<void> {
    return userRepository.delete(id);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await userRepository.findByEmail(email);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }
}

export const userService = new UserService();