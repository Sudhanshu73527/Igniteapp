import Subject from "../models/Subject.js";

// ✅ ADD
export const addSubject = async (req, res) => {
  try {
    const subject = await Subject.create(req.body);

    res.status(201).json({
      message: "Subject Added",
      subject,
    });
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
};

// ✅ GET
export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();

    res.json({
      count: subjects.length,
      subjects,
    });
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
};

// ✅ UPDATE
export const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Subject.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Subject Updated",
      subject: updated,
    });
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
};

// ✅ DELETE
export const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    await Subject.findByIdAndDelete(id);

    res.json({
      message: "Subject Deleted",
    });
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
};