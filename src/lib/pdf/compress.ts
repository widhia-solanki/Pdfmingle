// src/lib/pdf/compress.ts

import { PDFDocument, PDFImage } from 'pdf-lib';
import imageCompression from 'browser-image-compression';
import type { CompressionLevel } from '@/components/tools/CompressOptions';

const compressionOptions = {
  low: { maxSizeMB: 2, maxWidthOrHeight: 1920, useWebWorker: true },
  medium: { maxSizeMB: 1, maxWidthOrHeight: 1080, useWebWorker: true },
  high: { maxSizeMB: 0.5, maxWidthOrHeight: 720, useWebWorker: true },
};

export const compressPDF = async (file: File, level: CompressionLevel): Promise<Uint8Array> => {
  const pdfBytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(pdfBytes);

  const imageRefs = pdfDoc.context.enumerateIndirectObjects()
    .filter(([ref, obj]) => obj instanceof PDFImage)
    .map(([ref]) => ref);

  const compressedImageCache = new Map();

  for (const ref of imageRefs) {
    if (compressedImageCache.has(ref)) continue;

    try {
      const object = pdfDoc.context.lookup(ref);
      
      // --- THIS IS THE FIX: Safely check if the object is a PDFImage ---
      if (object instanceof PDFImage) {
        const image = object;
        if (image.width < 100 || image.height < 100) continue;
        
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
        
        pdfDoc.context.assign(ref, newImage.ref);
        compressedImageCache.set(ref, newImage);
      }
      
    } catch (error) {
      console.warn(`Could not compress an image (Ref: ${ref}). Skipping.`, error);
    }
  }

  return pdfDoc.save();
};
