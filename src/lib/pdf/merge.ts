import { PDFDocument } from 'pdf-lib';

// The function now only needs the array of files in the correct order
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
