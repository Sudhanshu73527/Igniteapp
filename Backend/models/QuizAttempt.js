import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
   questionIndex: {
      type: Number,
      required: true,
   },
   selectedAnswer: {
      type: Number,
      required: true,
   },
});

const quizAttemptSchema = new mongoose.Schema(
   {
      quiz: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Quiz',
         required: true,
      },
      user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true,
      },
      answers: {
         type: [answerSchema],
         required: true,
      },
      score: {
         type: Number,
         required: true,
         min: 0,
         max: 100,
      },
      totalCorrect: {
         type: Number,
         required: true,
         min: 0,
      },
      totalQuestions: {
         type: Number,
         required: true,
         min: 0,
      },
      passed: {
         type: Boolean,
         default: false,
      },
      completedAt: {
         type: Date,
         default: Date.now,
      },
   },
   { timestamps: true },
);

quizAttemptSchema.index({ quiz: 1, user: 1 });

export default mongoose.model('QuizAttempt', quizAttemptSchema);
