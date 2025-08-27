// src/lib/pdf/crop.ts

import { PDFDocument } from 'pdf-lib';

// Note: The CropMode type is now managed on the frontend, this file no longer needs it.

export interface MarginState {
  top: number;
  bottom: number;
  left: number;
  right: number;
  unit: 'px' | '%';
}

export const cropPdfWithMargins = async (
  file: File,
  allMargins: { [pageIndex: number]: MarginState },
  mode: string, // Changed to simple string
  activePageIndex: number
): Promise<Uint8Array> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pages = pdfDoc.getPages();

  const masterMargins = allMargins[activePageIndex] || { top: 0, bottom: 0, left: 0, right: 0, unit: 'px' };

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const { width, height } = page.getSize();
    
    let marginsToApply = masterMargins;
    // For 'current' mode, if we are NOT on the active page, just continue to the next one
    if (mode === 'current' && i !== activePageIndex) {
      continue;
    }
    // For 'all' mode, the marginsToApply is already masterMargins. No extra logic needed.


    let { top, bottom, left, right, unit } = marginsToApply;

    let topPx = top;
    let bottomPx = bottom;
    let leftPx = left;
    let rightPx = right;

    if (unit === '%') {
      topPx = height * (top / 100);
      bottomPx = height * (bottom / 100);
      leftPx = width * (left / 100);
      rightPx = width * (right / 100);
    }

    const newWidth = width - leftPx - rightPx;
    const newHeight = height - topPx - bottomPx;

    if (newWidth <= 0 || newHeight <= 0) {
        throw new Error(`Invalid crop dimensions on page ${i + 1}. The margins are larger than the page size.`);
    }

    page.setCropBox(leftPx, bottomPx, newWidth, newHeight);
  }

  return await pdfDoc.save();
};
