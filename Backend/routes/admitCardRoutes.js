import express from "express";
import {
  createAdmitCard,
  getAdmitCards,
  getStudentAdmit,
  deleteAdmitCard,
} from "../controllers/admitCardController.js";

const router = express.Router();

router.post("/create", createAdmitCard);
router.get("/all", getAdmitCards);
router.get("/student/:id", getStudentAdmit);
router.delete("/delete/:id", deleteAdmitCard);

export default router;