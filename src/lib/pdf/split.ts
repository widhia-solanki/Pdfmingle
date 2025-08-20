// src/lib/pdf/split.ts

import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';

// This function splits a PDF into single-page PDFs and returns a ZIP file Blob
export const splitPDF = async (file: File): Promise<Blob> => {
  // Dynamically import jszip to keep the main bundle small
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();

  const pdfBytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const totalPages = pdfDoc.getPageCount();

  if (totalPages <= 1) {
    throw new Error("Cannot split a PDF with only one page.");
  }

  for (let i = 0; i < totalPages; i++) {
    // Create a new PDF document for each page
    const newPdfDoc = await PDFDocument.create();
    const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i]);
    newPdfDoc.addPage(copiedPage);

    // Save the new single-page PDF as bytes
    const newPdfBytes = await newPdfDoc.save();
    
    // Add the new PDF to the ZIP file
    const originalName = file.name.replace(/\.pdf$/i, '');
    zip.file(`${originalName}_page_${i + 1}.pdf`, newPdfBytes);
  }

  // Generate the ZIP file as a Blob
  return zip.generateAsync({ type: 'blob' });
};
