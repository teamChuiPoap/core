import express from "express";
import { auth } from "../middleware/auth";
import { User } from "../models/User";
import { Alert } from "../models/Alert";
import { Doctor } from "../models/Doctor";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.id);

    console.log(doctor);

    // Get total patients assigned to the doctor
    const totalPatients = await User.countDocuments({
      _id: { $in: doctor?.assignedPatients },
    });

    // Get active alerts count
    const activeAlerts = await Alert.countDocuments({
      patient: { $in: doctor?.assignedPatients },
      status: { $ne: "resolved" },
    });

    // Get upcoming checkups count
    const upcomingCheckups = await User.aggregate([
      {
        $match: {
          _id: { $in: doctor?.assignedPatients },
        },
      },
      {
        $project: {
          checkup_dates: {
            $filter: {
              input: "$checkup_dates",
              as: "date",
              cond: { $gt: ["$$date", new Date()] },
            },
          },
        },
      },
    ]);

    const stats = {
      totalPatients,
      activeAlerts,
      upcomingCheckups: upcomingCheckups.reduce(
        (acc, patient) => acc + patient.checkup_dates.length,
        0
      ),
    };

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
