// src/lib/pdf/edit.ts

import { PDFDocument, rgb, StandardFonts, PDFFont, PDFImage, line, moveTo, close, LineCapStyle } from 'pdf-lib';
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
    
    const scale = 1.5;

    if (obj.type === 'text') {
      const { x, y, text, size, font, color, width } = obj;
      const pdfFont = await getFont(pdfDoc, font);
      page.drawText(text, {
        x: x / scale,
        y: pageHeight - y / scale - size,
        font: pdfFont,
        size: size,
        color: rgb(color.r / 255, color.g / 255, color.b / 255),
        maxWidth: width / scale,
        lineHeight: size * 1.2,
      });
    } else if (obj.type === 'image') {
      const { x, y, imageBytes, width, height } = obj;
      const image = await (new Uint8Array(imageBytes)[0] === 0x89
          ? pdfDoc.embedPng(imageBytes)
          : pdfDoc.embedJpg(imageBytes));
      page.drawImage(image, { 
          x: x / scale, 
          y: pageHeight - (y / scale) - (height / scale),
          width: width / scale, 
          height: height / scale 
      });
    } else if (obj.type === 'drawing') {
      // --- THIS IS THE FIX ---
      // We are now using the correct page.drawpath method instead of drawSvg.
      const { points, color, strokeWidth } = obj;
      const stroke = getStroke(points, {
        size: strokeWidth,
        thinning: 0.5,
        smoothing: 0.5,
        streamline: 0.5,
      });
      const pathData = getSvgPathFromStroke(stroke);
      
      // The y-coordinates need to be flipped for pdf-lib's coordinate system
      const flippedPath = pathData.replace(/(\d+(\.\d+)?)\s*,?\s*(\d+(\.\d+)?)/g, (match, x, _, y) => {
          const scaledY = pageHeight - (parseFloat(y) / scale);
          const scaledX = parseFloat(x) / scale;
          return `${scaledX} ${scaledY}`;
      });

      page.drawpath(flippedPath, {
        borderColor: rgb(color.r/255, color.g/255, color.b/255),
        borderWidth: 0, // The "stroke" from perfect-freehand is a filled shape
        color: rgb(color.r/255, color.g/255, color.b/255),
      });
    }
  }

  return await pdfDoc.save();
};
