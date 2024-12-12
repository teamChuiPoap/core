import express from "express";
import { auth } from "../middleware/auth";
import { User } from "../models/User";
import { Doctor } from "../models/Doctor";

const router = express.Router();

// Get all patients
router.get("/", auth, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.id);
    const patients = await User.find({
      _id: { $in: doctor?.assignedPatients },
    });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get patient details
router.get("/:id", auth, async (req, res) => {
  try {
    const patient = await User.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Assign patient to doctor
router.post("/assign/:id", auth, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.id);
    const patient = await User.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    if (doctor?.assignedPatients.includes(patient._id)) {
      return res.status(400).json({ message: "Patient already assigned" });
    }

    doctor?.assignedPatients.push(patient._id);
    await doctor?.save();

    res.json({ message: "Patient assigned successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
