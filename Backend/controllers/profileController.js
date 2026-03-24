import Student from '../models/Student.js';
import User from '../models/User.js';

export const getMyProfile = async (req, res) => {
   try {
      const user = await User.findById(req.user._id).select(
         '-password -resetPasswordToken -resetPasswordExpires',
      );
      const student = await Student.findOne({ user: req.user._id });

      return res.json({
         success: true,
         message: 'Profile fetched successfully',
         data: {
            user,
            student,
         },
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Error fetching profile',
         data: {},
      });
   }
};

export const updateMyProfile = async (req, res) => {
   try {
      const { firstName, lastName, age, email, ...studentFields } = req.body;

      const user = await User.findById(req.user._id);
      if (!user) {
         return res.status(404).json({
            success: false,
            message: 'User not found',
            data: {},
         });
      }

      if (email && email.toLowerCase() !== user.email) {
         const existing = await User.findOne({
            email: String(email).trim().toLowerCase(),
            _id: { $ne: user._id },
         });
         if (existing) {
            return res.status(400).json({
               success: false,
               message: 'Email already exists',
               data: {},
            });
         }
         user.email = String(email).trim().toLowerCase();
      }

      if (firstName !== undefined) user.firstName = firstName;
      if (lastName !== undefined) user.lastName = lastName;
      if (age !== undefined) user.age = age;
      await user.save();

      let student = await Student.findOne({ user: user._id });
      if (!student && user.role === 'student') {
         student = await Student.create({ user: user._id, email: user.email });
      }

      if (student) {
         Object.entries(studentFields).forEach(([key, value]) => {
            student[key] = value;
         });
         student.email = user.email;
         student.firstName = user.firstName;
         student.lastName = user.lastName;
         await student.save();
      }

      return res.json({
         success: true,
         message: 'Profile updated successfully',
         data: {
            user: user.toObject({ getters: true }),
            student,
         },
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Error updating profile',
         data: {},
      });
   }
};
