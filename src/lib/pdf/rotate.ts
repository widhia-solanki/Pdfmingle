// src/lib/pdf/rotate.ts

import { PDFDocument, degrees } from 'pdf-lib';

export const rotatePDF = async (file: File, angle: number): Promise<Uint8Array> => {
  const pdfBytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();
  
  pages.forEach(page => {
    // We add 90 degrees to the current rotation of each page
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees(currentRotation + 90));
  });

  return await pdfDoc.save();
};
