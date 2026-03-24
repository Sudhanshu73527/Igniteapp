import mongoose from 'mongoose';

const admitCardSchema = new mongoose.Schema(
   {
      student: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true,
         unique: true,
      },
      examName: {
         type: String,
         default: '',
      },
      examDate: {
         type: String,
         default: '',
      },
      pdfUrl: {
         type: String,
         required: true,
      },
   },
   { timestamps: true },
);

export default mongoose.model('AdmitCard', admitCardSchema);
