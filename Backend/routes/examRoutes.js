import express from "express";
import {
  addExam,
  getExams,
  updateExam,
  deleteExam,
} from "../controllers/examController.js";

const router = express.Router();

router.post("/add", addExam);
router.get("/", getExams);
router.put("/:id", updateExam);
router.delete("/:id", deleteExam);

export default router;