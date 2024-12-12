import { Report } from "../models/Report";
import { User } from "../models/User";
import { Alert } from "../models/Alert";
import { generatePDF } from "./pdfGenerator";

export async function generateReport(reportId: string) {
  try {
    const report = await Report.findById(reportId);
    if (!report) return;

    let data;
    switch (report.type) {
      case "patient":
        data = await generatePatientReport(report);
        break;
      case "alert":
        data = await generateAlertReport(report);
        break;
      case "checkup":
        data = await generateCheckupReport(report);
        break;
    }

    const pdfPath = await generatePDF(data, report.type);

    report.status = "completed";
    report.data = data;
    report.fileUrl = pdfPath;
    await report.save();
  } catch (error) {
    console.error("Error generating report:", error);
    await Report.findByIdAndUpdate(reportId, {
      status: "failed",
    });
  }
}

async function generatePatientReport(report: any) {
  const { startDate, endDate } = report.dateRange;
  const patients = await User.find({
    createdAt: { $gte: startDate, $lte: endDate },
  });

  return {
    totalPatients: patients.length,
    newPatients: patients.filter((p: any) => p.createdAt >= startDate).length,
    patientsByMonth: groupByMonth(patients, "createdAt"),
    // Add more statistics as needed
  };
}

async function generateAlertReport(report: any) {
  const { startDate, endDate } = report.dateRange;
  const alerts = await Alert.find({
    createdAt: { $gte: startDate, $lte: endDate },
  });

  return {
    totalAlerts: alerts.length,
    resolvedAlerts: alerts.filter((a) => a.status === "resolved").length,
    alertsByPriority: groupByField(alerts, "priority"),
    alertsByStatus: groupByField(alerts, "status"),
    // Add more statistics as needed
  };
}

async function generateCheckupReport(report: any) {
  const { startDate, endDate } = report.dateRange;
  const patients = await User.find({
    checkup_dates: {
      $elemMatch: {
        $gte: startDate,
        $lte: endDate,
      },
    },
  });

  return {
    totalCheckups: patients.reduce((acc, p) => acc + p.checkup_dates.length, 0),
    upcomingCheckups: patients.filter((p) =>
      p.checkup_dates.some((d: any) => d > new Date())
    ).length,
    checkupsByMonth: groupByMonth(
      patients.flatMap((p) => p.checkup_dates),
      null
    ),
    // Add more statistics as needed
  };
}

function groupByMonth(items: any[], dateField: string | null) {
  const groups: { [key: string]: number } = {};
  items.forEach((item) => {
    const date = dateField ? item[dateField] : item;
    const month = new Date(date).toLocaleString("default", { month: "long" });
    groups[month] = (groups[month] || 0) + 1;
  });
  return groups;
}

function groupByField(items: any[], field: string) {
  const groups: { [key: string]: number } = {};
  items.forEach((item) => {
    const value = item[field];
    groups[value] = (groups[value] || 0) + 1;
  });
  return groups;
}
