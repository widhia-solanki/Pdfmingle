// src/lib/pdf/split.ts
import JSZip from 'jszip';

// This function will split a PDF into multiple single-page PDFs and return a ZIP file
export const splitPDF = async (file: File): Promise<Blob> => {
  const { PDFDocument } = await import('pdf-lib');
  const zip = new JSZip();

  const pdfBytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const totalPages = pdfDoc.getPageCount();

  for (let i = 0; i < totalPages; i++) {
    const newPdf = await PDFDocument.create();
    const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
    newPdf.addPage(copiedPage);
    const newPdfBytes = await newPdf.save();
    zip.file(`page_${i + 1}.pdf`, newPdfBytes);
  }

  return zip.generateAsync({ type: 'blob' });
};
