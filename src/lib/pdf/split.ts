// src/lib/pdf/split.ts

import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import type { SplitRange } from '@/components/tools/SplitOptions';

export const splitPDF = async (file: File, ranges: SplitRange[]): Promise<Blob> => {
  // Use a static import for JSZip for reliability
  const zip = new JSZip();

  const pdfBytes = await file.arrayBuffer();
  // Load the original PDF document once
  const originalPdfDoc = await PDFDocument.load(pdfBytes);
  const totalPages = originalPdfDoc.getPageCount();

  if (ranges.length === 0) {
    throw new Error("Please define at least one page range to split.");
  }

  // Process each custom range defined by the user
  for (let i = 0; i < ranges.length; i++) {
    const range = ranges[i];
    const { from, to } = range;
    
    // Validate the range against the total number of pages
    if (from > to || from < 1 || to > totalPages) {
      throw new Error(`Invalid page range: ${from}-${to}. Pages must be between 1 and ${totalPages}.`);
    }

    // Create a new, blank PDF document for this specific range
    const newPdfDoc = await PDFDocument.create();
    
    // Create an array of page indices for pdf-lib (0-based)
    const pageIndicesToCopy = [];
    for (let j = from - 1; j < to; j++) {
      pageIndicesToCopy.push(j);
    }
    
    // Copy the selected pages from the original document to the new one
    const copiedPages = await newPdfDoc.copyPages(originalPdfDoc, pageIndicesToCopy);
    copiedPages.forEach((page) => newPdfDoc.addPage(page));
    
    // Save the new PDF document into a byte array
    const newPdfBytes = await newPdfDoc.save();
    
    const originalName = file.name.replace(/\.pdf$/i, '');
    zip.file(`${originalName}_range_${from}-${to}.pdf`, newPdfBytes);
  }

  // Generate the final ZIP file containing all the new PDFs
  return zip.generateAsync({ type: 'blob' });
};
