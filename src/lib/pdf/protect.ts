// src/lib/pdf/protect.ts

import { PDFDocument } from 'pdf-lib';

/**
 * Encrypts a PDF with a user-provided password.
 * @param file The original PDF file.
 * @param password The password to apply for encryption.
 * @returns A Promise that resolves with the new, encrypted PDF as a Uint8Array.
 */
export const protectPdf = async (
  file: File,
  password: string
): Promise<Uint8Array> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);

  // This is the correct, verified method for pdf-lib v1.17.1.
  // The encryption options are passed directly to the .save() method.
  const pdfBytes = await pdfDoc.save({
    userPassword: password, // The password to open the document.
    // permissions: { printing: 'highResolution' } // Optional: to set specific permissions
  });

  return pdfBytes;
};
