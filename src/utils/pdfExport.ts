import jsPDF from 'jspdf';
import type { InvoiceWithFees } from '../types/invoice';
import { CURRENCY_SYMBOLS } from '../types/invoice';

export function exportInvoiceToPDF(invoice: InvoiceWithFees) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  let yPos = 20;

  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Invoice Number: ${invoice.invoice_number}`, 20, yPos);
  yPos += 6;
  doc.text(`Issue Date: ${new Date(invoice.issue_date).toLocaleDateString()}`, 20, yPos);
  yPos += 6;
  doc.text(`Due Date: ${new Date(invoice.due_date).toLocaleDateString()}`, 20, yPos);
  yPos += 6;
  doc.text(`Status: ${invoice.status.toUpperCase()}`, 20, yPos);
  yPos += 15;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To:', 20, yPos);
  yPos += 6;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.client_name, 20, yPos);
  yPos += 6;
  doc.text(invoice.client_email, 20, yPos);
  yPos += 6;

  const addressLines = doc.splitTextToSize(invoice.client_address, 80);
  doc.text(addressLines, 20, yPos);
  yPos += addressLines.length * 6 + 10;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Patent Information:', 20, yPos);
  yPos += 6;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Patent Number: ${invoice.patent_number}`, 20, yPos);
  yPos += 6;
  const titleLines = doc.splitTextToSize(`Patent Title: ${invoice.patent_title}`, 170);
  doc.text(titleLines, 20, yPos);
  yPos += titleLines.length * 6 + 15;

  const tableHeaders = ['Description', 'Type', 'Qty', 'Unit Price', 'Amount'];
  const colWidths = [70, 35, 15, 30, 30];
  const tableStartX = 20;
  const tableStartY = yPos;

  doc.setFillColor(240, 240, 240);
  doc.rect(tableStartX, tableStartY, pageWidth - 40, 8, 'F');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  let currentX = tableStartX + 2;
  tableHeaders.forEach((header, i) => {
    doc.text(header, currentX, tableStartY + 6);
    currentX += colWidths[i];
  });

  yPos = tableStartY + 10;
  doc.setFont('helvetica', 'normal');

  invoice.fees.forEach((fee) => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }

    currentX = tableStartX + 2;

    const descLines = doc.splitTextToSize(fee.fee_description, colWidths[0] - 4);
    doc.text(descLines, currentX, yPos + 4);
    currentX += colWidths[0];

    doc.text(fee.fee_type, currentX, yPos + 4);
    currentX += colWidths[1];

    doc.text(fee.quantity.toString(), currentX, yPos + 4);
    currentX += colWidths[2];

    doc.text(
      `${CURRENCY_SYMBOLS[invoice.currency]}${fee.unit_price.toFixed(2)}`,
      currentX,
      yPos + 4
    );
    currentX += colWidths[3];

    doc.text(
      `${CURRENCY_SYMBOLS[invoice.currency]}${fee.amount.toFixed(2)}`,
      currentX,
      yPos + 4
    );

    const lineHeight = Math.max(descLines.length * 5, 8);
    yPos += lineHeight;
  });

  yPos += 5;
  doc.setDrawColor(200, 200, 200);
  doc.line(tableStartX, yPos, pageWidth - 20, yPos);
  yPos += 10;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Total:', pageWidth - 80, yPos);
  doc.text(
    `${CURRENCY_SYMBOLS[invoice.currency]}${invoice.total_amount.toFixed(2)} ${invoice.currency}`,
    pageWidth - 20,
    yPos,
    { align: 'right' }
  );

  if (invoice.notes) {
    yPos += 15;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Notes:', 20, yPos);
    yPos += 6;
    doc.setFont('helvetica', 'normal');
    const notesLines = doc.splitTextToSize(invoice.notes, pageWidth - 40);
    doc.text(notesLines, 20, yPos);
  }

  doc.save(`invoice-${invoice.invoice_number}.pdf`);
}
