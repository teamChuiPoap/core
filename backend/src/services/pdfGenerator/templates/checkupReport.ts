import { CheckupReportData } from '../types';

export function generateCheckupReportTemplate(data: CheckupReportData|any): string {
  return `
    <div class="report">
      <h1>Checkup Report</h1>
      <div class="stats">
        <div class="stat">
          <h3>Total Checkups</h3>
          <p>${data.totalCheckups}</p>
        </div>
        <div class="stat">
          <h3>Upcoming Checkups</h3>
          <p>${data.upcomingCheckups}</p>
        </div>
      </div>

      <div class="chart">
        <h3>Checkups by Month</h3>
        <table>
          <tr>
            <th>Month</th>
            <th>Count</th>
          </tr>
          ${Object.entries(data.checkupsByMonth)
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