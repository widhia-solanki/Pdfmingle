// src/lib/pdf/compress.ts

import { PDFDocument, PDFImage, PDFPage } from 'pdf-lib';
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
  const pages = pdfDoc.getPages();
  
  // A map to track which original images we have already compressed
  const processedImages = new Map<string, PDFImage>();

  for (const page of pages) {
    const resources = page.getResources();
    const imageNames = resources.XObject ? Object.keys(resources.XObject) : [];

    for (const imageName of imageNames) {
      const xobject = resources.XObject[imageName];
      // Check if this resource is an image
      if (pdfDoc.context.lookup(xobject) instanceof PDFImage) {
        const imageRef = xobject.toString();
        
        // If we haven't already processed this image, compress it now
        if (!processedImages.has(imageRef)) {
          try {
            const image = pdfDoc.context.lookup(xobject) as PDFImage;

            // Skip very small images
            if (image.width < 100 || image.height < 100) {
              processedImages.set(imageRef, image); // Mark as processed
              continue;
            }

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
            
            // Store the new, compressed image in our map
            processedImages.set(imageRef, newImage);

          } catch (error) {
            console.warn(`Could not compress an image. Skipping.`, error);
          }
        }
        
        // --- THIS IS THE CRITICAL FIX ---
        // Replace the image on the page with the (potentially compressed) version from our map
        if (processedImages.has(imageRef)) {
          page.getXObject(imageName).set(processedImages.get(imageRef)!.ref);
        }
      }
    }
  }

  return pdfDoc.save();
};
