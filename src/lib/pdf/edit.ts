// src/lib/pdf/edit.ts

import { PDFDocument, rgb, StandardFonts, PDFFont } from 'pdf-lib';

export interface TextObject {
  id: string; 
  x: number;
  y: number;
  text: string;
  size: number;
  font: string; 
  color: { r: number; g: number; b: number };
  pageIndex: number;
  width?: number; 
  isEditing?: boolean;
}

// A helper to map font names to the standard fonts
const getFont = async (doc: PDFDocument, fontName: string): Promise<PDFFont> => {
  switch (fontName) {
    case 'Helvetica':
      return await doc.embedFont(StandardFonts.Helvetica);
    case 'TimesRoman':
      return await doc.embedFont(StandardFonts.TimesRoman);
    case 'Courier':
      return await doc.embedFont(StandardFonts.Courier);
    default:
      return await doc.embedFont(StandardFonts.Helvetica);
  }
};

// --- THIS IS THE FULL, CORRECT FUNCTION ---
export const applyEditsToPdf = async (
  file: File,
  textObjects: TextObject[]
): Promise<Uint8Array> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pages = pdfDoc.getPages();

  for (const textObject of textObjects) {
    if (textObject.pageIndex < pages.length) {
      const page = pages[textObject.pageIndex];
      const font = await getFont(pdfDoc, textObject.font);
      
      const { height } = page.getSize();
      // Adjust for canvas scale (1.5) and flipped y-coordinate.
      // The y coordinate also needs to account for the font size to align properly.
      const yFlipped = height - (textObject.y / 1.5) - (textObject.size);
      const x = textObject.x / 1.5;


      page.drawText(textObject.text, {
        x: x,
        y: yFlipped,
        font,
        size: textObject.size,
        color: rgb(textObject.color.r / 255, textObject.color.g / 255, textObject.color.b / 255),
        lineHeight: textObject.size * 1.2,
        maxWidth: textObject.width ? textObject.width / 1.5 : undefined
      });
    }
  }

  return await pdfDoc.save();
};
