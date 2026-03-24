import express from 'express';
import {
   createStudent,
   getStudents,
   deleteStudent,
   updateStudent,
   getSingleStudent,
} from '../controllers/studentController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// routes
router.post('/create', protect, isAdmin, createStudent);
router.post('/register', protect, isAdmin, createStudent);
router.get('/', protect, isAdmin, getStudents);
router.delete('/:id', protect, isAdmin, deleteStudent);
router.put('/:id', protect, isAdmin, updateStudent);
router.get('/:id', protect, isAdmin, getSingleStudent);

// ✅ VERY IMPORTANT
export default router;
