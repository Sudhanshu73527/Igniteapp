import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema(
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
      completedLectures: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lecture',
         },
      ],
      totalLectures: {
         type: Number,
         default: 0,
      },
      progressPercentage: {
         type: Number,
         default: 0,
         min: 0,
         max: 100,
      },
      lastWatchedLecture: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Lecture',
         default: null,
      },
      lastWatchedAt: {
         type: Date,
         default: null,
      },
   },
   { timestamps: true },
);

progressSchema.index({ user: 1, course: 1 }, { unique: true });

export default mongoose.model('Progress', progressSchema);
