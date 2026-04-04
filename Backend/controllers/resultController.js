import Result from '../models/Result.js';
import User from '../models/User.js';
import Course from '../models/Course.js';
import { createNotificationForUser } from '../utils/notificationService.js';

const resultPopulate = [
   { path: 'student', select: 'firstName lastName email role' },
   { path: 'course', select: 'title description duration price' },
   { path: 'verifiedBy', select: 'firstName lastName email role' },
];

export const addResult = async (req, res) => {
   try {
      const { studentId, courseId, marks, grade, remarks, pdfUrl, resultUrl } =
         req.body;
      const resolvedResultUrl = String(resultUrl || pdfUrl || '').trim();

      if (
         !studentId ||
         !courseId ||
         marks === undefined ||
         !grade ||
         !resolvedResultUrl
      ) {
         return res.status(400).json({
            success: false,
            message:
               'studentId, courseId, marks, grade and resultUrl are required',
            data: {},
         });
      }

      const student = await User.findById(studentId);
      const course = await Course.findById(courseId);
      if (!student || student.role !== 'student') {
         return res.status(404).json({
            success: false,
            message: 'Student not found',
            data: {},
         });
      }
      if (!course) {
         return res.status(404).json({
            success: false,
            message: 'Course not found',
            data: {},
         });
      }

      const result = await Result.create({
         student: student._id,
         course: course._id,
         marks,
         grade,
         remarks,
         pdfUrl: resolvedResultUrl,
         resultUrl: resolvedResultUrl,
      });

      await result.populate(resultPopulate);

      try {
         await createNotificationForUser(student, {
            type: 'result',
            title: `New result published: ${course.title}`,
            message: `Grade: ${grade}`,
            entityType: 'result',
            entityId: result._id,
            actionPath: '/student/exams',
            createdBy: req.user._id,
         });
      } catch (_notificationError) {
         // Result creation should not fail if notification creation fails.
      }

      return res.status(201).json({
         success: true,
         message: 'Result created successfully',
         data: { result },
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Error creating result',
         data: {},
      });
   }
};

export const getAllResults = async (_req, res) => {
   try {
      const results = await Result.find()
         .populate(resultPopulate)
         .sort({ createdAt: -1 });

      return res.json({
         success: true,
         message: 'Results fetched successfully',
         data: { results },
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Error fetching results',
         data: {},
      });
   }
};

export const getResultById = async (req, res) => {
   try {
      const result = await Result.findById(req.params.id).populate(
         resultPopulate,
      );
      if (!result) {
         return res.status(404).json({
            success: false,
            message: 'Result not found',
            data: {},
         });
      }

      const isAdmin = req.user?.role === 'admin';
      const isOwner =
         String(result.student?._id || result.student) ===
         String(req.user?._id);

      if (!isAdmin && !isOwner) {
         return res.status(403).json({
            success: false,
            message: 'Not allowed to access this result',
            data: {},
         });
      }

      return res.json({
         success: true,
         message: 'Result fetched successfully',
         data: { result },
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Error fetching result',
         data: {},
      });
   }
};

export const updateResult = async (req, res) => {
   try {
      const { studentId, courseId, resultUrl, pdfUrl, ...rest } = req.body;
      const updatePayload = { ...rest };
      const resolvedResultUrl = String(resultUrl || pdfUrl || '').trim();

      if (resolvedResultUrl) {
         updatePayload.resultUrl = resolvedResultUrl;
         updatePayload.pdfUrl = resolvedResultUrl;
      }

      if (studentId) {
         const student = await User.findById(studentId);
         if (!student || student.role !== 'student') {
            return res.status(404).json({
               success: false,
               message: 'Student not found',
               data: {},
            });
         }
         updatePayload.student = student._id;
      }

      if (courseId) {
         const course = await Course.findById(courseId);
         if (!course) {
            return res.status(404).json({
               success: false,
               message: 'Course not found',
               data: {},
            });
         }
         updatePayload.course = course._id;
      }

      const updated = await Result.findByIdAndUpdate(
         req.params.id,
         updatePayload,
         {
            returnDocument: 'after',
            runValidators: true,
         },
      ).populate(resultPopulate);

      if (!updated) {
         return res.status(404).json({
            success: false,
            message: 'Result not found',
            data: {},
         });
      }

      try {
         await createNotificationForUser(updated.student, {
            type: 'result-update',
            title: 'Result updated',
            message: 'Your result record was updated by admin.',
            entityType: 'result',
            entityId: updated._id,
            actionPath: '/student/exams',
            createdBy: req.user._id,
         });
      } catch (_notificationError) {
         // Result update should not fail if notification creation fails.
      }

      return res.json({
         success: true,
         message: 'Result updated successfully',
         data: { result: updated },
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Error updating result',
         data: {},
      });
   }
};

export const verifyResult = async (req, res) => {
   try {
      const result = await Result.findById(req.params.id);
      if (!result) {
         return res.status(404).json({
            success: false,
            message: 'Result not found',
            data: {},
         });
      }

      result.isVerified = true;
      result.verifiedBy = req.user._id;
      result.verifiedAt = new Date();
      await result.save();
      await result.populate(resultPopulate);

      return res.json({
         success: true,
         message: 'Result verified successfully',
         data: { result },
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Error verifying result',
         data: {},
      });
   }
};

export const deleteResult = async (req, res) => {
   try {
      const deleted = await Result.findByIdAndDelete(req.params.id);
      if (!deleted) {
         return res.status(404).json({
            success: false,
            message: 'Result not found',
            data: {},
         });
      }

      return res.json({
         success: true,
         message: 'Result deleted successfully',
         data: {},
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Error deleting result',
         data: {},
      });
   }
};

export const getMyResults = async (req, res) => {
   try {
      const results = await Result.find({ student: req.user._id })
         .populate(resultPopulate)
         .sort({ createdAt: -1 });

      return res.json({
         success: true,
         message: 'Results fetched successfully',
         data: { results },
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Error fetching results',
         data: {},
      });
   }
};
