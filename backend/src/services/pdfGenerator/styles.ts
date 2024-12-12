export const reportStyles = `
  <style>
    .report {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    h1 {
      color: #1a365d;
      text-align: center;
      margin-bottom: 30px;
    }

    h3 {
      color: #2d3748;
      margin-bottom: 15px;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }

    .stat {
      background: #f7fafc;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }

    .stat p {
      font-size: 24px;
      font-weight: bold;
      color: #4a5568;
      margin: 10px 0 0;
    }

    .chart {
      margin-bottom: 40px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }

    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }

    th {
      background-color: #f7fafc;
      font-weight: bold;
      color: #2d3748;
    }

    tr:nth-child(even) {
      background-color: #f7fafc;
    }
  </style>
`;