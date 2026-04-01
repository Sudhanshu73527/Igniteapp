import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema(
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
      amount: {
         type: Number,
         default: 0,
      },
      currency: {
         type: String,
         default: 'INR',
      },
      paymentProvider: {
         type: String,
         default: 'razorpay',
      },
      paymentStatus: {
         type: String,
         enum: ['created', 'paid', 'failed', 'refunded'],
         default: 'created',
      },
      razorpayOrderId: {
         type: String,
         default: '',
      },
      razorpayPaymentId: {
         type: String,
         default: '',
      },
      razorpaySignature: {
         type: String,
         default: '',
      },
      purchasedAt: {
         type: Date,
         default: null,
      },
   },
   { timestamps: true },
);

enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

export default mongoose.model('Enrollment', enrollmentSchema);
