import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
   {
      recipient: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true,
         index: true,
      },
      recipientRole: {
         type: String,
         enum: ['admin', 'student'],
         required: true,
         index: true,
      },
      type: {
         type: String,
         default: 'general',
      },
      title: {
         type: String,
         required: true,
      },
      message: {
         type: String,
         default: '',
      },
      entityType: {
         type: String,
         default: '',
      },
      entityId: {
         type: String,
         default: '',
      },
      actionPath: {
         type: String,
         default: '',
      },
      createdBy: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         default: null,
      },
      isRead: {
         type: Boolean,
         default: false,
         index: true,
      },
      readAt: {
         type: Date,
         default: null,
      },
   },
   { timestamps: true },
);

notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

export default mongoose.model('Notification', notificationSchema);
