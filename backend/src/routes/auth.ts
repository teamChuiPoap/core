import express from "express";
import { Doctor } from "../models/Doctor";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { auth } from "../middleware/auth";
import { JWT_SECRET } from "../config";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      specialization,
      licenseNumber,
      phoneNumber,
    } = req.body;

    let doctor = await Doctor.findOne({ email });
    if (doctor) {
      return res.status(400).json({ message: "Doctor already exists" });
    }

    console.log(req.body);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    doctor = await Doctor.create({
      name,
      email,
      password: hashedPassword,
      specialization,
      licenseNumber,
      phoneNumber,
    });

    const token = jwt.sign({ id: doctor._id, role: doctor.role }, JWT_SECRET, {
      expiresIn: "24h",
    });

    console.log(doctor);

    return res.json({ token });
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: doctor._id, role: doctor.role }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/me", auth, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.id).select("-password");
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
