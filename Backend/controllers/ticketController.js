import Ticket from '../models/Ticket.js';

const normalizeStatus = (status = 'pending') => {
   const value = String(status).toLowerCase();
   if (value === 'resolved') return 'resolved';
   return 'pending';
};

export const createTicket = async (req, res) => {
   try {
      const { subject, description } = req.body;

      if (!subject || !description) {
         return res.status(400).json({
            success: false,
            message: 'subject and description are required',
            data: {},
         });
      }

      const ticket = await Ticket.create({
         user: req.user._id,
         subject,
         description,
         status: 'pending',
      });

      return res.status(201).json({
         success: true,
         message: 'Ticket created successfully',
         data: { ticket },
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Error creating ticket',
         data: {},
      });
   }
};

export const getMyTickets = async (req, res) => {
   try {
      const tickets = await Ticket.find({ user: req.user._id })
         .populate('replies.repliedBy', 'firstName lastName role')
         .sort({ createdAt: -1 });

      return res.json({
         success: true,
         message: 'My tickets fetched successfully',
         data: { tickets },
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Error fetching my tickets',
         data: {},
      });
   }
};

export const getAllTickets = async (_req, res) => {
   try {
      const tickets = await Ticket.find()
         .populate('user', 'firstName lastName email role')
         .populate('replies.repliedBy', 'firstName lastName role')
         .sort({ createdAt: -1 });

      return res.json({
         success: true,
         message: 'Tickets fetched successfully',
         data: { tickets },
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Error fetching tickets',
         data: {},
      });
   }
};

export const updateTicketStatus = async (req, res) => {
   try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
         return res.status(400).json({
            success: false,
            message: 'status is required',
            data: {},
         });
      }

      const ticket = await Ticket.findByIdAndUpdate(
         id,
         { status: normalizeStatus(status) },
         { new: true, runValidators: true },
      );

      if (!ticket) {
         return res.status(404).json({
            success: false,
            message: 'Ticket not found',
            data: {},
         });
      }

      return res.json({
         success: true,
         message: 'Ticket status updated',
         data: { ticket },
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Error updating ticket status',
         data: {},
      });
   }
};

export const replyToTicket = async (req, res) => {
   try {
      const { id } = req.params;
      const { message, status } = req.body;

      if (!message) {
         return res.status(400).json({
            success: false,
            message: 'message is required',
            data: {},
         });
      }

      const ticket = await Ticket.findById(id);
      if (!ticket) {
         return res.status(404).json({
            success: false,
            message: 'Ticket not found',
            data: {},
         });
      }

      ticket.replies.push({
         message,
         repliedBy: req.user._id,
      });

      if (status) {
         ticket.status = normalizeStatus(status);
      }

      await ticket.save();
      await ticket.populate('replies.repliedBy', 'firstName lastName role');

      return res.json({
         success: true,
         message: 'Reply submitted successfully',
         data: { ticket },
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Error replying to ticket',
         data: {},
      });
   }
};

export const getAdminNotifications = async (_req, res) => {
   try {
      const tickets = await Ticket.find({ status: 'pending' })
         .populate('user', 'firstName lastName email')
         .sort({ createdAt: -1 })
         .limit(50);

      const notifications = tickets.map((ticket) => ({
         id: ticket._id,
         title: `New complaint: ${ticket.subject}`,
         message: ticket.description,
         studentName:
            `${ticket.user?.firstName || ''} ${ticket.user?.lastName || ''}`.trim(),
         studentEmail: ticket.user?.email || '',
         createdAt: ticket.createdAt,
         status: ticket.status,
      }));

      return res.json({
         success: true,
         message: 'Notifications fetched successfully',
         data: { notifications },
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Error fetching notifications',
         data: {},
      });
   }
};
