export interface PatientReportData {
  totalPatients: number;
  newPatients: number;
  patientsByMonth: Record<string, number>;
}

export interface AlertReportData {
  totalAlerts: number;
  resolvedAlerts: number;
  alertsByPriority: Record<string, number>;
  alertsByStatus: Record<string, number>;
}

export interface CheckupReportData {
  totalCheckups: number;
  upcomingCheckups: number;
  checkupsByMonth: Record<string, number>;
}

export type ReportData = PatientReportData | AlertReportData | CheckupReportData;