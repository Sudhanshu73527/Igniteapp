import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
  subjectName: {
    type: String,
    required: true,
  },
  subjectCode: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["Theory", "Practical"],
    required: true,
  },
  examDate: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
}, { timestamps: true });

export default mongoose.model("Exam", examSchema);