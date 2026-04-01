import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
   throw new Error('JWT_SECRET must be set in environment variables');
}

export const protect = async (req, res, next) => {
   try {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.startsWith('Bearer ')
         ? authHeader.split(' ')[1]
         : null;

      if (!token) {
         return res.status(401).json({
            success: false,
            message: 'Unauthorized',
            data: {},
         });
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
         return res.status(401).json({
            success: false,
            message: 'Invalid token user',
            data: {},
         });
      }

      req.user = user;
      next();
   } catch (error) {
      return res.status(401).json({
         success: false,
         message: 'Invalid or expired token',
         data: {},
      });
   }
};

export const isAdmin = (req, res, next) => {
   if (req.user?.role !== 'admin') {
      return res.status(403).json({
         success: false,
         message: 'Admin access required',
         data: {},
      });
   }
   next();
};

export const isStudent = (req, res, next) => {
   if (req.user?.role !== 'student') {
      return res.status(403).json({
         success: false,
         message: 'Student access required',
         data: {},
      });
   }
   next();
};
