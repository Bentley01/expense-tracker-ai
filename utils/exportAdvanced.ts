import { Expense } from '@/types/expense';
import { formatCurrency, formatDate } from './format';

/**
 * Export expenses to CSV format
 */
export const exportToCSV = (expenses: Expense[]): string => {
  const headers = ['Date', 'Category', 'Amount', 'Description'];
  const rows = expenses.map(exp => [
    exp.date,
    exp.category,
    exp.amount.toString(),
    `"${exp.description.replace(/"/g, '""')}"`, // Escape quotes
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');

  return csvContent;
};

/**
 * Export expenses to JSON format
 */
export const exportToJSON = (expenses: Expense[]): string => {
  const exportData = {
    exportDate: new Date().toISOString(),
    totalRecords: expenses.length,
    totalAmount: expenses.reduce((sum, exp) => sum + exp.amount, 0),
    expenses: expenses.map(exp => ({
      id: exp.id,
      date: exp.date,
      category: exp.category,
      amount: exp.amount,
      description: exp.description,
      createdAt: exp.createdAt,
      updatedAt: exp.updatedAt,
    })),
  };

  return JSON.stringify(exportData, null, 2);
};

/**
 * Export expenses to PDF format (HTML-based)
 * Creates a printable HTML document that can be saved as PDF
 */
export const exportToPDF = (expenses: Expense[]): string => {
  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const now = new Date();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Expense Report</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Arial', sans-serif;
      padding: 40px;
      color: #333;
      line-height: 1.6;
    }

    .header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 3px solid #0284c7;
      padding-bottom: 20px;
    }

    .header h1 {
      color: #0284c7;
      font-size: 32px;
      margin-bottom: 10px;
    }

    .header p {
      color: #666;
      font-size: 14px;
    }

    .summary {
      background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
      color: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
      display: flex;
      justify-content: space-around;
    }

    .summary-item {
      text-align: center;
    }

    .summary-item .label {
      font-size: 12px;
      opacity: 0.9;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .summary-item .value {
      font-size: 24px;
      font-weight: bold;
      margin-top: 5px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    thead {
      background: #f8fafc;
    }

    th {
      padding: 12px;
      text-align: left;
      font-weight: 600;
      color: #475569;
      border-bottom: 2px solid #e2e8f0;
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 0.5px;
    }

    tbody tr {
      border-bottom: 1px solid #e2e8f0;
    }

    tbody tr:hover {
      background: #f8fafc;
    }

    td {
      padding: 12px;
      font-size: 13px;
    }

    .date-col {
      color: #64748b;
      width: 120px;
    }

    .category-col {
      width: 150px;
    }

    .category-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
    }

    .category-food { background: #fee2e2; color: #991b1b; }
    .category-transportation { background: #dbeafe; color: #1e40af; }
    .category-entertainment { background: #ede9fe; color: #5b21b6; }
    .category-shopping { background: #fce7f3; color: #9f1239; }
    .category-bills { background: #fef3c7; color: #92400e; }
    .category-other { background: #e5e7eb; color: #374151; }

    .amount-col {
      text-align: right;
      font-weight: 600;
      color: #0f172a;
      width: 120px;
    }

    .description-col {
      color: #475569;
    }

    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      color: #64748b;
      font-size: 12px;
    }

    .total-row {
      background: #f1f5f9;
      font-weight: bold;
    }

    .total-row td {
      padding: 16px 12px;
      font-size: 14px;
    }

    @media print {
      body {
        padding: 20px;
      }

      .summary {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }

      table {
        page-break-inside: avoid;
      }

      tr {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>💰 Expense Report</h1>
    <p>Generated on ${now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}</p>
  </div>

  <div class="summary">
    <div class="summary-item">
      <div class="label">Total Records</div>
      <div class="value">${expenses.length}</div>
    </div>
    <div class="summary-item">
      <div class="label">Total Amount</div>
      <div class="value">${formatCurrency(totalAmount)}</div>
    </div>
    <div class="summary-item">
      <div class="label">Average</div>
      <div class="value">${formatCurrency(expenses.length > 0 ? totalAmount / expenses.length : 0)}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Category</th>
        <th>Description</th>
        <th style="text-align: right;">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${expenses.map(exp => `
        <tr>
          <td class="date-col">${formatDate(exp.date)}</td>
          <td class="category-col">
            <span class="category-badge category-${exp.category.toLowerCase()}">${exp.category}</span>
          </td>
          <td class="description-col">${exp.description}</td>
          <td class="amount-col">${formatCurrency(exp.amount)}</td>
        </tr>
      `).join('')}
      <tr class="total-row">
        <td colspan="3" style="text-align: right;">TOTAL:</td>
        <td class="amount-col">${formatCurrency(totalAmount)}</td>
      </tr>
    </tbody>
  </table>

  <div class="footer">
    <p>This report was generated by Expense Tracker</p>
    <p>Built with Next.js, TypeScript, and Tailwind CSS</p>
  </div>

  <script>
    // Auto-print on load for PDF saving
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>
  `;

  return html;
};

/**
 * Download file with given content and filename
 */
export const downloadFile = (content: string, filename: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Open HTML content in new window for PDF printing
 */
export const openPDFWindow = (html: string): void => {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  }
};

/**
 * Main export function that handles all formats
 */
export const performExport = async (
  expenses: Expense[],
  format: 'csv' | 'json' | 'pdf',
  filename: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      let content: string;
      let mimeType: string;
      let fullFilename: string;

      switch (format) {
        case 'csv':
          content = exportToCSV(expenses);
          mimeType = 'text/csv;charset=utf-8;';
          fullFilename = `${filename}.csv`;
          downloadFile(content, fullFilename, mimeType);
          break;

        case 'json':
          content = exportToJSON(expenses);
          mimeType = 'application/json;charset=utf-8;';
          fullFilename = `${filename}.json`;
          downloadFile(content, fullFilename, mimeType);
          break;

        case 'pdf':
          content = exportToPDF(expenses);
          openPDFWindow(content);
          break;

        default:
          throw new Error(`Unsupported format: ${format}`);
      }

      // Simulate async operation
      setTimeout(() => resolve(), 500);
    } catch (error) {
      reject(error);
    }
  });
};
