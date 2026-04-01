import Certificate from '../models/Certificate.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import User from '../models/User.js';

const populateConfig = [
   { path: 'user', select: 'firstName lastName email role' },
   { path: 'course', select: 'title description duration price' },
   { path: 'approvedBy', select: 'firstName lastName email role' },
];

const hasCourseAccess = async (userId, courseId) => {
   const [enrollment, user] = await Promise.all([
      Enrollment.findOne({
         user: userId,
         course: courseId,
         paymentStatus: 'paid',
      }),
      User.findById(userId).select('enrolledCourses'),
   ]);

   if (enrollment) return true;
   return Boolean(
      user?.enrolledCourses?.some((id) => id.toString() === String(courseId)),
   );
};

export const requestCertificate = async (req, res) => {
   try {
      const { courseId } = req.body;

      if (!courseId) {
         return res.status(400).json({
            success: false,
            message: 'courseId is required',
            data: {},
         });
      }

      const course = await Course.findById(courseId);
      if (!course) {
         return res.status(404).json({
            success: false,
            message: 'Course not found',
            data: {},
         });
      }

      const access = await hasCourseAccess(req.user._id, course._id);
      if (!access) {
         return res.status(403).json({
            success: false,
            message: 'Purchase required before requesting certificate',
            data: {},
         });
      }

      const certificate = await Certificate.findOneAndUpdate(
         { user: req.user._id, course: course._id },
         {
            user: req.user._id,
            course: course._id,
            status: 'pending',
            note: 'Certificate request submitted by student.',
         },
         { upsert: true, returnDocument: 'after', runValidators: true },
      ).populate(populateConfig);

      return res.status(201).json({
         success: true,
         message: 'Certificate request submitted',
         data: { certificate },
      });
   } catch (_error) {
      return res.status(500).json({
         success: false,
         message: 'Error requesting certificate',
         data: {},
      });
   }
};

export const getMyCertificates = async (req, res) => {
   try {
      const certificates = await Certificate.find({ user: req.user._id })
         .populate(populateConfig)
         .sort({ updatedAt: -1 });

      return res.json({
         success: true,
         message: 'Certificates fetched successfully',
         data: { certificates },
      });
   } catch (_error) {
      return res.status(500).json({
         success: false,
         message: 'Error fetching certificates',
         data: {},
      });
   }
};

export const getAllCertificates = async (_req, res) => {
   try {
      const certificates = await Certificate.find()
         .populate(populateConfig)
         .sort({ updatedAt: -1 });

      return res.json({
         success: true,
         message: 'Certificates fetched successfully',
         data: { certificates },
      });
   } catch (_error) {
      return res.status(500).json({
         success: false,
         message: 'Error fetching certificates',
         data: {},
      });
   }
};

export const reviewCertificate = async (req, res) => {
   try {
      const { status, certificateUrl, note } = req.body;
      const normalizedStatus = String(status || '').toLowerCase();

      if (!['approved', 'rejected'].includes(normalizedStatus)) {
         return res.status(400).json({
            success: false,
            message: 'status must be approved or rejected',
            data: {},
         });
      }

      const certificate = await Certificate.findById(req.params.id);
      if (!certificate) {
         return res.status(404).json({
            success: false,
            message: 'Certificate not found',
            data: {},
         });
      }

      certificate.status = normalizedStatus;
      certificate.note = String(note || '').trim();
      certificate.approvedBy = req.user._id;

      if (normalizedStatus === 'approved') {
         certificate.approvedAt = new Date();
         certificate.rejectedAt = null;
         if (certificateUrl) {
            certificate.certificateUrl = String(certificateUrl).trim();
         }
      } else {
         certificate.rejectedAt = new Date();
      }

      await certificate.save();
      await certificate.populate(populateConfig);

      return res.json({
         success: true,
         message: `Certificate ${normalizedStatus}`,
         data: { certificate },
      });
   } catch (_error) {
      return res.status(500).json({
         success: false,
         message: 'Error updating certificate status',
         data: {},
      });
   }
};

export const downloadCertificate = async (req, res) => {
   try {
      const certificate = await Certificate.findById(req.params.id).populate(
         'user',
         'email',
      );
      if (!certificate) {
         return res.status(404).json({
            success: false,
            message: 'Certificate not found',
            data: {},
         });
      }

      const isOwner =
         String(certificate.user?._id || certificate.user) ===
         String(req.user._id);
      const isAdmin = req.user.role === 'admin';
      if (!isOwner && !isAdmin) {
         return res.status(403).json({
            success: false,
            message: 'Not allowed to access this certificate',
            data: {},
         });
      }

      if (certificate.status !== 'approved') {
         return res.status(400).json({
            success: false,
            message: 'Certificate is not approved yet',
            data: {},
         });
      }

      if (!certificate.certificateUrl) {
         return res.status(404).json({
            success: false,
            message: 'Certificate file URL is not available',
            data: {},
         });
      }

      return res.json({
         success: true,
         message: 'Certificate download URL fetched',
         data: { downloadUrl: certificate.certificateUrl },
      });
   } catch (_error) {
      return res.status(500).json({
         success: false,
         message: 'Error downloading certificate',
         data: {},
      });
   }
};
