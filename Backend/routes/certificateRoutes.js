import express from 'express';
import {
   downloadCertificate,
   getAllCertificates,
   getMyCertificates,
   requestCertificate,
   reviewCertificate,
} from '../controllers/certificateController.js';
import { isAdmin, isStudent, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/request', protect, isStudent, requestCertificate);
router.get('/my', protect, isStudent, getMyCertificates);
router.get('/', protect, isAdmin, getAllCertificates);
router.patch('/:id/status', protect, isAdmin, reviewCertificate);
router.get('/:id/download', protect, downloadCertificate);

export default router;
