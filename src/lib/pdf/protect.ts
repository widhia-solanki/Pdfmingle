// src/lib/pdf/protect.ts

import { PDFDocument, StandardFonts, rgb, PDFString } from 'pdf-lib';

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

  // pdf-lib's encryption feature is accessed via the save method with specific options.
  // There is no explicit encrypt() method. The library handles the complex parts
  // of creating the correct document structure for a password-protected PDF.
  
  // The 'userPassword' is the password required to open the document.
  // We are setting it to the user's provided password.
  const pdfBytes = await pdfDoc.save({
    useObjectStreams: false, // Object streams are not compatible with encryption in some readers
    userPassword: PDFString.of(password),
  });

  return pdfBytes;
};
