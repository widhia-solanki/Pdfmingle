// src/lib/pdf/rotate.ts

import { PDFDocument, RotationTypes, degrees } from 'pdf-lib';
import type { RotationDirection } from '@/components/tools/RotateOptions';

export const rotatePDF = async (
  file: File, 
  direction: RotationDirection
): Promise<Uint8Array> => {
  const pdfBytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();

  // Determine the angle based on the selected direction
  const angle = direction === 'right' ? 90 : -90;

  // Apply the rotation to every page in the document
  pages.forEach(page => {
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees(currentRotation + angle));
  });

  return await pdfDoc.save();
};
