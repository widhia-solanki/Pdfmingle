// src/lib/pdf/rotate.ts

import { PDFDocument, degrees } from 'pdf-lib';

export interface PageRotation {
  [pageIndex: number]: number; // Maps page index to its new rotation angle (e.g., { 0: 90, 2: 180 })
}

export const rotatePDF = async (
  file: File, 
  rotations: PageRotation
): Promise<Uint8Array> => {
  const pdfBytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();

  // Iterate over the rotation instructions
  for (const pageIndexStr in rotations) {
    const pageIndex = parseInt(pageIndexStr, 10);
    const angle = rotations[pageIndex];

    // Ensure the page exists before trying to rotate it
    if (pageIndex >= 0 && pageIndex < pages.length) {
      const page = pages[pageIndex];
      // Set the page's rotation to the specified absolute angle
      page.setRotation(degrees(angle));
    }
  }

  return await pdfDoc.save();
};
