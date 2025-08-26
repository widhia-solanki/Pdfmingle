// src/lib/pdf/edit.ts

import { PDFDocument, rgb, StandardFonts, PDFFont, PDFImage, cmyk, grayscale } from 'pdf-lib';
import getStroke from 'perfect-freehand';
import { getSvgPathFromStroke } from './getSvgPathFromStroke';

// --- ADDED HIGHLIGHT OBJECT TYPE ---
export interface HighlightObject {
  type: 'highlight';
  id: string;
  pageIndex: number;
  points: { x: number; y: number; pressure: number }[];
  color: { r: number; g: number; b: number };
  strokeWidth: number;
  opacity: number;
}

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
  isEditing?: boolean;
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

// Add the new type to our union
export type EditableObject = TextObject | ImageObject | DrawObject | HighlightObject;

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
  objects: EditableObject[],
  renderScale: number
): Promise<Uint8Array> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pages = pdfDoc.getPages();

  for (const obj of objects) {
    if (obj.pageIndex >= pages.length) continue;
    
    const page = pages[obj.pageIndex];
    const { height: pageHeight } = page.getSize();

    if (obj.type === 'text') {
      const { x, y, text, size, font, color, width } = obj;
      const pdfFont = await getFont(pdfDoc, font);
      page.drawText(text, {
        x: x / renderScale,
        y: pageHeight - y / renderScale - size / renderScale,
        font: pdfFont,
        size: size / renderScale,
        color: rgb(color.r / 255, color.g / 255, color.b / 255),
        maxWidth: width / renderScale,
        lineHeight: (size * 1.2) / renderScale,
      });
    } else if (obj.type === 'image') {
      const { x, y, imageBytes, width, height } = obj;
      const image = await (new Uint8Array(imageBytes)[0] === 0x89
          ? pdfDoc.embedPng(imageBytes)
          : pdfDoc.embedJpg(imageBytes));
      page.drawImage(image, { 
          x: x / renderScale, 
          y: pageHeight - (y / renderScale) - (height / renderScale),
          width: width / renderScale, 
          height: height / renderScale 
      });
    } else if (obj.type === 'drawing' || obj.type === 'highlight') {
      // --- UPDATED TO HANDLE BOTH DRAWING AND HIGHLIGHTING ---
      const { points, color, strokeWidth } = obj;
      const transformedPoints = points.map(p => {
        const x = p.x / renderScale;
        const y = pageHeight - (p.y / renderScale);
        return { ...p, x, y };
      });
      const stroke = getStroke(transformedPoints, { size: strokeWidth / renderScale });
      const pathData = getSvgPathFromStroke(stroke);
      
      page.drawSvgPath(pathData, { 
        color: rgb(color.r/255, color.g/255, color.b/255),
        // Highlights are semi-transparent
        opacity: obj.type === 'highlight' ? obj.opacity : 1.0,
      });
    }
  }

  return await pdfDoc.save();
};
