// src/lib/pdf/split.ts

import { PDFDocument } from 'pdf-lib';
import type { SplitRange } from '@/components/tools/SplitOptions'; // Import the type

export const splitPDF = async (file: File, ranges: SplitRange[]): Promise<Blob> => {
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();

  const pdfBytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const totalPages = pdfDoc.getPageCount();

  if (ranges.length === 0) {
    throw new Error("No split ranges were defined. Please add at least one range.");
  }

  for (let i = 0; i < ranges.length; i++) {
    const range = ranges[i];
    const { from, to } = range;
    
    if (from > to || from < 1 || to > totalPages) {
        throw new Error(`Invalid page range provided: ${from}-${to}. Please ensure ranges are within 1 and ${totalPages}.`);
    }

    const newPdfDoc = await PDFDocument.create();
    const pageIndices = [];
    for (let j = from - 1; j < to; j++) {
      pageIndices.push(j);
    }
    
    const copiedPages = await newPdfDoc.copyPages(pdfDoc, pageIndices);
    copiedPages.forEach((page) => newPdfDoc.addPage(page));
    
    const newPdfBytes = await newPdfDoc.save();
    const originalName = file.name.replace(/\.pdf$/i, '');
    zip.file(`${originalName}_range_${from}-${to}.pdf`, newPdfBytes);
  }

  return zip.generateAsync({ type: 'blob' });
};
