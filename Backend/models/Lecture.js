import mongoose from 'mongoose';

const lectureSchema = new mongoose.Schema(
   {
      course: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Course',
         required: true,
         index: true,
      },
      title: {
         type: String,
         required: true,
         trim: true,
      },
      description: {
         type: String,
         default: '',
         trim: true,
      },
      videoUrl: {
         type: String,
         required: true,
      },
      order: {
         type: Number,
         required: true,
         min: 1,
      },
      duration: {
         type: String,
         default: '',
      },
      isPreview: {
         type: Boolean,
         default: false,
      },
   },
   { timestamps: true },
);

lectureSchema.index({ course: 1, order: 1 }, { unique: true });

export default mongoose.model('Lecture', lectureSchema);
