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
    // The correct method for this version of pdf-lib is to pass the password
    // as the second argument to the load function.
    const pdfDoc = await PDFDocument.load(arrayBuffer, { password });

    // If the document loads successfully, it is now decrypted in memory.
    // Saving it without any options will create a new, unlocked version.
    const pdfBytes = await pdfDoc.save();

    return pdfBytes;
  } catch (error: any) {
    // pdf-lib throws a specific error for wrong passwords. We can catch it.
    if (error.name === 'InvalidPasswordError') {
      throw new Error('The password you entered is incorrect. Please try again.');
    } else {
      // Handle other potential errors, like a corrupted file.
      console.error('Failed to unlock PDF:', error);
      throw new Error('Could not process this PDF. It may be corrupted.');
    }
  }
};
