import Exam from "../models/Exam.js";

// ✅ ADD
export const addExam = async (req, res) => {
  try {
    const exam = await Exam.create(req.body);

    res.status(201).json({
      message: "Exam Scheduled",
      exam,
    });
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
};

// ✅ GET ALL (Student view)
export const getExams = async (req, res) => {
  try {
    const exams = await Exam.find().sort({ examDate: 1 });

    res.json({
      exams,
    });
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
};

// ✅ UPDATE
export const updateExam = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Exam.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.json({
      message: "Exam Updated",
      exam: updated,
    });
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
};

// ✅ DELETE
export const deleteExam = async (req, res) => {
  try {
    const { id } = req.params;

    await Exam.findByIdAndDelete(id);

    res.json({
      message: "Exam Deleted",
    });
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
};