// src/lib/pdf/unlock.ts

import { PDFDocument } from 'pdf-lib';

/**
 * Unlocks a password-protected PDF.
 * @param file The encrypted PDF file.
 * @param password The password to unlock the file.
 * @returns A Promise that resolves with the new, unlocked PDF as a Uint8Array.
 */
export const unlockPdf = async (
  file: File,
  password: string
): Promise<Uint8Array> => {
  const arrayBuffer = await file.arrayBuffer();

  try {
    // With the @types/pdf-lib package installed, TypeScript now understands this option.
    const pdfDoc = await PDFDocument.load(arrayBuffer, {
      password: password,
    });

    // If the document loads successfully, it is now decrypted in memory.
    const pdfBytes = await pdfDoc.save();

    return pdfBytes;
  } catch (error: any) {
    if (error.name === 'InvalidPasswordError' || (error.message && error.message.includes('password'))) {
      throw new Error('The password you entered is incorrect. Please try again.');
    } else {
      console.error('Failed to unlock PDF:', error);
      throw new Error('Could not process this PDF. It may be corrupted.');
    }
  }
};
