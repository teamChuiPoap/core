import { AlertReportData } from '../types';

export function generateAlertReportTemplate(data: AlertReportData|any): string {
  return `
    <div class="report">
      <h1>Alert Report</h1>
      <div class="stats">
        <div class="stat">
          <h3>Total Alerts</h3>
          <p>${data.totalAlerts}</p>
        </div>
        <div class="stat">
          <h3>Resolved Alerts</h3>
          <p>${data.resolvedAlerts}</p>
        </div>
      </div>

      <div class="chart">
        <h3>Alerts by Priority</h3>
        <table>
          <tr>
            <th>Priority</th>
            <th>Count</th>
          </tr>
          ${Object.entries(data.alertsByPriority)
            .map(([priority, count]) => `
              <tr>
                <td>${priority}</td>
                <td>${count}</td>
              </tr>
            `).join('')}
        </table>
      </div>

      <div class="chart">
        <h3>Alerts by Status</h3>
        <table>
          <tr>
            <th>Status</th>
            <th>Count</th>
          </tr>
          ${Object.entries(data.alertsByStatus)
            .map(([status, count]) => `
              <tr>
                <td>${status}</td>
                <td>${count}</td>
              </tr>
            `).join('')}
        </table>
      </div>
    </div>
  `;
}