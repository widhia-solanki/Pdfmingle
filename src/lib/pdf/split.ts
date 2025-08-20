// src/lib/pdf/split.ts

import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import type { SplitRange } from '@/components/tools/SplitOptions';

export const splitPDF = async (file: File, ranges: SplitRange[]): Promise<Blob> => {
  const zip = new JSZip();

  const pdfBytes = await file.arrayBuffer();
  const originalPdfDoc = await PDFDocument.load(pdfBytes);
  const totalPages = originalPdfDoc.getPageCount();

  if (ranges.length === 0) {
    throw new Error("Please define at least one page range to split.");
  }

  for (let i = 0; i < ranges.length; i++) {
    const range = ranges[i];
    const { from, to } = range;
    
    if (from > to || from < 1 || to > totalPages) {
      throw new Error(`Invalid page range: ${from}-${to}. Pages must be between 1 and ${totalPages}.`);
    }

    const newPdfDoc = await PDFDocument.create();
    
    const pageIndicesToCopy = [];
    for (let j = from - 1; j < to; j++) {
      pageIndicesToCopy.push(j);
    }
    
    const copiedPages = await newPdfDoc.copyPages(originalPdfDoc, pageIndicesToCopy);
    copiedPages.forEach((page) => newPdfDoc.addPage(page));
    
    const newPdfBytes = await newPdfDoc.save();
    
    const originalName = file.name.replace(/\.pdf$/i, '');
    zip.file(`${originalName}_range_${from}-${to}.pdf`, newPdfBytes);
  }

  return zip.generateAsync({ type: 'blob' });
};
