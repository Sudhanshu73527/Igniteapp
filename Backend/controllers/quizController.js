import Quiz from '../models/Quiz.js';
import QuizAttempt from '../models/QuizAttempt.js';

// ── Admin: Create a quiz ────────────────────────────────────────────
export const createQuiz = async (req, res) => {
   try {
      const { title, courseId, questions, timeLimit, passingScore } = req.body;

      if (!title || !courseId || !questions || !questions.length) {
         return res.status(400).json({
            success: false,
            message: 'title, courseId, and at least one question are required',
            data: {},
         });
      }

      for (let i = 0; i < questions.length; i++) {
         const q = questions[i];
         if (!q.question || !q.options || q.options.length < 2) {
            return res.status(400).json({
               success: false,
               message: `Question ${i + 1} must have text and at least 2 options`,
               data: {},
            });
         }
         if (
            q.correctAnswer === undefined ||
            q.correctAnswer < 0 ||
            q.correctAnswer >= q.options.length
         ) {
            return res.status(400).json({
               success: false,
               message: `Question ${i + 1} has an invalid correct answer index`,
               data: {},
            });
         }
      }

      const quiz = await Quiz.create({
         title,
         course: courseId,
         questions,
         timeLimit: Number(timeLimit || 0),
         passingScore: Number(passingScore || 60),
      });

      const populated = await Quiz.findById(quiz._id).populate(
         'course',
         'title',
      );

      return res.status(201).json({
         success: true,
         message: 'Quiz created successfully',
         data: { quiz: populated },
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Error creating quiz',
         data: {},
      });
   }
};

// ── Admin: Get all quizzes ──────────────────────────────────────────
export const getAllQuizzes = async (_req, res) => {
   try {
      const quizzes = await Quiz.find()
         .populate('course', 'title')
         .sort({ createdAt: -1 });

      const quizIds = quizzes.map((q) => q._id);
      const attemptCounts = await QuizAttempt.aggregate([
         { $match: { quiz: { $in: quizIds } } },
         { $group: { _id: '$quiz', count: { $sum: 1 } } },
      ]);
      const countMap = Object.fromEntries(
         attemptCounts.map((a) => [a._id.toString(), a.count]),
      );

      const enriched = quizzes.map((quiz) => ({
         ...quiz.toObject(),
         attemptCount: countMap[quiz._id.toString()] || 0,
      }));

      return res.json({
         success: true,
         message: 'Quizzes fetched successfully',
         data: { quizzes: enriched },
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Error fetching quizzes',
         data: {},
      });
   }
};

// ── Get quizzes by course ───────────────────────────────────────────
export const getQuizzesByCourse = async (req, res) => {
   try {
      const { courseId } = req.params;
      const quizzes = await Quiz.find({ course: courseId, isActive: true })
         .populate('course', 'title')
         .sort({ createdAt: -1 });

      return res.json({
         success: true,
         message: 'Quizzes fetched successfully',
         data: { quizzes },
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Error fetching quizzes',
         data: {},
      });
   }
};

// ── Admin: Update a quiz ────────────────────────────────────────────
export const updateQuiz = async (req, res) => {
   try {
      const { id } = req.params;
      const { title, courseId, questions, timeLimit, passingScore, isActive } =
         req.body;

      const updatePayload = {};
      if (title !== undefined) updatePayload.title = title;
      if (courseId !== undefined) updatePayload.course = courseId;
      if (timeLimit !== undefined) updatePayload.timeLimit = Number(timeLimit);
      if (passingScore !== undefined)
         updatePayload.passingScore = Number(passingScore);
      if (isActive !== undefined) updatePayload.isActive = Boolean(isActive);

      if (questions !== undefined) {
         if (!Array.isArray(questions) || questions.length < 1) {
            return res.status(400).json({
               success: false,
               message: 'At least one question is required',
               data: {},
            });
         }
         updatePayload.questions = questions;
      }

      const updated = await Quiz.findByIdAndUpdate(id, updatePayload, {
         returnDocument: 'after',
         runValidators: true,
      }).populate('course', 'title');

      if (!updated) {
         return res.status(404).json({
            success: false,
            message: 'Quiz not found',
            data: {},
         });
      }

      return res.json({
         success: true,
         message: 'Quiz updated successfully',
         data: { quiz: updated },
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Error updating quiz',
         data: {},
      });
   }
};

// ── Admin: Delete a quiz ────────────────────────────────────────────
export const deleteQuiz = async (req, res) => {
   try {
      const { id } = req.params;

      const deleted = await Quiz.findByIdAndDelete(id);
      if (!deleted) {
         return res.status(404).json({
            success: false,
            message: 'Quiz not found',
            data: {},
         });
      }

      await QuizAttempt.deleteMany({ quiz: id });

      return res.json({
         success: true,
         message: 'Quiz deleted successfully',
         data: {},
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Error deleting quiz',
         data: {},
      });
   }
};

// ── Student: Get quizzes for a course (hides correct answers) ───────
export const getStudentQuizzes = async (req, res) => {
   try {
      const { courseId } = req.params;
      const userId = req.user._id;

      const quizzes = await Quiz.find({ course: courseId, isActive: true })
         .populate('course', 'title')
         .sort({ createdAt: -1 });

      const quizIds = quizzes.map((q) => q._id);
      const myAttempts = await QuizAttempt.find({
         quiz: { $in: quizIds },
         user: userId,
      }).sort({ score: -1 });

      const attemptMap = {};
      for (const attempt of myAttempts) {
         const qid = attempt.quiz.toString();
         if (!attemptMap[qid]) {
            attemptMap[qid] = {
               attemptCount: 0,
               bestScore: 0,
               lastAttempt: null,
            };
         }
         attemptMap[qid].attemptCount++;
         if (attempt.score > attemptMap[qid].bestScore) {
            attemptMap[qid].bestScore = attempt.score;
         }
         if (
            !attemptMap[qid].lastAttempt ||
            attempt.createdAt > attemptMap[qid].lastAttempt
         ) {
            attemptMap[qid].lastAttempt = attempt.createdAt;
         }
      }

      const sanitized = quizzes.map((quiz) => {
         const qObj = quiz.toObject();
         qObj.questions = qObj.questions.map((q) => ({
            question: q.question,
            options: q.options,
            _id: q._id,
         }));
         const stats = attemptMap[quiz._id.toString()];
         qObj.myAttemptCount = stats?.attemptCount || 0;
         qObj.myBestScore = stats?.bestScore || 0;
         qObj.myLastAttempt = stats?.lastAttempt || null;
         return qObj;
      });

      return res.json({
         success: true,
         message: 'Student quizzes fetched successfully',
         data: { quizzes: sanitized },
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Error fetching student quizzes',
         data: {},
      });
   }
};

// ── Student: Submit a quiz attempt ──────────────────────────────────
export const submitAttempt = async (req, res) => {
   try {
      const { id } = req.params;
      const { answers } = req.body;
      const userId = req.user._id;

      if (!answers || !Array.isArray(answers)) {
         return res.status(400).json({
            success: false,
            message: 'answers array is required',
            data: {},
         });
      }

      const quiz = await Quiz.findById(id);
      if (!quiz) {
         return res.status(404).json({
            success: false,
            message: 'Quiz not found',
            data: {},
         });
      }

      if (!quiz.isActive) {
         return res.status(400).json({
            success: false,
            message: 'This quiz is no longer active',
            data: {},
         });
      }

      let totalCorrect = 0;
      const totalQuestions = quiz.questions.length;

      const processedAnswers = answers.map((answer) => {
         const qi = Number(answer.questionIndex);
         const sa = Number(answer.selectedAnswer);
         const question = quiz.questions[qi];
         if (question && question.correctAnswer === sa) {
            totalCorrect++;
         }
         return { questionIndex: qi, selectedAnswer: sa };
      });

      const score =
         totalQuestions > 0
            ? Math.round((totalCorrect / totalQuestions) * 100)
            : 0;
      const passed = score >= quiz.passingScore;

      const attempt = await QuizAttempt.create({
         quiz: quiz._id,
         user: userId,
         answers: processedAnswers,
         score,
         totalCorrect,
         totalQuestions,
         passed,
         completedAt: new Date(),
      });

      const correctAnswers = quiz.questions.map((q, i) => ({
         questionIndex: i,
         correctAnswer: q.correctAnswer,
      }));

      return res.status(201).json({
         success: true,
         message: passed
            ? 'Congratulations! You passed the quiz!'
            : 'Quiz submitted. Better luck next time!',
         data: {
            attempt: {
               _id: attempt._id,
               score,
               totalCorrect,
               totalQuestions,
               passed,
               completedAt: attempt.completedAt,
            },
            correctAnswers,
         },
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Error submitting quiz attempt',
         data: {},
      });
   }
};

// ── Student: Get my attempts ────────────────────────────────────────
export const getMyAttempts = async (req, res) => {
   try {
      const userId = req.user._id;

      const attempts = await QuizAttempt.find({ user: userId })
         .populate({
            path: 'quiz',
            select: 'title course questions passingScore',
            populate: { path: 'course', select: 'title' },
         })
         .sort({ createdAt: -1 });

      return res.json({
         success: true,
         message: 'Attempts fetched successfully',
         data: { attempts },
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Error fetching attempts',
         data: {},
      });
   }
};

// ── Admin: Get all attempts for a quiz ──────────────────────────────
export const getQuizResults = async (req, res) => {
   try {
      const { id } = req.params;

      const attempts = await QuizAttempt.find({ quiz: id })
         .populate('user', 'firstName lastName email')
         .sort({ createdAt: -1 });

      return res.json({
         success: true,
         message: 'Quiz results fetched successfully',
         data: { attempts },
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Error fetching quiz results',
         data: {},
      });
   }
};
