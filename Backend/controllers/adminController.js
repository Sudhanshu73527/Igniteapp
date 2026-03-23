import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ✅ HARD CODED ADMIN
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "123456";

// ========================
// 🔐 ADMIN LOGIN
// ========================
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check email
    if (email !== ADMIN_EMAIL) {
      return res.status(400).json({ message: "Invalid Email" });
    }

    // check password
    if (password !== ADMIN_PASSWORD) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    // token generate
    const token = jwt.sign(
      { role: "admin" },
      "secretkey",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Admin Login Successful",
      token,
      role: "admin",
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// ========================
// 👥 GET ALL USERS
// ========================
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // hide password

    res.json({
      success: true,
      count: users.length,
      users,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching users",
      error,
    });
  }
};