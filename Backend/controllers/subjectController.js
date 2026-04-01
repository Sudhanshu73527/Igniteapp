import Subject from '../models/Subject.js';

// ✅ ADD
export const addSubject = async (req, res) => {
   try {
      const { name, code, type, minMarks, maxMarks } = req.body;

      if (
         !name ||
         !code ||
         !type ||
         minMarks === undefined ||
         maxMarks === undefined
      ) {
         return res.status(400).json({
            success: false,
            message: 'name, code, type, minMarks and maxMarks are required',
            data: {},
         });
      }

      const subject = await Subject.create({
         name,
         code,
         type,
         minMarks,
         maxMarks,
      });

      res.status(201).json({
         success: true,
         message: 'Subject added successfully',
         data: { subject },
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: 'Error adding subject',
         data: {},
      });
   }
};

// ✅ GET
export const getSubjects = async (req, res) => {
   try {
      const subjects = await Subject.find();

      res.json({
         success: true,
         message: 'Subjects fetched successfully',
         data: {
            count: subjects.length,
            subjects,
         },
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: 'Error fetching subjects',
         data: {},
      });
   }
};

// ✅ UPDATE
export const updateSubject = async (req, res) => {
   try {
      const { id } = req.params;

      const updated = await Subject.findByIdAndUpdate(id, req.body, {
         returnDocument: 'after',
         runValidators: true,
      });

      if (!updated) {
         return res.status(404).json({
            success: false,
            message: 'Subject not found',
            data: {},
         });
      }

      res.json({
         success: true,
         message: 'Subject updated successfully',
         data: { subject: updated },
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: 'Error updating subject',
         data: {},
      });
   }
};

// ✅ DELETE
export const deleteSubject = async (req, res) => {
   try {
      const { id } = req.params;

      const deleted = await Subject.findByIdAndDelete(id);

      if (!deleted) {
         return res.status(404).json({
            success: false,
            message: 'Subject not found',
            data: {},
         });
      }

      res.json({
         success: true,
         message: 'Subject deleted successfully',
         data: {},
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: 'Error deleting subject',
         data: {},
      });
   }
};
