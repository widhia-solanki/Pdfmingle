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

  // --- THIS IS THE FIX: Use the correct public API to get images ---
  const pages = pdfDoc.getPages();
  const imageRefs = new Set();

  // Find all unique image references in the document
  for (const page of pages) {
    const images = page.getXObjects();
    images.forEach((xobject, ref) => {
      if (xobject instanceof PDFImage) {
        imageRefs.add(ref);
      }
    });
  }

  // A map to avoid re-compressing the same image
  const compressedImageCache = new Map();

  for (const ref of Array.from(imageRefs)) {
    if (compressedImageCache.has(ref)) continue;

    try {
      const image = pdfDoc.context.lookup(ref) as PDFImage;
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
      
      // Replace the image in the document's context
      pdfDoc.context.assign(ref, newImage.ref);
      compressedImageCache.set(ref, newImage);
      
    } catch (error) {
      console.warn("Could not compress an image within the PDF:", error);
    }
  }

  return pdfDoc.save();
};
