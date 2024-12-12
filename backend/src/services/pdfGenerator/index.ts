import puppeteer from "puppeteer";
import { generatePatientReportTemplate } from "./templates/patientReport";
import { generateAlertReportTemplate } from "./templates/alertReport";
import { generateCheckupReportTemplate } from "./templates/checkupReport";
import { reportStyles } from "./styles";
import {
  AlertReportData,
  CheckupReportData,
  PatientReportData,
  ReportData,
} from "./types";
import path from "path";
import fs from "fs/promises";

export async function generatePDF(
  data: ReportData | AlertReportData | PatientReportData | CheckupReportData,
  type: string
): Promise<string> {
  try {
    // Create reports directory if it doesn't exist
    const reportsDir = path.join(process.cwd(), "reports");
    await fs.mkdir(reportsDir, { recursive: true });

    // Generate HTML content based on report type
    let template = "";
    switch (type) {
      case "patient":
        template = generatePatientReportTemplate(data);
        break;
      case "alert":
        template = generateAlertReportTemplate(data);
        break;
      case "checkup":
        template = generateCheckupReportTemplate(data);
        break;
      default:
        throw new Error("Invalid report type");
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          ${reportStyles}
        </head>
        <body>
          ${template}
        </body>
      </html>
    `;

    // Launch puppeteer and generate PDF
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const fileName = `report-${Date.now()}.pdf`;
    const filePath = path.join(reportsDir, fileName);

    await page.pdf({
      path: filePath,
      format: "A4",
      margin: {
        top: "20mm",
        right: "20mm",
        bottom: "20mm",
        left: "20mm",
      },
    });

    await browser.close();
    return filePath;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
}
