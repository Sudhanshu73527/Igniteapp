import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema(
   {
      user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true,
         index: true,
      },
      course: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Course',
         required: true,
         index: true,
      },
      status: {
         type: String,
         enum: ['pending', 'approved', 'rejected'],
         default: 'pending',
      },
      certificateUrl: {
         type: String,
         default: '',
      },
      note: {
         type: String,
         default: '',
      },
      approvedBy: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         default: null,
      },
      approvedAt: {
         type: Date,
         default: null,
      },
      rejectedAt: {
         type: Date,
         default: null,
      },
   },
   { timestamps: true },
);

certificateSchema.index({ user: 1, course: 1 }, { unique: true });

export default mongoose.model('Certificate', certificateSchema);
