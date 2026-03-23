import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,

  firstName: String,
  lastName: String,
  fatherName: String,

  aadharNumber: String,
  rollNumber: String,

  institutionName: String,
  institutionAddress: String,
  passingYear: String,

  phone: String,
  address: String,
  dob: String,

  degree: String,
  major: String,
  grade: String,

  course: {
  type: String,
  required: true,
},
  role: {
    type: String,
    default: "student",
  },
}, { timestamps: true });

export default mongoose.model("Student", studentSchema);