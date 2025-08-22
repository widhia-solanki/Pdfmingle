// src/lib/pdf/rotate.ts

import { PDFDocument, RotationTypes } from 'pdf-lib';

// --- THIS IS THE FIX: Changed from 'export default' to a named 'export const' ---
export const rotatePDF = async (file: File, angle: 90 | 180 | 270): Promise<Uint8Array> => {
  const pdfBytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(pdfBytes);

  const pages = pdfDoc.getPages();
  
  pages.forEach(page => {
    const currentRotation = page.getRotation().angle;
    page.setRotation({ type: RotationTypes.Degrees, angle: currentRotation + angle });
  });

  return await pdfDoc.save();
};
