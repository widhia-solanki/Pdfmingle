// src/lib/pdf/edit.ts

import { PDFDocument, rgb, StandardFonts, PDFFont, PDFImage } from 'pdf-lib';

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

export type EditableObject = TextObject | ImageObject;

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
    const x = obj.x / scale;
    const y = pageHeight - (obj.y / scale) - (obj.height / scale);
    const width = obj.width / scale;
    const height = obj.height / scale;

    if (obj.type === 'text') {
      const font = await getFont(pdfDoc, obj.font);
      page.drawText(obj.text, {
        x,
        y,
        font,
        size: obj.size / scale,
        color: rgb(obj.color.r / 255, obj.color.g / 255, obj.color.b / 255),
        lineHeight: (obj.size * 1.2) / scale,
        maxWidth: width,
      });
    } else if (obj.type === 'image') {
      let image: PDFImage;
      
      // --- THIS IS THE FIX ---
      // We must create a Uint8Array view to read the bytes of the ArrayBuffer.
      const bytes = new Uint8Array(obj.imageBytes);
      const isPng = bytes[0] === 0x89 && bytes[1] === 0x50;
      
      if (isPng) {
        image = await pdfDoc.embedPng(obj.imageBytes);
      } else {
        image = await pdfDoc.embedJpg(obj.imageBytes);
      }
      page.drawImage(image, { x, y, width, height });
    }
  }

  return await pdfDoc.save();
};
