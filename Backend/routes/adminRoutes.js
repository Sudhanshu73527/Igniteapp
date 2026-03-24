import express from 'express';
import { getAllUsers } from '../controllers/adminController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// 👥 Get All Users (Admin Panel)
router.get('/users', protect, isAdmin, getAllUsers);

export default router;
