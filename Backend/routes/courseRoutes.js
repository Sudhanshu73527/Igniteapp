import express from 'express';
import {
   addCourse,
   getCourses,
   getCourseById,
   getCourseDetail,
   enrollCourse,
   getMyCourses,
   updateCourse,
   deleteCourse,
} from '../controllers/courseController.js';
import { protect, isAdmin, isStudent } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/add', protect, isAdmin, addCourse);
router.get('/', getCourses);
router.post('/enroll', protect, isStudent, enrollCourse);
router.get('/my', protect, isStudent, getMyCourses);
router.get('/:id/detail', protect, getCourseDetail);
router.get('/:id', getCourseById);

// ✅ NEW
router.put('/:id', protect, isAdmin, updateCourse);
router.delete('/:id', protect, isAdmin, deleteCourse);

export default router;
