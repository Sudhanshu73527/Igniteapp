
import express from "express";
import {
  addCourse,
  getCourses,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController.js";

const router = express.Router();

router.post("/add", addCourse);
router.get("/", getCourses);

// ✅ NEW
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);

export default router;