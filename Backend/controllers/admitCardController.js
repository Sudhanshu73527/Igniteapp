import AdmitCard from '../models/AdmitCard.js';
import User from '../models/User.js';

export const createAdmitCard = async (req, res) => {
   try {
      const { studentId, examName, examDate, pdfUrl, admitCardUrl } = req.body;
      const resolvedAdmitUrl = String(admitCardUrl || pdfUrl || '').trim();

      if (!studentId || !resolvedAdmitUrl) {
         return res.status(400).json({
            success: false,
            message: 'studentId and admitCardUrl are required',
            data: {},
         });
      }

      const student = await User.findById(studentId);
      if (!student || student.role !== 'student') {
         return res.status(404).json({
            success: false,
            message: 'Student not found',
            data: {},
         });
      }

      const admit = await AdmitCard.findOneAndUpdate(
         { student: student._id },
         {
            student: student._id,
            examName: examName || '',
            examDate: examDate || '',
            pdfUrl: resolvedAdmitUrl,
            admitCardUrl: resolvedAdmitUrl,
         },
         {
            returnDocument: 'after',
            upsert: true,
            runValidators: true,
         },
      ).populate('student', 'firstName lastName email');

      return res.status(201).json({
         success: true,
         message: 'Admit card saved successfully',
         data: { admitCard: admit },
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Error saving admit card',
         data: {},
      });
   }
};

export const getAdmitCards = async (_req, res) => {
   try {
      const admitCards = await AdmitCard.find()
         .populate('student', 'firstName lastName email')
         .sort({ createdAt: -1 });

      return res.json({
         success: true,
         message: 'Admit cards fetched successfully',
         data: { admitCards },
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Error fetching admit cards',
         data: {},
      });
   }
};

export const getStudentAdmit = async (req, res) => {
   try {
      const isAdmin = req.user?.role === 'admin';
      const isOwner = String(req.params.id) === String(req.user?._id);

      if (!isAdmin && !isOwner) {
         return res.status(403).json({
            success: false,
            message: 'Not allowed to access this admit card',
            data: {},
         });
      }

      const admitCard = await AdmitCard.findOne({
         student: req.params.id,
      }).populate('student', 'firstName lastName email');

      if (!admitCard) {
         return res.status(404).json({
            success: false,
            message: 'Admit card not found',
            data: {},
         });
      }

      return res.json({
         success: true,
         message: 'Admit card fetched successfully',
         data: { admitCard },
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Error fetching admit card',
         data: {},
      });
   }
};

export const updateAdmitCard = async (req, res) => {
   try {
      const { admitCardUrl, pdfUrl, ...rest } = req.body;
      const updatePayload = { ...rest };
      const resolvedAdmitUrl = String(admitCardUrl || pdfUrl || '').trim();

      if (resolvedAdmitUrl) {
         updatePayload.admitCardUrl = resolvedAdmitUrl;
         updatePayload.pdfUrl = resolvedAdmitUrl;
      }

      const updated = await AdmitCard.findByIdAndUpdate(
         req.params.id,
         updatePayload,
         {
            returnDocument: 'after',
            runValidators: true,
         },
      ).populate('student', 'firstName lastName email');

      if (!updated) {
         return res.status(404).json({
            success: false,
            message: 'Admit card not found',
            data: {},
         });
      }

      return res.json({
         success: true,
         message: 'Admit card updated successfully',
         data: { admitCard: updated },
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Error updating admit card',
         data: {},
      });
   }
};

export const deleteAdmitCard = async (req, res) => {
   try {
      const deleted = await AdmitCard.findByIdAndDelete(req.params.id);
      if (!deleted) {
         return res.status(404).json({
            success: false,
            message: 'Admit card not found',
            data: {},
         });
      }

      return res.json({
         success: true,
         message: 'Admit card deleted successfully',
         data: {},
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Error deleting admit card',
         data: {},
      });
   }
};
