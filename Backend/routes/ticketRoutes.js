import express from 'express';
import {
   createTicket,
   getMyTickets,
   getAllTickets,
   updateTicketStatus,
   replyToTicket,
   getAdminNotifications,
} from '../controllers/ticketController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createTicket);
router.get('/my', protect, getMyTickets);
router.get('/', protect, isAdmin, getAllTickets);
router.get('/notifications', protect, isAdmin, getAdminNotifications);
router.patch('/:id/status', protect, isAdmin, updateTicketStatus);
router.post('/:id/reply', protect, isAdmin, replyToTicket);

export default router;
