import mongoose from "mongoose";

const admitCardSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
    name: String,
    rollNumber: String,
    course: String,
    address: String,
    examDate: String,
  },
  { timestamps: true }
);

export default mongoose.model("AdmitCard", admitCardSchema);