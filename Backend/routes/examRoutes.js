import express from 'express';
import {
   addExam,
   getExams,
   updateExam,
   deleteExam,
} from '../controllers/examController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/add', protect, isAdmin, addExam);
router.get('/', getExams);
router.put('/:id', protect, isAdmin, updateExam);
router.delete('/:id', protect, isAdmin, deleteExam);

export default router;
