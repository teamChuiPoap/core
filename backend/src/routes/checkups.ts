import express from "express";
import { auth } from "../middleware/auth";
import { User } from "../models/User";
import { Doctor } from "../models/Doctor";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const { limit } = req.query;
    const doctor = await Doctor.findById(req.user.id);

    // Get patients with upcoming checkups
    const patients = await User.aggregate([
      {
        $match: {
          _id: { $in: doctor?.assignedPatients },
        },
      },
      {
        $project: {
          name: 1,
          checkup_dates: {
            $filter: {
              input: "$checkup_dates",
              as: "date",
              cond: { $gt: ["$$date", new Date()] },
            },
          },
        },
      },
      {
        $unwind: "$checkup_dates",
      },
      {
        $sort: {
          checkup_dates: 1,
        },
      },
    ]);

    // Apply limit if specified
    const checkups = limit
      ? patients.slice(0, parseInt(limit as string))
      : patients;

    res.json(
      checkups.map((patient) => ({
        _id: patient._id,
        patient: {
          name: patient.name,
        },
        date: patient.checkup_dates,
      }))
    );
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
