import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema(
   {
      student: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true,
      },
      course: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Course',
         required: true,
      },
      marks: {
         type: Number,
         required: true,
         min: 0,
         max: 100,
      },
      grade: {
         type: String,
         required: true,
      },
      remarks: {
         type: String,
         default: '',
      },
      pdfUrl: {
         type: String,
         default: '',
      },
      isVerified: {
         type: Boolean,
         default: false,
      },
      verifiedBy: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         default: null,
      },
      verifiedAt: {
         type: Date,
         default: null,
      },
   },
   { timestamps: true },
);

export default mongoose.model('Result', resultSchema);
