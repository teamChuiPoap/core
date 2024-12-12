import express from "express";
import { auth } from "../middleware/auth";
import { Alert } from "../models/Alert";
import { Doctor } from "../models/Doctor";

const router = express.Router();

// Get all alerts for doctor's patients
router.get("/", auth, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.id);
    const alerts = await Alert.find({
      patient: { $in: doctor?.assignedPatients },
    }).populate("patient");
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Respond to alert
router.put("/:id/respond", auth, async (req, res) => {
  try {
    const { response, status } = req.body;
    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    alert.response = response;
    alert.status = status;
    alert.assignedDoctor = req.user.id;
    await alert.save();

    res.json(alert);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
