// src/lib/pdf/edit.ts

import { PDFDocument, rgb, StandardFonts, PDFFont, PDFImage } from 'pdf-lib';
import getStroke from 'perfect-freehand';
import { getSvgPathFromStroke } from './getSvgPathFromStroke';

export interface DrawObject {
  type: 'drawing';
  id: string;
  pageIndex: number;
  points: { x: number; y: number; pressure: number }[];
  color: { r: number; g: number; b: number };
  strokeWidth: number;
}

export interface TextObject {
  type: 'text';
  id: string; 
  x: number;
  y: number;
  text: string;
  size: number;
  font: string; 
  color: { r: number; g: number; b: number };
  pageIndex: number;
  width: number;
  height: number;
}

export interface ImageObject {
  type: 'image';
  id: string;
  x: number;
  y: number;
  pageIndex: number;
  imageBytes: ArrayBuffer;
  width: number;
  height: number;
}

export type EditableObject = TextObject | ImageObject | DrawObject;

const getFont = async (doc: PDFDocument, fontName: string): Promise<PDFFont> => {
  switch (fontName) {
    case 'Helvetica': return await doc.embedFont(StandardFonts.Helvetica);
    case 'TimesRoman': return await doc.embedFont(StandardFonts.TimesRoman);
    case 'Courier': return await doc.embedFont(StandardFonts.Courier);
    default: return await doc.embedFont(StandardFonts.Helvetica);
  }
};

export const applyEditsToPdf = async (
  file: File,
  objects: EditableObject[]
): Promise<Uint8Array> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pages = pdfDoc.getPages();

  for (const obj of objects) {
    if (obj.pageIndex >= pages.length) continue;
    
    const page = pages[obj.pageIndex];
    const { height: pageHeight } = page.getSize();
    
    const scaleFactor = 1.5;

    if (obj.type === 'text') {
      const { x, y, text, size, font, color, width } = obj;
      const pdfFont = await getFont(pdfDoc, font);
      page.drawText(text, {
        x: x / scaleFactor,
        y: pageHeight - y / scaleFactor - size,
        font: pdfFont,
        size: size,
        color: rgb(color.r / 255, color.g / 255, color.b / 255),
        maxWidth: width / scaleFactor,
        lineHeight: size * 1.2,
      });
    } else if (obj.type === 'image') {
      const { x, y, imageBytes, width, height } = obj;
      const image = await (new Uint8Array(imageBytes)[0] === 0x89
          ? pdfDoc.embedPng(imageBytes)
          : pdfDoc.embedJpg(imageBytes));
      page.drawImage(image, { 
          x: x / scaleFactor, 
          y: pageHeight - (y / scaleFactor) - (height / scaleFactor),
          width: width / scaleFactor, 
          height: height / scaleFactor 
      });
    } else if (obj.type === 'drawing') {
      // --- THIS IS THE FINAL, CORRECT IMPLEMENTATION ---
      const { points, color, strokeWidth } = obj;
      const stroke = getStroke(points, {
        size: strokeWidth,
        thinning: 0.5,
        smoothing: 0.5,
        streamline: 0.5,
      });
      const pathData = getSvgPathFromStroke(stroke);
      
      // Save the current graphics state
      page.saveGraphicsState();

      // Apply transformations directly on the page
      page.scale(1 / scaleFactor, -1 / scaleFactor);
      page.translate(0, -pageHeight * scaleFactor);

      // Draw the path
      page.drawSvgPath(pathData, {
        color: rgb(color.r/255, color.g/255, color.b/255),
      });

      // Restore the graphics state to remove the transformations for the next object
      page.restoreGraphicsState();
    }
  }

  return await pdfDoc.save();
};
