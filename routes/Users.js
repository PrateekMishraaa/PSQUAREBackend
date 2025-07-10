// routes/hrAuth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/Users.js";

dotenv.config();
const JWT_SECRET = process.env.JWTSECRET;

const router = express.Router();

/* ---------- HR SIGN‑UP ---------- */
router.post("/signup", async (req, res) => {
  const { fullName, email, mobile, password } = req.body;

  if (!fullName || !email || !mobile || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const newHR = await User.create({
      fullName,
      email,
      mobile,
      password,
      role: "hr", // force role to HR
    });

    const { password: _pw, ...userData } = newHR.toObject();

    res.status(201).json({
      message: "HR account created",
      user: userData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

/* ---------- HR LOGIN ---------- */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Invalid credentials" });

  try {
    const user = await User.findOne({ email, role: "hr" }).select("+password");
    if (!user)
      return res
        .status(404)
        .json({ message: "No HR account found for this email" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Incorrect password" });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    const { password: _pw, ...userData } = user.toObject();

    res.status(200).json({
      message: "HR login successful",
      token,
      user: userData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
