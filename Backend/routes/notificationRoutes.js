import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
   getMyNotifications,
   getUnreadNotificationCount,
   markAllNotificationsRead,
   markNotificationRead,
} from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', protect, getMyNotifications);
router.get('/unread-count', protect, getUnreadNotificationCount);
router.post('/read-all', protect, markAllNotificationsRead);
router.patch('/:id/read', protect, markNotificationRead);

export default router;
