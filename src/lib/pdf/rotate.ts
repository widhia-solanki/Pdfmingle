// src/lib/pdf/rotate.ts

import { PDFDocument, degrees } from 'pdf-lib';

/**
 * Rotates pages in a PDF document.
 * @param file The PDF file to process.
 * @param rotations A map of page indices (0-based) to their rotation angle (90, 180, 270).
 * @returns A Promise that resolves with the new PDF as a Uint8Array.
 */
export const rotatePdf = async (
  file: File,
  rotations: { [key: number]: number }
): Promise<Uint8Array> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pageCount = pdfDoc.getPageCount();

  for (let i = 0; i < pageCount; i++) {
    const angle = rotations[i];
    if (angle) {
      const page = pdfDoc.getPage(i);
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees(currentRotation + angle));
    }
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};
