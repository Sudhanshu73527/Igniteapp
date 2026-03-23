import express from "express";
import {
  registerStudent,
  getStudents,
  deleteStudent,
  updateStudent,
  getSingleStudent,
} from "../controllers/studentController.js";

const router = express.Router();

// routes
router.post("/register", registerStudent);
router.get("/", getStudents);
router.delete("/:id", deleteStudent);
router.put("/:id", updateStudent);
router.get("/:id", getSingleStudent);

// ✅ VERY IMPORTANT
export default router;