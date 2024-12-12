import express from "express";
import { auth } from "../middleware/auth";
import { Report } from "../models/Report";
import { generateReport } from "../services/reportGenerator";

const router = express.Router();

// Get all reports for a doctor
router.get("/", auth, async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;
    let query: any = { doctor: req.user.id };

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      };
    }

    if (type && type !== "all") {
      query.type = type;
    }

    const reports = await Report.find(query).sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Generate a new report
router.post("/generate", auth, async (req, res) => {
  try {
    const { title, type, dateRange, customStartDate, customEndDate } = req.body;

    let startDate, endDate;
    if (dateRange === "custom") {
      startDate = new Date(customStartDate);
      endDate = new Date(customEndDate);
    } else {
      const days = dateRange === "last30" ? 30 : 90;
      endDate = new Date();
      startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
    }

    const report = await Report.create({
      title,
      type,
      doctor: req.user.id,
      dateRange: { startDate, endDate },
      status: "processing",
    });

    // Start report generation process
    generateReport(report.id).catch(console.error);

    res.json(report);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Download a report
router.get("/:id/download", auth, async (req, res) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      doctor: req.user.id,
    });

    if (!report || !report.fileUrl) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.download(report.fileUrl);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
