import Student from "../models/Student.js";
import bcrypt from "bcryptjs";

// ✅ REGISTER STUDENT (ADMIN SIDE)
export const registerStudent = async (req, res) => {
  try {
    const data = req.body;

    // check email
    const exist = await Student.findOne({ email: data.email });
    if (exist) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // hash password
    const hashed = await bcrypt.hash(data.password, 10);

    const student = await Student.create({
      ...data,
      password: hashed,
    });

    res.status(201).json({
      message: "Student Registered Successfully",
      student,
    });

  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
};

// ✅ GET ALL STUDENTS
export const getStudents = async (req, res) => {
  const students = await Student.find().select("-password");
  res.json({ students });
};

// ✅ DELETE STUDENT
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    await Student.findByIdAndDelete(id);

    res.json({ message: "Student Deleted" });

  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
};

// ✅ UPDATE STUDENT
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Student.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Student Updated",
      student: updated,
    });

  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
};

// ✅ GET SINGLE STUDENT
export const getSingleStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id).select("-password");

    res.json({ student });

  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
};