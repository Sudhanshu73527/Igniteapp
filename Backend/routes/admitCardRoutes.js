import express from 'express';
import {
   createAdmitCard,
   getAdmitCards,
   getStudentAdmit,
   deleteAdmitCard,
   updateAdmitCard,
} from '../controllers/admitCardController.js';
import { protect, isAdmin, isStudent } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, isAdmin, createAdmitCard);
router.get('/', protect, isAdmin, getAdmitCards);
router.get('/student/:id', protect, getStudentAdmit);
router.put('/:id', protect, isAdmin, updateAdmitCard);
router.delete('/:id', protect, isAdmin, deleteAdmitCard);

export default router;
