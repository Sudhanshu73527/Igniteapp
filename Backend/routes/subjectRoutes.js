import express from 'express';
import {
   addSubject,
   getSubjects,
   updateSubject,
   deleteSubject,
} from '../controllers/subjectController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/add', protect, isAdmin, addSubject);
router.get('/', protect, isAdmin, getSubjects);
router.put('/:id', protect, isAdmin, updateSubject);
router.delete('/:id', protect, isAdmin, deleteSubject);

export default router;
