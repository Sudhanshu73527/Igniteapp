import Notice from '../models/Notice.js';

export const addNotice = async (req, res) => {
   try {
      const { title, description } = req.body;

      if (!title || !description) {
         return res.status(400).json({
            success: false,
            message: 'title and description are required',
            data: {},
         });
      }

      const notice = await Notice.create({ title, description });

      return res.status(201).json({
         success: true,
         message: 'Notice created successfully',
         data: { notice },
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Error creating notice',
         data: {},
      });
   }
};

export const getNotices = async (_req, res) => {
   try {
      const notices = await Notice.find().sort({ createdAt: -1 });
      return res.json({
         success: true,
         message: 'Notices fetched successfully',
         data: { notices },
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Error fetching notices',
         data: {},
      });
   }
};

export const getNoticeById = async (req, res) => {
   try {
      const notice = await Notice.findById(req.params.id);
      if (!notice) {
         return res.status(404).json({
            success: false,
            message: 'Notice not found',
            data: {},
         });
      }

      return res.json({
         success: true,
         message: 'Notice fetched successfully',
         data: { notice },
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Error fetching notice',
         data: {},
      });
   }
};

export const updateNotice = async (req, res) => {
   try {
      const updated = await Notice.findByIdAndUpdate(req.params.id, req.body, {
         returnDocument: 'after',
         runValidators: true,
      });

      if (!updated) {
         return res.status(404).json({
            success: false,
            message: 'Notice not found',
            data: {},
         });
      }

      return res.json({
         success: true,
         message: 'Notice updated successfully',
         data: { notice: updated },
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Error updating notice',
         data: {},
      });
   }
};

export const deleteNotice = async (req, res) => {
   try {
      const deleted = await Notice.findByIdAndDelete(req.params.id);
      if (!deleted) {
         return res.status(404).json({
            success: false,
            message: 'Notice not found',
            data: {},
         });
      }

      return res.json({
         success: true,
         message: 'Notice deleted successfully',
         data: {},
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Error deleting notice',
         data: {},
      });
   }
};
