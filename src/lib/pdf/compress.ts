// src/lib/pdf/compress.ts

import { PDFDocument, PDFImage } from 'pdf-lib';
import imageCompression from 'browser-image-compression';
import type { CompressionLevel } from '@/components/tools/CompressOptions';

// Maps our friendly names to options for the browser-image-compression library
const compressionOptions = {
  low: { maxSizeMB: 2, maxWidthOrHeight: 1920 },
  medium: { maxSizeMB: 1, maxWidthOrHeight: 1080 },
  high: { maxSizeMB: 0.5, maxWidthOrHeight: 720 },
};

export const compressPDF = async (file: File, level: CompressionLevel): Promise<Uint8Array> => {
  const pdfBytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const imageObjects = pdfDoc.context.indirectObjects.filter(obj => obj instanceof PDFImage);

  // A map to avoid re-compressing the same image if it appears on multiple pages
  const compressedImageCache = new Map<string, PDFImage>();

  for (const image of imageObjects) {
    const ref = image.ref.toString();
    if (compressedImageCache.has(ref)) continue; // Skip if already processed

    try {
      const imageBytes = await image.embed();
      const mimeType = image.isJpg() ? 'image/jpeg' : 'image/png';
      
      const imageFile = new File([imageBytes], `image.${mimeType.split('/')[1]}`, { type: mimeType });
      
      const compressedFile = await imageCompression(imageFile, compressionOptions[level]);
      const compressedBytes = await compressedFile.arrayBuffer();
      
      let newImage: PDFImage;
      if (mimeType === 'image/jpeg') {
        newImage = await pdfDoc.embedJpg(compressedBytes);
      } else {
        newImage = await pdfDoc.embedPng(compressedBytes);
      }

      // Replace the old image object with our new, smaller one
      pdfDoc.context.assign(image.ref, newImage.ref);
      compressedImageCache.set(ref, newImage);

    } catch (error) {
      console.warn("Could not compress an image within the PDF:", error);
      // If an image fails to compress, we simply skip it and continue.
    }
  }

  return pdfDoc.save();
};
