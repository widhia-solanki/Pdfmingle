import { PDFDocument } from 'pdf-lib';

export const mergePDFs = async (files: File[]): Promise<Uint8Array> => {
  const mergedPdfDoc = await PDFDocument.create();

  for (const file of files) {
    try {
      const pdfBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
      copiedPages.forEach((page) => {
        mergedPdfDoc.addPage(page);
      });
    } catch (err) {
      console.error(`Failed to process file ${file.name}:`, err);
      throw new Error(`Could not process ${file.name}. It may be corrupt or password-protected.`);
    }
  }

  return await mergedPdfDoc.save();
};
