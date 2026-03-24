import User from '../models/User.js';

export const getAllUsers = async (req, res) => {
   try {
      const users = await User.find().select(
         '-password -resetPasswordToken -resetPasswordExpires',
      );

      return res.json({
         success: true,
         message: 'Users fetched successfully',
         data: {
            count: users.length,
            users,
         },
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Error fetching users',
         data: {},
      });
   }
};
