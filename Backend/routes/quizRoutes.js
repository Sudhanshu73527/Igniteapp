import express from 'express';
import {
   createQuiz,
   getAllQuizzes,
   getQuizzesByCourse,
   updateQuiz,
   deleteQuiz,
   getStudentQuizzes,
   submitAttempt,
   getMyAttempts,
   getQuizResults,
} from '../controllers/quizController.js';
import { protect, isAdmin, isStudent } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin routes
router.post('/', protect, isAdmin, createQuiz);
router.get('/', protect, isAdmin, getAllQuizzes);
router.put('/:id', protect, isAdmin, updateQuiz);
router.delete('/:id', protect, isAdmin, deleteQuiz);
router.get('/:id/results', protect, isAdmin, getQuizResults);

// Shared route
router.get('/course/:courseId', protect, getQuizzesByCourse);

// Student routes
router.get('/student/:courseId', protect, isStudent, getStudentQuizzes);
router.post('/:id/attempt', protect, isStudent, submitAttempt);
router.get('/my-attempts', protect, isStudent, getMyAttempts);

export default router;
