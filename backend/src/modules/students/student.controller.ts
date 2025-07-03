import { Request, Response } from 'express';
import { studentService } from './student.service';
import { StudentFilter } from './student.types';

export const studentController = {
  getAllStudents: async (req: Request, res: Response) => {
    try {
      const filter: StudentFilter = req.query;
      const students = await studentService.getAllStudents(filter);
      res.json(students);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getStudentById: async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID debe ser un número' });
    }

    try {
      const student = await studentService.getStudentById(id);
      if (!student) {
        return res.status(404).json({ error: 'Estudiante no encontrado' });
      }
      res.json(student);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getStudentProfile: async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    try {
      const student = await studentService.getStudentByUserId(req.user.userId);
      if (!student) {
        return res.status(404).json({ error: 'Estudiante no encontrado' });
      }
      res.json(student);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getStudentGrades: async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID debe ser un número' });
    }

    try {
      const student = await studentService.getStudentGrades(id);
      if (!student) {
        return res.status(404).json({ error: 'Estudiante no encontrado' });
      }
      res.json(student);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createStudent: async (req: Request, res: Response) => {
    try {
      const newStudent = await studentService.createStudent(req.body);
      res.status(201).json(newStudent);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  updateStudent: async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID debe ser un número' });
    }

    try {
      const updatedStudent = await studentService.updateStudent(id, req.body);
      res.json(updatedStudent);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  deleteStudent: async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID debe ser un número' });
    }

    try {
      await studentService.deleteStudent(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};