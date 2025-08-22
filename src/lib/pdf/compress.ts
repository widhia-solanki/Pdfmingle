// src/lib/pdf/compress.ts

import { PDFDocument, PDFImage } from 'pdf-lib';
import imageCompression from 'browser-image-compression';
import type { CompressionLevel } from '@/components/tools/CompressOptions';

const compressionOptions = {
  low: { maxSizeMB: 2, maxWidthOrHeight: 1920, useWebWorker: true },
  medium: { maxSizeMB: 1, maxWidthOrHeight: 1080, useWebWorker: true },
  high: { maxSizeMB: 0.5, maxWidthOrHeight: 720, useWebWorker: true },
};

// Helper to reliably detect image type from raw bytes
const detectImageType = (bytes: Uint8Array): 'image/jpeg' | 'image/png' | null => {
  if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) {
    return 'image/jpeg';
  }
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
    return 'image/png';
  }
  return null;
};

export const compressPDF = async (file: File, level: CompressionLevel): Promise<Uint8Array> => {
  const pdfBytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(pdfBytes);

  // Use the documented public API to find all image objects in the document
  const imageRefs = pdfDoc.context.enumerateIndirectObjects()
    .filter(([ref, obj]) => obj instanceof PDFImage)
    .map(([ref]) => ref);

  for (const ref of imageRefs) {
    try {
      const image = pdfDoc.context.lookup(ref);

      // A robust type guard to satisfy TypeScript
      if (!(image instanceof PDFImage)) {
        continue;
      }
      
      // Skip very small images that won't benefit from compression
      if (image.width < 100 || image.height < 100) {
        continue;
      }
      
      // THIS IS THE CRITICAL FIX: Access the raw, unmodified image data
      const imageBytes: Uint8Array = (image as any).encodedBytes;
      if (!imageBytes) {
        continue;
      }
      
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
      
      // Replace the old image object with the new, smaller one
      pdfDoc.context.assign(ref, newImage.ref);
      
    } catch (error) {
      console.warn(`Could not compress an image (Ref: ${ref}). Skipping.`, error);
    }
  }

  return pdfDoc.save();
};
