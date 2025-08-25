// src/lib/pdf/protect.ts

import { PDFDocument } from 'pdf-lib';

/**
 * Encrypts a PDF document with a user-provided password.
 * @param file The original PDF file.
 * @param password The password to apply for encryption.
 * @returns A Promise that resolves with the encrypted PDF as a Uint8Array.
 */
export const protectPDF = async (
  file: File,
  password: string
): Promise<Uint8Array> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);

  // pdf-lib's save method has a built-in encrypt option.
  // We use the same password for both the owner and the user for simplicity.
  const pdfBytes = await pdfDoc.save({
    encrypt: {
      ownerPassword: password,
      userPassword: password,
      // We can specify permissions here in the future if we want
    },
  });

  return pdfBytes;
};
