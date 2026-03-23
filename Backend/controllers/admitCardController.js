import AdmitCard from "../models/AdmitCard.js";
import Student from "../models/Student.js";

// 🔥 CREATE OR UPDATE ADMIT CARD
export const createAdmitCard = async (req, res) => {
  try {
    const { studentId, examDate } = req.body;

    // ✅ VALIDATION
    if (!studentId || !examDate) {
      return res.status(400).json({
        message: "Student ID and Exam Date are required",
      });
    }

    // ✅ FIND STUDENT
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // ✅ CHECK EXISTING ADMIT CARD
    let admit = await AdmitCard.findOne({ studentId });

    if (admit) {
      // 🔁 UPDATE EXISTING
      admit.examDate = examDate;
      admit.name = student.name;
      admit.rollNumber = student.rollNumber;
      admit.course = student.course;
      admit.address = student.address;

      await admit.save();

      return res.status(200).json({
        message: "Admit Card Updated ✅",
        admit,
      });
    }

    // 🆕 CREATE NEW
    admit = new AdmitCard({
      studentId,
      name: student.name,
      rollNumber: student.rollNumber,
      course: student.course,
      address: student.address,
      examDate,
    });

    await admit.save();

    res.status(201).json({
      message: "Admit Card Created ✅",
      admit,
    });
  } catch (error) {
    console.error("Create Admit Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// 📄 GET ALL ADMIT CARDS (ADMIN)
export const getAdmitCards = async (req, res) => {
  try {
    const data = await AdmitCard.find()
      .populate("studentId")
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (error) {
    console.error("Get Admit Cards Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// 👨‍🎓 GET SINGLE STUDENT ADMIT CARD
export const getStudentAdmit = async (req, res) => {
  try {
    const data = await AdmitCard.findOne({
      studentId: req.params.id,
    }).sort({ createdAt: -1 });

    if (!data) {
      return res.status(404).json({
        message: "Admit card not found",
      });
    }

    res.json(data);
  } catch (error) {
    console.error("Get Student Admit Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ❌ DELETE ADMIT CARD (OPTIONAL BUT PRO FEATURE)
export const deleteAdmitCard = async (req, res) => {
  try {
    await AdmitCard.findByIdAndDelete(req.params.id);

    res.json({ message: "Admit Card Deleted ✅" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ error: error.message });
  }
};


