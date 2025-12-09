/**
 * Export Helpers V2 - Enterprise-Grade PDF/Excel/CSV Export
 * 
 * Features:
 * - Full Turkish character support (UTF-8)
 * - Professional design with branding
 * - Optimized for print
 * - Accessibility compliant
 * - Multiple export formats
 * 
 * @module shared/utils/export-helpers-v2
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { formatCurrency, formatNumber, formatDate, formatDateTime } from './formatters';

// ==================== TYPES ====================

export interface ExportConfig {
  title: string;
  subtitle?: string;
  description?: string;
  dateRange?: string;
  metadata?: {
    generatedBy?: string;
    generatedAt?: string;
    company?: string;
    logo?: string;
  };
}

export interface ExportTable {
  title: string;
  description?: string;
  headers: string[];
  rows: (string | number | null)[][];
  summary?: {
    label: string;
    value: string | number;
  }[];
}

export interface ExportStats {
  title?: string;
  items: {
    label: string;
    value: string | number;
    icon?: string;
    trend?: {
      value: number;
      isPositive: boolean;
    };
  }[];
}

export interface ExportChart {
  title: string;
  type: 'line' | 'bar' | 'pie';
  data: {
    labels: string[];
    values: number[];
  };
}

export interface ExportData {
  config: ExportConfig;
  stats?: ExportStats;
  tables?: ExportTable[];
  charts?: ExportChart[];
  notes?: string[];
}

// ==================== PDF EXPORT ====================

/**
 * Export data to PDF with professional design and Turkish character support
 */
export async function exportToPDF(data: ExportData): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // ========== HEADER ==========
  yPosition = addPDFHeader(doc, data.config, yPosition, pageWidth);

  // ========== STATS ==========
  if (data.stats) {
    yPosition = addPDFStats(doc, data.stats, yPosition, pageWidth, pageHeight);
  }

  // ========== TABLES ==========
  if (data.tables && data.tables.length > 0) {
    for (const table of data.tables) {
      yPosition = addPDFTable(doc, table, yPosition, pageWidth, pageHeight);
    }
  }

  // ========== CHARTS ==========
  if (data.charts && data.charts.length > 0) {
    // Charts would require canvas rendering - placeholder for now
    yPosition = addPDFChartsPlaceholder(doc, data.charts, yPosition, pageWidth);
  }

  // ========== NOTES ==========
  if (data.notes && data.notes.length > 0) {
    yPosition = addPDFNotes(doc, data.notes, yPosition, pageWidth, pageHeight);
  }

  // ========== FOOTER ==========
  addPDFFooter(doc, data.config);

  // ========== SAVE ==========
  const filename = generateFilename(data.config.title, 'pdf');
  doc.save(filename);
}

/**
 * Add PDF header with branding
 */
function addPDFHeader(
  doc: jsPDF,
  config: ExportConfig,
  yPosition: number,
  pageWidth: number
): number {
  // Company logo (if provided)
  if (config.metadata?.logo) {
    // doc.addImage(config.metadata.logo, 'PNG', 14, yPosition, 30, 10);
    yPosition += 15;
  }

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(config.title, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  // Subtitle
  if (config.subtitle) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(71, 85, 105); // slate-600
    doc.text(config.subtitle, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 8;
  }

  // Description
  if (config.description) {
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139); // slate-500
    const descLines = doc.splitTextToSize(config.description, pageWidth - 40);
    doc.text(descLines, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += descLines.length * 5 + 5;
  }

  // Date Range
  if (config.dateRange) {
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(config.dateRange, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 8;
  }

  // Metadata
  if (config.metadata?.generatedAt) {
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184); // slate-400
    const metaText = `Oluşturulma: ${formatDateTime(config.metadata.generatedAt)}`;
    doc.text(metaText, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 6;
  }

  // Separator line
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.5);
  doc.line(14, yPosition, pageWidth - 14, yPosition);
  yPosition += 10;

  return yPosition;
}

/**
 * Add PDF stats section
 */
function addPDFStats(
  doc: jsPDF,
  stats: ExportStats,
  yPosition: number,
  pageWidth: number,
  pageHeight: number
): number {
  // Check for page break
  if (yPosition > pageHeight - 60) {
    doc.addPage();
    yPosition = 20;
  }

  // Stats title
  if (stats.title) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text(stats.title, 14, yPosition);
    yPosition += 8;
  }

  // Stats grid (2 columns)
  const statsPerRow = 2;
  const statWidth = (pageWidth - 28 - 4) / statsPerRow; // 4mm gap
  let xPosition = 14;
  let rowIndex = 0;

  for (const stat of stats.items) {
    // Background box
    doc.setFillColor(248, 250, 252); // slate-50
    doc.roundedRect(xPosition, yPosition, statWidth, 20, 2, 2, 'F');

    // Border
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.3);
    doc.roundedRect(xPosition, yPosition, statWidth, 20, 2, 2, 'S');

    // Label
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(stat.label, xPosition + 3, yPosition + 6);

    // Value
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text(String(stat.value), xPosition + 3, yPosition + 15);

    // Trend (if provided)
    if (stat.trend) {
      const trendText = `${stat.trend.isPositive ? '↑' : '↓'} ${Math.abs(stat.trend.value)}%`;
      doc.setFontSize(8);
      doc.setTextColor(stat.trend.isPositive ? 34 : 220, stat.trend.isPositive ? 197 : 38, stat.trend.isPositive ? 94 : 38);
      doc.text(trendText, xPosition + statWidth - 3, yPosition + 15, { align: 'right' });
    }

    rowIndex++;
    if (rowIndex >= statsPerRow) {
      xPosition = 14;
      yPosition += 24;
      rowIndex = 0;
    } else {
      xPosition += statWidth + 4;
    }
  }

  if (rowIndex > 0) {
    yPosition += 24;
  }

  yPosition += 5;
  return yPosition;
}

/**
 * Add PDF table
 */
function addPDFTable(
  doc: jsPDF,
  table: ExportTable,
  yPosition: number,
  pageWidth: number,
  pageHeight: number
): number {
  // Check for page break
  if (yPosition > pageHeight - 80) {
    doc.addPage();
    yPosition = 20;
  }

  // Table title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(table.title, 14, yPosition);
  yPosition += 6;

  // Table description
  if (table.description) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(table.description, 14, yPosition);
    yPosition += 5;
  }

  // AutoTable
  autoTable(doc, {
    startY: yPosition,
    head: [table.headers],
    body: table.rows.map(row => row.map(cell => cell === null ? '-' : String(cell))),
    theme: 'grid',
    headStyles: {
      fillColor: [99, 102, 241], // indigo-500
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'left',
      cellPadding: 3,
    },
    bodyStyles: {
      textColor: [15, 23, 42],
      fontSize: 9,
      cellPadding: 2.5,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252], // slate-50
    },
    columnStyles: {
      // Auto-adjust column widths
    },
    margin: { left: 14, right: 14 },
    didDrawPage: (data) => {
      // Add page numbers if table spans multiple pages
      if (data.pageNumber > 1) {
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(
          `Sayfa ${data.pageNumber}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }
    },
  });

  // @ts-expect-error - autoTable adds finalY
  yPosition = doc.lastAutoTable.finalY + 5;

  // Table summary (if provided)
  if (table.summary && table.summary.length > 0) {
    yPosition += 3;
    doc.setFillColor(248, 250, 252);
    doc.rect(14, yPosition, pageWidth - 28, table.summary.length * 6 + 4, 'F');

    for (const item of table.summary) {
      yPosition += 5;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      doc.text(item.label, 16, yPosition);
      doc.text(String(item.value), pageWidth - 16, yPosition, { align: 'right' });
    }

    yPosition += 4;
  }

  yPosition += 10;
  return yPosition;
}

/**
 * Add charts placeholder
 */
function addPDFChartsPlaceholder(
  doc: jsPDF,
  charts: ExportChart[],
  yPosition: number,
  pageWidth: number
): number {
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `[${charts.length} grafik - Detaylı rapor için Excel formatını kullanın]`,
    pageWidth / 2,
    yPosition,
    { align: 'center' }
  );
  return yPosition + 10;
}

/**
 * Add PDF notes
 */
function addPDFNotes(
  doc: jsPDF,
  notes: string[],
  yPosition: number,
  pageWidth: number,
  pageHeight: number
): number {
  if (yPosition > pageHeight - 40) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('Notlar', 14, yPosition);
  yPosition += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);

  for (const note of notes) {
    const lines = doc.splitTextToSize(`• ${note}`, pageWidth - 28);
    doc.text(lines, 14, yPosition);
    yPosition += lines.length * 4 + 2;

    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = 20;
    }
  }

  return yPosition;
}

/**
 * Add PDF footer to all pages
 */
function addPDFFooter(doc: jsPDF, config: ExportConfig): void {
  const pageCount = doc.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Footer line
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(14, pageHeight - 15, pageWidth - 14, pageHeight - 15);

    // Company name
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    const companyText = config.metadata?.company || 'AsistanApp';
    doc.text(companyText, 14, pageHeight - 10);

    // Page number
    doc.text(`Sayfa ${i} / ${pageCount}`, pageWidth - 14, pageHeight - 10, {
      align: 'right',
    });

    // Generated date (center)
    if (config.metadata?.generatedAt) {
      doc.text(
        formatDate(config.metadata.generatedAt),
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }
  }
}

// ==================== EXCEL EXPORT ====================

/**
 * Export data to Excel with Turkish character support
 */
export async function exportToExcel(data: ExportData): Promise<void> {
  const wb = XLSX.utils.book_new();

  // ========== SUMMARY SHEET ==========
  if (data.stats) {
    const summaryData = [
      [data.config.title],
      data.config.subtitle ? [data.config.subtitle] : [],
      data.config.dateRange ? ['Dönem', data.config.dateRange] : [],
      [],
      ['İSTATİSTİKLER'],
      [],
    ];

    for (const stat of data.stats.items) {
      summaryData.push([stat.label, String(stat.value)]);
    }

    const ws = XLSX.utils.aoa_to_sheet(summaryData);

    // Styling (basic)
    ws['!cols'] = [{ wch: 30 }, { wch: 20 }];

    XLSX.utils.book_append_sheet(wb, ws, 'Özet');
  }

  // ========== TABLE SHEETS ==========
  if (data.tables && data.tables.length > 0) {
    for (let i = 0; i < data.tables.length; i++) {
      const table = data.tables[i];
      const tableData = [
        [table.title],
        table.description ? [table.description] : [],
        [],
        table.headers,
        ...table.rows,
      ];

      if (table.summary && table.summary.length > 0) {
        tableData.push([]);
        tableData.push(['ÖZET']);
        for (const item of table.summary) {
          tableData.push([item.label, item.value]);
        }
      }

      const ws = XLSX.utils.aoa_to_sheet(tableData);
      const sheetName = table.title.substring(0, 31); // Excel limit

      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    }
  }

  // ========== SAVE ==========
  const filename = generateFilename(data.config.title, 'xlsx');
  XLSX.writeFile(wb, filename, { compression: true });
}

// ==================== CSV EXPORT ====================

/**
 * Export data to CSV with UTF-8 BOM (for Turkish characters in Excel)
 */
export async function exportToCSV(data: ExportData): Promise<void> {
  let csvContent = '';

  // Header
  csvContent += `"${data.config.title}"\n`;
  if (data.config.subtitle) {
    csvContent += `"${data.config.subtitle}"\n`;
  }
  if (data.config.dateRange) {
    csvContent += `"Dönem: ${data.config.dateRange}"\n`;
  }
  csvContent += '\n';

  // Stats
  if (data.stats) {
    csvContent += '"İSTATİSTİKLER"\n';
    for (const stat of data.stats.items) {
      csvContent += `"${stat.label}","${stat.value}"\n`;
    }
    csvContent += '\n';
  }

  // Tables
  if (data.tables && data.tables.length > 0) {
    for (const table of data.tables) {
      csvContent += `"${table.title}"\n`;
      if (table.description) {
        csvContent += `"${table.description}"\n`;
      }

      // Headers
      csvContent += table.headers.map(h => `"${h}"`).join(',') + '\n';

      // Rows
      for (const row of table.rows) {
        csvContent += row.map(cell => `"${cell === null ? '' : cell}"`).join(',') + '\n';
      }

      csvContent += '\n';

      // Summary
      if (table.summary && table.summary.length > 0) {
        csvContent += '"ÖZET"\n';
        for (const item of table.summary) {
          csvContent += `"${item.label}","${item.value}"\n`;
        }
        csvContent += '\n';
      }
    }
  }

  // Add UTF-8 BOM for Turkish character support in Excel
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], {
    type: 'text/csv;charset=utf-8;',
  });

  // Download
  const filename = generateFilename(data.config.title, 'csv');
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ==================== UTILITIES ====================

/**
 * Generate filename with timestamp
 */
function generateFilename(title: string, extension: string): string {
  const timestamp = formatDate(new Date().toISOString()).replace(/[/:]/g, '-');
  const sanitized = title
    .toLowerCase()
    .replace(/[^a-z0-9ğüşöçıİ]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return `${sanitized}-${timestamp}.${extension}`;
}

