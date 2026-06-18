import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
   question: {
      type: String,
      required: true,
   },
   options: {
      type: [String],
      required: true,
      validate: {
         validator: (v) => v.length >= 2 && v.length <= 6,
         message: 'A question must have between 2 and 6 options',
      },
   },
   correctAnswer: {
      type: Number,
      required: true,
      min: 0,
   },
});

const quizSchema = new mongoose.Schema(
   {
      title: {
         type: String,
         required: true,
      },
      course: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Course',
         required: true,
      },
      questions: {
         type: [questionSchema],
         required: true,
         validate: {
            validator: (v) => v.length >= 1,
            message: 'A quiz must have at least one question',
         },
      },
      timeLimit: {
         type: Number,
         default: 0,
         min: 0,
      },
      passingScore: {
         type: Number,
         default: 60,
         min: 0,
         max: 100,
      },
      isActive: {
         type: Boolean,
         default: true,
      },
   },
   { timestamps: true },
);

export default mongoose.model('Quiz', quizSchema);
