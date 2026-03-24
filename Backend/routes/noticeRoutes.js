import express from 'express';
import {
   addNotice,
   getNotices,
   deleteNotice,
   getNoticeById,
   updateNotice,
} from '../controllers/noticeController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getNotices);
router.get('/:id', protect, getNoticeById);
router.post('/', protect, isAdmin, addNotice);
router.put('/:id', protect, isAdmin, updateNotice);
router.delete('/:id', protect, isAdmin, deleteNotice);

export default router;
