import crypto from 'crypto';
import dotenv from 'dotenv';
import Razorpay from 'razorpay';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import User from '../models/User.js';
import { createNotificationsForRole } from '../utils/notificationService.js';

dotenv.config();

const getRazorpayClient = () => {
   const key_id = String(process.env.RAZORPAY_KEY_ID || '').trim();
   const key_secret = String(process.env.RAZORPAY_KEY_SECRET || '').trim();

   if (!key_id || !key_secret) {
      return null;
   }

   return new Razorpay({ key_id, key_secret });
};

export const createRazorpayOrder = async (req, res) => {
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

      const existingPaid = await Enrollment.findOne({
         user: req.user._id,
         course: course._id,
         paymentStatus: 'paid',
      });

      if (existingPaid) {
         return res.status(409).json({
            success: false,
            message: 'Course already purchased',
            data: {},
         });
      }

      const razorpay = getRazorpayClient();
      if (!razorpay) {
         return res.status(500).json({
            success: false,
            message:
               'Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Backend/.env',
            data: {},
         });
      }

      const amount = Math.round(Number(course.price || 0) * 100);
      if (!Number.isFinite(amount) || amount <= 0) {
         return res.status(400).json({
            success: false,
            message: 'Course price is invalid for payment',
            data: {},
         });
      }

      const receipt = `c_${String(course._id).slice(-12)}_${Date.now()
         .toString()
         .slice(-8)}`;

      const order = await razorpay.orders.create({
         amount,
         currency: 'INR',
         receipt,
         notes: {
            userId: String(req.user._id),
            courseId: String(course._id),
         },
      });

      await Enrollment.findOneAndUpdate(
         { user: req.user._id, course: course._id },
         {
            user: req.user._id,
            course: course._id,
            amount: Number(course.price || 0),
            currency: order.currency,
            paymentStatus: 'created',
            razorpayOrderId: order.id,
         },
         { upsert: true, returnDocument: 'after', runValidators: true },
      );

      return res.status(201).json({
         success: true,
         message: 'Razorpay order created',
         data: {
            keyId: process.env.RAZORPAY_KEY_ID,
            order,
            course: {
               id: course._id,
               title: course.title,
               price: course.price,
            },
         },
      });
   } catch (error) {
      const reason =
         error?.error?.description ||
         error?.error?.reason ||
         error?.message ||
         'Unknown payment provider error';

      console.error('Razorpay create order error:', reason);

      return res.status(500).json({
         success: false,
         message: `Error creating Razorpay order: ${reason}`,
         data: {},
      });
   }
};

export const verifyRazorpayPayment = async (req, res) => {
   try {
      const {
         courseId,
         razorpayOrderId,
         razorpayPaymentId,
         razorpaySignature,
      } = req.body;

      if (
         !courseId ||
         !razorpayOrderId ||
         !razorpayPaymentId ||
         !razorpaySignature
      ) {
         return res.status(400).json({
            success: false,
            message:
               'courseId, razorpayOrderId, razorpayPaymentId and razorpaySignature are required',
            data: {},
         });
      }

      const secret = process.env.RAZORPAY_KEY_SECRET;
      if (!secret) {
         return res.status(500).json({
            success: false,
            message:
               'Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Backend/.env',
            data: {},
         });
      }

      const expectedSignature = crypto
         .createHmac('sha256', secret)
         .update(`${razorpayOrderId}|${razorpayPaymentId}`)
         .digest('hex');

      if (expectedSignature !== razorpaySignature) {
         await Enrollment.findOneAndUpdate(
            { user: req.user._id, course: courseId },
            {
               paymentStatus: 'failed',
               razorpayOrderId,
               razorpayPaymentId,
               razorpaySignature,
            },
            { upsert: true, returnDocument: 'after' },
         );

         return res.status(400).json({
            success: false,
            message: 'Invalid payment signature',
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

      const enrollment = await Enrollment.findOneAndUpdate(
         { user: req.user._id, course: course._id },
         {
            user: req.user._id,
            course: course._id,
            amount: Number(course.price || 0),
            currency: 'INR',
            paymentStatus: 'paid',
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
            purchasedAt: new Date(),
         },
         { upsert: true, returnDocument: 'after', runValidators: true },
      );

      const user = await User.findById(req.user._id);
      if (
         user &&
         !user.enrolledCourses.some(
            (id) => id.toString() === String(course._id),
         )
      ) {
         user.enrolledCourses.push(course._id);
         await user.save();
      }

      try {
         await createNotificationsForRole('admin', {
            type: 'course-purchase',
            title: `New course purchase: ${course.title}`,
            message: `${req.user?.firstName || 'A student'} completed payment successfully.`,
            entityType: 'enrollment',
            entityId: enrollment._id,
            actionPath: '/admin/students',
            createdBy: req.user._id,
         });
      } catch (_notificationError) {
         // Payment verification should not fail if notification fan-out fails.
      }

      return res.json({
         success: true,
         message: 'Payment verified successfully',
         data: {
            enrollment,
            course,
            accessGranted: true,
         },
      });
   } catch (error) {
      const reason =
         error?.error?.description ||
         error?.error?.reason ||
         error?.message ||
         'Unknown payment verification error';

      console.error('Razorpay verify payment error:', reason);

      return res.status(500).json({
         success: false,
         message: `Error verifying payment: ${reason}`,
         data: {},
      });
   }
};

export const getMyPurchases = async (req, res) => {
   try {
      const enrollments = await Enrollment.find({
         user: req.user._id,
         paymentStatus: 'paid',
      })
         .populate('course')
         .sort({ purchasedAt: -1, updatedAt: -1 });

      return res.json({
         success: true,
         message: 'Purchases fetched successfully',
         data: { enrollments },
      });
   } catch (_error) {
      return res.status(500).json({
         success: false,
         message: 'Error fetching purchases',
         data: {},
      });
   }
};
