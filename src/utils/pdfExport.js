import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Generate PDF report for measurement book
 */
export function generatePDF(data) {
  const {
    workDetail = '',
    workType = '',
    rows = [],
  } = data;

  // Create new PDF document
  const doc = new jsPDF();
  
  // Set font
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  
  // Header
  doc.text('MEASUREMENT BOOK', 105, 15, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  
  let yPos = 25;
  
  // Work details
  if (workDetail) {
    // Split workDetail into lines if it has multiple lines
    const workDetailLines = workDetail.split('\n').filter(Boolean);
    doc.text(`Work Detail: ${workDetailLines[0]}`, 14, yPos);
    yPos += 7;
    
    // Add additional lines if any
    for (let i = 1; i < workDetailLines.length; i++) {
      doc.text(workDetailLines[i], 14, yPos);
      yPos += 7;
    }
  }
  
  if (workType) {
    doc.text(`Work Type: ${workType}`, 14, yPos);
    yPos += 7;
  }
  
  yPos += 3;
  
  // Prepare table data
  const tableData = rows.map((row, index) => [
    index + 1, // S.No
    row.length || '', // Length
    row.heightReadings || '', // Height
    row.topReadings || '', // Top
    row.bedWidth || '', // Bed
    row.volFt3 ? row.volFt3.toFixed(2) : '0.00', // Vol (ft³)
    row.volM3 ? row.volM3.toFixed(2) : '0.00', // Vol (m³)
  ]);
  
  // Calculate grand totals
  const totalFt3 = rows.reduce((sum, row) => sum + (row.volFt3 || 0), 0);
  const totalM3 = rows.reduce((sum, row) => sum + (row.volM3 || 0), 0);
  
  // Add table
  doc.autoTable({
    startY: yPos,
    head: [['S.No', 'Length', 'Height', 'Top', 'Bed', 'Vol (ft³)', 'Vol (m³)']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [16, 185, 129], // Emerald green to match website
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 10,
    },
    styles: {
      fontSize: 9,
      cellPadding: 3,
      textColor: [31, 41, 55], // Gray-900
    },
    columnStyles: {
      0: { cellWidth: 15, halign: 'center' }, // S.No
      1: { cellWidth: 25 }, // Length
      2: { cellWidth: 30 }, // Height
      3: { cellWidth: 30 }, // Top
      4: { cellWidth: 25 }, // Bed
      5: { cellWidth: 28, halign: 'right' }, // Vol (ft³)
      6: { cellWidth: 28, halign: 'right' }, // Vol (m³)
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251], // Gray-50
    },
  });
  
  // Get final Y position after table
  const finalY = doc.lastAutoTable.finalY || yPos + 50;
  
  // Add footer with totals (styled to match website)
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129); // Emerald green
  doc.text('Grand Total:', 14, finalY + 10);
  doc.setTextColor(0, 0, 0); // Black
  doc.text(`${totalFt3.toFixed(2)} ft³`, 60, finalY + 10);
  doc.text(`${totalM3.toFixed(2)} m³`, 100, finalY + 10);
  
  return doc;
}

/**
 * Generate and download PDF
 */
export function downloadPDF(data) {
  const doc = generatePDF(data);
  const {
    workDetail = '',
  } = data;
  
  // Use first line of workDetail for filename, or first 20 chars
  const workDetailForFile = workDetail.split('\n')[0] || workDetail.substring(0, 20) || 'Report';
  const sanitized = workDetailForFile.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
  const fileName = `Volume_Calculation_${sanitized}.pdf`;
  doc.save(fileName);
}

/**
 * Generate PDF and return as blob for sharing
 */
export async function sharePDF(data) {
  const doc = generatePDF(data);
  const {
    workDetail = '',
  } = data;
  
  // Use first line of workDetail for filename
  const workDetailForFile = workDetail.split('\n')[0] || workDetail.substring(0, 20) || 'Report';
  const sanitized = workDetailForFile.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
  const fileName = `Volume_Calculation_${sanitized}.pdf`;
  
  const pdfBlob = doc.output('blob');
  const file = new File([pdfBlob], fileName, { type: 'application/pdf' });
  
  // Check if Web Share API is available
  if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: 'Volume Calculation Report',
        text: `Volume calculation report for ${workDetailForFile || 'construction work'}`,
      });
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error sharing:', error);
        // Fallback to download
        downloadPDF(data);
      }
    }
  } else {
    // Fallback: copy link or download
    downloadPDF(data);
  }
}

