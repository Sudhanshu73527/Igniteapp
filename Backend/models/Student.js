import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
   {
      user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         unique: true,
      },

      studentId: {
         type: String,
         unique: true,
         sparse: true,
      },

      username: String,
      email: String,

      firstName: String,
      lastName: String,
      fatherName: String,

      aadharNumber: String,
      rollNumber: String,

      institutionName: String,
      institutionAddress: String,
      passingYear: String,

      phone: String,
      address: String,
      dob: String,

      degree: String,
      major: String,
      grade: String,

      course: {
         type: String,
         default: '',
      },
   },
   { timestamps: true },
);

export default mongoose.model('Student', studentSchema);
