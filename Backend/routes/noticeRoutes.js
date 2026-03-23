import express from "express";
import {
  addNotice,
  getNotices,
  deleteNotice,
} from "../controllers/noticeController.js";

const router = express.Router();

router.post("/add", addNotice);
router.get("/all", getNotices);
router.delete("/delete/:id", deleteNotice);

export default router;