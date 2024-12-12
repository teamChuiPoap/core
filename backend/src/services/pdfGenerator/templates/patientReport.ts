import { PatientReportData } from '../types';

export function generatePatientReportTemplate(data: PatientReportData|any): string {
  return `
    <div class="report">
      <h1>Patient Report</h1>
      <div class="stats">
        <div class="stat">
          <h3>Total Patients</h3>
          <p>${data.totalPatients}</p>
        </div>
        <div class="stat">
          <h3>New Patients</h3>
          <p>${data.newPatients}</p>
        </div>
      </div>
      
      <div class="chart">
        <h3>Patients by Month</h3>
        <table>
          <tr>
            <th>Month</th>
            <th>Count</th>
          </tr>
          ${Object.entries(data.patientsByMonth)
            .map(([month, count]) => `
              <tr>
                <td>${month}</td>
                <td>${count}</td>
              </tr>
            `).join('')}
        </table>
      </div>
    </div>
  `;
}