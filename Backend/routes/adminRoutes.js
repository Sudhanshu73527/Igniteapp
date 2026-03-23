import express from "express";
import { adminLogin, getAllUsers } from "../controllers/adminController.js";

const router = express.Router();

// 🔐 Admin Login
router.post("/login", adminLogin);

// 👥 Get All Users (Admin Panel)
router.get("/users", getAllUsers);

export default router;