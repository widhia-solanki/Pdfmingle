// src/lib/pdf/merge.ts

import { PDFDocument } from 'pdf-lib';

// --- THIS IS THE FIX: The function now accepts the new page order ---
export const mergePDFs = async (
  files: File[],
  pageOrder: { pageIndex: number; originalFileIndex: number }[]
): Promise<Uint8Array> => {
  const mergedPdfDoc = await PDFDocument.create();

  // Load all the uploaded PDF documents into an array
  const loadedDocs = await Promise.all(
    files.map(async (file) => {
      const pdfBytes = await file.arrayBuffer();
      return await PDFDocument.load(pdfBytes);
    })
  );

  // Use the pageOrder array to copy pages in the correct sequence
  for (const orderInfo of pageOrder) {
    const sourceDoc = loadedDocs[orderInfo.originalFileIndex];
    if (sourceDoc) {
      const [copiedPage] = await mergedPdfDoc.copyPages(sourceDoc, [orderInfo.pageIndex]);
      mergedPdfDoc.addPage(copiedPage);
    }
  }

  return await mergedPdfDoc.save();
};
