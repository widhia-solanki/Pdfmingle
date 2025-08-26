// src/lib/pdf/edit.ts

import { PDFDocument, rgb, StandardFonts, PDFFont } from 'pdf-lib';

export interface TextObject {
  id: string; // Unique ID for the text object
  x: number;
  y: number;
  text: string;
  size: number;
  font: string; // We'll map this to a PDFFont
  color: { r: number; g: number; b: number };
  pageIndex: number;
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
      
      // The y-coordinate needs to be flipped, as pdf-lib's origin is the bottom-left
      const { height } = page.getSize();
      const yFlipped = height - textObject.y;

     // src/lib/pdf/edit.ts

export interface TextObject {
  id: string; 
  x: number;
  y: number;
  text: string;
  size: number;
  font: string; 
  color: { r: number; g: number; b: number };
  pageIndex: number;
  // --- ADD THESE NEW PROPERTIES ---
  width?: number; // Optional width for handling interactions
  isEditing?: boolean; // To know if we're currently editing the text
}

// ... the rest of your applyEditsToPdf function stays the same

  return await pdfDoc.save();
};
