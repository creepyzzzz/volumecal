import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Generate PDF report for measurement book
 */
export function generatePDF(data) {
  const {
    workName = '',
    siteLocation = '',
    workType = '',
    date = new Date().toLocaleDateString(),
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
  if (workName) {
    doc.text(`Work Name: ${workName}`, 14, yPos);
    yPos += 7;
  }
  
  if (siteLocation) {
    doc.text(`Site Location: ${siteLocation}`, 14, yPos);
    yPos += 7;
  }
  
  if (workType) {
    doc.text(`Work Type: ${workType}`, 14, yPos);
    yPos += 7;
  }
  
  doc.text(`Date: ${date}`, 14, yPos);
  yPos += 10;
  
  // Prepare table data
  const tableData = rows.map((row, index) => [
    index + 1, // S.No
    row.length || '', // Length
    row.heightReadings || '', // Height Readings
    row.topReadings || '', // Top Readings
    row.bedWidth || '', // Bed Width
    row.volFt3 ? row.volFt3.toFixed(2) : '0.00', // Vol (ft³)
    row.volM3 ? row.volM3.toFixed(2) : '0.00', // Vol (m³)
  ]);
  
  // Calculate grand totals
  const totalFt3 = rows.reduce((sum, row) => sum + (row.volFt3 || 0), 0);
  const totalM3 = rows.reduce((sum, row) => sum + (row.volM3 || 0), 0);
  
  // Add table
  doc.autoTable({
    startY: yPos,
    head: [['S.No', 'Length', 'Height Readings', 'Top Readings', 'Bed Width', 'Vol (ft³)', 'Vol (m³)']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [66, 66, 66],
      textColor: 255,
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    columnStyles: {
      0: { cellWidth: 15 }, // S.No
      1: { cellWidth: 25 }, // Length
      2: { cellWidth: 35 }, // Height Readings
      3: { cellWidth: 35 }, // Top Readings
      4: { cellWidth: 25 }, // Bed Width
      5: { cellWidth: 25 }, // Vol (ft³)
      6: { cellWidth: 25 }, // Vol (m³)
    },
  });
  
  // Get final Y position after table
  const finalY = doc.lastAutoTable.finalY || yPos + 50;
  
  // Add footer with totals
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Grand Total Volume: ${totalFt3.toFixed(2)} ft³ (${totalM3.toFixed(2)} m³)`, 14, finalY + 10);
  
  // Save PDF
  const fileName = `Volume_Calculation_${workName || 'Report'}_${date.replace(/\//g, '-')}.pdf`;
  doc.save(fileName);
}

