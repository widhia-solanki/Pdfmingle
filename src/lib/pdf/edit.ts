// src/lib/pdf/edit.ts

import { PDFDocument, rgb, StandardFonts, PDFFont, PDFImage, svgPathToAcroform, AcroForm } from 'pdf-lib';
import getStroke from 'perfect-freehand';
import { getSvgPathFromStroke } from './getSvgPathFromStroke';

// --- ADDED DRAW OBJECT TYPE ---
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

// ... (getFont function remains the same)
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
    const { height: pageHeight, width: pageWidth } = page.getSize();
    
    const scale = 1.5;

    if (obj.type === 'text') {
      const { x, y, text, size, font, color, width } = obj;
      const pdfFont = await getFont(pdfDoc, font);
      page.drawText(text, {
        x: x / scale,
        y: pageHeight - (y / scale) - (size / scale),
        font: pdfFont,
        size: size / scale,
        color: rgb(color.r / 255, color.g / 255, color.b / 255),
        maxWidth: width / scale,
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
        // --- NEW DRAWING LOGIC ---
        const { points, color, strokeWidth } = obj;
        const scaledPoints = points.map(p => ({ ...p, x: p.x / scale, y: p.y / scale }));
        const stroke = getStroke(scaledPoints, {
            size: strokeWidth,
            thinning: 0.5,
            smoothing: 0.5,
            streamline: 0.5,
        });
        const pathData = getSvgPathFromStroke(stroke);
        
        page.drawSvg(pathData, {
            x: 0,
            y: pageHeight, // SVG origin is top-left, but we must flip the y-axis
            color: rgb(color.r / 255, color.g / 255, color.b / 255),
            scale: 1,
            // Invert the y-axis for the entire SVG path
            transform: {
                ySkew: 0,
                xSkew: 0,
                yScale: -1, // This flips the drawing vertically
                xScale: 1,
                y: pageHeight, // Move it back into view
                x: 0
            }
        });
    }
  }

  return await pdfDoc.save();
};
