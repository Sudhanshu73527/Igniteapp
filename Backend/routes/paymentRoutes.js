import express from 'express';
import {
   createRazorpayOrder,
   getMyPurchases,
   verifyRazorpayPayment,
} from '../controllers/paymentController.js';
import { isStudent, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-order', protect, isStudent, createRazorpayOrder);
router.post('/verify', protect, isStudent, verifyRazorpayPayment);
router.get('/my', protect, isStudent, getMyPurchases);

export default router;
