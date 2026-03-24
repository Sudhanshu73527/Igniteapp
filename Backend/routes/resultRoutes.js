import express from 'express';
import {
   addResult,
   getMyResults,
   getAllResults,
   getResultById,
   updateResult,
   verifyResult,
   deleteResult,
} from '../controllers/resultController.js';
import { protect, isAdmin, isStudent } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/my', protect, isStudent, getMyResults);
router.get('/', protect, isAdmin, getAllResults);
router.get('/:id', protect, getResultById);
router.post('/', protect, isAdmin, addResult);
router.put('/:id', protect, isAdmin, updateResult);
router.patch('/:id/verify', protect, isAdmin, verifyResult);
router.delete('/:id', protect, isAdmin, deleteResult);

export default router;
