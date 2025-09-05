// src/lib/pdf/watermark.ts

import { PDFDocument, rgb, StandardFonts, degrees, PageSizes } from 'pdf-lib';
import { WatermarkState } from '@/components/tools/WatermarkOptions';

// Helper to convert HEX color to RGB
const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
      }
    : { r: 0, g: 0, b: 0 };
};

export const addWatermarkToPdf = async (
  pdfFile: File,
  options: WatermarkState
): Promise<Uint8Array> => {
  const pdfBytes = await pdfFile.arrayBuffer();
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  let watermarkImage: any = null;
  if (options.type === 'image' && options.image) {
    const imageBytes = await options.image.arrayBuffer();
    if (options.image.type === 'image/png') {
      watermarkImage = await pdfDoc.embedPng(imageBytes);
    } else {
      watermarkImage = await pdfDoc.embedJpg(imageBytes);
    }
  }

  for (const page of pages) {
    const { width, height } = page.getSize();
    const rotationDegrees = options.rotation;

    if (options.positioning === 'tiled') {
      const tileSize = options.type === 'text' ? 300 : 400; // Spacing between tiles
      for (let y = -height; y < height * 2; y += tileSize) {
        for (let x = -width; x < width * 2; x += tileSize) {
          if (options.type === 'text') {
            page.drawText(options.text, {
              x,
              y,
              font,
              size: options.fontSize,
              color: hexToRgb(options.color),
              opacity: options.opacity,
              rotate: degrees(rotationDegrees),
            });
          } else if (watermarkImage) {
            const imgDims = watermarkImage.scale(0.5); // Example scaling
            page.drawImage(watermarkImage, {
              x,
              y,
              width: imgDims.width,
              height: imgDims.height,
              opacity: options.opacity,
              rotate: degrees(rotationDegrees),
            });
          }
        }
      }
    } else { // Single position
      let x = 0, y = 0;
      const margin = 50;

      const elementWidth = options.type === 'text' 
        ? font.widthOfTextAtSize(options.text, options.fontSize)
        : watermarkImage.scale(0.5).width; // Use a consistent scale for preview
      const elementHeight = options.type === 'text'
        ? font.heightAtSize(options.fontSize)
        : watermarkImage.scale(0.5).height;

      switch (options.position) {
        case 'top-left':
          x = margin;
          y = height - elementHeight - margin;
          break;
        case 'top-right':
          x = width - elementWidth - margin;
          y = height - elementHeight - margin;
          break;
        case 'bottom-left':
          x = margin;
          y = margin;
          break;
        case 'bottom-right':
          x = width - elementWidth - margin;
          y = margin;
          break;
        case 'center':
        default:
          x = (width - elementWidth) / 2;
          y = (height - elementHeight) / 2;
          break;
      }
      
      if (options.type === 'text') {
        page.drawText(options.text, {
          x,
          y,
          font,
          size: options.fontSize,
          color: hexToRgb(options.color),
          opacity: options.opacity,
          rotate: degrees(rotationDegrees),
        });
      } else if (watermarkImage) {
        const imgDims = watermarkImage.scale(0.5);
         page.drawImage(watermarkImage, {
          x,
          y,
          width: imgDims.width,
          height: imgDims.height,
          opacity: options.opacity,
          rotate: degrees(rotationDegrees),
        });
      }
    }
  }

  return await pdfDoc.save();
};
