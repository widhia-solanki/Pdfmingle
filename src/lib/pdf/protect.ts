// src/lib/pdf/protect.ts

import { PDFDocument, PermissionFlag } from 'pdf-lib';

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
  const pdfDoc = await PDFDocument.load(arrayBuffer, { 
    // Important: ignore the original document's permissions when loading
    updateMetadata: false 
  });

  // --- THIS IS THE FIX ---
  // The `encrypt` method is now called on the document *before* saving.
  // It takes the password and an optional list of permissions.
  pdfDoc.encrypt(password, {
    // We can define what the user can do once they enter the password.
    // Let's allow everything for now.
    permissions: [
      PermissionFlag.Print,
      PermissionFlag.CopyContents,
      PermissionFlag.Modify,
      PermissionFlag.Annotate,
    ],
  });

  // Now, we just call save() with no arguments.
  const pdfBytes = await pdfDoc.save();

  return pdfBytes;
};
