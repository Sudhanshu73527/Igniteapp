import User from '../models/User.js';
import Notification from '../models/Notification.js';

const normalizePayload = (payload = {}) => ({
   type: String(payload.type || 'general').trim(),
   title: String(payload.title || '').trim(),
   message: String(payload.message || '').trim(),
   entityType: String(payload.entityType || '').trim(),
   entityId: payload.entityId ? String(payload.entityId).trim() : '',
   actionPath: String(payload.actionPath || '').trim(),
   createdBy: payload.createdBy || null,
});

export const createNotificationForUser = async (user, payload = {}) => {
   if (!user) return null;

   const recipientId = user._id || user.id || user;
   if (!recipientId) return null;

   const recipientRole = user.role
      ? String(user.role)
      : (await User.findById(recipientId).select('role'))?.role;

   if (!recipientRole || !['admin', 'student'].includes(recipientRole)) {
      return null;
   }

   const normalized = normalizePayload(payload);
   if (!normalized.title) return null;

   return await Notification.create({
      ...normalized,
      recipient: recipientId,
      recipientRole,
   });
};

export const createNotificationsForRole = async (role, payload = {}) => {
   const normalizedRole = String(role || '').toLowerCase();
   if (!['admin', 'student'].includes(normalizedRole)) {
      return [];
   }

   const normalized = normalizePayload(payload);
   if (!normalized.title) return [];

   const users = await User.find({ role: normalizedRole }).select('_id role');
   if (!users.length) return [];

   const docs = users.map((user) => ({
      ...normalized,
      recipient: user._id,
      recipientRole: user.role,
   }));

   return await Notification.insertMany(docs, { ordered: false });
};
