// src/lib/pdf/protect.ts

import { getQpdf } from 'qpdf-js';

/**
 * Encrypts a PDF with a user-provided password using qpdf-js.
 * @param file The original PDF file.
 * @param password The password to apply for encryption.
 * @returns A Promise that resolves with the new, encrypted PDF as a Uint8Array.
 */
export const protectPdf = async (
  file: File,
  password: string
): Promise<Uint8Array> => {
  try {
    const qpdf = await getQpdf();
    const arrayBuffer = await file.arrayBuffer();

    // Use the qpdf-js library to encrypt the PDF data.
    // This is a robust, specialized function for this exact task.
    const protectedPdf = await qpdf.encrypt(arrayBuffer, {
      // The user password is the one required to open the document.
      password: password,
      // We can specify encryption strength, 256-bit AES is very strong.
      // QPDF defaults to AES-256 if not specified, but we'll be explicit.
      keyLength: 256,
    });

    return protectedPdf;
  } catch (error) {
    console.error('Failed to protect PDF:', error);
    // Re-throw the error to be caught by the UI and shown to the user.
    throw new Error('Could not encrypt the PDF file. It may be corrupted or in an unsupported format.');
  }
};
