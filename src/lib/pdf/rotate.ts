// src/lib/pdf/rotate.ts

import { PDFDocument, degrees } from 'pdf-lib';

/**
 * Rotates all pages in a PDF document by the same angle.
 * @param file The PDF file to process.
 * @param rotation The angle to rotate all pages (e.g., 90, 180, 270).
 * @returns A Promise that resolves with the new PDF as a Uint8Array.
 */
export const rotatePdf = async (
  file: File,
  rotation: number
): Promise<Uint8Array> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pageCount = pdfDoc.getPageCount();

  // If rotation is 0, no need to do anything.
  if (rotation === 0) {
    return pdfDoc.save();
  }

  // Apply the same rotation to every page.
  for (let i = 0; i < pageCount; i++) {
    const page = pdfDoc.getPage(i);
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees(currentRotation + rotation));
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};
