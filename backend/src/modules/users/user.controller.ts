import { Request, Response } from 'express';
import { userService } from './user.service';
import { CreateUserDTO, UpdateUserDTO } from './user.types';

export const userController = {
  getAllUsers: async (req: Request, res: Response) => {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener usuarios' });
    }
  },

  getUserById: async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID debe ser un número' });
    }

    try {
      const user = await userService.getUserById(id);
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener usuario' });
    }
  },

  createUser: async (req: Request, res: Response) => {
    const userData: CreateUserDTO = req.body;

    try {
      const newUser = await userService.createUser(userData);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear usuario' });
    }
  },

  updateUser: async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID debe ser un número' });
    }

    const userData: UpdateUserDTO = req.body;

    try {
      const updatedUser = await userService.updateUser(id, userData);
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar usuario' });
    }
  },

  deleteUser: async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID debe ser un número' });
    }

    try {
      await userService.deleteUser(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar usuario' });
    }
  }
};