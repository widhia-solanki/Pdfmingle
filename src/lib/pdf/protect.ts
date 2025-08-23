// src/lib/pdf/protect.ts

import { getQpdf } from '@pdftools/qpdf';

/**
 * Encrypts a PDF with a user-provided password using @pdftools/qpdf.
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

    const protectedPdf = await qpdf.encrypt(arrayBuffer, {
      password: password,
      keyLength: 256,
    });

    return protectedPdf;
  } catch (error) {
    console.error('Failed to protect PDF:', error);
    throw new Error('Could not encrypt the PDF file. It may be corrupted or in an unsupported format.');
  }
};
