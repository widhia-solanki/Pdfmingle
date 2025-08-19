// src/lib/pdf/merge.ts
import { PDFDocument } from 'pdf-lib';

export const mergePDFs = async (files: File[]): Promise<Uint8Array> => {
  const mergedPdfDoc = await PDFDocument.create();

  for (const file of files) {
    const pdfBytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const copiedPages = await mergedPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
    copiedPages.forEach((page) => {
      mergedPdfDoc.addPage(page);
    });
  }

  return await mergedPdfDoc.save();
};
