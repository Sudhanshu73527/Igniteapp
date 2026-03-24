import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import examRoutes from './routes/examRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import noticeRoutes from './routes/noticeRoutes.js';
import admitRoutes from './routes/admitCardRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import resultRoutes from './routes/resultRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import { protect } from './middleware/authMiddleware.js';
import { me } from './controllers/authController.js';

dotenv.config();

// DB connect
connectDB();

const app = express();

const corsOptions = {
   origin: (origin, callback) => {
      // Allow native mobile requests (no origin) and browser/dev origins.
      if (!origin) return callback(null, true);

      const allowedOrigins = [
         'http://localhost:8081',
         'http://localhost:8083',
         'http://10.140.82.88:8081',
         'http://10.140.82.88:8083',
      ];

      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(null, true);
   },
   credentials: true,
   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
   allowedHeaders: ['Content-Type', 'Authorization'],
};

// middleware
app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/notice', noticeRoutes);
app.use('/api/admit', admitRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/tickets', ticketRoutes);
app.get('/api/me', protect, me);

// test route
app.get('/', (req, res) => {
   res.send('API Running');
});

// server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
   console.log(`Server running on port ${PORT} 🚀`);
});
