import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["Theory", "Practical"],
    required: true,
  },
  minMarks: {
    type: Number,
    required: true,
  },
  maxMarks: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

export default mongoose.model("Subject", subjectSchema);