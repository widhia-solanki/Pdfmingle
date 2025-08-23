// src/lib/pdf/rotate.ts

import { PDFDocument, degrees } from 'pdf-lib';

/**
 * Rotates pages in a PDF document.
 * Can rotate all pages by a single angle or specific pages by different angles.
 * @param file The PDF file to process.
 * @param rotationOrRotations A single angle (number) for all pages, or an object mapping page indices to angles.
 * @returns A Promise that resolves with the new PDF as a Uint8Array.
 */
export const rotatePdf = async (
  file: File,
  rotationOrRotations: number | { [key: number]: number }
): Promise<Uint8Array> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pageCount = pdfDoc.getPageCount();

  if (typeof rotationOrRotations === 'number') {
    // Mode 1: Rotate all pages by a single angle
    const angle = rotationOrRotations;
    if (angle === 0) return pdfDoc.save();

    for (let i = 0; i < pageCount; i++) {
      const page = pdfDoc.getPage(i);
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees(currentRotation + angle));
    }
  } else {
    // Mode 2: Rotate specific pages by angles defined in the object
    const rotations = rotationOrRotations;
    for (let i = 0; i < pageCount; i++) {
      const angle = rotations[i];
      if (angle) { // Only rotate if an angle is specified for this page
        const page = pdfDoc.getPage(i);
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees(currentRotation + angle));
      }
    }
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};
