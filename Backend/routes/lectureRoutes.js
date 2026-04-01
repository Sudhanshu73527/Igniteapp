import express from 'express';
import {
   addLecturesBulk,
   getLecturesByCourse,
   markLectureWatched,
   getProgress,
} from '../controllers/lectureController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/bulk', protect, isAdmin, addLecturesBulk);
router.get('/course/:courseId', protect, getLecturesByCourse);
router.post('/:lectureId/watch', protect, markLectureWatched);
router.get('/progress/:courseId', protect, getProgress);

export default router;
