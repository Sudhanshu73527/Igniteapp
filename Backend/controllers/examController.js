import Exam from '../models/Exam.js';

// ✅ ADD
export const addExam = async (req, res) => {
   try {
      const {
         subjectName,
         subjectCode,
         type,
         examDate,
         time,
         duration,
         description,
      } = req.body;

      if (
         !subjectName ||
         !subjectCode ||
         !type ||
         !examDate ||
         !time ||
         !duration
      ) {
         return res.status(400).json({
            success: false,
            message:
               'subjectName, subjectCode, type, examDate, time and duration are required',
            data: {},
         });
      }

      const exam = await Exam.create({
         subjectName,
         subjectCode,
         type,
         examDate,
         time,
         duration,
         description,
      });

      res.status(201).json({
         success: true,
         message: 'Exam scheduled successfully',
         data: { exam },
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: 'Error scheduling exam',
         data: {},
      });
   }
};

// ✅ GET ALL (Student view)
export const getExams = async (req, res) => {
   try {
      const exams = await Exam.find().sort({ examDate: 1 });

      res.json({
         success: true,
         message: 'Exams fetched successfully',
         data: {
            count: exams.length,
            exams,
         },
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: 'Error fetching exams',
         data: {},
      });
   }
};

// ✅ UPDATE
export const updateExam = async (req, res) => {
   try {
      const { id } = req.params;

      const updated = await Exam.findByIdAndUpdate(id, req.body, {
         returnDocument: 'after',
         runValidators: true,
      });

      if (!updated) {
         return res.status(404).json({
            success: false,
            message: 'Exam not found',
            data: {},
         });
      }

      res.json({
         success: true,
         message: 'Exam updated successfully',
         data: { exam: updated },
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: 'Error updating exam',
         data: {},
      });
   }
};

// ✅ DELETE
export const deleteExam = async (req, res) => {
   try {
      const { id } = req.params;

      const deleted = await Exam.findByIdAndDelete(id);

      if (!deleted) {
         return res.status(404).json({
            success: false,
            message: 'Exam not found',
            data: {},
         });
      }

      res.json({
         success: true,
         message: 'Exam deleted successfully',
         data: {},
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: 'Error deleting exam',
         data: {},
      });
   }
};
