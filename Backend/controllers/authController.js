import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Student from '../models/Student.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';
const JWT_EXPIRES = '7d';
const RESET_TOKEN_EXPIRES_MIN = 15;

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
         role: role === 'admin' ? 'admin' : 'student',
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
      if (!user) {
         return res.status(404).json({
            success: false,
            message: 'User not found',
            data: {},
         });
      }

      const resetToken = jwt.sign(
         { id: user._id, purpose: 'reset' },
         JWT_SECRET,
         { expiresIn: `${RESET_TOKEN_EXPIRES_MIN}m` },
      );

      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = new Date(
         Date.now() + RESET_TOKEN_EXPIRES_MIN * 60 * 1000,
      );
      await user.save();

      return res.json({
         success: true,
         message: 'Password reset token generated',
         data: {
            resetToken,
         },
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

      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded.purpose !== 'reset') {
         return res.status(400).json({
            success: false,
            message: 'Invalid reset token',
            data: {},
         });
      }

      const user = await User.findById(decoded.id);
      if (!user) {
         return res.status(404).json({
            success: false,
            message: 'User not found',
            data: {},
         });
      }

      if (
         user.resetPasswordToken !== token ||
         !user.resetPasswordExpires ||
         user.resetPasswordExpires.getTime() < Date.now()
      ) {
         return res.status(400).json({
            success: false,
            message: 'Reset token expired or invalid',
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
         message: 'Invalid or expired token',
         data: {},
      });
   }
};
