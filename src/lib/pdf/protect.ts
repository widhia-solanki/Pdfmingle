// src/lib/pdf/protect.ts

import { PDFDocument, PDFDocumentOptions } from 'pdf-lib';

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
  
  // --- THIS IS THE FIX ---
  // We don't need to import PermissionFlag. The permissions are set directly
  // in the encrypt method using simple boolean flags.
  const pdfDoc = await PDFDocument.load(arrayBuffer);

  // The encrypt method is called on the document before saving.
  pdfDoc.encrypt({
    ownerPassword: password,
    userPassword: password,
    // Permissions are set here. Let's allow everything for now.
    permissions: {
      printing: true,
      copying: true,
      modifying: true,
      annotating: true,
    },
  });

  // Now, we just call save() with no arguments.
  const pdfBytes = await pdfDoc.save();

  return pdfBytes;
};
