// src/lib/pdf/rotate.ts

import { PDFDocument, RotationTypes, degrees } from 'pdf-lib';

export const rotatePDF = async (
  file: File, 
  rotations: { [pageIndex: number]: number }
): Promise<Uint8Array> => {
  const pdfBytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();

  // Apply the specific rotation to each page that has one
  for (const pageIndexStr in rotations) {
    const pageIndex = parseInt(pageIndexStr, 10);
    if (pageIndex >= 0 && pageIndex < pages.length) {
      const angle = rotations[pageIndex];
      pages[pageIndex].setRotation(degrees(angle));
    }
  }

  return await pdfDoc.save();
};
