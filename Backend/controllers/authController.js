import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Student from '../models/Student.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = '7d';
const RESET_TOKEN_EXPIRES_MIN = 15;

if (!JWT_SECRET) {
   throw new Error('JWT_SECRET must be set in environment variables');
}

const sanitizeUser = (user) => ({
   _id: user._id,
   firstName: user.firstName,
   lastName: user.lastName,
   email: user.email,
   age: user.age,
   role: user.role,
   createdAt: user.createdAt,
   updatedAt: user.updatedAt,
});

const makeAuthToken = (user) =>
   jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES,
   });

const hashResetToken = (token) =>
   crypto.createHash('sha256').update(String(token)).digest('hex');

const createResetCode = () => `${Math.floor(100000 + Math.random() * 900000)}`;

export const signup = async (req, res) => {
   try {
      const { firstName, lastName, email, password, age, role } = req.body;

      if (!firstName || !lastName || !email || !password || age === undefined) {
         return res.status(400).json({
            success: false,
            message:
               'firstName, lastName, email, password and age are required',
            data: {},
         });
      }

      const normalizedEmail = String(email).trim().toLowerCase();
      const requestedRole = String(role || 'student').toLowerCase();

      if (requestedRole === 'admin') {
         const adminCreationKey = process.env.ADMIN_CREATION_KEY;
         const headerKey = String(req.headers['x-admin-creation-key'] || '');
         const internalAllowed =
            adminCreationKey && headerKey && adminCreationKey === headerKey;

         if (!internalAllowed) {
            return res.status(403).json({
               success: false,
               message: 'Public admin account creation is not allowed',
               data: {},
            });
         }
      }

      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
         return res.status(400).json({
            success: false,
            message: 'User already exists',
            data: {},
         });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
         firstName,
         lastName,
         email: normalizedEmail,
         password: hashedPassword,
         age,
         role: requestedRole === 'admin' ? 'admin' : 'student',
      });

      if (user.role === 'student') {
         await Student.create({
            user: user._id,
            email: normalizedEmail,
            firstName,
            lastName,
            studentId: `IGN-${Date.now().toString().slice(-6)}-${Math.floor(
               100 + Math.random() * 900,
            )}`,
         });
      }

      return res.status(201).json({
         success: true,
         message: 'Signup successful',
         data: {
            user: sanitizeUser(user),
         },
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Error during signup',
         data: {},
      });
   }
};

export const login = async (req, res) => {
   try {
      const { email, password } = req.body;

      if (!email || !password) {
         return res.status(400).json({
            success: false,
            message: 'email and password are required',
            data: {},
         });
      }

      const normalizedEmail = String(email).trim().toLowerCase();
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
         return res.status(400).json({
            success: false,
            message: 'Invalid credentials',
            data: {},
         });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
         return res.status(400).json({
            success: false,
            message: 'Invalid credentials',
            data: {},
         });
      }

      const token = makeAuthToken(user);

      return res.json({
         success: true,
         message: 'Login successful',
         data: {
            user: sanitizeUser(user),
            token,
         },
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Error during login',
         data: {},
      });
   }
};

export const me = async (req, res) => {
   return res.json({
      success: true,
      message: 'User fetched successfully',
      data: {
         user: req.user,
      },
   });
};

export const logout = async (req, res) => {
   return res.json({
      success: true,
      message: 'Logout successful',
      data: {},
   });
};

export const forgotPassword = async (req, res) => {
   try {
      const { email } = req.body;
      if (!email) {
         return res.status(400).json({
            success: false,
            message: 'email is required',
            data: {},
         });
      }

      const normalizedEmail = String(email).trim().toLowerCase();
      const user = await User.findOne({ email: normalizedEmail });

      if (user) {
         const resetCode = createResetCode();

         user.resetPasswordToken = hashResetToken(resetCode);
         user.resetPasswordExpires = new Date(
            Date.now() + RESET_TOKEN_EXPIRES_MIN * 60 * 1000,
         );
         await user.save();

         if (process.env.NODE_ENV !== 'production') {
            console.log(
               `[DEV] Password reset code for ${normalizedEmail}: ${resetCode}`,
            );
         }
      }

      return res.json({
         success: true,
         message:
            'If the account exists, a password reset code has been generated',
         data: {},
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Error generating reset token',
         data: {},
      });
   }
};

export const resetPassword = async (req, res) => {
   try {
      const { token } = req.params;
      const { password } = req.body;

      if (!token || !password) {
         return res.status(400).json({
            success: false,
            message: 'token and password are required',
            data: {},
         });
      }

      if (String(password).length < 6) {
         return res.status(400).json({
            success: false,
            message: 'Password must be at least 6 characters',
            data: {},
         });
      }

      const hashedToken = hashResetToken(token);
      const user = await User.findOne({
         resetPasswordToken: hashedToken,
         resetPasswordExpires: { $gt: new Date() },
      });
      if (!user) {
         return res.status(400).json({
            success: false,
            message: 'Reset code is invalid or expired',
            data: {},
         });
      }

      user.password = await bcrypt.hash(password, 10);
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();

      return res.json({
         success: true,
         message: 'Password reset successful',
         data: {},
      });
   } catch (error) {
      return res.status(400).json({
         success: false,
         message: 'Invalid or expired reset code',
         data: {},
      });
   }
};
