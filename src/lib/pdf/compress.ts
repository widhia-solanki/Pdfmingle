// src/lib/pdf/compress.ts

import {
  PDFDocument,
  PDFImage,
  PDFName,
  PDFNumber,
  PDFRawStream,
} from 'pdf-lib';
import imageCompression from 'browser-image-compression';
import type { CompressionLevel } from '@/components/tools/CompressOptions';

const compressionOptions = {
  low: { maxSizeMB: 2, maxWidthOrHeight: 1920, useWebWorker: true },
  medium: { maxSizeMB: 1, maxWidthOrHeight: 1080, useWebWorker: true },
  high: { maxSizeMB: 0.5, maxWidthOrHeight: 720, useWebWorker: true },
};

const detectImageType = (
  bytes: Uint8Array
): 'image/jpeg' | 'image/png' | null => {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'image/jpeg';
  }
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return 'image/png';
  }
  return null;
};

export const compressPDF = async (
  file: File,
  level: CompressionLevel
): Promise<Uint8Array> => {
  const pdfBytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(pdfBytes, {
    // This option is crucial for preserving the structure
    updateMetadata: false, 
  });

  const imageRefs = new Set<any>();
  pdfDoc.getPages().forEach((page) => {
    const xObject = page.node.XObjects();
    if (xObject) {
      xObject.keys().forEach((key) => {
        const streamRef = xObject.get(key);
        if (streamRef) {
          imageRefs.add(streamRef);
        }
      });
    }
  });

  for (const ref of imageRefs) {
    try {
      const stream = pdfDoc.context.lookup(ref);

      if (
        stream instanceof PDFRawStream &&
        stream.dict.get(PDFName.of('Subtype')) === PDFName.of('Image')
      ) {
        const imageBytes = stream.contents;
        const widthObj = stream.dict.get(PDFName.of('Width'));
        const heightObj = stream.dict.get(PDFName.of('Height'));

        if (
          widthObj instanceof PDFNumber &&
          heightObj instanceof PDFNumber &&
          (widthObj.asNumber() < 100 || heightObj.asNumber() < 100)
        ) {
          continue;
        }
        
        const mimeType = detectImageType(imageBytes);
        if (!mimeType) {
          console.warn(`Skipping an image with an unknown type (Ref: ${ref}).`);
          continue;
        }

        const imageFile = new File(
          [imageBytes],
          `image.${mimeType.split('/')[1]}`,
          { type: mimeType }
        );

        const compressedFile = await imageCompression(
          imageFile,
          compressionOptions[level]
        );
        const compressedBytes = await compressedFile.arrayBuffer();

        let newImage: PDFImage;
        if (mimeType === 'image/jpeg') {
          newImage = await pdfDoc.embedJpg(compressedBytes);
        } else {
          newImage = await pdfDoc.embedPng(compressedBytes);
        }
        
        // This is a bit of a hack to replace the image data directly
        // We're replacing the underlying PDFStream's dictionary with the new image's dictionary
        const newStream = pdfDoc.context.lookup(newImage.ref) as PDFRawStream;
        stream.dict.set(PDFName.of('Length'), PDFNumber.of(compressedBytes.byteLength));
        stream.dict.set(PDFName.of('Filter'), newStream.dict.get(PDFName.of('Filter')) as any);
        (stream as any).contents = newStream.contents;
      }
    } catch (error) {
      console.warn(`Could not compress an image (Ref: ${ref}). Skipping.`, error);
    }
  }

  return pdfDoc.save({ useObjectStreams: false });
};
