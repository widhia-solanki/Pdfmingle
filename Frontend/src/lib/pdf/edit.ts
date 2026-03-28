// src/lib/pdf/edit.ts

import { PDFDocument, rgb, StandardFonts, PDFFont, PDFImage, cmyk, grayscale, LineCapStyle } from 'pdf-lib';
import getStroke from 'perfect-freehand';
import { getSvgPathFromStroke } from './getSvgPathFromStroke';

// --- NEW SHAPE OBJECT TYPE ---
export interface ShapeObject {
  type: 'shape';
  id: string;
  pageIndex: number;
  shapeType: 'rectangle';
  x: number;
  y: number;
  width: number;
  height: number;
  fillColor: { r: number; g: number; b: number; a: number }; // Added alpha for opacity
  borderColor: { r: number; g: number; b: number };
  borderWidth: number;
}

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

export type EditableObject = TextObject | ImageObject | DrawObject | HighlightObject | ShapeObject;

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
        const { points, color, strokeWidth } = obj;
        const transformedPoints = points.map(p => ({ ...p, x: p.x / renderScale, y: pageHeight - (p.y / renderScale) }));
        const stroke = getStroke(transformedPoints, { size: strokeWidth / renderScale });
        const pathData = getSvgPathFromStroke(stroke);
        page.drawSvgPath(pathData, { 
            color: rgb(color.r/255, color.g/255, color.b/255),
            opacity: obj.type === 'highlight' ? obj.opacity : 1.0,
        });
    } else if (obj.type === 'shape') {
        // --- NEW SHAPE LOGIC ---
        const { x, y, width, height, fillColor, borderColor, borderWidth } = obj;
        if (obj.shapeType === 'rectangle') {
            page.drawRectangle({
                x: x / renderScale,
                y: pageHeight - (y / renderScale) - (height / renderScale),
                width: width / renderScale,
                height: height / renderScale,
                color: rgb(fillColor.r / 255, fillColor.g / 255, fillColor.b / 255),
                opacity: fillColor.a,
                borderColor: rgb(borderColor.r / 255, borderColor.g / 255, borderColor.b / 255),
                borderWidth: borderWidth / renderScale,
            });
        }
    }
  }

  return await pdfDoc.save();
};
