import Notification from '../models/Notification.js';

const parseLimit = (value) => {
   const parsed = Number(value);
   if (!Number.isFinite(parsed)) return 50;
   return Math.max(1, Math.min(200, Math.floor(parsed)));
};

export const getMyNotifications = async (req, res) => {
   try {
      const limit = parseLimit(req.query.limit);
      const notifications = await Notification.find({ recipient: req.user._id })
         .sort({ createdAt: -1 })
         .limit(limit);

      return res.json({
         success: true,
         message: 'Notifications fetched successfully',
         data: { notifications },
      });
   } catch (_error) {
      return res.status(500).json({
         success: false,
         message: 'Error fetching notifications',
         data: {},
      });
   }
};

export const getUnreadNotificationCount = async (req, res) => {
   try {
      const count = await Notification.countDocuments({
         recipient: req.user._id,
         isRead: false,
      });

      return res.json({
         success: true,
         message: 'Unread notification count fetched successfully',
         data: { count },
      });
   } catch (_error) {
      return res.status(500).json({
         success: false,
         message: 'Error fetching unread notification count',
         data: {},
      });
   }
};

export const markAllNotificationsRead = async (req, res) => {
   try {
      const result = await Notification.updateMany(
         {
            recipient: req.user._id,
            isRead: false,
         },
         {
            $set: {
               isRead: true,
               readAt: new Date(),
            },
         },
      );

      return res.json({
         success: true,
         message: 'Notifications marked as read',
         data: { updated: result.modifiedCount || 0 },
      });
   } catch (_error) {
      return res.status(500).json({
         success: false,
         message: 'Error marking notifications as read',
         data: {},
      });
   }
};

export const markNotificationRead = async (req, res) => {
   try {
      const updated = await Notification.findOneAndUpdate(
         {
            _id: req.params.id,
            recipient: req.user._id,
         },
         {
            $set: {
               isRead: true,
               readAt: new Date(),
            },
         },
         { returnDocument: 'after' },
      );

      if (!updated) {
         return res.status(404).json({
            success: false,
            message: 'Notification not found',
            data: {},
         });
      }

      return res.json({
         success: true,
         message: 'Notification marked as read',
         data: { notification: updated },
      });
   } catch (_error) {
      return res.status(500).json({
         success: false,
         message: 'Error marking notification as read',
         data: {},
      });
   }
};
