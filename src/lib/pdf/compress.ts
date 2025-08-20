// src/lib/pdf/compress.ts

import { PDFDocument, PDFImage } from 'pdf-lib';
import imageCompression from 'browser-image-compression';
import type { CompressionLevel } from '@/components/tools/CompressOptions';

const compressionOptions = {
  low: { maxSizeMB: 2, maxWidthOrHeight: 1920, useWebWorker: true },
  medium: { maxSizeMB: 1, maxWidthOrHeight: 1080, useWebWorker: true },
  high: { maxSizeMB: 0.5, maxWidthOrHeight: 720, useWebWorker: true },
};

// --- THIS IS THE FIX: A new function to reliably detect image type ---
const detectImageType = (bytes: Uint8Array): 'image/jpeg' | 'image/png' | null => {
  // JPEG magic numbers: FF D8 FF
  if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) {
    return 'image/jpeg';
  }
  // PNG magic numbers: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E &&
    bytes[3] === 0x47 && bytes[4] === 0x0D && bytes[5] === 0x0A &&
    bytes[6] === 0x1A && bytes[7] === 0x0A
  ) {
    return 'image/png';
  }
  return null;
};

export const compressPDF = async (file: File, level: CompressionLevel): Promise<Uint8Array> => {
  const pdfBytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(pdfBytes);

  const imageRefs = pdfDoc.context.enumerateIndirectObjects()
    .filter(([ref, obj]) => obj instanceof PDFImage)
    .map(([ref]) => ref);

  for (const ref of imageRefs) {
    try {
      const image = pdfDoc.context.lookup(ref);
      if (!(image instanceof PDFImage)) continue;

      if (image.width < 100 || image.height < 100) continue;
      
      const imageBytes = await image.embed();
      
      // Use our new detection function instead of .isJpg()
      const mimeType = detectImageType(imageBytes);
      if (!mimeType) {
        console.warn(`Skipping an image with an unknown type (Ref: ${ref}).`);
        continue;
      }
      
      const imageFile = new File([imageBytes], `image.${mimeType.split('/')[1]}`, { type: mimeType });
      
      const compressedFile = await imageCompression(imageFile, compressionOptions[level]);
      const compressedBytes = await compressedFile.arrayBuffer();
      
      let newImage: PDFImage;
      if (mimeType === 'image/jpeg') {
        newImage = await pdfDoc.embedJpg(compressedBytes);
      } else {
        newImage = await pdfDoc.embedPng(compressedBytes);
      }
      
      pdfDoc.context.assign(ref, newImage.ref);
      
    } catch (error) {
      console.warn(`Could not compress an image (Ref: ${ref}). Skipping.`, error);
    }
  }

  return pdfDoc.save();
};
