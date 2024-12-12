import express from "express";
import { auth } from "../middleware/auth";
import { Advice } from "../models/Advice";

const router = express.Router();

// Create advice
router.post("/", auth, async (req, res) => {
  try {
    const { patientId, title, content, category } = req.body;
    const advice = await Advice.create({
      doctor: req.user.id,
      patient: patientId,
      title,
      content,
      category,
    });
    res.json(advice);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all advice for a patient
router.get("/patient/:id", auth, async (req, res) => {
  try {
    const advice = await Advice.find({
      patient: req.params.id,
      status: "published",
    }).populate("doctor");
    res.json(advice);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
