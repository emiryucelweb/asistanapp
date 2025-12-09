 

/**
 * Export Helpers - PDF and Excel Export Utilities
 * Uses jspdf and xlsx libraries for generating exports
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { formatCurrency, formatNumber, formatDate } from './formatters';

export interface ExportData {
  title: string;
  subtitle?: string;
  dateRange: string;
  tables?: {
    title: string;
    headers: string[];
    rows: (string | number)[][];
  }[];
  stats?: {
    label: string;
    value: string | number;
  }[];
}

/**
 * Export data as PDF with Turkish character support
 */
export const exportToPDF = (data: ExportData) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  
  // Note: jsPDF'in default font'u Türkçe karakterleri destekler (Helvetica)
  // Daha iyi görünüm için font boyutlarını optimize ediyoruz
  
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPosition = 20;

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(data.title, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  // Subtitle
  if (data.subtitle) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(data.subtitle, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 8;
  }

  // Date Range
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105); // slate-600
  doc.text(data.dateRange, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Quick Stats
  if (data.stats && data.stats.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text('Özet İstatistikler', 14, yPosition);
    yPosition += 8;

    const statsPerRow = 2;
    const statWidth = (pageWidth - 28) / statsPerRow;
    let xPosition = 14;
    let rowIndex = 0;

    data.stats.forEach((stat, _index) => {
      doc.setFillColor(248, 250, 252); // slate-50
      doc.rect(xPosition, yPosition, statWidth - 4, 18, 'F');
      
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(stat.label, xPosition + 3, yPosition + 6);
      
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text(String(stat.value), xPosition + 3, yPosition + 14);

      rowIndex++;
      if (rowIndex >= statsPerRow) {
        xPosition = 14;
        yPosition += 22;
        rowIndex = 0;
      } else {
        xPosition += statWidth;
      }
    });

    if (rowIndex > 0) {
      yPosition += 22;
    }
    yPosition += 5;
  }

  // Tables
  if (data.tables && data.tables.length > 0) {
    data.tables.forEach((table, _index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text(table.title, 14, yPosition);
      yPosition += 5;

      autoTable(doc, {
        startY: yPosition,
        head: [table.headers],
        body: table.rows,
        theme: 'striped',
        headStyles: {
          fillColor: [249, 115, 22], // orange-500
          textColor: [255, 255, 255],
          fontSize: 10,
          fontStyle: 'bold',
        },
        bodyStyles: {
          textColor: [15, 23, 42],
          fontSize: 9,
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252], // slate-50
        },
        margin: { left: 14, right: 14 },
      });

      // @ts-expect-error - autoTable adds finalY to doc
      yPosition = doc.lastAutoTable.finalY + 10;
    });
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(
      `Sayfa ${i} / ${pageCount} - AsistanApp © ${new Date().getFullYear()}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  // Save PDF
  const fileName = `${data.title.replace(/\s+/g, '_')}_${formatDate(new Date()).replace(/\./g, '-')}.pdf`;
  doc.save(fileName);
};

/**
 * Export data as Excel
 */
export const exportToExcel = (data: ExportData) => {
  const workbook = XLSX.utils.book_new();

  // Create summary sheet
  const summaryData: any[][] = [
    [data.title],
    [data.subtitle || ''],
    [data.dateRange],
    [''],
  ];

  if (data.stats && data.stats.length > 0) {
    summaryData.push(['Özet İstatistikler']);
    summaryData.push(['Metrik', 'Değer']);
    data.stats.forEach(stat => {
      summaryData.push([stat.label, stat.value]);
    });
    summaryData.push(['']);
  }

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);

  // Style summary sheet
  summarySheet['!cols'] = [{ wch: 30 }, { wch: 20 }];
  
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Özet');

  // Create sheets for each table
  if (data.tables && data.tables.length > 0) {
    data.tables.forEach((table, _index) => {
      const tableData = [table.headers, ...table.rows];
      const tableSheet = XLSX.utils.aoa_to_sheet(tableData);
      
      // Auto-size columns
      const columnWidths = table.headers.map((header, colIndex) => {
        const maxLength = Math.max(
          header.length,
          ...table.rows.map(row => String(row[colIndex] || '').length)
        );
        return { wch: Math.min(maxLength + 2, 30) };
      });
      tableSheet['!cols'] = columnWidths;

      const sheetName = table.title.substring(0, 31); // Excel sheet name limit
      XLSX.utils.book_append_sheet(workbook, tableSheet, sheetName);
    });
  }

  // Save Excel
  const fileName = `${data.title.replace(/\s+/g, '_')}_${formatDate(new Date()).replace(/\./g, '-')}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

/**
 * Export data as CSV
 */
export const exportToCSV = (data: ExportData) => {
  let csvContent = '';

  // Header
  csvContent += `"${data.title}"\n`;
  if (data.subtitle) {
    csvContent += `"${data.subtitle}"\n`;
  }
  csvContent += `"${data.dateRange}"\n\n`;

  // Stats
  if (data.stats && data.stats.length > 0) {
    csvContent += '"Özet İstatistikler"\n';
    csvContent += '"Metrik","Değer"\n';
    data.stats.forEach(stat => {
      csvContent += `"${stat.label}","${stat.value}"\n`;
    });
    csvContent += '\n';
  }

  // Tables
  if (data.tables && data.tables.length > 0) {
    data.tables.forEach((table, _index) => {
      csvContent += `"${table.title}"\n`;
      csvContent += table.headers.map(h => `"${h}"`).join(',') + '\n';
      table.rows.forEach(row => {
        csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
      });
      csvContent += '\n';
    });
  }

  // Download with BOM for Excel UTF-8 support
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  const fileName = `${data.title.replace(/\s+/g, '_')}_${formatDate(new Date()).replace(/\./g, '-')}.csv`;

  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

