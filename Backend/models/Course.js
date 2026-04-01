import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
   {
      title: {
         type: String,
         required: true,
      },
      description: {
         type: String,
         required: true,
      },
      imageUrl: {
         type: String,
         required: true,
         trim: true,
      },
      price: {
         type: Number,
         required: true,
      },
      duration: {
         type: String,
         required: true,
      },
      videoUrl: {
         type: String,
         default: '',
      },
      lectures: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lecture',
         },
      ],
   },
   { timestamps: true },
);

export default mongoose.model('Course', courseSchema);
