// src/lib/pdf/organize.ts

import { PDFDocument, degrees } from 'pdf-lib';

export interface PageObject {
  id: string; // A unique identifier for the page, e.g., `page-0`, `page-1`
  originalIndex: number;
  rotation: number;
}

/**
 * Reorganizes a PDF based on a new page order, handling deletions and rotations.
 * @param file The original PDF file.
 * @param pages The array of PageObject representing the new order and state of pages.
 * @returns A Promise that resolves with the new PDF as a Uint8Array.
 */
export const organizePdf = async (
  file: File,
  pages: PageObject[]
): Promise<Uint8Array> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const newPdfDoc = await PDFDocument.create();

  // Create a map of original page indices to their current rotation
  const rotationMap = new Map<number, number>();
  pages.forEach(p => {
    rotationMap.set(p.originalIndex, p.rotation);
  });
  
  // Get the indices of the pages in their new order
  const pageIndicesToCopy = pages.map(p => p.originalIndex);

  // Copy the pages from the original document into the new one
  const copiedPages = await newPdfDoc.copyPages(pdfDoc, pageIndicesToCopy);

  // Add the copied pages to the new document and apply rotations
  copiedPages.forEach((page, index) => {
    const originalIndex = pageIndicesToCopy[index];
    const rotation = rotationMap.get(originalIndex) || 0;
    
    if (rotation !== 0) {
      page.setRotation(degrees(rotation));
    }
    
    newPdfDoc.addPage(page);
  });

  const pdfBytes = await newPdfDoc.save();
  return pdfBytes;
};
