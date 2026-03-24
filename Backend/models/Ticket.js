import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
   {
      user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true,
      },
      subject: {
         type: String,
         required: true,
         trim: true,
      },
      description: {
         type: String,
         required: true,
         trim: true,
      },
      status: {
         type: String,
         enum: ['pending', 'resolved'],
         default: 'pending',
      },
      replies: [
         {
            message: {
               type: String,
               required: true,
            },
            repliedBy: {
               type: mongoose.Schema.Types.ObjectId,
               ref: 'User',
               required: true,
            },
            createdAt: {
               type: Date,
               default: Date.now,
            },
         },
      ],
   },
   { timestamps: true },
);

export default mongoose.model('Ticket', ticketSchema);
