import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
   {
      firstName: {
         type: String,
         required: true,
      },
      lastName: {
         type: String,
         required: true,
      },
      email: {
         type: String,
         required: true,
         unique: true,
      },
      password: {
         type: String,
         required: true,
      },
      age: {
         type: Number,
         required: true,
      },
      role: {
         type: String,
         enum: ['admin', 'student'],
         default: 'student',
      },
      enrolledCourses: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
         },
      ],
      resetPasswordToken: {
         type: String,
         default: null,
      },
      resetPasswordExpires: {
         type: Date,
         default: null,
      },
   },
   { timestamps: true },
);

export default mongoose.model('User', userSchema);
